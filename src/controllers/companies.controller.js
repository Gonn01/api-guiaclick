import { performance } from "perf_hooks";
import { logRed, logPurple } from "../utils/logs_custom.js";

export class CompaniesController {
  constructor(companiesService) {
    this.companiesService = companiesService;
  }

  list = async (req, res) => {
    const start = performance.now();
    try {
      const body = await this.companiesService.listCompanies();
      return res.status(200).json({ message: "Empresas listadas correctamente.", body });
    } catch (err) {
      logRed(`Error en GET /api/companies: ${err.stack || err.message}`);
      return res.status(500).json({ message: "Error listando empresas: " + err.message });
    } finally {
      logPurple(`GET /api/companies - ${performance.now() - start}ms`);
    }
  };

  getById = async (req, res) => {
    const start = performance.now();
    try {
      const body = await this.companiesService.getCompany(req.params.id);
      return res.status(200).json({ body, message: "Empresa encontrada" });
    } catch (err) {
      logRed(`Error en GET /api/companies/:id: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/companies/:id - ${performance.now() - start}ms`);
    }
  };

  updateName = async (req, res) => {
    const start = performance.now();
    try {
      await this.companiesService.updateCompanyName({ id: req.params.id, name: req.body?.name });
      return res.status(200).json({ message: "Empresa actualizada correctamente" });
    } catch (err) {
      logRed(`Error en PUT /api/companies/:id: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message });
    } finally {
      logPurple(`PUT /api/companies/:id - ${performance.now() - start}ms`);
    }
  };

  delete = async (req, res) => {
    const start = performance.now();
    try {
      await this.companiesService.deleteCompany(req.params.companyId);
      return res.status(200).json({ message: "Empresa eliminada correctamente." });
    } catch (err) {
      logRed(`Error en DELETE /api/companies/:companyId: ${err.stack || err.message}`);
      return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
      logPurple(`DELETE /api/companies/:companyId - ${performance.now() - start}ms`);
    }
  };

  createCompanyWithAdmin = async (req, res) => {
    try {
      const { empresa_nombre, admin_nombre, admin_email, admin_password } = req.body;
      await this.companiesService.createCompanyWithAdmin({ empresa_nombre, admin_nombre, admin_email, admin_password });
      return res.status(201).json({ message: "Empresa y usuario creados correctamente." });
    } catch (err) {
      logRed(`Error en POST /api/empresas/crear: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };
}
