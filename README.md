# UG CS Registration

pnpm monorepo for the UG Computer Science department registration app.

```
apps/
  web/               Vite + React + Tailwind v4 prototype (exported from Figma Make)
  mobile/            Expo SDK 54 / React Native app
packages/
  design-tokens/     Shared design tokens + design tooling scripts
```

## Getting started

Requires Node 20+ and pnpm (`corepack enable`).

```sh
pnpm install
pnpm dev:web       # Vite dev server
pnpm dev:mobile    # Expo dev server
```

## Design tokens

`packages/design-tokens/tokens/*.json` is the single source of truth for colors, radii and typography, written in the
[W3C Design Tokens (DTCG)](https://www.designtokens.org/tr/drafts/format/) format, so it can be exchanged with Figma
plugins such as Tokens Studio. Aliases like `{ "$value": "{color.deepBlue}" }` are supported.

`pnpm tokens:build` generates `packages/design-tokens/generated/`:

| File          | Used by                                                              |
| ------------- | -------------------------------------------------------------------- |
| `tokens.css`  | Web: `--ug-*` custom properties, imported in `apps/web/src/styles/index.css` |
| `tokens.js`   | Mobile (and web JS): `import { color, radius } from "@ug-cs/design-tokens"` |
| `tokens.d.ts` | Literal types for `tokens.js`                                        |
| `tokens.json` | Flat resolved map for tooling                                        |

Generated files are committed so Metro and Vite can consume them without a build step.

On the web, brand colors are also exposed as Tailwind utilities (`bg-ug-deep-blue`, `text-ug-accent-gold`,
`font-ug-serif`, …) and the shadcn semantic variables (`--primary`, `--accent`, …) point at the tokens.
On mobile, `apps/mobile/src/constants/Colors.ts` re-exports `color`.

### Scripts

| Command                            | What it does                                                         |
| ---------------------------------- | -------------------------------------------------------------------- |
| `pnpm tokens:build`                | Validate tokens and regenerate outputs                               |
| `pnpm tokens:watch`                | Rebuild on every change to `tokens/`                                 |
| `pnpm tokens:check`                | Exit 1 if generated files are stale (use in CI / pre-commit)         |
| `pnpm design:lint [path] [--verbose] [--strict]` | Find hardcoded colors, map them to tokens, and list off-palette values |

### Changing a token

1. Edit `packages/design-tokens/tokens/*.json`
2. `pnpm tokens:build`
3. Commit the token source and `generated/` together
