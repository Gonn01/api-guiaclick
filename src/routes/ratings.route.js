import express from "express";
import { asyncHandler } from "../middleware/async_handler.js";
import { verifyToken } from "../middleware/verify_token.js";
import { requireSameUserOrAdmin } from "../middleware/authorize.js";

export default function ratingsRoutes(ratingsController) {
  const router = express.Router();

  router.post("/api/ratings", verifyToken, asyncHandler(ratingsController.create));
  router.delete(
    "/api/ratings/:userId/:manualId",
    verifyToken,
    requireSameUserOrAdmin("userId"),
    asyncHandler(ratingsController.delete)
  );
  router.get(
    "/api/valoraciones/manuales/:id",
    asyncHandler(ratingsController.listByManual)
  );

  return router;
}
