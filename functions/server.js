
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
import { verifyAll } from "./funciones/verifyParameters.js";
import { agregarFavorito } from "./controllers/favorites/addFavorite.js";
import { quitarFavorito } from "./controllers/favorites/removeFavorite.js";
import { listManuales } from "./controllers/manuals/manualList.js";
import { getManualById } from "./controllers/manuals/getManualById.js";
import { listarValoracionesManual } from "./controllers/ratings/getRatingList.js";
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

/* ======================
   Endpoints de Favoritos
   ====================== */
// POST para agregar favorito usa ambos: params y body
router.post("/api/usuarios/:id/favoritos", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyAll(req, ["id"], ["manualId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  const { manualId } = req.body;
  try {
    const result = await agregarFavorito(id, manualId); // Función a definir
    res.status(200).json({
      body: result,
      message: "Manual agregado a favoritos correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/usuarios/${id}/favoritos: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// DELETE usa solo params
router.delete("/api/usuarios/:id/favoritos/:manualId", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id", "manualId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id, manualId } = req.params;
  try {
    await quitarFavorito(id, manualId); // Función a definir
    res.status(200).json({
      body: { usuarioId: id, manualId },
      message: "Favorito eliminado correctamente."
    });
  } catch (error) {
    logRed(`Error en DELETE /api/usuarios/${id}/favoritos/${manualId}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Valoraciones
   ====================== */
router.post("/api/valoraciones", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["usuarioId", "manualId", "puntuacion"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en el body: ${missing.join(", ")}` });
  }
  const { usuarioId, manualId, puntuacion, comentario } = req.body;
  try {
    const result = await crearValoracion(usuarioId, manualId, puntuacion, comentario); // Función a definir
    res.status(200).json({
      body: result,
      message: "Valoración creada correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/valoraciones: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
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
