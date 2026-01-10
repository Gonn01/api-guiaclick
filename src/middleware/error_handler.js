import { logRed } from "../utils/logs_custom.js";
import { AppError } from "../utils/app_error.js";

// Centralized error handler (must be the last middleware)
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const statusCode = Number(err?.statusCode || err?.status) || 500;
  const message = err?.message || "Internal server error";

  // Keep logs detailed for debugging; keep responses minimal for clients
  logRed(
    `[${req.method} ${req.originalUrl}] ${statusCode} - ${message}\n` +
      (err?.stack ? err.stack : "")
  );

  const payload = { message };
  if (err instanceof AppError) {
    if (err.code) payload.code = err.code;
    if (err.details !== undefined) payload.details = err.details;
  }

  return res.status(statusCode).json(payload);
}
