# 0001 – pnpm monorepo

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

The repo held two unrelated projects side by side: a Vite web prototype (Figma Make export) at the root and an Expo
app in `rn-app/`, each with its own npm lockfile. Brand colors were copied by hand into both, and there was no
obvious place for shared code or docs.

## Decision

Use a pnpm workspace:

- `apps/web`, `apps/mobile`: deployable apps
- `packages/*`: shared libraries (starting with `@ug-cs/design-tokens`)
- `docs/`: architecture, design principles, decisions, project proposal

`nodeLinker: hoisted` is set because Expo/Metro expects a flat `node_modules`.

## Consequences

- One install and one lockfile (`pnpm-lock.yaml`); root scripts run each workspace (`pnpm dev:mobile`, `pnpm dev:web`).
- Shared code has a home, and a future `apps/api` (Express backend from the proposal) fits the same layout.
- Hoisting means apps with different React versions need care (see [0003](0003-one-react-per-app.md)).
