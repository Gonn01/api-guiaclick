import { AppError } from "../utils/app_error.js";
import { verifyParameters } from "../utils/verify_parameters.js";
import { Roles, normalizeRole } from "../constants/roles.js";

export class ManualsController {
  constructor(manualsService) {
    this.manualsService = manualsService;
  }

  list = async (_req, res) => {
    const body = await this.manualsService.listManuales();
    return res.status(200).json({ body, message: "Manuales listados correctamente." });
  };

  dashboardList = async (_req, res) => {
    const body = await this.manualsService.listManualesDashboard();
    return res.status(200).json({ body, message: "Manuales listados correctamente." });
  };

  getById = async (req, res) => {
    const missing = verifyParameters(req.params, ["id"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Falta el parámetro: ${missing.join(", ")}`, statusCode: 400 });
    }

    const body = await this.manualsService.getManualById(req.params.id);
    return res.status(200).json({ body, message: "Manual obtenido correctamente." });
  };

  getSteps = async (req, res) => {
    const missing = verifyParameters(req.params, ["manualId"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Missing required parameters: ${missing.join(", ")}`, statusCode: 400 });
    }

    const body = await this.manualsService.getManualSteps(req.params.manualId);
    return res.status(200).json({ success: true, body });
  };

  create = async (req, res) => {
    const required = ["title", "created_by", "steps"];
    const missing = verifyParameters(req.body, required);
    if (missing.length > 0) {
      throw new AppError({
        message: `Faltan los siguientes campos requeridos: ${missing.join(", ")}`,
        statusCode: 400,
      });
    }

    const {
      title,
      description = null,
      created_by,
      public: isPublic = true,
      image = null,
      steps,
      company_id = null,
    } = req.body;

    const tokenUserId = Number(req.user?.userId);
    const role = normalizeRole(req.user?.role);
    if (Number.isFinite(tokenUserId) && Number(created_by) !== tokenUserId && role !== Roles.ADMIN) {
      throw new AppError({ message: "Forbidden", statusCode: 403 });
    }

    const manual_id = await this.manualsService.createManual({
      title,
      description,
      created_by,
      public: isPublic,
      image,
      steps,
      company_id,
      log: true,
    });

    return res.status(201).json({
      success: true,
      message: "Manual y pasos creados correctamente.",
      manual_id,
    });
  };

  update = async (req, res) => {
    const { manualId } = req.params;

    const required = ["title", "description", "image", "public", "steps"];
    const missing = required.filter((key) => !(key in (req.body || {})));
    if (missing.length > 0) {
      throw new AppError({ message: `Faltan campos: ${missing.join(", ")}`, statusCode: 400 });
    }

    // Owner check (creator or admin)
    const manual = await this.manualsService.getManualById(manualId);
    const tokenUserId = Number(req.user?.userId);
    const role = normalizeRole(req.user?.role);
    if (Number.isFinite(tokenUserId) && Number(manual?.created_by) !== tokenUserId && role !== Roles.ADMIN) {
      throw new AppError({ message: "Forbidden", statusCode: 403 });
    }

    const { title, description, image, public: isPublic, steps } = req.body;
    await this.manualsService.updateManual(manualId, {
      title,
      description,
      image,
      public: isPublic,
      steps,
      log: true,
    });

    return res.status(200).json({ success: true, message: "Manual actualizado correctamente" });
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const manual = await this.manualsService.getManualById(id);
    const tokenUserId = Number(req.user?.userId);
    const role = normalizeRole(req.user?.role);
    if (Number.isFinite(tokenUserId) && Number(manual?.created_by) !== tokenUserId && role !== Roles.ADMIN) {
      throw new AppError({ message: "Forbidden", statusCode: 403 });
    }
    await this.manualsService.deleteManual(id);
    return res.status(200).json({ message: "Manual eliminado correctamente." });
  };
}
