
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { performance } from "perf_hooks";
import {
  logBlue,
  logPurple,
  logRed,
  logCyan
} from "./funciones/logsCustom.js";
import { verifyParameters } from "./funciones/verifyParameters.js";
import { listManuales } from "./controllers/manuals/manualList.js";
import { getManualSteps } from "./controllers/manuals/getManualSteps.js";
import { getManualById } from "./controllers/manuals/getManualById.js";
import { listarValoracionesManual } from "./controllers/ratings/getRatingList.js";
import { isManualFavorite } from "./controllers/manuals/getIfFavorite.js";
import { addFavorite } from "./controllers/manuals/turnFavorite.js";
import { removeFavorite } from "./controllers/manuals/removeFavorite.js";
import { createRating } from "./controllers/manuals/createRating.js";
import { deleteRating } from "./controllers/manuals/deleteRating.js";
import { getUserFavorites } from "./controllers/manuals/getFavorites.js";
import { verifyUser } from "./funciones/verifyUser.js";
var app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

/* ======================
   Endpoints de Manuales
   ====================== */

// PARA RELLENAR ALGOLIA
router.get("/api/manuales", async (req, res) => {
  const startTime = performance.now();
  try {
    const manuals = await listManuales();
    res.status(200).json({
      body: manuals,
      message: "Manuales listados correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/manuales: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// GET MANUAL BY ID
router.get("/api/manuales/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    const manual = await getManualById(id);
    res.status(200).json({
      body: manual,
      message: "Manual obtenido correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/manuales/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});
// GET /api/manuals/:manualId/steps
router.get("/api/manuals/:manualId/steps", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["manualId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
  }

  const { manualId } = req.params;

  try {
    const steps = await getManualSteps(manualId);
    res.status(200).json({ success: true, body: steps });
  } catch (error) {
    logRed(`Error in GET /api/manuals/${manualId}/steps: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Execution time: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Favoritos
   ====================== */
// POST para agregar favorito usa ambos: params y body
router.get("/api/users/:userId/favorites", verifyUser, async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["userId"]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required parameter: ${missing.join(", ")}` });
  }

  const { userId } = req.params;

  try {
    const favorites = await getUserFavorites(userId);
    res.status(200).json({ success: true, body: favorites });
  } catch (error) {
    logRed(`Error in GET /api/users/${userId}/favorites: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    logPurple(`Execution time: ${performance.now() - startTime} ms`);
  }
});
router.get("/api/users/:userId/favorites/:manualId/check", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["userId", "manualId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
  }

  const { userId, manualId } = req.params;

  try {
    const isFavorite = await isManualFavorite(userId, manualId);
    res.status(200).json({ success: true, body: isFavorite });
  } catch (error) {
    logRed(`Error in GET /api/users/${userId}/favorites/${manualId}/check: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Execution time: ${endTime - startTime} ms`);
  }
});
router.post("/api/users/:userId/favorites/:manualId", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["userId", "manualId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
  }

  const { userId, manualId } = req.params;

  try {
    await addFavorite(userId, manualId);
    res.status(200).json({
      success: true,
      message: "Manual marked as favorite successfully.",
    });
  } catch (error) {
    logRed(`Error in POST /api/users/${userId}/favorites/${manualId}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Execution time: ${endTime - startTime} ms`);
  }
});
router.delete("/api/users/:userId/favorites/:manualId", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["userId", "manualId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
  }

  const { userId, manualId } = req.params;

  try {
    await removeFavorite(userId, manualId);
    res.status(200).json({
      message: "Manual unmarked as favorite successfully.",
      body: { userId, manualId }
    });
  } catch (error) {
    logRed(`Error in DELETE /api/users/${userId}/favorites/${manualId}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Execution time: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de ratings
   ====================== */
router.post("/api/ratings", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["user_id", "manual_id"]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
  }

  const { user_id, manual_id, score, comment } = req.body;

  try {
    const rating = await createRating({ user_id, manual_id, score, comment }); // see below
    res.status(200).json({
      message: "Rating created successfully.",
      body: rating
    });
  } catch (error) {
    logRed(`Error in POST /api/ratings: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Execution time: ${endTime - startTime} ms`);
  }
});

router.delete("/api/ratings/:userId/:manualId", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["userId", "manualId"]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
  }

  const { userId, manualId } = req.params;

  try {
    await deleteRating(userId, manualId); // defined below
    res.status(200).json({
      message: "Rating deleted successfully.",
      body: { user_id: userId, manual_id: manualId }
    });
  } catch (error) {
    logRed(`Error in DELETE /api/ratings/${userId}/${manualId}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Execution time: ${endTime - startTime} ms`);
  }
});

router.get("/api/valoraciones/manuales/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    logCyan(`Obteniendo valoraciones para el manual con ID: ${id}`);
    const valoraciones = await listarValoracionesManual(id);
    res.status(200).json({
      body: valoraciones,
      message: "Valoraciones obtenidas correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/valoraciones/manuales/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

if (process.env.NETLIFY !== "true") {
  app.use("/.netlify/functions/server", router);
  app.listen(port, () => {
    logBlue(`Servidor corriendo en http://localhost:${port}`);
  });
} else {
  app.use('/.netlify/functions/server', router);
}

export const handler = serverless(app);


