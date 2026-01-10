import multer from "multer";
import { Request, RequestHandler } from "express";
import { AppError } from "./errorHandler.js";
import { ERROR_CODES } from "../constants/index.js";

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Documents
  "application/pdf",
  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// File size limit: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// File filter function
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new AppError(ERROR_CODES.INVALID_FILE_TYPE, 400));
  }
};

// Configure multer with memory storage
const storage = multer.memoryStorage();

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Single file upload middleware
export const uploadSingle: RequestHandler = upload.single("file");

// Export constants for use in other modules
export const UPLOAD_CONFIG = {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB: 10,
} as const;
