# 0003 – One React copy per app

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

The web prototype pins React 18.3.1 (Figma Make / shadcn). The Expo SDK 54 app needs React 19.1.0. With a hoisted
install, React 18 landed at the repo root, next to `react-native`, while React 19 was nested in `apps/mobile`. The
bundle loaded both, and the app crashed with "Invalid hook call".

## Decision

`apps/mobile/metro.config.js` resolves every `react` / `react/*` import from `apps/mobile/node_modules`, so the
mobile bundle always gets exactly one React (19). The web app is unaffected.

## Consequences

- Each app keeps the React version its framework needs.
- If another package ends up duplicated the same way, add it to the `singletons` list in `metro.config.js`.
- Upgrading the web app to React 19 would remove the need for this workaround.
