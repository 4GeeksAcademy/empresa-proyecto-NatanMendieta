#!/usr/bin/env bash
set -euo pipefail

# Enable Corepack and make pnpm available for JS/TS workspaces.
if command -v corepack >/dev/null 2>&1; then
	corepack enable || true
	corepack prepare pnpm@latest --activate || true
fi

if [[ -f pyproject.toml ]]; then
	if ! command -v uv >/dev/null 2>&1; then
		python -m pip install --upgrade pip uv
	fi
	uv sync
else
	echo "No pyproject.toml found; skipping Python dependency sync."
fi

echo "Devcontainer setup complete."
