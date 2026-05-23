# Changelog

All notable changes to **Hermes by AI Evolution Labs** are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [3.0.0] — 2026-05-23

**AI Evolution Labs rebrand.** Hermes Workspace becomes the public flagship product of [AI Evolution Labs](https://aievolutionlabs.io) — repositioned for business teams (sales, ops, marketing, finance) instead of the dev-tools framing of v2.

### Added
- **Brand identity** — new AI Evolution Labs logo (SVG + maskable icon slots), favicon, hero card. Cyan `#00E5FF` + lime PCB `#7DFF8A` accents over deep black.
- **`aievolution` theme** — new dark theme set as the default, plus `aievolution-light` daylight variant. Wired into all 50+ CSS surface tokens.
- **Business shortcuts** on the chat home screen — 4 first-class workflows: client brief / proposal, business report / analysis, workflow automation, market intelligence. One click pre-fills the composer with a prompt that produces a real deliverable on the first turn.
- **Multilingual welcome tour** (`src/components/onboarding/welcome-tour-panel.tsx`) — 4-step onboarding modal explaining what Hermes is, what it can do, and how to use it. Available in **Polski, English, Español, Deutsch, Français** with auto-detection from `navigator.language`. Persists choice + seen-state in `localStorage`.
- **Dashboard hero card** — branded card at the top of `/dashboard` linking to https://aievolutionlabs.io. Shows the AIEL hero photo with an SVG fallback so it never breaks.
- **PWA install icon wired to AI Evolution Labs logo** — `manifest.json` swapped to AIEL icon paths with `purpose: "any maskable"`. PWA shortcut on desktop / home screen uses the AIEL logo.
- **Electron desktop installer rebranded** — `productName: "Hermes AIEL"`, `appId: "io.aievolutionlabs.hermes"`, icon source `public/aievolutionlabs-icon-1024.png`, NSIS / DMG titles updated.
- **`docs/branding.md`** — single source of truth for the brand: color tokens, asset slots, install-icon workflow.

### Changed
- **Workspace shell title bar** — `Hermes` → `AI Evolution Labs · Hermes`.
- **Sidebar header** — logo swapped to `aievolutionlabs-logo.svg`; label becomes `Hermes` with an `AI EVOLUTION LABS` micro-eyebrow.
- **Chat empty state** — rebranded with AIEL logo, the "Your business. Automated." tagline, and the 4 business shortcuts in a 2x2 card grid (was 3 dev-focused chips).
- **PWA manifest** — new `name`, `short_name`, `description`, `theme_color`, `id`, plus 3 in-app shortcuts (New chat, Dashboard, Conductor).
- **`package.json`** — `name: hermes-aievolutionlabs`, `version: 3.0.0`, `author: AI Evolution Labs`, `homepage` + `repository`.
- **`LICENSE`** — copyright AI Evolution Labs.
- **`README.md`** — public-grade rewrite with hero, business shortcuts, install paths, desktop install workflow, architecture diagram, project layout.
- **`CONTRIBUTING.md`** — updated for AIEL repo URLs, branch conventions, new contribution categories (shortcuts, skills, translations).

### Fixed
- Pre-existing JSX structure bug in `src/screens/playground/components/playground-hud.tsx` (orphan `</div>` after the player name block) that broke `npx tsc --noEmit`.

### Branding assets

The repo ships SVG fallbacks for every brand slot. To use real raster artwork, drop these files into `public/` (the wiring is already in place):

- `aievolutionlabs-icon-192.png` (192×192, maskable) — PWA
- `aievolutionlabs-icon-512.png` (512×512, maskable) — PWA
- `aievolutionlabs-icon-1024.png` (1024×1024) — Electron `.icns` / `.ico` source
- `apple-touch-icon.png` (180×180) — iOS install
- `aievolutionlabs-hero.jpg` — dashboard hero + README

See `docs/branding.md` for export sizes.

## [Unreleased]

### Changed
- **`docker compose up` now pulls pre-built images by default** (#82) — `nousresearch/hermes-agent:latest` for the gateway and `ghcr.io/outsourc-e/hermes-workspace:latest` for the UI. Agent state persists in the `claude-data` named volume. Adds `docker-compose.dev.yml` overlay for building from source.

## [2.0.0] — 2026-04-20

**Zero-fork release.** Clone, don't fork. Hermes Workspace now runs on vanilla `pip install hermes-agent` with no patches, no drift, no custom gateway required.

### Added
- **Zero-fork architecture** — dual gateway/dashboard routing; workspace talks directly to vanilla `hermes-agent` 0.10.0+ via standard endpoints (`/v1/models`, `/api/sessions`, `/api/skills`, `/api/config`, `/api/jobs`)
- **One-liner curl installer** — `curl -fsSL … | bash` provisions workspace + gateway + defaults
- **Claude-Nous theme** — dark + light editorial variants with cobalt/paper surface pass, thin 1px architectural borders, editorial type accents
- **Conductor** (`/conductor`) — mission-control surface ported from Clawsuite; spawn missions, assign workers, watch live output and costs
- **Operations** (`/operations`) — agent registry / sessions manager ported from Clawsuite; pause, steer, kill live agents with role and model insight
- **Synthesized tool pills** — inline tool-call rendering from dashboard stream markers when running against zero-fork gateway
- **Landing parity pass** — hero, features, screenshots, setup, OG image, mobile theme toggle
- **Task board status vs. assignee** decoupling
- **Local-model chat session persistence** — local sessions appear in history + session list
- **Memory is local-fs first** — honors `HERMES_HOME`, no gateway dependency
- **Splash + screenshots refresh** — Conductor, Dashboard, Tasks, Jobs captured in new editorial theme

### Changed
- **Model picker** — fetches from gateway (`~/.hermes/models.json` for user-configured models), matches OCPlatform behavior; shows only configured providers instead of all upstream
- **`enhanced-fork` mode label** no longer implies a fork is required; it indicates streaming route availability on vanilla gateway
- **Dashboard + enhanced-chat capabilities** marked optional; missing endpoints no longer trigger warnings
- **Feature-gate + install copy** — all fork-era references purged
- **Theme family allowlist** — `claude-nous` promoted to the enterprise allowlist
- **Session pill** — solid dark-mode background, matches model selector

### Fixed
- Duplicate responses and disappearing history on interrupt (#62)
- Portable-mode double user message, uncleaned timeouts, orphaned unregister callbacks
- Local model selection actually propagates to chat (no silent fallback)
- Strip provider prefix correctly for local routing
- Dashboard token injection on `/` (not `/index.html`)
- Onboarding no longer stacks behind workspace shell
- Root bootstrap guards against uncaught errors
- Preserve assistant text during tool-call streaming
- Installer output uses defined escape vars (removed undefined BOLD/RESET)

### Removed
- All references to the legacy "enhanced fork" as a requirement
- Stale fork-era gateway instructions and feature-gate copy

---

## [1.0.0] — 2026-04-10

Initial public release. Chat, files, memory, skills, terminal, dashboard, settings — the foundational workspace.
