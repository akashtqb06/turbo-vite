#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# clone-app.sh
#
# Clones an app repo into apps/<app-name> so Turborepo can discover it
# as a workspace package. After cloning, runs `npm install` from the root
# to link @repo/* shared packages.
#
# Usage:
#   ./scripts/clone-app.sh <repo-url> [app-name]
#
# Examples:
#   ./scripts/clone-app.sh git@github.com:org/app-dashboard.git
#   ./scripts/clone-app.sh git@github.com:org/app-dashboard.git dashboard
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_URL="${1:-}"
APP_NAME="${2:-}"

# ── Validate inputs ───────────────────────────────────────────────────────────
if [ -z "$REPO_URL" ]; then
  echo "❌  Usage: ./scripts/clone-app.sh <repo-url> [app-name]"
  exit 1
fi

# Derive app name from repo URL if not provided (strips .git suffix)
if [ -z "$APP_NAME" ]; then
  APP_NAME=$(basename "$REPO_URL" .git)
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TARGET_DIR="$ROOT_DIR/apps/$APP_NAME"

# ── Check not already cloned ──────────────────────────────────────────────────
if [ -d "$TARGET_DIR" ]; then
  echo "⚠️   $TARGET_DIR already exists. Skipping clone."
  echo "    Pull latest changes manually: cd $TARGET_DIR && git pull"
  exit 0
fi

# ── Clone ─────────────────────────────────────────────────────────────────────
echo "📦  Cloning $REPO_URL into apps/$APP_NAME ..."
git clone "$REPO_URL" "$TARGET_DIR"

# ── Install deps from root to link @repo/* packages ──────────────────────────
echo ""
echo "🔗  Running npm install from root to link shared packages ..."
cd "$ROOT_DIR"
npm install

echo ""
echo "✅  Done! App '$APP_NAME' is ready."
echo "    Start dev: npm run dev --workspace=apps/$APP_NAME"
echo "    Or from root: npm run dev"
