
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { performance } from "perf_hooks";
import { logBlue, logPurple, logRed, logCyan, logGreen } from "./funciones/logsCustom.js";
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
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { executeQuery } from "./db.js";
import { processRecords } from "../ns.js";
var app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});


router.post(
  '/login',
  express.json(),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email and password are required' });
      }

      // Buscar al usuario junto con su empresa (si tiene)
      const qUsers = `
        SELECT u.*, c.name AS company_name 
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE u.email = $1
      `;
      const rows = await executeQuery(qUsers, [email]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = rows[0];
      const rawPassword = String(password);
      const hashedPassword = String(user.password);
      const isValid = await bcrypt.compare(rawPassword, hashedPassword);

      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verificar JWT_SECRET
      const JWT_SECRET = process.env.JWT_SECRET;
      if (typeof JWT_SECRET !== 'string' || JWT_SECRET.trim() === '') {
        throw new Error('JWT_SECRET is invalid or undefined');
      }

      // Generar token
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          company_id: user.company_id || null,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Respuesta
      return res.status(200).json({
        message: 'Login successful',
        body: {
          token,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role * 1,
          company_id: user.company_id || null,
          company_name: user.company_name || null
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res
        .status(500)
        .json({ message: 'An error occurred during login: ' + error.message });
    }
  }
);

router.get("/api/usuarios", async (req, res) => {
  const startTime = performance.now();
  try {
    const result = await executeQuery(`
      SELECT id, name, email, role
      FROM users
      ORDER BY name
    `);

    const usuarios = result.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role === "1" ? "Admin" : "User"
    }));

    res.status(200).json({
      body: usuarios,
      message: "Usuarios listados correctamente."
    });
  } catch (error) {
    logRed(`Error en GET /api/usuarios: ${error.stack}`);
    res.status(500).json({ message: error.stack });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});
router.delete("/api/usuarios/:id", async (req, res) => {
  const startTime = performance.now();
  const { id } = req.params;

  try {
    // 1. Eliminar favoritos del usuario
    await executeQuery(`DELETE FROM favorites WHERE user_id = $1`, [id]);

    // 2. Eliminar valoraciones del usuario
    await executeQuery(`DELETE FROM ratings WHERE user_id = $1`, [id]);

    // 3. Eliminar pasos de los manuales creados por este usuario
    await executeQuery(
      `DELETE FROM steps WHERE manual_id IN (SELECT id FROM manuals WHERE created_by = $1)`,
      [id]
    );

    // 4. Eliminar favoritos de esos manuales
    await executeQuery(
      `DELETE FROM favorites WHERE manual_id IN (SELECT id FROM manuals WHERE created_by = $1)`,
      [id]
    );

    // 5. Eliminar los manuales
    await executeQuery(`DELETE FROM manuals WHERE created_by = $1`, [id]);

    // 6. Finalmente, eliminar el usuario
    await executeQuery(`DELETE FROM users WHERE id = $1`, [id]);

    res.status(200).json({ message: "Usuario y sus datos eliminados correctamente." });
  } catch (error) {
    logRed(`Error en DELETE /api/usuarios/${id}: ${error.stack}`);
    res.status(500).json({ message: "Error al eliminar el usuario y sus datos." });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});
router.delete("/api/manuals/:id", async (req, res) => {
  const startTime = performance.now();
  const { id } = req.params;

  try {
    // Eliminar pasos del manual
    await executeQuery(`DELETE FROM steps WHERE manual_id = $1`, [id]);

    // Eliminar favoritos asociados al manual
    await executeQuery(`DELETE FROM favorites WHERE manual_id = $1`, [id]);

    // Eliminar ratings asociados al manual
    await executeQuery(`DELETE FROM ratings WHERE manual_id = $1`, [id]);

    // Eliminar relaciones con empresas y categorías
    await executeQuery(`DELETE FROM manual_company WHERE manual_id = $1`, [id]);
    await executeQuery(`DELETE FROM manual_category WHERE manual_id = $1`, [id]);

    // Finalmente, eliminar el manual
    await executeQuery(`DELETE FROM manuals WHERE id = $1`, [id]);
    processRecords();
    res.status(200).json({ message: "Manual eliminado correctamente." });
  } catch (error) {
    logRed(`Error en DELETE /api/manuals/${id}: ${error.stack}`);
    res.status(500).json({ message: "Error al eliminar el manual." });
  } finally {
    const endTime = performance.now();
    logPurple(`Tiempo de ejecución: ${endTime - startTime} ms`);
  }
});
router.post("/api/users/:userId/company", async (req, res) => {
  const startTime = performance.now();
  const { userId } = req.params;
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "El código es obligatorio." });
  }

  try {
    // Verificar si el código es válido
    const result = await executeQuery(
      `
      SELECT company_id 
      FROM access_codes 
      WHERE code = $1 
        AND active = true 
        AND (expiration_date IS NULL OR expiration_date >= CURRENT_DATE)
      LIMIT 1
    `,
      [code]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Código inválido o expirado." });
    }

    const companyId = result[0].company_id;

    // Actualizar el usuario con la empresa
    await executeQuery(
      `
      UPDATE users 
      SET company_id = $1 
      WHERE id = $2
    `,
      [companyId, userId]
    );

    res.status(200).json({
      message: "Usuario vinculado correctamente a la empresa.",
      company_id: companyId
    });
  } catch (error) {
    logRed(`Error en POST /api/users/:userId/company: ${error.stack}`);
    res.status(500).json({ message: "Error interno del servidor." });
  } finally {
    const endTime = performance.now();
    logPurple(`POST /api/users/${userId}/company → ${endTime - startTime} ms`);
  }
});
router.get("/api/manuales-dashboard", async (req, res) => {
  const startTime = performance.now();
  try {
    const result = await executeQuery(`
      SELECT 
        m.id,
        m.title,
        m.description,
        m.public,
        m.image,
        m.created_at,
        u.name AS author,
        COUNT(DISTINCT s.id) AS step_count,
        COUNT(DISTINCT f.user_id) AS favorites_count
      FROM manuals m
      LEFT JOIN users u ON m.created_by = u.id
      LEFT JOIN steps s ON m.id = s.manual_id
      LEFT JOIN favorites f ON m.id = f.manual_id
      GROUP BY m.id, u.name
      ORDER BY m.created_at DESC
    `);

    res.status(200).json({
      body: result,
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

router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, password are required' });
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: 'Invalid name format' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 1) Verificar si ya existe
    const qUsers = 'SELECT * FROM users WHERE email = $1';
    const existing = await executeQuery(qUsers, [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'User already registered' });
    }

    // 2) Insertar y devolver fila creada
    const hashed = await bcrypt.hash(password, 10);
    const qInsert = `
      INSERT INTO users (name, email, role, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
    `;
    const result = await executeQuery(qInsert, [name, email, 0, hashed]);

    // Dependiendo de tu wrapper, puede ser result.rows[0] o result[0]
    const newUser = result.rows ? result.rows[0] : result[0];

    return res.status(201).json({
      message: 'User registered successfully',
      body: newUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});
router.post("/api/empresas/crear", express.json(), async (req, res) => {
  const { empresa_nombre, admin_nombre, admin_email, admin_password } = req.body;

  if (!empresa_nombre || !admin_nombre || !admin_email || !admin_password) {
    return res.status(400).json({ message: "Faltan datos obligatorios." });
  }

  try {
    // 1. Crear empresa
    const empresa = await executeQuery(
      "INSERT INTO companies (name, created_at) VALUES ($1, NOW()) RETURNING id",
      [empresa_nombre]
    );
    const empresaId = empresa[0]?.id;

    // 2. Verificar si ya existe usuario
    const existe = await executeQuery(
      "SELECT id FROM users WHERE email = $1",
      [admin_email]
    );
    if (existe.length > 0) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    // 3. Hashear contraseña
    const hashed = await bcrypt.hash(admin_password, 10);

    // 4. Crear usuario
    await executeQuery(
      `INSERT INTO users (name, email, password, role, company_id, created_at)
       VALUES ($1, $2, $3, '1', $4, NOW())`,
      [admin_nombre, admin_email, hashed, empresaId]
    );
    processRecords();
    return res.status(201).json({ message: "Empresa y usuario creados correctamente." });
  } catch (error) {
    console.error("Error al crear empresa/usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});
router.get("/api/companies/:id", async (req, res) => {
  const startTime = performance.now();
  try {
    const { id } = req.params;
    const result = await executeQuery(
      `SELECT id, name, created_at FROM companies WHERE id = $1`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.status(200).json({ body: result[0], message: "Empresa encontrada" });
  } catch (error) {
    logRed(`Error en GET /api/companies/:id → ${error.stack}`);
    res.status(500).json({ message: error.message });
  } finally {
    logPurple(`GET /api/companies/:id - ${performance.now() - startTime}ms`);
  }
});// PUT editar nombre de la empresa
router.put("/api/companies/:id", express.json(), async (req, res) => {
  const startTime = performance.now();
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Nombre inválido" });
    }

    await executeQuery(`UPDATE companies SET name = $1 WHERE id = $2`, [name, id]);

    res.status(200).json({ message: "Empresa actualizada correctamente" });
  } catch (error) {
    logRed(`Error en PUT /api/companies/:id → ${error.stack}`);
    res.status(500).json({ message: error.message });
  } finally {
    logPurple(`PUT /api/companies/:id - ${performance.now() - startTime}ms`);
  }
});

// POST generar código de acceso
router.post("/api/access-codes", express.json(), async (req, res) => {
  const startTime = performance.now();
  try {
    const { company_id } = req.body;

    if (!company_id) {
      return res.status(400).json({ message: "company_id requerido" });
    }

    const code = randomCode(6).toUpperCase();

    await executeQuery(
      `INSERT INTO access_codes (code, company_id, active, expiration_date)
       VALUES ($1, $2, true, NOW() + INTERVAL '90 days')`,
      [code, company_id]
    );

    res.status(201).json({ message: "Código generado", body: { code } });
  } catch (error) {
    logRed(`Error en POST /api/access-codes → ${error.stack}`);
    res.status(500).json({ message: error.message });
  } finally {
    logPurple(`POST /api/access-codes - ${performance.now() - startTime}ms`);
  }
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
router.get("/api/users/:userId/favorites", async (req, res) => {
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
router.put("/api/manuals/:manualId", async (req, res) => {
  const startTime = performance.now();
  const { manualId } = req.params;

  const required = ["title", "description", "image", "public", "steps"];
  const missing = required.filter((key) => !(key in req.body));
  if (missing.length > 0) {
    return res.status(400).json({ message: `Faltan campos: ${missing.join(", ")}` });
  }

  const { title, description, image, public: isPublic, steps } = req.body;

  try {
    // Actualizar el manual principal
    await executeQuery(
      `
      UPDATE manuals
      SET title = $1,
          description = $2,
          image = $3,
          public = $4
      WHERE id = $5
      `,
      [title, description, image, isPublic, manualId]
    );

    // Eliminar pasos anteriores
    await executeQuery(`DELETE FROM steps WHERE manual_id = $1`, [manualId]);

    // Insertar nuevos pasos
    for (const step of steps) {
      const { order, title, description, image = null } = step;
      await executeQuery(
        `
        INSERT INTO steps (manual_id, "order", title, description, image)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [manualId, order, title, description, image]
      );
    }

    res.status(200).json({
      success: true,
      message: "Manual actualizado correctamente"
    });
  } catch (error) {
    logRed(`❌ Error al actualizar manual ${manualId}: ${error.stack}`);
    res.status(500).json({ message: "Error interno al editar manual." });
  } finally {
    const endTime = performance.now();
    logPurple(`🕒 Tiempo edición manual: ${endTime - startTime} ms`);
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

router.post("/api/manuals", async (req, res) => {
  const startTime = performance.now();

  const required = ["title", "created_by", "steps"];
  const missing = verifyParameters(req.body, required);

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Faltan los siguientes campos requeridos: ${missing.join(", ")}`
    });
  }

  const {
    title,
    description = null,
    created_by,
    public: isPublic = true,
    image = null,
    steps
  } = req.body;

  try {
    // Insertar el manual
    const manualResult = await executeQuery(
      `
  INSERT INTO manuals (title, description, created_by, public, image)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id
  `,
      [title, description, created_by, isPublic, image], true
    );


    const manualId = manualResult[0].id;

    // Insertar los pasos (uno por uno)
    for (const step of steps) {
      const { order, title, description, image = null } = step;

      await executeQuery(
        `
        INSERT INTO steps (manual_id, "order", title, description, image)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [manualId, order, title, description, image], true
      );
    }
    processRecords();
    res.status(201).json({
      success: true,
      message: "Manual y pasos creados correctamente.",
      manual_id: manualId
    });
  } catch (error) {
    logRed(`❌ Error en POST /api/manuals: ${error.stack}`);
    res.status(500).json({ message: "Error al crear el manual o sus pasos." });
  } finally {
    const endTime = performance.now();
    logPurple(`🕒 Tiempo ejecución POST /api/manuals: ${endTime - startTime} ms`);
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
    logGreen(`Rating deleted successfully for user ${userId} and manual ${manualId}`);
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
router.get("/api/companies", async (req, res) => {
  const start = performance.now();
  try {
    const result = await executeQuery(`SELECT id, name, created_at FROM companies ORDER BY created_at DESC`);
    res.status(200).json({
      message: "Empresas listadas correctamente.",
      body: result,
    });
  } catch (error) {
    logRed("Error en GET /api/companies: " + error.stack);
    res.status(500).json({ message: "Error listando empresas: " + error.message });
  } finally {
    logPurple(`GET /api/companies demoró ${performance.now() - start} ms`);
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


export function randomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
