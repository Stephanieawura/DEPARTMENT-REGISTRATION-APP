# 0002 – Shared design tokens

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

Brand values (`#153D70`, `#BA8F4A`, …) were duplicated in the web theme CSS, the mobile `Colors.ts`, and as hundreds
of inline literals. A brand change meant hunting through both apps.

## Decision

Keep tokens in `packages/design-tokens/tokens/*.json` using the W3C Design Tokens (DTCG) format, and generate
platform outputs with a small, dependency-free script:

- `tokens.css`: CSS custom properties for web (`--ug-*`)
- `tokens.js` + `tokens.d.ts`: typed JS for React Native (unitless numbers)
- `tokens.json`: flat map for tooling

Generated files are committed so Metro and Vite need no build step. `pnpm tokens:check` guards against drift, and
`pnpm design:lint` reports hardcoded colors.

## Consequences

- One edit updates both apps. DTCG JSON can be exchanged with Figma plugins such as Tokens Studio.
- Contributors must run `pnpm tokens:build` after editing tokens (CI should run `tokens:check`).
- Existing inline colors still need migrating; `design:lint` tracks the backlog.
