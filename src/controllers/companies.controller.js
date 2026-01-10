import { AppError } from "../utils/app_error.js";

export class CompaniesController {
  constructor(companiesService) {
    this.companiesService = companiesService;
  }

  list = async (_req, res) => {
    const body = await this.companiesService.listCompanies();
    return res.status(200).json({ message: "Empresas listadas correctamente.", body });
  };

  getById = async (req, res) => {
    if (!req.params.id) throw new AppError({ message: "Falta el parámetro: id", statusCode: 400 });
    const body = await this.companiesService.getCompany(req.params.id);
    return res.status(200).json({ body, message: "Empresa encontrada" });
  };

  updateName = async (req, res) => {
    if (!req.params.id) throw new AppError({ message: "Falta el parámetro: id", statusCode: 400 });
    await this.companiesService.updateCompanyName({ id: req.params.id, name: req.body?.name });
    return res.status(200).json({ message: "Empresa actualizada correctamente" });
  };

  delete = async (req, res) => {
    const { companyId } = req.params;
    if (!companyId) throw new AppError({ message: "Falta el parámetro: companyId", statusCode: 400 });
    await this.companiesService.deleteCompany(companyId);
    return res.status(200).json({ message: "Empresa eliminada correctamente." });
  };

  createCompanyWithAdmin = async (req, res) => {
    const { empresa_nombre, admin_nombre, admin_email, admin_password } = req.body || {};
    await this.companiesService.createCompanyWithAdmin({ empresa_nombre, admin_nombre, admin_email, admin_password });
    return res.status(201).json({ message: "Empresa y usuario creados correctamente." });
  };
}
