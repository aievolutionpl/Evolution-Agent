#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${1:-}"
TARGET_DIR="${2:-Evolution-Agent}"

if [[ -z "$REPO_URL" ]]; then
  echo "Usage: $0 <repo-url> [target-dir]"
  exit 1
fi

if [[ ! -d "$TARGET_DIR/.git" ]]; then
  git clone "$REPO_URL" "$TARGET_DIR"
fi

cd "$TARGET_DIR"

corepack enable
pnpm install

if [[ -f ".env.example" && ! -f ".env" ]]; then
  cp .env.example .env
fi

echo "Bootstrap complete. Start with: cd $TARGET_DIR && pnpm dev"
