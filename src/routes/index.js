import express from "express";

import authRoutes from "./auth.route.js";
import usersRoutes from "./users.route.js";
import manualsRoutes from "./manuals.route.js";
import favoritesRoutes from "./favorites.route.js";
import ratingsRoutes from "./ratings.route.js";
import companiesRoutes from "./companies.route.js";
import accessCodesRoutes from "./access_codes.route.js";

export default function routesIndex(controllers) {
  const router = express.Router();

  router.get("/", (_req, res) => {
    res.send("Hello from refactored API!");
  });

  router.use(authRoutes(controllers.authController));
  router.use(usersRoutes(controllers.usersController));
  router.use(manualsRoutes(controllers.manualsController));
  router.use(favoritesRoutes(controllers.favoritesController));
  router.use(ratingsRoutes(controllers.ratingsController));
  router.use(companiesRoutes(controllers.companiesController));
  router.use(accessCodesRoutes(controllers.accessCodesController));

  return router;
}
