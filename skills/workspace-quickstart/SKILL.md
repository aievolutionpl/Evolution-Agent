---
name: workspace-quickstart
description: Step-by-step bootstrap for cloning this repository, installing dependencies, configuring environment variables, and running Hermes Workspace locally with one command. Use when an agent needs a simple, reliable onboarding path for fresh machines or new folders.
---

# Workspace Quickstart

## Cel
Zapewnić agentowi prostą procedurę uruchomienia repo od zera.

## Workflow
1. Utwórz katalog roboczy i przejdź do niego.
2. Sklonuj repozytorium.
3. Uruchom skrypt `scripts/bootstrap-workspace.sh`.
4. Skopiuj `.env.example` do `.env` jeżeli plik `.env` nie istnieje.
5. Uruchom `pnpm dev` (albo `docker compose -f docker-compose.dev.yml up --build`, jeśli użytkownik woli Docker).

## Komendy manualne (fallback)
```bash
git clone <REPO_URL> Evolution-Agent
cd Evolution-Agent
corepack enable
pnpm install
cp -n .env.example .env 2>/dev/null || true
pnpm dev
```

## Zasady wykonania
- Preferuj skrypt bootstrapujący zamiast ręcznego przepisywania komend.
- Jeśli `pnpm` nie działa, uruchom `corepack enable` i ponów instalację.
- Jeśli `.env.example` nie istnieje, pomiń krok kopiowania i zgłoś to użytkownikowi.
- Po uruchomieniu wypisz użytkownikowi URL aplikacji z logów (najczęściej `http://localhost:5173`).

## Co raportować użytkownikowi
- Które komendy zostały wykonane.
- Czy instalacja zależności zakończyła się sukcesem.
- Jak uruchomić projekt ponownie w przyszłości (`pnpm dev`).
