import { executeQuery } from "../db/db.js";

export class FavoritesRepository {
  async listByUser(userId, { log = false } = {}) {
    const query = `
      SELECT m.*
      FROM favorites f
      JOIN manuals m ON m.id = f.manual_id
      WHERE f.user_id = $1
    `;
    return await executeQuery(query, [userId], log);
  }

  async isFavorite(userId, manualId, { log = false } = {}) {
    const query = `
      SELECT 1
      FROM favorites
      WHERE user_id = $1 AND manual_id = $2
      LIMIT 1
    `;
    const rows = await executeQuery(query, [userId, manualId], log);
    return rows.length > 0;
  }

  async add(userId, manualId, { log = false } = {}) {
    const query = `
      INSERT INTO favorites (user_id, manual_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
    await executeQuery(query, [userId, manualId], log);
    return true;
  }

  async remove(userId, manualId, { log = false } = {}) {
    const query = `
      DELETE FROM favorites
      WHERE user_id = $1 AND manual_id = $2
    `;
    await executeQuery(query, [userId, manualId], log);
    return true;
  }
}
