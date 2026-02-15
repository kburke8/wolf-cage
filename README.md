# Wolf Cage

A 2D browser game designed by a 7-year-old. All the game art — bunnies, wolves, coins, and the background — are original kid drawings. The rules, roles, and barrier mechanics were dreamed up by a kid and brought to life with HTML5 Canvas and vanilla JavaScript.

## How to Run

Open `index.html` in any modern browser. No install, no build step — just open and play.

## Controls

| Key | Action |
|-----|--------|
| **W / A / S / D** | Move (up / left / down / right) |
| **Arrow keys** | Move (alternative) |
| **E** | Open / close upgrade menu |
| **1** | Buy speed upgrade (in menu) |
| **2** | Buy money upgrade (in menu) |

## How to Play

You start as a random role — bunny, captain bunny, or even the alpha wolf.

- **Bunnies** run around collecting coins for gold. If a wolf tags you, you become a wolf.
- **Captain Bunnies** are tougher — they survive the first tag (demoted to regular bunny) and only convert on the second.
- **Wolves** chase bunnies to tag and convert them. Tagging earns gold.
- **Alpha Wolf** is the fastest and gets to cross the barrier first.

### The Barrier

A red line splits the arena in half. It opens in stages:

1. **BARRIER CLOSED** — Wolves are stuck on their side. Bunnies collect coins in peace.
2. **ALPHA WOLF** — The Alpha Wolf breaks through. The hunt begins.
3. **WOLF CAGE** — All wolves can cross. Run.

### Upgrades

Press **E** mid-game to spend gold on:
- **Speed** — move faster
- **Money** — earn more gold per coin/tag

Upgrades reset each match. The winner gets bonus starting gold next round.

### Winning

- Last bunny alive = **bunny wins**
- Zero bunnies left = **wolves win**

## About the Art

All sprites were drawn by hand by a 7-year-old and scanned/photographed as PNGs. The game uses them as-is — no cleanup, no polish. That's the point.

## Configuration

All gameplay values (speeds, phase durations, upgrade costs, bot count, etc.) are tunable in `js/config.js`.
