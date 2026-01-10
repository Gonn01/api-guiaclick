import { AppError } from "../utils/app_error.js";
import { Roles, normalizeRole } from "../constants/roles.js";

export const requireRole = (...roles) => (req, _res, next) => {
  const role = normalizeRole(req.user?.role);
  if (role === null) return next(new AppError({ message: "Unauthorized", statusCode: 401 }));
  if (!roles.includes(role)) return next(new AppError({ message: "Forbidden", statusCode: 403 }));
  return next();
};

export const requireSameUserOrAdmin = (paramName = "userId") => (req, _res, next) => {
  const tokenUserId = Number(req.user?.userId);
  const targetUserId = Number(req.params?.[paramName]);
  const role = normalizeRole(req.user?.role);

  if (!Number.isFinite(targetUserId)) {
    return next(new AppError({ message: `Invalid ${paramName}`, statusCode: 400 }));
  }

  if (Number.isFinite(tokenUserId) && tokenUserId === targetUserId) return next();
  if (role === Roles.ADMIN) return next();

  return next(new AppError({ message: "Forbidden", statusCode: 403 }));
};
