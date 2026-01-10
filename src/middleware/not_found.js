import { AppError } from "../utils/app_error.js";

export function notFound(req, res, next) {
  next(
    new AppError({
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      statusCode: 404,
    })
  );
}
