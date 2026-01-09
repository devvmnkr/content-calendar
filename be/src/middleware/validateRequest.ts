import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type RequestLocation = "body" | "query" | "params";

export function validateRequest<T>(
  schema: ZodSchema<T>,
  location: RequestLocation = "body"
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req[location];
      const parsed = schema.parse(data);
      req[location] = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
}
