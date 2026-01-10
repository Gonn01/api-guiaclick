import { performance } from "perf_hooks";
import { logRed, logPurple } from "../utils/logs_custom.js";
import { verifyParameters } from "../utils/verify_parameters.js";

export class ManualsController {
  constructor(manualsService) {
    this.manualsService = manualsService;
  }

  list = async (req, res) => {
    const start = performance.now();
    try {
      const body = await this.manualsService.listManuales();
      return res.status(200).json({ body, message: "Manuales listados correctamente." });
    } catch (err) {
      logRed(`Error en GET /api/manuales: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/manuales - ${performance.now() - start}ms`);
    }
  };

  dashboardList = async (req, res) => {
    const start = performance.now();
    try {
      const body = await this.manualsService.listManualesDashboard();
      return res.status(200).json({ body, message: "Manuales listados correctamente." });
    } catch (err) {
      logRed(`Error en GET /api/manuales-dashboard: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/manuales-dashboard - ${performance.now() - start}ms`);
    }
  };

  getById = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.params, ["id"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
    }

    try {
      const body = await this.manualsService.getManualById(req.params.id);
      return res.status(200).json({ body, message: "Manual obtenido correctamente." });
    } catch (err) {
      logRed(`Error en GET /api/manuales/:id: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/manuales/:id - ${performance.now() - start}ms`);
    }
  };

  getSteps = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.params, ["manualId"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
    }

    try {
      const body = await this.manualsService.getManualSteps(req.params.manualId);
      return res.status(200).json({ success: true, body });
    } catch (err) {
      logRed(`Error in GET /api/manuals/:manualId/steps: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/manuals/:manualId/steps - ${performance.now() - start}ms`);
    }
  };

  create = async (req, res) => {
    const start = performance.now();
    const required = ["title", "created_by", "steps"];
    const missing = verifyParameters(req.body, required);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Faltan los siguientes campos requeridos: ${missing.join(", ")}` });
    }

    try {
      const {
        title,
        description = null,
        created_by,
        public: isPublic = true,
        image = null,
        steps,
        company_id = null,
      } = req.body;

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

      return res.status(201).json({ success: true, message: "Manual y pasos creados correctamente.", manual_id });
    } catch (err) {
      logRed(`Error en POST /api/manuals: ${err.stack || err.message}`);
      return res.status(500).json({ message: "Error al crear el manual o sus pasos." });
    } finally {
      logPurple(`POST /api/manuals - ${performance.now() - start}ms`);
    }
  };

  update = async (req, res) => {
    const start = performance.now();
    const { manualId } = req.params;

    const required = ["title", "description", "image", "public", "steps"];
    const missing = required.filter((key) => !(key in (req.body || {})));
    if (missing.length > 0) {
      return res.status(400).json({ message: `Faltan campos: ${missing.join(", ")}` });
    }

    try {
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
    } catch (err) {
      logRed(`Error al actualizar manual ${manualId}: ${err.stack || err.message}`);
      return res.status(500).json({ message: "Error interno al editar manual." });
    } finally {
      logPurple(`PUT /api/manuals/:manualId - ${performance.now() - start}ms`);
    }
  };

  delete = async (req, res) => {
    const start = performance.now();
    const { id } = req.params;

    try {
      await this.manualsService.deleteManual(id);
      return res.status(200).json({ message: "Manual eliminado correctamente." });
    } catch (err) {
      logRed(`Error en DELETE /api/manuals/:id: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message || "Error al eliminar el manual." });
    } finally {
      logPurple(`DELETE /api/manuals/:id - ${performance.now() - start}ms`);
    }
  };
}
