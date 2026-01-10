import express from "express";
import { asyncHandler } from "../middleware/async_handler.js";
import { verifyToken } from "../middleware/verify_token.js";

export default function manualsRoutes(manualsController) {
  const router = express.Router();

  router.get("/api/manuales", asyncHandler(manualsController.list));
  router.get("/api/manuales-dashboard", asyncHandler(manualsController.dashboardList));
  router.get("/api/manuales/:id", asyncHandler(manualsController.getById));

  router.get("/api/manuals/:manualId/steps", asyncHandler(manualsController.getSteps));

  router.post("/api/manuals", verifyToken, asyncHandler(manualsController.create));
  router.put("/api/manuals/:manualId", verifyToken, asyncHandler(manualsController.update));
  router.delete("/api/manuals/:id", verifyToken, asyncHandler(manualsController.delete));

  return router;
}
