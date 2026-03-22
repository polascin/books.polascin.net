#!/usr/bin/env bash
# hooks/install.sh – install Git hooks after cloning
# Usage (from repo root):  bash hooks/install.sh

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_SRC="$REPO_ROOT/hooks"
HOOKS_DST="$REPO_ROOT/.git/hooks"

echo "Installing Git hooks..."

for hook in pre-commit pre-push; do
    src="$HOOKS_SRC/$hook"
    dst="$HOOKS_DST/$hook"
    cp "$src" "$dst"
    chmod +x "$dst"
    echo "  installed: $hook"
done

echo "Done. Secret-blocking hooks are now active."