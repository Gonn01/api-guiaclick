import postgres from "postgres";
import { DATABASE_URL } from "../config/env.js";
import { logRed, logYellow } from "../utils/logs_custom.js";

if (!DATABASE_URL) {
  logYellow("DATABASE_URL is not set. DB queries will fail until it's provided.");
}

const connection = postgres(DATABASE_URL || "postgresql://invalid", { ssl: "require" });

export async function executeQuery(query, values = [], log = false) {
  if (log) {
    logYellow(`Ejecutando query: ${query} con valores: ${JSON.stringify(values)}`);
  }

  try {
    const results = await connection.unsafe(query, values);
    if (log) {
      logYellow(`Query ejecutado con éxito: ${JSON.stringify(results)}`);
    }
    return results;
  } catch (error) {
    logRed(`Error en executeQuery: ${error.stack || error.message}`);
    throw error;
  }
}

// Very small helper for manual transactions.
export async function withTransaction(fn, { log = false } = {}) {
  await executeQuery("BEGIN", [], log);
  try {
    const res = await fn();
    await executeQuery("COMMIT", [], log);
    return res;
  } catch (err) {
    try {
      await executeQuery("ROLLBACK", [], log);
    } catch {}
    throw err;
  }
}
