import express from "express";
import { asyncHandler } from "../middleware/async_handler.js";

export default function authRoutes(authController) {
  const router = express.Router();

  router.post("/login", asyncHandler(authController.login));
  router.post("/users", asyncHandler(authController.register));

  return router;
}
