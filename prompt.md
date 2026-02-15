# 🐺 WOLF CAGE — 2D WEB GAME (AGENT PROMPT)

You are building a 2D browser game called **Wolf Cage** using **HTML5 Canvas + JavaScript (no frameworks)**. The game uses user-provided PNG assets (kid drawings) for bunnies, captain bunnies, wolves, alpha wolf, and coins/apples.

## Goals

* Produce a fully playable MVP that runs by opening `index.html`.
* Use simple, readable code and a clear folder structure.
* Make gameplay values configurable in a single `config.js`.

## Tech Constraints

* 2D top-down.
* Canvas rendering.
* Keyboard controls for player (WASD or arrows).
* AI bots for other actors.
* No build step required.

---

## Assets (to be provided by user)

Expect these files in `/assets/` (names flexible, map them in code):

* `bunny.png`
* `captain_bunny.png`
* `wolf.png`
* `alpha_wolf.png`
* `coin.png` (or `apple.png`)
  Optional:
* Multiple-frame sprites (e.g. `bunny_0.png`, `bunny_1.png`) → support simple animation if present.

The game must gracefully handle missing optional assets by using colored shapes.

---

## Core Gameplay Rules

### Roles

* **Bunny**

  * Speed: 5
  * Can collect coins/apples for gold
  * 1 tag → becomes Wolf
* **Captain Bunny**

  * Speed: 6
  * Needs 2 tags:

    * First tag removes captain status → becomes Bunny
    * Second tag → becomes Wolf
* **Wolf**

  * Speed: 6
  * Cannot collect coins
  * When Wolf tags Bunny: Bunny becomes Wolf, tagging Wolf earns gold
* **Alpha Wolf**

  * Speed: 7
  * Same tagging as Wolf
  * Special barrier access rules

### Match Start

* Randomly select **one Alpha Wolf** each match.
* Randomly select **N Captain Bunnies** (configurable).
* Everyone else starts as Bunny.

### Red Line Barrier (State Machine)

Arena has a visible red line barrier splitting the map.

* At start: Wolves and Alpha Wolf cannot cross.
* Phase text rotates:

  * **“ALPHA WOLF”** → only Alpha Wolf can cross
  * **“WOLF CAGE”** → Alpha Wolf and Wolves can cross
    Timing is configurable and must show UI text on screen.

### Economy & Upgrades (Mid-run only)

* Bunnies earn gold by collecting coins/apples.
* Wolves earn gold by tagging.
* Press a key (e.g. `E`) to open a mid-run upgrade menu overlay.
  Upgrades:
* Speed upgrade (increases move speed)
* Money upgrade (multiplies gold gained)
  Rules:
* Upgrades reset every match (no persistent progression).
* Winner of the match gets a small starting gold bonus next match only.

### Win Condition

* If only 1 Bunny remains → Bunny wins.
* If 0 Bunnies remain → Wolves win.
  No placement rewards besides the winner bonus.

---

## Required Screens / UI

* Start screen: “Play”
* In-game HUD:

  * Current role
  * Gold
  * Current phase: “ALPHA WOLF” or “WOLF CAGE”
  * Bunny count remaining
* Upgrade overlay:

  * Buy Speed upgrade
  * Buy Money upgrade
  * Close menu

---

## AI (Simple)

* Bunny AI:

  * Run away from nearest Wolf
  * If safe, drift toward nearest coin
* Wolf AI:

  * Chase nearest Bunny
    Keep AI simple and readable.

---

## Folder Structure

```
wolf-cage/
  index.html
  style.css
  js/
    main.js
    config.js
    assets.js
    input.js
    game.js
    entities.js
    ai.js
    ui.js
    collisions.js
  assets/
    bunny.png
    captain_bunny.png
    wolf.png
    alpha_wolf.png
    coin.png
```

---

## Engineering Requirements

* Deterministic collision: simple circle or AABB.
* Entities have:

  * position, velocity
  * radius/hitbox
  * role, team
  * speed, goldMultiplier
* Game loop:

  * update(dt)
  * render()
* Configurable constants:

  * speeds, coin spawn rate, phase durations, upgrade costs, winner bonus, #bots, #captains.

---

## Definition of Done (MVP)

* Run by opening `index.html`.
* Fully playable rounds with restart.
* Uses provided images as sprites.
* Barrier phases work.
* Infection works (including 2-hit captain).
* Upgrades work mid-run and reset each match.

---

## DO NOT IMPLEMENT YET

* Online multiplayer
* Mobile touch controls (unless requested)
* Advanced animation system
* Sound effects

---

### Deliverables

* Complete repo code with comments.
* A short README with: “How to run” and controls.

---

Now: **upload the drawings** (even phone screenshots are fine).
Once you do, I’ll update the prompt with:

* exact filenames
* recommended sprite sizes
* collision box tuning per sprite
* optional “outline glow” so kids can easily tell roles apart
