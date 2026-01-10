import { executeQuery, withTransaction } from "../db/db.js";

export class CompaniesRepository {
  async listAll({ log = false } = {}) {
    return await executeQuery(
      "SELECT id, name, created_at FROM companies ORDER BY created_at DESC",
      [],
      log
    );
  }

  async getById(id, { log = false } = {}) {
    const rows = await executeQuery(
      "SELECT id, name, created_at FROM companies WHERE id = $1",
      [id],
      log
    );
    return rows[0] ?? null;
  }

  async updateName(id, name, { log = false } = {}) {
    await executeQuery("UPDATE companies SET name = $1 WHERE id = $2", [name, id], log);
    return true;
  }

  async deleteCompany(companyId, { log = false } = {}) {
    return await withTransaction(async () => {
      await executeQuery("UPDATE users SET company_id = NULL WHERE company_id = $1", [companyId], log);
      await executeQuery("DELETE FROM companies WHERE id = $1", [companyId], log);
      return true;
    }, { log });
  }

  async createCompany(name, { log = false } = {}) {
    const rows = await executeQuery(
      "INSERT INTO companies (name, created_at) VALUES ($1, NOW()) RETURNING id",
      [name],
      log
    );
    return rows[0]?.id ?? null;
  }
}
