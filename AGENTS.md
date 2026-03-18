# AGENTS Guide for `uchi-shopping`

## Project Snapshot
- Nuxt 4 full-stack app (Vue UI + Nitro server API) in a single package; no separate backend service.
- Main domains currently implemented: authentication and user management (`/login`, `/usuarios/criar`).
- UI language is Brazilian Portuguese (`app/app.vue`, `app/pages/login.vue`), so keep user-facing text in pt-BR.
- The UI is mainly developed with NuxtUI components.

## Architecture You Should Assume
- Frontend pages/components live in `app/**`; server endpoints live in `server/api/**`.
- API handlers call Prisma directly or via server services (`server/utils/services/user.ts`).
- Shared input validation schemas are in `shared/utils/*.schema.ts` and reused on both client and server.
- Session auth is handled by `nuxt-auth-utils` (`setUserSession`, `useUserSession`, `clearUserSession`).

## Request/Data Flow Patterns
- Login flow: `app/pages/login.vue` -> `POST /api/login` (`server/api/login.post.ts`) -> session set -> redirect.
- User creation flow: `app/pages/usuarios/criar.vue` -> `POST /api/users` (`server/api/users.post.ts`) -> `createUser` service -> Prisma.
- Global route protection is server middleware (`server/middleware/redirect-guests.ts`), not page-level guards.

## Conventions Specific to This Repo
- Validate request bodies with `readValidatedBody(...schema.safeParse...)` and return `createError` on invalid input.
- Keep Zod schemas in `shared/utils` (`CreateUserSchema`, `PasswordLoginSchema`) and import via `#shared/...` aliases.
- Passwords are hashed/checked with `bcrypt-ts` (`hashSync`, `compareSync`) before DB writes/auth.
- DB uniqueness/business checks belong in service layer (`server/utils/services/user.ts` checks duplicate email).
- Layout choice is explicit per page via `definePageMeta({ layout: 'auth' | 'guest' })`.

## Database + Prisma Notes
- Prisma schema: `prisma/schema.prisma`; provider is MySQL.
- Generated Prisma client is committed under `server/generated/prisma/**` (output configured in schema).
- Prefer editing `prisma/schema.prisma`; do not edit the migrations, nor hand-edit generated client files; Instead, run `npx prisma generate` after schema changes to update the client.
- Prisma client singleton is in `server/utils/prisma.ts` using `@prisma/adapter-mariadb` and env-based connection config.

## Dev Workflows (Verified from repo files)
- Install deps: `npm install`
- Start dev server: `npm dev`
- Build/preview: `npm build` / `npm preview`
- Static checks: `npm lint` and `npm typecheck`
- Local DB container: `docker compose up -d` (MySQL 8.0, mapped to host `${DB_PORT:-3307}`)

## Environment/Integrations
- Required env keys are documented in `.env.example`: `DB_*`, `DATABASE_URL`, `NUXT_SESSION_PASSWORD`.
- `compose.yml` starts MySQL 8.0 and maps `${DB_PORT:-3307}` -> container `3306`.
- Prisma config reads `DATABASE_URL` from env (`prisma.config.ts`).

