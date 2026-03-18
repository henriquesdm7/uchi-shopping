# Agent Conversation Playbook

Use this as a repeatable process when a new AI agent conversation starts in this repo.

## 1) Fast Discovery (always first)
- Read `AGENTS.md` and `prisma/schema.prisma`.
- Check active domain pages in `app/pages/**` related to the task.
- Check related APIs in `server/api/**` and services in `server/utils/services/**`.
- Confirm existing shared schemas in `shared/utils/*.schema.ts`.

## 2) Plan Before Editing
- Write a short 3-7 step implementation plan.
- Identify which files are new vs existing.
- Prefer extending existing patterns over introducing new architecture.

## 3) Backend Pattern (repo standard)
- Add/extend Zod schema in `shared/utils`.
- Add/extend service function in `server/utils/services/*`.
- Add/extend handler in `server/api/*`.
- Use `readValidatedBody(...safeParse...)` and `createError(...)`.
- Keep business checks in service layer (e.g., duplicate names, aggregate updates).

## 4) Frontend Pattern (repo standard)
- Use `definePageMeta({ layout: 'auth' | 'guest' })`.
- Build CRUD pages using Nuxt UI + existing page structures:
  - list pages: table + `UDropdownMenu`
  - create/edit pages: `UForm` + `UFormField`
- Keep labels/messages in pt-BR.
- Update menu links in `app/components/layout/AuthMenu.vue`.

## 5) Prisma + DB Changes
- Edit only `prisma/schema.prisma`.
- Then run:

```bash
npx prisma migrate dev --name <migration_name>
npx prisma generate
```

- Never hand-edit `server/generated/prisma/**`.

## 6) AI Extraction Changes
- Gemini logic lives in `server/utils/services/gemini.ts`.
- Receipt endpoint is `server/api/purchases.post.ts`.
- Persist usage metrics to `AiRequest` when calling model.
- If model alias fails, use `listGeminiModels()` to inspect available models.

## 7) Validate and Handoff
- Run targeted checks for edited files.
- Prefer quick smoke tests via impacted pages/routes.
- In handoff, include:
  - what changed
  - where changed
  - how to test
  - known follow-ups

