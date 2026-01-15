export class FavoritesService {
  constructor({ favoritesRepository }) {
    this.favoritesRepository = favoritesRepository;
  }

  async getUserFavorites(userId) {
    return await this.favoritesRepository.listByUser(userId);
  }

  async isManualFavorite(userId, manualId) {
    return await this.favoritesRepository.isFavorite(userId, manualId);
  }

  async addFavorite(userId, manualId) {
    await this.favoritesRepository.add(userId, manualId);
    return true;
  }

  async removeFavorite(userId, manualId) {
    await this.favoritesRepository.remove(userId, manualId);
    return true;
  }
}
