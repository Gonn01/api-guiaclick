import express from "express";

export default function manualsRoutes(manualsController) {
  const router = express.Router();

  router.get("/api/manuales", manualsController.list);
  router.get("/api/manuales-dashboard", manualsController.dashboardList);
  router.get("/api/manuales/:id", manualsController.getById);

  router.get("/api/manuals/:manualId/steps", manualsController.getSteps);

  router.post("/api/manuals", express.json(), manualsController.create);
  router.put("/api/manuals/:manualId", express.json(), manualsController.update);
  router.delete("/api/manuals/:id", manualsController.delete);

  return router;
}
