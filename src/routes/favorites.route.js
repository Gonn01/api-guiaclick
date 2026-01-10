import express from "express";

export default function favoritesRoutes(favoritesController) {
  const router = express.Router();

  router.get("/api/users/:userId/favorites", favoritesController.listByUser);
  router.get("/api/users/:userId/favorites/:manualId/check", favoritesController.check);
  router.post("/api/users/:userId/favorites/:manualId", favoritesController.add);
  router.delete("/api/users/:userId/favorites/:manualId", favoritesController.remove);

  return router;
}
