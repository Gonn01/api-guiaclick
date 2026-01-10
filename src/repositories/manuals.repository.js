import { executeQuery, withTransaction } from "../db/db.js";

export class ManualsRepository {
  async listPublic({ log = false } = {}) {
    const query = `
      SELECT
        m.id,
        m.title,
        m.description,
        m.image,
        m.public,
        m.company_id,
        u.name AS author,
        m.created_at,
        COUNT(DISTINCT s.id) AS step_count,
        COUNT(DISTINCT f.user_id) AS favorites_count
      FROM manuals m
      LEFT JOIN users u ON m.created_by = u.id
      LEFT JOIN steps s ON m.id = s.manual_id
      LEFT JOIN favorites f ON m.id = f.manual_id
      GROUP BY m.id, u.name
      ORDER BY m.created_at DESC
    `;

    const results = await executeQuery(query, [], log);
    return results.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image,
      public: row.public,
      company_id: row.company_id,
      author: row.author,
      created_at: row.created_at,
      step_count: Number(row.step_count ?? 0),
      favorites_count: Number(row.favorites_count ?? 0),
    }));
  }

  async listDashboard({ log = false } = {}) {
    const query = `
      SELECT 
        m.id,
        m.title,
        m.description,
        m.public,
        m.image,
        m.created_at,
        m.company_id,
        u.name AS author,
        COUNT(DISTINCT s.id) AS step_count,
        COUNT(DISTINCT f.user_id) AS favorites_count
      FROM manuals m
      LEFT JOIN users u ON m.created_by = u.id
      LEFT JOIN steps s ON m.id = s.manual_id
      LEFT JOIN favorites f ON m.id = f.manual_id
      GROUP BY m.id, u.name
      ORDER BY m.created_at DESC
    `;

    return await executeQuery(query, [], log);
  }

  async getById(id, { log = false } = {}) {
    const query = "SELECT * FROM manuals WHERE id = $1";
    const results = await executeQuery(query, [id], log);
    return results[0] ?? null;
  }

  async getSteps(manualId, { log = false } = {}) {
    const query = `
      SELECT *
      FROM steps
      WHERE manual_id = $1
      ORDER BY "order" ASC
    `;
    const rows = await executeQuery(query, [manualId], log);
    return rows.map((row) => ({
      ...row,
      created_at: row.created_at?.toISOString?.() ?? null,
    }));
  }

  async createManualWithSteps({
    title,
    description = null,
    created_by,
    public: isPublic = true,
    image = null,
    company_id = null,
    steps = [],
    log = false,
  }) {
    return await withTransaction(async () => {
      const manualResult = await executeQuery(
        `
          INSERT INTO manuals (title, description, created_by, public, image, company_id)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `,
        [title, description, created_by, isPublic, image, company_id],
        log
      );

      const manualId = manualResult?.[0]?.id;

      for (const step of steps) {
        const { order, title: stepTitle, description: stepDesc, image: stepImg = null } = step;
        await executeQuery(
          `
            INSERT INTO steps (manual_id, "order", title, description, image)
            VALUES ($1, $2, $3, $4, $5)
          `,
          [manualId, order, stepTitle, stepDesc, stepImg],
          log
        );
      }

      return manualId;
    }, { log });
  }

  async updateManualWithSteps(manualId, { title, description, image, public: isPublic, steps, log = false }) {
    return await withTransaction(async () => {
      await executeQuery(
        `
          UPDATE manuals
          SET title = $1,
              description = $2,
              image = $3,
              public = $4
          WHERE id = $5
        `,
        [title, description, image, isPublic, manualId],
        log
      );

      await executeQuery("DELETE FROM steps WHERE manual_id = $1", [manualId], log);

      for (const step of steps) {
        const { order, title: stepTitle, description: stepDesc, image: stepImg = null } = step;
        await executeQuery(
          `
            INSERT INTO steps (manual_id, "order", title, description, image)
            VALUES ($1, $2, $3, $4, $5)
          `,
          [manualId, order, stepTitle, stepDesc, stepImg],
          log
        );
      }

      return true;
    }, { log });
  }

  async deleteManualCascade(manualId, { log = false } = {}) {
    return await withTransaction(async () => {
      await executeQuery("DELETE FROM steps WHERE manual_id = $1", [manualId], log);
      await executeQuery("DELETE FROM favorites WHERE manual_id = $1", [manualId], log);
      await executeQuery("DELETE FROM ratings WHERE manual_id = $1", [manualId], log);
      await executeQuery("DELETE FROM manuals WHERE id = $1", [manualId], log);
      return true;
    }, { log });
  }
}
