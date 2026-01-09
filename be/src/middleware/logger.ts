import pino from "pino";
import pinoHttp, { HttpLogger, Options } from "pino-http";
import { IncomingMessage, ServerResponse } from "http";
import { Request, Response } from "express";
import { env } from "../config/index.js";

// Custom log format constants
const LOG_FORMAT = {
  SUCCESS: (route: string, status: number, responseTime: number) =>
    `${route} ${status} - ${responseTime}ms`,
  ERROR: (route: string, status: number, req: string, res: string) =>
    `${route} ${status} - [Req: ${req}] [Res: ${res}]`,
} as const;

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname,req,res,responseTime",
            messageFormat: "{msg}",
          },
        }
      : undefined,
  // Remove default serializers for cleaner output
  serializers: {},
});

// Type-safe pino-http callable
type PinoHttpFn = (opts?: Options) => HttpLogger;
const createHttpLogger = pinoHttp as unknown as PinoHttpFn;

// Helper to get request body summary
function getRequestSummary(req: IncomingMessage): string {
  const expressReq = req as Request;
  if (expressReq.body && Object.keys(expressReq.body).length > 0) {
    // Exclude sensitive fields
    const sanitized = { ...expressReq.body };
    if (sanitized.password) sanitized.password = "[REDACTED]";
    return JSON.stringify(sanitized);
  }
  return "{}";
}

// Helper to get response body (captured via middleware)
function getResponseSummary(res: ServerResponse): string {
  const expressRes = res as Response & { _body?: unknown };
  if (expressRes._body) {
    return JSON.stringify(expressRes._body);
  }
  return "{}";
}

export const httpLogger: HttpLogger = createHttpLogger({
  logger,
  autoLogging: {
    ignore: (req: IncomingMessage) => {
      return req.url === "/health";
    },
  },
  // Don't log request/response objects by default
  serializers: {
    req: () => undefined,
    res: () => undefined,
  },
  customLogLevel: (
    _req: IncomingMessage,
    res: ServerResponse,
    err: Error | undefined
  ) => {
    if (res.statusCode >= 500 || err) {
      return "error";
    }
    if (res.statusCode >= 400) {
      return "warn";
    }
    return "info";
  },
  customSuccessMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    responseTime: number
  ) => {
    const route = `${req.method} ${req.url}`;
    return LOG_FORMAT.SUCCESS(route, res.statusCode, Math.round(responseTime));
  },
  customErrorMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    _error: Error
  ) => {
    const route = `${req.method} ${req.url}`;
    const reqSummary = getRequestSummary(req);
    const resSummary = getResponseSummary(res);
    return LOG_FORMAT.ERROR(route, res.statusCode, reqSummary, resSummary);
  },
  // For non-2xx responses, include req/res in the log
  customSuccessObject: (
    _req: IncomingMessage,
    res: ServerResponse,
    _val: object
  ) => {
    // For non-2xx, treat as "error" logging with req/res
    if (res.statusCode >= 400) {
      return {
        // Return empty to let customErrorMessage handle it
      };
    }
    // For success, return minimal object
    return {};
  },
  customErrorObject: (
    _req: IncomingMessage,
    _res: ServerResponse,
    _error: Error,
    _val: object
  ) => {
    // Return empty, let the message contain all info
    return {};
  },
});

// Middleware to capture response body for error logging
export function captureResponseBody(
  _req: Request,
  res: Response,
  next: () => void
): void {
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown) {
    (res as Response & { _body?: unknown })._body = body;
    return originalJson(body);
  };

  next();
}
