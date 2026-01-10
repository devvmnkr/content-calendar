import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type RequestLocation = "body" | "query" | "params";

/**
 * Pre-process body data from FormData
 * Parses JSON strings for array/object fields that come as strings in multipart/form-data
 */
function preprocessFormData(
  body: Record<string, unknown>
): Record<string, unknown> {
  const processed = { ...body };

  // Fields that should be arrays but might come as JSON strings from FormData
  const jsonArrayFields = ["channels"];

  for (const field of jsonArrayFields) {
    if (typeof processed[field] === "string") {
      try {
        processed[field] = JSON.parse(processed[field] as string);
      } catch {
        // Keep as-is if parsing fails
      }
    }
  }

  return processed;
}

export function validateRequest<T>(
  schema: ZodSchema<T>,
  location: RequestLocation = "body"
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      let data = req[location];

      // Pre-process body data to handle FormData JSON strings
      if (location === "body" && data && typeof data === "object") {
        data = preprocessFormData(data as Record<string, unknown>);
      }

      const parsed = schema.parse(data);
      req[location] = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
}
