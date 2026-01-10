import express from "express";
import cors from "cors";

import routesIndex from "./routes/index.js";
import { makeControllers } from "./factories/controllers.factory.js";
import { requestLogger } from "./middleware/request_logger.js";
import { notFound } from "./middleware/not_found.js";
import { errorHandler } from "./middleware/error_handler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  // JSON is also enabled in individual routes that need it, but keeping here is fine
  app.use(express.json({ limit: "5mb" }));

  // Logs method/path/status/duration for every request (replaces per-controller timers)
  app.use(requestLogger);

  const controllers = makeControllers();
  app.use(routesIndex(controllers));

  // 404 + error handler (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
