import { AppError } from "../utils/app_error.js";
import { verifyParameters } from "../utils/verify_parameters.js";

export class FavoritesController {
  constructor(favoritesService) {
    this.favoritesService = favoritesService;
  }

  listByUser = async (req, res) => {
    const missing = verifyParameters(req.params, ["userId"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Missing required parameter: ${missing.join(", ")}`, statusCode: 400 });
    }

    const body = await this.favoritesService.getUserFavorites(req.params.userId);
    return res.status(200).json({ success: true, body });
  };

  check = async (req, res) => {
    const missing = verifyParameters(req.params, ["userId", "manualId"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Missing required parameters: ${missing.join(", ")}`, statusCode: 400 });
    }

    const body = await this.favoritesService.isManualFavorite(req.params.userId, req.params.manualId);
    return res.status(200).json({ success: true, body });
  };

  add = async (req, res) => {
    const missing = verifyParameters(req.params, ["userId", "manualId"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Missing required parameters: ${missing.join(", ")}`, statusCode: 400 });
    }

    await this.favoritesService.addFavorite(req.params.userId, req.params.manualId);
    return res.status(200).json({ success: true, message: "Manual marked as favorite successfully." });
  };

  remove = async (req, res) => {
    const missing = verifyParameters(req.params, ["userId", "manualId"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Missing required parameters: ${missing.join(", ")}`, statusCode: 400 });
    }

    await this.favoritesService.removeFavorite(req.params.userId, req.params.manualId);
    return res.status(200).json({
      message: "Manual unmarked as favorite successfully.",
      body: { userId: req.params.userId, manualId: req.params.manualId },
    });
  };
}
