export class ManualsService {
  constructor({ manualsRepository, algoliaService }) {
    this.manualsRepository = manualsRepository;
    this.algoliaService = algoliaService;
  }

  async listManuales() {
    return await this.manualsRepository.listPublic({ log: true });
  }

  async getManualById(id) {
    const manual = await this.manualsRepository.getById(id);
    if (!manual) {
      const err = new Error("Manual no encontrado.");
      err.statusCode = 404;
      throw err;
    }
    return manual;
  }

  async getManualSteps(manualId) {
    return await this.manualsRepository.getSteps(manualId);
  }

  async listManualesDashboard() {
    return await this.manualsRepository.listDashboard();
  }

  async createManual(payload) {
    const manualId = await this.manualsRepository.createManualWithSteps(payload);
    // Best-effort (doesn't block the request)
    await this.algoliaService?.reindexManuals?.();
    return manualId;
  }

  async updateManual(manualId, payload) {
    await this.manualsRepository.updateManualWithSteps(manualId, payload);
    await this.algoliaService?.reindexManuals?.();
    return true;
  }

  async deleteManual(manualId) {
    // Verify exists
    const existing = await this.manualsRepository.getById(manualId);
    if (!existing) {
      const err = new Error("Manual no encontrado.");
      err.statusCode = 404;
      throw err;
    }
    await this.manualsRepository.deleteManualCascade(manualId);
    await this.algoliaService?.reindexManuals?.();
    return true;
  }
}
