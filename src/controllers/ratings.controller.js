import { performance } from "perf_hooks";
import { logRed, logPurple, logGreen } from "../utils/logs_custom.js";
import { verifyParameters } from "../utils/verify_parameters.js";

export class RatingsController {
  constructor(ratingsService) {
    this.ratingsService = ratingsService;
  }

  create = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.body || {}, ["user_id", "manual_id"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
    }

    try {
      const { user_id, manual_id, score, comment } = req.body;
      const body = await this.ratingsService.createRating({ user_id, manual_id, score, comment });
      return res.status(200).json({ message: "Rating created successfully.", body });
    } catch (err) {
      logRed(`Error in POST /api/ratings: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`POST /api/ratings - ${performance.now() - start}ms`);
    }
  };

  delete = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.params, ["userId", "manualId"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
    }

    try {
      const { userId, manualId } = req.params;
      await this.ratingsService.deleteRating({ userId, manualId });
      logGreen(`Rating deleted successfully for user ${userId} and manual ${manualId}`);
      return res.status(200).json({ message: "Rating deleted successfully.", body: { user_id: userId, manual_id: manualId } });
    } catch (err) {
      logRed(`Error in DELETE /api/ratings/:userId/:manualId: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`DELETE /api/ratings/:userId/:manualId - ${performance.now() - start}ms`);
    }
  };

  listByManual = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.params, ["id"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Falta el parámetro: ${missing.join(", ")}` });
    }

    try {
      const body = await this.ratingsService.listRatingsByManual(req.params.id);
      return res.status(200).json({ body, message: "Valoraciones obtenidas correctamente." });
    } catch (err) {
      logRed(`Error en GET /api/valoraciones/manuales/:id: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/valoraciones/manuales/:id - ${performance.now() - start}ms`);
    }
  };
}
