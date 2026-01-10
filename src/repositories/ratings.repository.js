import { executeQuery } from "../db/db.js";

export class RatingsRepository {
  async listByManual(manualId, { log = false } = {}) {
    const query = "SELECT * FROM ratings WHERE manual_id = $1";
    return await executeQuery(query, [manualId], log);
  }

  async create({ user_id, manual_id, score = null, comment = null }, { log = false } = {}) {
    const query = `
      INSERT INTO ratings (user_id, manual_id, score, comment, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const rows = await executeQuery(query, [user_id, manual_id, score, comment], log);
    return rows[0] ?? null;
  }

  async deleteByUserAndManual(userId, manualId, { log = false } = {}) {
    const query = `
      DELETE FROM ratings
      WHERE user_id = $1 AND manual_id = $2
    `;
    await executeQuery(query, [userId, manualId], log);
    return true;
  }
}
