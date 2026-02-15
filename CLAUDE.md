# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

No build step. Open `index.html` in any browser. For local dev with a server:
```
python -m http.server 8080
```

## Architecture

Vanilla JS with no modules/bundler. Files load via `<script>` tags in strict order:

```
config.js → assets.js → input.js → entities.js → collisions.js → ai.js → ui.js → game.js → main.js
```

Load order matters — each file depends on globals from earlier files. All inter-module communication is through global objects:

| Global | Purpose |
|--------|---------|
| `CONFIG` | All tunable constants (speeds, costs, durations, counts) |
| `Assets` | Sprite loader; draws PNGs or falls back to colored circles with role initials |
| `Input` | Keyboard state; provides normalized movement vector (WASD + arrows) |
| `Collisions` | Circle overlap, arena clamping, barrier enforcement using `prevY` tracking |
| `AI` | Bot behavior — bunnies flee/collect, wolves chase nearest bunny, wall avoidance |
| `UI` | Canvas drawing for HUD, start screen, upgrade menu, game-over overlay |
| `Game` | Central state machine — owns entities[], coins[], phase timer, match logic |

Free functions in `entities.js`: `createEntity()`, `getBaseSpeed()`, `getEffectiveSpeed()`, `isBunnyTeam()`, `isWolfTeam()`. Free function in `ui.js`: `roleColor()`.

## Game Loop

`main.js` bootstraps: loads assets, inits Game, starts `requestAnimationFrame` loop with dt-capped updates.

```
Game.update(dt):  phase timer → coin spawning → entity movement (input/AI) →
                  barrier enforcement → tagging collisions → coin collection → win check
Game.render():    background → barrier → coins → entities (Y-sorted) → HUD → overlays
```

## State Machine

`Game.state`: `'start'` → `'playing'` → `'upgradeMenu'` (E key toggle) → `'gameover'`

Barrier phases: `'closed'` → `'alpha'` → `'wolfcage'` (timed progression in `Game.update`)

## Key Conventions

- **All tunable values in `CONFIG`** — never hardcode gameplay numbers
- **Namespace pattern** for stateful modules (`Game`, `AI`, `Assets`, etc.) — no classes/prototypes
- **Role strings** are always lowercase: `'bunny'`, `'captain'`, `'wolf'`, `'alpha'`
- **Asset filenames are case-sensitive** — PNGs use uppercase extension (`.PNG`) and hyphens (`captain-bunny.PNG`, `alpha-wolf.PNG`)
- **Fallback rendering** — missing sprites automatically become colored circles with role initials; no error handling needed
- Entities use **circle collision** (radius-based overlap)
- Barrier enforcement tracks `entity.prevY` to detect and block crossings per phase rules
