# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check + production build (tsc -b && vite build)
npm run preview  # Serve the dist/ output locally
```

No test runner is configured. Type checking is the primary static safety net (`tsc -b`).

## Environment

Copy `.env.example` to `.env` and fill in Firebase credentials. All vars are `VITE_FIREBASE_*` and must be present at build time (Vite inlines them). No `.env` → app crashes on startup with Firebase init errors.

## Architecture

**Stack:** React 19 + TypeScript + Vite, Tailwind CSS, Firebase (Firestore + Auth), React Router v7, date-fns-tz.

**Data flow:**
1. On first load, `useAppInit` → `loadFixtureIfNeeded` fetches the fixture JSON from `openfootball/worldcup.json` on GitHub, parses it into `Match[]` objects, and bulk-writes them to Firestore (`matches` collection). A `config/app` document with `{ initialized: true }` gates this — subsequent loads skip the fetch.
2. All pages subscribe to Firestore via `useMatches` → `onSnapshot`, so score edits are real-time across clients.
3. Score writes go through `saveScore` in `useMatches`, which translates `undefined` fields to Firestore `deleteField()`.

**Bracket resolution (`src/lib/bracketLogic.ts`):**
- Group-stage matches use placeholder team names like `"1A"`, `"2B"`, `"3C"`.
- `resolveBracket` resolves these placeholders using computed group standings, then assigns the 8 best third-place teams to their R32 slots via `getThirdPlacePlacements` (backtracking + FIFA constraint table), then propagates winners forward through all rounds using the hardcoded `WINNER_FEEDS` map.
- Match numbers are significant: group matches are `GM1..GMn`, knockout matches are `M73..M104` (M103 = 3rd place, M104 = final).

**Standings tiebreakers (`src/lib/standings.ts`):** pts → GD → GF → fair play (yellow + red×3) → head-to-head among tied teams.

**Third-place slot assignment (`src/lib/thirdPlacePlacements.ts`):** The 8 R32 slots each accept thirds from specific group clusters (hardcoded from FIFA's fixture). `getThirdPlacePlacements` uses backtracking to find a valid assignment — it always resolves uniquely per FIFA's design.

**Auth:** Firebase email/password only. `AuthContext` exposes `user` and `ready`. Only logged-in users can edit scores — `FixturePage` and `BracketPage` gate the `onClick` on `!!user`.

**Timezone:** `TimezoneContext` supports `America/Mexico_City` (CT) and `America/New_York` (ET), persisted in `localStorage` under `wc26_tz`. All match times are stored as `utcMs` (epoch ms) in Firestore; display is done via `date-fns-tz`.

**Pages:**
- `/grupos` — group standings tables for all 12 groups (A–L)
- `/fixture` — all matches sorted by date, grouped by day; click to edit score (auth required)
- `/bracket` — knockout bracket view with live propagation

**Deployment:** Vercel with SPA rewrite (`/(.*) → /`).
