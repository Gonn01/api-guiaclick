import express from "express";

export default function usersRoutes(usersController) {
  const router = express.Router();

  router.get("/api/usuarios", usersController.list);
  router.delete("/api/usuarios/:id", usersController.delete);

  // Link user to company by access code
  router.post("/api/users/:userId/company", express.json(), usersController.linkCompanyByCode);

  return router;
}
