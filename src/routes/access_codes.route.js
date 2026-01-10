import express from "express";
import { asyncHandler } from "../middleware/async_handler.js";
import { verifyToken } from "../middleware/verify_token.js";
import { requireRole } from "../middleware/authorize.js";
import { Roles } from "../constants/roles.js";

export default function accessCodesRoutes(accessCodesController) {
  const router = express.Router();

  router.post(
    "/api/access-codes",
    verifyToken,
    requireRole(Roles.ADMIN),
    asyncHandler(accessCodesController.generate)
  );

  return router;
}
