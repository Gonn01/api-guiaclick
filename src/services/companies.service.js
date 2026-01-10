import bcrypt from "bcryptjs";

export class CompaniesService {
  constructor({ companiesRepository, usersRepository, algoliaService }) {
    this.companiesRepository = companiesRepository;
    this.usersRepository = usersRepository;
    this.algoliaService = algoliaService;
  }

  async listCompanies() {
    return await this.companiesRepository.listAll();
  }

  async getCompany(id) {
    const company = await this.companiesRepository.getById(id);
    if (!company) {
      const err = new Error("Empresa no encontrada");
      err.statusCode = 404;
      throw err;
    }
    return company;
  }

  async updateCompanyName({ id, name }) {
    if (!name || name.trim() === "") {
      const err = new Error("Nombre inválido");
      err.statusCode = 400;
      throw err;
    }
    await this.companiesRepository.updateName(id, name);
    return true;
  }

  async deleteCompany(companyId) {
    await this.companiesRepository.deleteCompany(companyId);
    return true;
  }

  async createCompanyWithAdmin({ empresa_nombre, admin_nombre, admin_email, admin_password }) {
    if (!empresa_nombre || !admin_nombre || !admin_email || !admin_password) {
      const err = new Error("Faltan datos obligatorios.");
      err.statusCode = 400;
      throw err;
    }

    const exists = await this.usersRepository.existsByEmail(admin_email);
    if (exists) {
      const err = new Error("El email ya está registrado.");
      err.statusCode = 409;
      throw err;
    }

    const companyId = await this.companiesRepository.createCompany(empresa_nombre);
    const hashed = await bcrypt.hash(String(admin_password), 10);

    await this.usersRepository.createUser({
      name: admin_nombre,
      email: admin_email,
      passwordHash: hashed,
      role: 1,
      company_id: companyId,
    });

    await this.algoliaService?.reindexManuals?.();
    return companyId;
  }
}
