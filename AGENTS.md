# AGENTS Guide for `uchi-shopping`

## Project Snapshot
- Nuxt 4 full-stack app (Vue + Nitro API) in one package; no separate backend service.
- UI language is pt-BR (`app/app.vue` sets `lang: 'pt-BR'`), so user-facing text should stay in Portuguese.
- Main active domains: auth/session, markets, categories, purchases, AI receipt extraction, product price analytics.
- UI stack is Nuxt UI + Tailwind; charts use `chart.js` + `vue-chartjs`.

## Architecture You Should Assume
- Frontend pages/components: `app/**`
- API handlers: `server/api/**`
- Service layer: `server/utils/services/**`
- Shared schemas/types: `shared/utils/*.schema.ts`
- Prisma client singleton: `server/utils/prisma.ts`
- Session auth: `nuxt-auth-utils` (`setUserSession`, `useUserSession`, `clearUserSession`)

## Current Core Flows
- Login: `app/pages/login.vue` -> `POST /api/login` -> `setUserSession` -> redirect.
- Receipt register: `app/pages/compras/registro.vue` -> `POST /api/purchases` (multipart image + market/date).
- AI extraction: `server/api/purchases.post.ts` -> `processReceiptImage` in `server/utils/services/gemini.ts`.
- Persistence after extraction: API upserts category/product, creates purchase + purchase items, and logs token usage.
- Product analytics: `GET /api/products` and `GET /api/products/:id` drive product list + price evolution chart pages.

## Conventions Specific to This Repo
- Validate bodies with `readValidatedBody(...schema.safeParse...)` in handlers.
- Keep Zod schemas in `shared/utils` and import via `#shared/...`.
- Put business rules in service layer (duplicate checks, aggregates, recalculations).
- Use explicit page layout: `definePageMeta({ layout: 'auth' | 'guest' })`.
- Route protection is server middleware (`server/middleware/redirect-guests.ts`), not page guards.

## Prisma + Data Model Notes
- Edit `prisma/schema.prisma`, then run migrations + generate client.
- Do not hand-edit `server/generated/prisma/**`.
- Current key models include: `Market`, `Category`, `Product`, `Purchase`, `PurchaseItem`, `AiRequest`.
- `PurchaseItem` updates should keep `Purchase.total` in sync (see `server/utils/services/purchase.ts`).

## AI Receipt Processing Notes
- Gemini integration: `@google/generative-ai` in `server/utils/services/gemini.ts`.
- Model currently used: `gemini-2.5-flash` (`GEMINI_MODEL` constant).
- On model issues, `listGeminiModels()` can print available models for the key.
- Token accounting is persisted in `AiRequest` (`inputTokens`, `outputTokens`, `totalTokens`, `durationMs`, `status`).

## Developer Workflows
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Build/preview: `npm run build` / `npm run preview`
- Checks: `npm run lint` and `npm run typecheck`
- DB (MySQL): `docker compose up -d`
- Prisma after schema changes:
  - `npx prisma migrate dev --name <migration_name>`
  - `npx prisma generate`

## Environment Keys
- `.env.example` includes: `DB_*`, `DATABASE_URL`, `NUXT_SESSION_PASSWORD`, `GEMINI_API_KEY`.
- `GEMINI_API_KEY` must be set for receipt extraction routes.

## Agent Handoff Tips
- If `#shared/...` import errors appear after adding schema files, regenerate Nuxt types by restarting dev server.
- Reuse existing UI patterns from:
  - `app/pages/cadastros/mercados/**` for CRUD pages
  - `app/pages/compras/historico.vue` + `app/pages/compras/[id].vue` for list/details/edit tables
- Keep menu links centralized in `app/components/layout/AuthMenu.vue`.
