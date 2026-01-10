import express from "express";

export default function ratingsRoutes(ratingsController) {
  const router = express.Router();

  router.post("/api/ratings", express.json(), ratingsController.create);
  router.delete("/api/ratings/:userId/:manualId", ratingsController.delete);
  router.get("/api/valoraciones/manuales/:id", ratingsController.listByManual);

  return router;
}
