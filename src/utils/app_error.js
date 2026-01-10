export class AppError extends Error {
  /**
   * @param {object} args
   * @param {string} args.message
   * @param {number} [args.statusCode]
   * @param {string} [args.code]
   * @param {any} [args.details]
   */
  constructor({ message, statusCode = 500, code = undefined, details = undefined }) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
