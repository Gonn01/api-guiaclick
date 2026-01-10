import { AppError } from "../utils/app_error.js";

export class AccessCodesController {
  constructor(accessCodesService) {
    this.accessCodesService = accessCodesService;
  }

  generate = async (req, res) => {
    const { company_id } = req.body || {};
    if (!company_id) throw new AppError({ message: "company_id es obligatorio", statusCode: 400 });
    const code = await this.accessCodesService.generate({ company_id });
    return res.status(200).json({ message: "Código generado correctamente", code });
  };
}
