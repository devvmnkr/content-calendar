import { Response } from "express";
import { ApiResponse, ApiErrorResponse } from "../types/index.js";

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode = 400,
  errors?: Record<string, string[]>
): Response<ApiErrorResponse> {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
    errors,
  });
}
