import { performance } from "perf_hooks";
import { logRed, logPurple } from "../utils/logs_custom.js";

export class AccessCodesController {
  constructor(accessCodesService) {
    this.accessCodesService = accessCodesService;
  }

  generate = async (req, res) => {
    const start = performance.now();
    try {
      const { company_id } = req.body;
      const code = await this.accessCodesService.generate({ company_id });
      return res.status(200).json({ message: "Código generado correctamente", code });
    } catch (err) {
      logRed(`Error en POST /api/access-codes: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message });
    } finally {
      logPurple(`POST /api/access-codes - ${performance.now() - start}ms`);
    }
  };
}
