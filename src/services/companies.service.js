import bcrypt from "bcryptjs";
import { AppError } from "../utils/app_error.js";
import { Roles } from "../constants/roles.js";

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
      throw new AppError({ message: "Empresa no encontrada", statusCode: 404 });
    }
    return company;
  }

  async updateCompanyName({ id, name }) {
    if (!name || name.trim() === "") {
      throw new AppError({ message: "Nombre inválido", statusCode: 400 });
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
      throw new AppError({ message: "Faltan datos obligatorios.", statusCode: 400 });
    }

    const exists = await this.usersRepository.existsByEmail(admin_email);
    if (exists) {
      throw new AppError({ message: "El email ya está registrado.", statusCode: 409 });
    }

    const companyId = await this.companiesRepository.createCompany(empresa_nombre);
    const hashed = await bcrypt.hash(String(admin_password), 10);

    await this.usersRepository.createUser({
      name: admin_nombre,
      email: admin_email,
      passwordHash: hashed,
      role: Roles.ADMIN,
      company_id: companyId,
    });

    await this.algoliaService?.reindexManuals?.();
    return companyId;
  }
}
