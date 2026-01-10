import express from "express";

export default function companiesRoutes(companiesController) {
  const router = express.Router();

  router.get("/api/companies", companiesController.list);
  router.get("/api/companies/:id", companiesController.getById);
  router.put("/api/companies/:id", express.json(), companiesController.updateName);
  router.delete("/api/companies/:companyId", companiesController.delete);

  router.post("/api/empresas/crear", express.json(), companiesController.createCompanyWithAdmin);

  return router;
}
