export class RatingsService {
  constructor({ ratingsRepository }) {
    this.ratingsRepository = ratingsRepository;
  }

  async listRatingsByManual(manualId) {
    return await this.ratingsRepository.listByManual(manualId);
  }

  async createRating({ user_id, manual_id, score, comment }) {
    return await this.ratingsRepository.create({ user_id, manual_id, score, comment });
  }

  async deleteRating({ userId, manualId }) {
    await this.ratingsRepository.deleteByUserAndManual(userId, manualId);
    return true;
  }
}
