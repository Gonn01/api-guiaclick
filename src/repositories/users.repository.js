import { executeQuery, withTransaction } from "../db/db.js";

export class UsersRepository {
  async findByEmailWithCompany(email, { log = false } = {}) {
    const rows = await executeQuery(
      `
        SELECT u.*, c.name AS company_name
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE u.email = $1
      `,
      [email],
      log
    );
    return rows[0] ?? null;
  }

  async existsByEmail(email, { log = false } = {}) {
    const rows = await executeQuery("SELECT 1 FROM users WHERE email = $1 LIMIT 1", [email], log);
    return rows.length > 0;
  }

  async createUser({ name, email, passwordHash, role = 0, company_id = null }, { log = false } = {}) {
    const rows = await executeQuery(
      `
        INSERT INTO users (name, email, role, password, company_id, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, name, email, role, company_id
      `,
      [name, email, String(role), passwordHash, company_id],
      log
    );
    return rows[0] ?? null;
  }

  async listAll({ log = false } = {}) {
    return await executeQuery(
      `
        SELECT *
        FROM users
        ORDER BY name
      `,
      [],
      log
    );
  }

  async updateCompany(userId, companyId, { log = false } = {}) {
    await executeQuery(
      "UPDATE users SET company_id = $1 WHERE id = $2",
      [companyId, userId],
      log
    );
    return true;
  }

  async deleteUserCascade(userId, { log = false } = {}) {
    return await withTransaction(async () => {
      await executeQuery("DELETE FROM favorites WHERE user_id = $1", [userId], log);
      await executeQuery("DELETE FROM ratings WHERE user_id = $1", [userId], log);
      await executeQuery(
        "DELETE FROM steps WHERE manual_id IN (SELECT id FROM manuals WHERE created_by = $1)",
        [userId],
        log
      );
      await executeQuery(
        "DELETE FROM favorites WHERE manual_id IN (SELECT id FROM manuals WHERE created_by = $1)",
        [userId],
        log
      );
      await executeQuery("DELETE FROM manuals WHERE created_by = $1", [userId], log);
      await executeQuery("DELETE FROM users WHERE id = $1", [userId], log);
      return true;
    }, { log });
  }
}
