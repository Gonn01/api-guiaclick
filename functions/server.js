
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { performance } from "perf_hooks";
import {
  logBlue,
  logPurple,
  logRed,
  logGreen
} from "./funciones/logsCustom.js";

import { verifyParameters } from "./funciones/verifyParameters.js";
import { verifyAll } from "./funciones/verifyParameters.js";

// Auth
import { login } from "./controllers/auth/login.js";
import { registerUser } from "./controllers/auth/registerUser.js";
import { logoutUser } from "./controllers/auth/logout.js";

// Usuarios
import { getUserById } from "./controllers/users/getUserById.js";
import { updateUser } from "./controllers/users/updateUser.js";
import { deleteUser } from "./controllers/users/deleteUser.js";
import { getUserFavorites } from "./controllers/users/getUserFavorites.js";
import { agregarFavorito } from "./controllers/favorites/addFavorite.js";
import { quitarFavorito } from "./controllers/favorites/removeFavorite.js";


var app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

/* ======================
   Endpoints de Autenticación
   ====================== */
router.post("/api/auth/login", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["email", "password"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en el body: ${missing.join(", ")}` });
  }
  const { email, password } = req.body;
  try {
    const result = await login(email, password); // Función a definir
    res.status(200).json({
      body: result,
      message: "Inicio de sesión exitoso."
    });
  } catch (error) {
    logRed(`Error en POST /api/auth/login: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

router.post("/api/auth/register", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["nombre", "email", "password"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en el body: ${missing.join(", ")}` });
  }
  const { nombre, email, password } = req.body;
  try {
    const result = await registerUser(nombre, email, password); // Función a definir
    res.status(200).json({
      body: result,
      message: "Usuario registrado correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/auth/register: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

router.post("/api/auth/logout", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["userId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en el body: ${missing.join(", ")}` });
  }
  const { userId } = req.body;
  try {
    const result = await logoutUser(userId); // Función a definir
    res.status(200).json({
      body: result,
      message: "Cierre de sesión exitoso."
    });
  } catch (error) {
    logRed(`Error en POST /api/auth/logout: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Usuarios
   ====================== */
router.get("/api/users/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en la URL: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    const user = await getUserById(id); // Función a definir
    res.status(200).json({
      body: user,
      message: "Usuario obtenido correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/users/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// Endpoint que requiere tanto params como body
router.put("/api/users/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyAll(req, ["id"], ["nombre", "email"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  const { nombre, email } = req.body;
  try {
    const result = await updateUser(id, nombre, email); // Función a definir
    res.status(200).json({
      body: result,
      message: "Usuario actualizado correctamente."
    });
  } catch (error) {
    logRed(`Error en PUT /api/users/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// Los endpoints DELETE que solo requieren params usan verifyParameters
router.delete("/api/users/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    await deleteUser(id); // Función a definir
    res.status(200).json({
      body: { id },
      message: "Usuario eliminado correctamente."
    });
  } catch (error) {
    logRed(`Error en DELETE /api/users/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// Endpoint para obtener favoritos (solo params)
router.get("/api/users/:id/favoritos", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    const favorites = await getUserFavorites(id); // Función a definir
    res.status(200).json({
      body: favorites,
      message: "Favoritos obtenidos correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/users/${id}/favoritos: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Empresas
   ====================== */
router.get("/api/empresas", async (req, res) => {
  const startTime = performance.now();
  try {
    const companies = await listEmpresas(); // Función a definir
    res.status(200).json({
      body: companies,
      message: "Empresas listadas correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/empresas: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// GET de empresa usa solo params
router.get("/api/empresas/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    const company = await getEmpresaById(id); // Función a definir
    res.status(200).json({
      body: company,
      message: "Empresa obtenida correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/empresas/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// POST para crear empresa usa solo body
router.post("/api/empresas", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["nombre", "descripcion"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en el body: ${missing.join(", ")}` });
  }
  const { nombre, descripcion } = req.body;
  try {
    const result = await createEmpresa(nombre, descripcion); // Función a definir
    res.status(200).json({
      body: result,
      message: "Empresa registrada correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/empresas: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// PUT para actualizar empresa requiere params y body
router.put("/api/empresas/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyAll(req, ["id"], ["nombre", "descripcion"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await updateEmpresa(id, nombre, descripcion); // Función a definir
    res.status(200).json({
      body: result,
      message: "Empresa actualizada correctamente."
    });
  } catch (error) {
    logRed(`Error en PUT /api/empresas/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// DELETE de empresa usa solo params
router.delete("/api/empresas/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    await deleteEmpresa(id); // Función a definir
    res.status(200).json({
      body: { id },
      message: "Empresa eliminada correctamente."
    });
  } catch (error) {
    logRed(`Error en DELETE /api/empresas/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Códigos de Acceso
   ====================== */
// POST, PUT, DELETE y validación para códigos usan solo body o params, se mantiene la validación individual
router.get("/api/codigos", async (req, res) => {
  const startTime = performance.now();
  try {
    const codes = await listCodigos(); // Función a definir
    res.status(200).json({
      body: codes,
      message: "Códigos listados correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/codigos: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

router.post("/api/codigos", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["codigo", "empresaId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en el body: ${missing.join(", ")}` });
  }
  const { codigo, empresaId } = req.body;
  try {
    const result = await createCodigo(codigo, empresaId); // Función a definir
    res.status(200).json({
      body: result,
      message: "Código de acceso generado correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/codigos: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// Similar para PUT, DELETE y POST /api/codigos/validar (se omiten para brevedad)

/* ======================
   Endpoints de Manuales
   ====================== */
router.get("/api/manuales", async (req, res) => {
  const startTime = performance.now();
  try {
    const manuals = await listManuales(); // Función a definir
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

router.get("/api/manuales/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    const manual = await getManualById(id); // Función a definir
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

// POST de manual usa solo body
router.post("/api/manuales", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["titulo", "descripcion", "contenido", "creadoPor"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en el body: ${missing.join(", ")}` });
  }
  const { titulo, descripcion, contenido, creadoPor } = req.body;
  try {
    const result = await createManual(titulo, descripcion, contenido, creadoPor); // Función a definir
    res.status(200).json({
      body: result,
      message: "Manual creado correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/manuales: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// PUT para actualizar manual usa tanto params como body
router.put("/api/manuales/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyAll(req, ["id"], []); // Si no hay campos obligatorios en el body, o agrega los que necesites
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    const result = await updateManual(id, req.body); // Función a definir
    res.status(200).json({
      body: result,
      message: "Manual actualizado correctamente."
    });
  } catch (error) {
    logRed(`Error en PUT /api/manuales/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// DELETE de manual usa solo params
router.delete("/api/manuales/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    await deleteManual(id); // Función a definir
    res.status(200).json({
      body: { id },
      message: "Manual eliminado correctamente."
    });
  } catch (error) {
    logRed(`Error en DELETE /api/manuales/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// GET de búsqueda usa query (se omite verifyAll)
router.get("/api/manuales/search", async (req, res) => {
  const startTime = performance.now();
  const { query } = req.query;
  try {
    const results = await searchManuales(query); // Función a definir
    res.status(200).json({
      body: results,
      message: "Búsqueda realizada correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/manuales/search: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Categorías
   ====================== */
router.get("/api/categorias", async (req, res) => {
  const startTime = performance.now();
  try {
    const categories = await listCategorias(); // Función a definir
    res.status(200).json({
      body: categories,
      message: "Categorías listadas correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/categorias: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// POST de categoría usa solo body
router.post("/api/categorias", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["nombre"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro en el body: ${missing.join(", ")}` });
  }
  const { nombre } = req.body;
  try {
    const result = await createCategoria(nombre); // Función a definir
    res.status(200).json({
      body: result,
      message: "Categoría creada correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/categorias: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// PUT de categoría usa ambos (params y body)
router.put("/api/categorias/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyAll(req, ["id"], ["nombre"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const result = await updateCategoria(id, nombre); // Función a definir
    res.status(200).json({
      body: result,
      message: "Categoría actualizada correctamente."
    });
  } catch (error) {
    logRed(`Error en PUT /api/categorias/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// DELETE de categoría usa solo params
router.delete("/api/categorias/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    await deleteCategoria(id); // Función a definir
    res.status(200).json({
      body: { id },
      message: "Categoría eliminada correctamente."
    });
  } catch (error) {
    logRed(`Error en DELETE /api/categorias/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Relación Manual-Empresa
   ====================== */
// GET usa solo params
router.get("/api/empresas/:id/manuales", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    const manuals = await getManualesPorEmpresa(id); // Función a definir
    res.status(200).json({
      body: manuals,
      message: "Manuales de la empresa obtenidos correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/empresas/${id}/manuales: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// POST para asignar manual a empresa usa ambos: params y body
router.post("/api/empresas/:id/manuales", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyAll(req, ["id"], ["manualId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  const { manualId } = req.body;
  try {
    const result = await asignarManualAEmpresa(id, manualId); // Función a definir
    res.status(200).json({
      body: result,
      message: "Manual asignado a la empresa correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/empresas/${id}/manuales: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// DELETE usa solo params
router.delete("/api/empresas/:id/manuales/:manualId", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id", "manualId"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id, manualId } = req.params;
  try {
    await quitarManualDeEmpresa(id, manualId); // Función a definir
    res.status(200).json({
      body: { empresaId: id, manualId },
      message: "Manual retirado de la empresa correctamente."
    });
  } catch (error) {
    logRed(`Error en DELETE /api/empresas/${id}/manuales/${manualId}: ${error.stack}`);
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
   Endpoints de Feedback
   ====================== */
router.post("/api/feedback", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.body, ["usuarioId", "mensaje"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros en el body: ${missing.join(", ")}` });
  }
  const { usuarioId, mensaje } = req.body;
  try {
    const result = await enviarFeedback(usuarioId, mensaje); // Función a definir
    res.status(200).json({
      body: result,
      message: "Feedback enviado correctamente."
    });
  } catch (error) {
    logRed(`Error en POST /api/feedback: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

router.get("/api/feedback", async (req, res) => {
  const startTime = performance.now();
  try {
    const feedbacks = await listarFeedback(); // Función a definir
    res.status(200).json({
      body: feedbacks,
      message: "Feedback listado correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/feedback: ${error.stack}`);
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
    const valoraciones = await listarValoracionesManual(id); // Función a definir
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

// PUT para actualizar valoración usa ambos (params y body)
router.put("/api/valoraciones/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyAll(req, ["id"], []); // Agregar campos del body si fueran obligatorios
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan los siguientes parámetros: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    const result = await actualizarValoracion(id, req.body); // Función a definir
    res.status(200).json({
      body: result,
      message: "Valoración actualizada correctamente."
    });
  } catch (error) {
    logRed(`Error en PUT /api/valoraciones/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

// DELETE de valoración usa solo params
router.delete("/api/valoraciones/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    await eliminarValoracion(id); // Función a definir
    res.status(200).json({
      body: { id },
      message: "Valoración eliminada correctamente."
    });
  } catch (error) {
    logRed(`Error en DELETE /api/valoraciones/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Sesiones
   ====================== */
router.get("/api/sesiones", async (req, res) => {
  const startTime = performance.now();
  try {
    const sesiones = await listarSesiones(); // Función a definir
    res.status(200).json({
      body: sesiones,
      message: "Sesiones listadas correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/sesiones: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

router.delete("/api/sesiones/:id", async (req, res) => {
  const startTime = performance.now();
  const missing = verifyParameters(req.params, ["id"]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
  }
  const { id } = req.params;
  try {
    await terminarSesion(id); // Función a definir
    res.status(200).json({
      body: { id },
      message: "Sesión terminada correctamente."
    });
  } catch (error) {
    logRed(`Error en DELETE /api/sesiones/${id}: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});

/* ======================
   Endpoints de Logs (Administración)
   ====================== */
router.get("/api/logs", async (req, res) => {
  const startTime = performance.now();
  try {
    const logs = await listarLogs(); // Función a definir
    res.status(200).json({
      body: logs,
      message: "Logs obtenidos correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/logs: ${error.stack}`);
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
