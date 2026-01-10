# Manuals API (refactor por capas)

Este proyecto es el refactor de tu API original hacia una estructura en capas:

- **Routes**: definen endpoints y delegan a controllers
- **Controllers**: validan request/response y llaman a services
- **Services**: lógica de negocio (orquesta repos, etc.)
- **Repositories**: acceso a datos (SQL) usando `executeQuery`
- **Config/Utils**: env, logs, helpers

## Estructura

```
refactored_api/
  index.js            # servidor local
  handler.js          # serverless-http handler
  src/
    app.js
    config/
    controllers/
    factories/
    middleware/
    repositories/
    routes/
    services/
    utils/
```

## Cómo correr

1. Copiá `.env.example` a `.env` y completá `DATABASE_URL`.
2. Instalar deps:

```
npm i
```

3. Ejecutar:

```
npm run start
```

## Endpoints (mismos que antes)

- POST `/login`
- POST `/users`
- GET `/api/usuarios`
- DELETE `/api/usuarios/:id`
- GET `/api/manuales`
- GET `/api/manuales-dashboard`
- GET `/api/manuales/:id`
- GET `/api/manuals/:manualId/steps`
- POST `/api/manuals`
- PUT `/api/manuals/:manualId`
- DELETE `/api/manuals/:id`
- GET `/api/users/:userId/favorites`
- GET `/api/users/:userId/favorites/:manualId/check`
- POST `/api/users/:userId/favorites/:manualId`
- DELETE `/api/users/:userId/favorites/:manualId`
- POST `/api/ratings`
- DELETE `/api/ratings/:userId/:manualId`
- GET `/api/valoraciones/manuales/:id`
- GET `/api/companies`
- GET `/api/companies/:id`
- PUT `/api/companies/:id`
- DELETE `/api/companies/:companyId`
- POST `/api/empresas/crear`
- POST `/api/access-codes`
- POST `/api/users/:userId/company`

## Fixes incluidos

- `DELETE /api/ratings/:userId/:manualId`: ahora borra por `(user_id, manual_id)` (antes borraba por id incorrecto).
- Algolia indexing: ahora es **opcional** por variables de entorno y reindex se hace desde DB (no `fetch` localhost).
