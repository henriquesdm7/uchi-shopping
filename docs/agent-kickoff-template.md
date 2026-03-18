# Agent Kickoff Template

Copy/paste this message at the start of a new agent conversation.

---

You are working on `uchi-shopping` (Nuxt 4 full-stack app).

Before coding:
1. Read `AGENTS.md`.
2. Inspect related files in `app/pages/**`, `server/api/**`, `server/utils/services/**`, and `shared/utils/**`.
3. Propose a short plan (3-7 steps).

Implementation rules:
- Keep user-facing text in Portuguese (pt-BR).
- Follow existing patterns:
  - API validation with `readValidatedBody(...schema.safeParse...)`
  - business logic in `server/utils/services/**`
  - schemas in `shared/utils/**`
- Use explicit page layouts via `definePageMeta`.
- Keep menu links in `app/components/layout/AuthMenu.vue`.

If schema changes are required:
- Edit `prisma/schema.prisma` only.
- Then run:

```bash
npx prisma migrate dev --name <name>
npx prisma generate
```

For AI receipt extraction tasks:
- Use `server/utils/services/gemini.ts`.
- Log request usage into `AiRequest`.
- If model fails, call/list available models and adjust.

At the end:
- Provide changed files list.
- Provide test steps.
- Mention any pending follow-up.

---

