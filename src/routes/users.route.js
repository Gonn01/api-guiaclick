import express from "express";
import { asyncHandler } from "../middleware/async_handler.js";
import { verifyToken } from "../middleware/verify_token.js";
import { requireRole, requireSameUserOrAdmin } from "../middleware/authorize.js";
import { Roles } from "../constants/roles.js";

export default function usersRoutes(usersController) {
  const router = express.Router();

  router.get("/api/usuarios", verifyToken, requireRole(Roles.ADMIN), asyncHandler(usersController.list));
  router.delete("/api/usuarios/:id", verifyToken, requireRole(Roles.ADMIN), asyncHandler(usersController.delete));

  // Link user to company by access code
  router.post("/api/users/:userId/company", verifyToken, requireSameUserOrAdmin("userId"), asyncHandler(usersController.linkCompanyByCode));

  return router;
}
