import express from "express";
import { asyncHandler } from "../middleware/async_handler.js";
import { verifyToken } from "../middleware/verify_token.js";
import { requireRole } from "../middleware/authorize.js";
import { Roles } from "../constants/roles.js";

export default function companiesRoutes(companiesController) {
  const router = express.Router();

  router.get("/api/companies", asyncHandler(companiesController.list));
  router.get("/api/companies/:id", asyncHandler(companiesController.getById));
  router.put(
    "/api/companies/:id",
    verifyToken,
    requireRole(Roles.ADMIN),
    asyncHandler(companiesController.updateName)
  );
  router.delete(
    "/api/companies/:companyId",
    verifyToken,
    requireRole(Roles.ADMIN),
    asyncHandler(companiesController.delete)
  );

  router.post(
    "/api/empresas/crear",
    verifyToken,
    requireRole(Roles.ADMIN),
    asyncHandler(companiesController.createCompanyWithAdmin)
  );

  return router;
}
