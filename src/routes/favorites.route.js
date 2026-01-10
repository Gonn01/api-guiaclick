import express from "express";
import { asyncHandler } from "../middleware/async_handler.js";
import { verifyToken } from "../middleware/verify_token.js";
import { requireSameUserOrAdmin } from "../middleware/authorize.js";

export default function favoritesRoutes(favoritesController) {
  const router = express.Router();

  router.get("/api/users/:userId/favorites", verifyToken, requireSameUserOrAdmin("userId"), asyncHandler(favoritesController.listByUser));
  router.get("/api/users/:userId/favorites/:manualId/check", verifyToken, requireSameUserOrAdmin("userId"), asyncHandler(favoritesController.check));
  router.post("/api/users/:userId/favorites/:manualId", verifyToken, requireSameUserOrAdmin("userId"), asyncHandler(favoritesController.add));
  router.delete("/api/users/:userId/favorites/:manualId", verifyToken, requireSameUserOrAdmin("userId"), asyncHandler(favoritesController.remove));

  return router;
}
