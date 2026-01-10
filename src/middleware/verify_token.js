import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { AppError } from "../utils/app_error.js";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError({ message: "Token no provisto", statusCode: 401 }));
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!JWT_SECRET) {
      return next(new AppError({ message: "JWT_SECRET no configurado", statusCode: 500 }));
    }

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return next(new AppError({ message: "Token inválido o expirado", statusCode: 401 }));
  }
}
