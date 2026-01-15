import { randomCode } from "../utils/random_code.js";

export class AccessCodesService {
  constructor({ accessCodesRepository }) {
    this.accessCodesRepository = accessCodesRepository;
  }

  async generate({ company_id }) {
    if (!company_id) {
      const err = new Error("company_id requerido");
      err.statusCode = 400;
      throw err;
    }

    const code = randomCode(6).toUpperCase();
    await this.accessCodesRepository.create({ code, company_id });
    return code;
  }
}
