import { AuthController } from "../controllers/auth.controller.js";
import { UsersController } from "../controllers/users.controller.js";
import { ManualsController } from "../controllers/manuals.controller.js";
import { FavoritesController } from "../controllers/favorites.controller.js";
import { RatingsController } from "../controllers/ratings.controller.js";
import { CompaniesController } from "../controllers/companies.controller.js";
import { AccessCodesController } from "../controllers/access_codes.controller.js";

import { UsersRepository } from "../repositories/users.repository.js";
import { ManualsRepository } from "../repositories/manuals.repository.js";
import { FavoritesRepository } from "../repositories/favorites.repository.js";
import { RatingsRepository } from "../repositories/ratings.repository.js";
import { CompaniesRepository } from "../repositories/companies.repository.js";
import { AccessCodesRepository } from "../repositories/access_codes.repository.js";

import { AuthService } from "../services/auth.service.js";
import { UsersService } from "../services/users.service.js";
import { ManualsService } from "../services/manuals.service.js";
import { FavoritesService } from "../services/favorites.service.js";
import { RatingsService } from "../services/ratings.service.js";
import { CompaniesService } from "../services/companies.service.js";
import { AccessCodesService } from "../services/access_codes.service.js";
import { AlgoliaService } from "../services/algolia.service.js";

export function makeControllers() {
  // Repositories (singletons)
  const usersRepository = new UsersRepository();
  const manualsRepository = new ManualsRepository();
  const favoritesRepository = new FavoritesRepository();
  const ratingsRepository = new RatingsRepository();
  const companiesRepository = new CompaniesRepository();
  const accessCodesRepository = new AccessCodesRepository();

  // Services
  const algoliaService = new AlgoliaService({ manualsRepository });
  const authService = new AuthService({ usersRepository });
  const usersService = new UsersService({ usersRepository, accessCodesRepository });
  const manualsService = new ManualsService({ manualsRepository, algoliaService });
  const favoritesService = new FavoritesService({ favoritesRepository });
  const ratingsService = new RatingsService({ ratingsRepository });
  const companiesService = new CompaniesService({ companiesRepository, usersRepository, algoliaService });
  const accessCodesService = new AccessCodesService({ accessCodesRepository });

  // Controllers
  return {
    authController: new AuthController(authService),
    usersController: new UsersController(usersService),
    manualsController: new ManualsController(manualsService),
    favoritesController: new FavoritesController(favoritesService),
    ratingsController: new RatingsController(ratingsService),
    companiesController: new CompaniesController(companiesService),
    accessCodesController: new AccessCodesController(accessCodesService),
  };
}
