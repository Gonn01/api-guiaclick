import { executeQuery } from "../db/db.js";

export class AccessCodesRepository {
  async create({ code, company_id }, { log = false } = {}) {
    await executeQuery(
      `
        INSERT INTO access_codes (code, company_id, active, expiration_date)
        VALUES ($1, $2, true, NOW() + INTERVAL '90 days')
      `,
      [code, company_id],
      log
    );
    return true;
  }

  async findValid(code, { log = false } = {}) {
    const rows = await executeQuery(
      `
        SELECT company_id
        FROM access_codes
        WHERE code = $1
          AND active = true
          AND (expiration_date IS NULL OR expiration_date >= CURRENT_DATE)
        LIMIT 1
      `,
      [code],
      log
    );
    return rows[0] ?? null;
  }
}
