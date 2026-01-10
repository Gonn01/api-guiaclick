import express from "express";
import cors from "cors";

import routesIndex from "./routes/index.js";
import { makeControllers } from "./factories/controllers.factory.js";

export function createApp() {
  const app = express();

  app.use(cors());
  // JSON is also enabled in individual routes that need it, but keeping here is fine
  app.use(express.json({ limit: "5mb" }));

  const controllers = makeControllers();
  app.use(routesIndex(controllers));

  return app;
}
