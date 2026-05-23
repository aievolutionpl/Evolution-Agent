# Contributing to Hermes — AI Evolution Labs

Thanks for your interest in contributing to the public **Hermes by
AI Evolution Labs** project. This document explains how to set up
your local environment, what we expect in a pull request, and where
to ask questions.

## Quick start

```bash
git clone https://github.com/aievolutionpl/hermes-aievolutionlaba.git
cd hermes-aievolutionlaba
pnpm install
cp .env.example .env
pnpm dev
```

That's it. The dev server runs on http://localhost:3000.

## Development

```bash
pnpm install       # install dependencies
pnpm dev           # vite dev server (http://localhost:3000)
pnpm build         # production build
pnpm lint          # eslint
pnpm test          # vitest
npx tsc --noEmit   # type check
```

## Environment variables

See `.env.example` for the full list. The most important ones:

- `HERMES_API_URL` — URL of your `hermes-agent` gateway (default
  `http://127.0.0.1:8642`).
- `HERMES_API_TOKEN` — set only if your gateway has
  `API_SERVER_KEY` configured.
- `CLAUDE_PASSWORD` — optional password gate for the web UI when
  you expose Hermes beyond localhost.
- `CLAUDE_ALLOWED_HOSTS` — comma-separated list of hostnames
  permitted for non-localhost access.

## What we accept

- 🐛 **Bug fixes** — always welcome. Please include reproduction
  steps.
- ✨ **New business shortcuts** — prompts that produce a real
  deliverable in 1 turn. Add them to
  `src/screens/chat/components/chat-empty-state.tsx`.
- 🧩 **New skills** — add a folder under `skills/` with a
  `SKILL.md` (front-matter `name:` / `description:` plus markdown
  body). See `skills/workspace-dispatch/` for the canonical
  example.
- 🌍 **Translations** — extend the language dictionary in
  `src/lib/onboarding-i18n.ts`. PRs welcome for any language.
- 🎨 **Theme tweaks** — propose them via screenshot first, then
  PR. Keep the AI Evolution Labs theme on-brand (black + cyan +
  PCB green).

## What we don't accept

- Forks of `hermes-agent` itself — Hermes runs on **vanilla**
  `hermes-agent` from Nous Research. Patches go upstream, not here.
- Hardcoded API keys, tokens, secrets, or any committed `.env`
  files.
- Mass refactors without a discussion first.

## Branch + PR guidelines

- **One PR per feature / fix** — keep them focused and reviewable.
- **Branch naming** — `feat/<short-slug>`, `fix/<short-slug>`,
  `docs/<short-slug>`.
- **Type check + lint pass locally** — `pnpm lint` and
  `npx tsc --noEmit` should both be clean for files you touched.
- **PR description** — what changed, why, and how to test it. Use
  the PR template — it asks the right questions.
- **Screenshots for UI changes** — before/after.

## Code style

- TypeScript strict mode is on. Don't bypass with `any` — narrow
  the type properly.
- Use the existing UI primitives in `src/components/ui/` before
  building a new one.
- Use theme CSS variables (`var(--theme-accent)`,
  `var(--theme-card)`, …) not hardcoded hex colors so themes work.
- No new top-level `node_modules` dependencies without a comment
  explaining why an existing one didn't work.

## Reporting security issues

Please **do not** open public issues for security vulnerabilities.
Follow the disclosure process in [SECURITY.md](./SECURITY.md).

## License

By contributing you agree your work is licensed under the
[MIT License](./LICENSE) of this project, copyright AI Evolution
Labs.

---

Built with 🖤 by [AI Evolution Labs](https://aievolutionlabs.io).
