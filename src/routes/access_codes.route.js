import express from "express";

export default function accessCodesRoutes(accessCodesController) {
  const router = express.Router();

  router.post("/api/access-codes", express.json(), accessCodesController.generate);

  return router;
}
