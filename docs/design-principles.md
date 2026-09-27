# Design Principles

How the UG CS Registration app should look and behave. The proposal asks for a mobile-first,
"clean University Tech" look that matches the University of Ghana's visual identity. This doc turns that into
concrete rules for the code.

## Principles

1. **Institutional, not decorative.** UG deep blue and gold carry the brand. Everything else is neutral. Color is
   there to signal meaning (brand, status, action), not for decoration.
2. **Status is the product.** Students open the app to answer one question: *am I cleared?* Verification status is
   always visible and always looks the same (see [status semantics](#status-semantics)).
3. **One primary action per screen.** Each screen has one clear next step (Sync, Upload, Verify & Sign In), styled
   as the gold primary button. Secondary actions are quieter.
4. **Mobile-first, thumb-first.** Design for a phone held in one hand: primary navigation in the bottom tab bar,
   primary buttons full width, touch targets at least 44×44 pt.
5. **Tokens, not literals.** Colors, radii and type come from `@ug-cs/design-tokens`. A hex value written straight
   into a screen is a bug waiting to happen (`pnpm design:lint` finds them).
6. **Same design on every platform.** Web and mobile share tokens, so changing the brand in one place updates both.

## Design tokens

The source of truth is `packages/design-tokens/tokens/*.json`. Never edit the `generated/` folder.

| Usage                     | Mobile (`Colors.*`) | Web CSS variable               | Value                     |
| ------------------------- | ------------------- | ------------------------------ | ------------------------- |
| Brand / primary / headers | `deepBlue`          | `--ug-color-deep-blue`         | `#153D70`                 |
| Primary action / accent   | `accentGold`        | `--ug-color-accent-gold`       | `#BA8F4A`                 |
| Pressed gold              | `accentGoldDark`    | `--ug-color-accent-gold-dark`  | `#a67d3f`                 |
| Screen background         | `lightGray`         | `--ug-color-light-gray`        | `#F8F9FA`                 |
| Card surface              | `white`             | `--ug-color-white`             | `#FFFFFF`                 |
| Body text                 | `darkText`          | `--ug-color-dark-text`         | `#1a1a2e`                 |
| Secondary text            | `gray500`           | `--ug-color-gray500`           | `#6b7280`                 |
| Placeholder / disabled    | `gray400`           | `--ug-color-gray400`           | `#9ca3af`                 |
| Dividers                  | `border`            | `--ug-color-border`            | `rgba(21, 61, 112, 0.12)` |
| Card outlines             | `borderLight`       | `--ug-color-border-light`      | `rgba(21, 61, 112, 0.06)` |
| Success                   | `emerald`           | `--ug-color-emerald`           | `#059669`                 |
| Warning                   | `amber`             | `--ug-color-amber`             | `#d97706`                 |
| Error / destructive       | `red`               | `--ug-color-red`               | `#dc2626`                 |

**Using gold:** use it for the primary action and for small highlights (crest ring, "Pending" label on the dark
status card). Don't use it for large surfaces or body text; gold on white fails WCAG AA contrast for small text.

### Radius

| Token        | Value | Use                                 |
| ------------ | ----- | ----------------------------------- |
| `radius.md`  | 8     | Small chips, inputs                 |
| `radius.lg`  | 10    | Icon buttons, icon tiles            |
| `radius.xl`  | 14    | Inner stat tiles                    |
| `radius.2xl` | 20    | Cards, status card, badges (pill)   |

Buttons use 16 today. Pick the closest token when adding new UI.

### Typography

- **Family:** system font on mobile (SF Pro / Roboto); Inter on web. Playfair Display (`fontFamily.serif`) is
  for ceremonial headings only.
- **Scale in use:** 10 · 11 · 12 · 13 · 14 · 16 · 17 · 18 · 28. Stick to these sizes.

| Role                  | Size | Weight | Notes                                         |
| --------------------- | ---- | ------ | --------------------------------------------- |
| Screen title (header) | 17   | 800    | White on deep blue                            |
| Header subtitle       | 11   | 400    | `rgba(255,255,255,0.6)`                       |
| Section label         | 10   | 700    | Uppercase, `letterSpacing: 1.5`, `gray500`    |
| Card title            | 14   | 700    | `darkText`                                    |
| Body / meta           | 12   | 400    | `gray500` for secondary                       |
| Button label          | 14   | 700    |                                               |
| Stat number / avatar | 28   | 800    | Admin dashboard stats, profile initials       |

## Layout

### Screen anatomy

```
┌──────────────────────────────┐
│ StatusBarBackground (blue)   │  ← safe-area inset, light status bar text
├──────────────────────────────┤
│ Header (deepBlue)            │  title 17/800 · subtitle 11 · optional icon button
├──────────────────────────────┤
│ Body (lightGray, scrolls)    │  padding 16, gap 16 between sections
│  SECTION LABEL               │
│  ┌────────────────────────┐  │
│  │ Card (white, r20,      │  │  1px borderLight, padding 16
│  │ borderLight)           │  │
│  └────────────────────────┘  │
├──────────────────────────────┤
│ Tab bar (white, border top)  │  active = deepBlue, inactive = gray400
└──────────────────────────────┘
```

Rules:

- **Safe areas:** every screen with a blue header starts with `<StatusBarBackground />` inside a
  `SafeAreaView` with `edges={["left", "right"]}`, so the header color extends behind the status bar. The root sets
  `<StatusBar style="light" />`. Don't pad the top with the light-gray background.
- **Spacing:** multiples of 4. Screen padding 16 (body) or 20 (header). Section gap 16. Card padding 16.
- **Cards:** white, radius 20, 1px `borderLight`. Use shadows sparingly, only for surfaces that float over the header (e.g. the Login and Profile cards).
- **Lists:** rows inside one card, separated by 1px `border` dividers, with a chevron if the row opens something.

## Components

| Component             | Location                                   | Rule                                                        |
| --------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| `PrimaryButton`       | `apps/mobile/src/components`               | `gold` = primary, `blue` = secondary emphasis, `ghost` = tertiary, `destructive` = sign-out/delete. Full width, disabled at 50% opacity, shows a spinner while loading. |
| `StatusBadge`         | `apps/mobile/src/components`               | The only way to show a `VerificationStatus`.                |
| `StatusBarBackground` | `apps/mobile/src/components`               | Top of every blue-header screen.                            |
| shadcn/ui             | `apps/web/src/app/components/ui`           | Web prototype only; themed through token CSS variables.     |

Move a pattern into `components/` once it appears on three or more screens (e.g. the blue header and section label
are good next candidates).

## Status semantics

Verification status must look the same on every screen:

| Status     | Icon (Feather)  | Text      | Background | Border    | Meaning                          |
| ---------- | --------------- | --------- | ---------- | --------- | -------------------------------- |
| `Pending`  | `clock`         | `#b45309` | `#fffbeb`  | `#fde68a` | Submitted, awaiting admin review |
| `Approved` | `check-circle`  | `#065f46` | `#ecfdf5`  | `#a7f3d0` | Departmental clearance granted   |
| `Rejected` | `x-circle`      | `#991b1b` | `#fef2f2`  | `#fecaca` | Needs resubmission               |

Never rely on color alone: always pair it with the icon and the word.

> These tints are still hardcoded in `StatusBadge.tsx`. Promote them to `color.status.*` tokens when doing the
> hardcoded-color cleanup.

## Iconography

Feather icons (`@expo/vector-icons` on mobile, `lucide-react` on web, which is the same family). 18–19 pt in
navigation and headers, 15–16 pt inline, 11 pt in badges. Icon tiles are 40×40 with radius 10–12 on a light tint.

## Accessibility

- Text contrast ≥ 4.5:1 (body) and ≥ 3:1 (large text). White on deep blue passes; gold on white doesn't pass for
  small text.
- Touch targets ≥ 44×44 pt. Icon buttons are 36–40 pt today, so add `hitSlop` to reach 44.
- Give every icon-only button an `accessibilityLabel`.
- Support Dynamic Type: avoid fixed heights on text containers.

## Workflow for design changes

1. Update the design in Figma.
2. Change the matching token in `packages/design-tokens/tokens/*.json`.
3. `pnpm tokens:build` and commit the token source and `generated/` together.
4. `pnpm design:lint` to find any hardcoded values that should now use the token.
