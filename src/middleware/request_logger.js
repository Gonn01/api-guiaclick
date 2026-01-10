import { performance } from "perf_hooks";
import { logPurple } from "../utils/logs_custom.js";

export function requestLogger(req, res, next) {
  const start = performance.now();
  res.on("finish", () => {
    const ms = Math.round(performance.now() - start);
    logPurple(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
}
