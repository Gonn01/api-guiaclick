
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
  express.json(),    // <— asegúrate de tener el body-parser
  async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email and password are required' });
      }

      // 1) Busca el user en la base
      const qUsers = 'SELECT * FROM users WHERE email = $1';
      const rows = await executeQuery(qUsers, [email]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const user = rows[0];

      // 2) Compara contraseñas (ambos deben ser strings)
      const rawPassword = String(password);
      const hashedPassword = String(user.password);
      const isValid = await bcrypt.compare(rawPassword, hashedPassword);

      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 3) Genera JWT
      const JWT_SECRET = process.env.JWT_SECRET;
      if (typeof JWT_SECRET !== 'string' || JWT_SECRET.trim() === '') {
        throw new Error('JWT_SECRET is invalid or undefined');
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // 4) Responde
      return res.status(200).json({
        message: 'Login successful',
        body: {
          token: token,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role * 1,
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

if (process.env.NETLIFY !== "true") {
  app.use("/.netlify/functions/server", router);
  app.listen(port, () => {
    logBlue(`Servidor corriendo en http://localhost:${port}`);
  });
} else {
  app.use('/.netlify/functions/server', router);
}

export const handler = serverless(app);


