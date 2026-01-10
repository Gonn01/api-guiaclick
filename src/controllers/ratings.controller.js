import { AppError } from "../utils/app_error.js";
import { verifyParameters } from "../utils/verify_parameters.js";

export class RatingsController {
  constructor(ratingsService) {
    this.ratingsService = ratingsService;
  }

  create = async (req, res) => {
    const missing = verifyParameters(req.body || {}, ["user_id", "manual_id"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Missing required parameters: ${missing.join(", ")}`, statusCode: 400 });
    }

    const { user_id, manual_id, score, comment } = req.body;
    const tokenUserId = Number(req.user?.userId);
    if (Number.isFinite(tokenUserId) && Number(user_id) !== tokenUserId) {
      throw new AppError({ message: "Forbidden", statusCode: 403 });
    }
    const body = await this.ratingsService.createRating({ user_id, manual_id, score, comment });
    return res.status(200).json({ message: "Rating created successfully.", body });
  };

  delete = async (req, res) => {
    const missing = verifyParameters(req.params, ["userId", "manualId"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Missing required parameters: ${missing.join(", ")}`, statusCode: 400 });
    }

    const { userId, manualId } = req.params;
    await this.ratingsService.deleteRating({ userId, manualId });
    return res.status(200).json({
      message: "Rating deleted successfully.",
      body: { user_id: userId, manual_id: manualId },
    });
  };

  listByManual = async (req, res) => {
    const missing = verifyParameters(req.params, ["id"]);
    if (missing.length > 0) {
      throw new AppError({ message: `Falta el parámetro: ${missing.join(", ")}`, statusCode: 400 });
    }

    const body = await this.ratingsService.listRatingsByManual(req.params.id);
    return res.status(200).json({ body, message: "Valoraciones obtenidas correctamente." });
  };
}
