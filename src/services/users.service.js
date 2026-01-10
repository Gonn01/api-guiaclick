export class UsersService {
  constructor({ usersRepository, accessCodesRepository }) {
    this.usersRepository = usersRepository;
    this.accessCodesRepository = accessCodesRepository;
  }

  async listUsers() {
    const rows = await this.usersRepository.listAll();
    return rows.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      company_id: u.company_id,
      created_at: u.created_at,
      role: String(u.role) === "1" ? "Admin" : "User",
    }));
  }

  async deleteUser(userId) {
    await this.usersRepository.deleteUserCascade(userId);
    return true;
  }

  async linkUserToCompanyByCode({ userId, code }) {
    if (!code) {
      const err = new Error("El código es obligatorio.");
      err.statusCode = 400;
      throw err;
    }

    const row = await this.accessCodesRepository.findValid(code);
    if (!row) {
      const err = new Error("Código inválido o expirado.");
      err.statusCode = 404;
      throw err;
    }

    const companyId = row.company_id;
    await this.usersRepository.updateCompany(userId, companyId);
    return companyId;
  }
}
