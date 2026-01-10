import { performance } from "perf_hooks";
import { logRed, logPurple } from "../utils/logs_custom.js";
import { verifyParameters } from "../utils/verify_parameters.js";

export class FavoritesController {
  constructor(favoritesService) {
    this.favoritesService = favoritesService;
  }

  listByUser = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.params, ["userId"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required parameter: ${missing.join(", ")}` });
    }

    try {
      const body = await this.favoritesService.getUserFavorites(req.params.userId);
      return res.status(200).json({ success: true, body });
    } catch (err) {
      logRed(`Error in GET /api/users/:userId/favorites: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/users/:userId/favorites - ${performance.now() - start}ms`);
    }
  };

  check = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.params, ["userId", "manualId"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
    }

    try {
      const body = await this.favoritesService.isManualFavorite(req.params.userId, req.params.manualId);
      return res.status(200).json({ success: true, body });
    } catch (err) {
      logRed(`Error in GET /api/users/:userId/favorites/:manualId/check: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/users/:userId/favorites/:manualId/check - ${performance.now() - start}ms`);
    }
  };

  add = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.params, ["userId", "manualId"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
    }

    try {
      await this.favoritesService.addFavorite(req.params.userId, req.params.manualId);
      return res.status(200).json({ success: true, message: "Manual marked as favorite successfully." });
    } catch (err) {
      logRed(`Error in POST /api/users/:userId/favorites/:manualId: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`POST /api/users/:userId/favorites/:manualId - ${performance.now() - start}ms`);
    }
  };

  remove = async (req, res) => {
    const start = performance.now();
    const missing = verifyParameters(req.params, ["userId", "manualId"]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required parameters: ${missing.join(", ")}` });
    }

    try {
      await this.favoritesService.removeFavorite(req.params.userId, req.params.manualId);
      return res.status(200).json({ message: "Manual unmarked as favorite successfully.", body: { userId: req.params.userId, manualId: req.params.manualId } });
    } catch (err) {
      logRed(`Error in DELETE /api/users/:userId/favorites/:manualId: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`DELETE /api/users/:userId/favorites/:manualId - ${performance.now() - start}ms`);
    }
  };
}
