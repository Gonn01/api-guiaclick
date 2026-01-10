import express from "express";

export default function authRoutes(authController) {
  const router = express.Router();

  router.post("/login", express.json(), authController.login);
  router.post("/users", express.json(), authController.register);

  return router;
}
