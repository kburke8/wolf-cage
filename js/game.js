// Core game state and loop logic
const Game = {
    canvas: null,
    ctx: null,
    state: 'start',   // 'start' | 'playing' | 'upgradeMenu' | 'gameover'
    entities: [],
    coins: [],
    player: null,
    phase: 'closed',   // 'closed' | 'alpha' | 'wolfcage'
    phaseTimer: 0,
    coinTimer: 0,
    winner: null,
    winnerBonus: 0,    // gold carried into next match by the winner

    // ── Initialise ──────────────────────────────────────────────────
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        canvas.width = CONFIG.CANVAS_WIDTH;
        canvas.height = CONFIG.CANVAS_HEIGHT;

        Input.init();

        // Click handler for start / restart
        canvas.addEventListener('click', () => {
            if (this.state === 'start' || this.state === 'gameover') {
                this.startMatch();
            }
        });

        // Key handler for upgrade menu
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();

            if (key === 'e') {
                if (this.state === 'playing') {
                    this.state = 'upgradeMenu';
                } else if (this.state === 'upgradeMenu') {
                    this.state = 'playing';
                }
            }

            if (this.state === 'upgradeMenu') {
                if (e.key === '1') this.buySpeedUpgrade();
                if (e.key === '2') this.buyMoneyUpgrade();
            }
        });
    },

    // ── Start a new match ───────────────────────────────────────────
    startMatch() {
        this.state = 'playing';
        this.entities = [];
        this.coins = [];
        this.phase = 'closed';
        this.phaseTimer = 0;
        this.coinTimer = 0;
        this.winner = null;

        const w = CONFIG.CANVAS_WIDTH;
        const h = CONFIG.CANVAS_HEIGHT;
        const barrierY = h * 0.5;
        const total = CONFIG.NUM_BOTS + 1;
        const margin = CONFIG.ENTITY_RADIUS * 2;

        // Build shuffled index array for random role assignment
        const idx = Array.from({ length: total }, (_, i) => i);
        for (let i = idx.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [idx[i], idx[j]] = [idx[j], idx[i]];
        }

        const alphaIdx = idx[0];
        const captainSet = new Set(idx.slice(1, 1 + CONFIG.NUM_CAPTAINS));

        for (let i = 0; i < total; i++) {
            let role = 'bunny';
            if (i === alphaIdx) role = 'alpha';
            else if (captainSet.has(i)) role = 'captain';

            const isWolf = isWolfTeam(role);

            // Wolves spawn top half, bunnies spawn bottom half
            const x = margin + Math.random() * (w - margin * 2);
            let y;
            if (isWolf) {
                y = margin + Math.random() * (barrierY - margin * 2 - CONFIG.ENTITY_RADIUS);
            } else {
                y = barrierY + CONFIG.ENTITY_RADIUS + margin +
                    Math.random() * (h - barrierY - margin * 3);
            }

            const isPlayer = (i === 0);
            const ent = createEntity(x, y, role, isPlayer);

            if (isPlayer) {
                ent.gold = this.winnerBonus;
                this.player = ent;
            }

            this.entities.push(ent);
        }

        // Seed a few coins in the bunny half
        for (let i = 0; i < CONFIG.INITIAL_COINS; i++) {
            this.coins.push({
                x: margin + Math.random() * (w - margin * 2),
                y: barrierY + margin + Math.random() * (h - barrierY - margin * 2),
                radius: CONFIG.COIN_RADIUS,
            });
        }
    },

    // ── Upgrades ────────────────────────────────────────────────────
    buySpeedUpgrade() {
        const p = this.player;
        if (!p || p.speedLevel >= CONFIG.MAX_UPGRADE_LEVEL) return;
        const cost = CONFIG.SPEED_UPGRADE_COST * (p.speedLevel + 1);
        if (p.gold >= cost) { p.gold -= cost; p.speedLevel++; }
    },

    buyMoneyUpgrade() {
        const p = this.player;
        if (!p || p.moneyLevel >= CONFIG.MAX_UPGRADE_LEVEL) return;
        const cost = CONFIG.MONEY_UPGRADE_COST * (p.moneyLevel + 1);
        if (p.gold >= cost) { p.gold -= cost; p.moneyLevel++; }
    },

    // ── Update (called every frame) ─────────────────────────────────
    update(dt) {
        if (this.state !== 'playing') return;

        const w = CONFIG.CANVAS_WIDTH;
        const h = CONFIG.CANVAS_HEIGHT;
        const barrierY = h * 0.5;

        // Phase progression
        this.phaseTimer += dt;
        if (this.phase === 'closed' && this.phaseTimer >= CONFIG.PHASE_CLOSED_DURATION) {
            this.phase = 'alpha';
            this.phaseTimer = 0;
        } else if (this.phase === 'alpha' && this.phaseTimer >= CONFIG.PHASE_ALPHA_DURATION) {
            this.phase = 'wolfcage';
            this.phaseTimer = 0;
        }

        // Spawn coins
        this.coinTimer += dt;
        if (this.coinTimer >= CONFIG.COIN_SPAWN_INTERVAL && this.coins.length < CONFIG.MAX_COINS) {
            this.coinTimer = 0;
            const margin = CONFIG.COIN_RADIUS * 2;
            this.coins.push({
                x: margin + Math.random() * (w - margin * 2),
                y: margin + Math.random() * (h - margin * 2),
                radius: CONFIG.COIN_RADIUS,
            });
        }

        // Move entities
        for (const ent of this.entities) {
            ent.prevY = ent.y;

            if (ent.tagCooldown > 0) ent.tagCooldown -= dt;

            // Input / AI
            if (ent.isPlayer) {
                const m = Input.getMovement();
                ent.vx = m.dx;
                ent.vy = m.dy;
            } else {
                AI.update(ent, this.entities, this.coins, barrierY, this.phase, dt);
            }

            const spd = getEffectiveSpeed(ent);
            ent.x += ent.vx * spd * dt;
            ent.y += ent.vy * spd * dt;

            Collisions.clampToArena(ent, w, h);
            Collisions.enforceBarrier(ent, barrierY, this.phase);
        }

        // Tagging: wolves tag bunnies
        for (const wolf of this.entities) {
            if (!isWolfTeam(wolf.role)) continue;
            if (wolf.tagCooldown > 0) continue;

            for (const bunny of this.entities) {
                if (!isBunnyTeam(bunny.role)) continue;
                if (bunny.tagCooldown > 0) continue;

                if (Collisions.circleOverlap(wolf, bunny)) {
                    wolf.gold += CONFIG.TAG_GOLD_REWARD * getGoldMultiplier(wolf);
                    wolf.tagCooldown = CONFIG.TAG_COOLDOWN;
                    bunny.tagCooldown = CONFIG.TAG_COOLDOWN;

                    if (bunny.role === 'captain') {
                        bunny.role = 'bunny'; // demoted — still needs one more tag
                    } else {
                        bunny.role = 'wolf';  // infected
                    }
                }
            }
        }

        // Coin collection (bunnies only)
        for (const ent of this.entities) {
            if (!isBunnyTeam(ent.role)) continue;
            for (let i = this.coins.length - 1; i >= 0; i--) {
                if (Collisions.circleOverlap(ent, this.coins[i])) {
                    ent.gold += CONFIG.COIN_VALUE * getGoldMultiplier(ent);
                    this.coins.splice(i, 1);
                }
            }
        }

        // Win condition
        const bunnyCount = this.entities.filter(e => isBunnyTeam(e.role)).length;

        if (bunnyCount === 0) {
            this.winner = 'wolves';
            this.state = 'gameover';
            this.winnerBonus = isWolfTeam(this.player.role) ? CONFIG.WINNER_BONUS_GOLD : 0;
        } else if (bunnyCount === 1) {
            const last = this.entities.find(e => isBunnyTeam(e.role));
            this.winner = 'bunny';
            this.state = 'gameover';
            this.winnerBonus = (last === this.player) ? CONFIG.WINNER_BONUS_GOLD : 0;
        }
    },

    // ── Render ───────────────────────────────────────────────────────
    render() {
        const ctx = this.ctx;
        const w = CONFIG.CANVAS_WIDTH;
        const h = CONFIG.CANVAS_HEIGHT;

        // Background
        const bgImg = Assets.images.background;
        if (bgImg) {
            ctx.drawImage(bgImg, 0, 0, w, h);
            // Darken the background heavily so entities pop
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.fillRect(0, 0, w, h);
        } else {
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#347a2c';
            for (let gx = 0; gx < w; gx += 40) {
                for (let gy = 0; gy < h; gy += 40) {
                    if ((Math.floor(gx / 40) + Math.floor(gy / 40)) % 2 === 0) {
                        ctx.fillRect(gx, gy, 40, 40);
                    }
                }
            }
        }

        if (this.state === 'start') {
            UI.drawStartScreen(ctx, w, h);
            return;
        }

        const barrierY = h * 0.5;

        // Barrier line with glow
        ctx.save();
        if (this.phase === 'wolfcage') {
            // Faded — barrier is open
            ctx.beginPath();
            ctx.moveTo(0, barrierY);
            ctx.lineTo(w, barrierY);
            ctx.strokeStyle = 'rgba(255,80,80,0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 14]);
            ctx.stroke();
        } else {
            // Glow layer
            ctx.beginPath();
            ctx.moveTo(0, barrierY);
            ctx.lineTo(w, barrierY);
            ctx.strokeStyle = 'rgba(255,0,0,0.25)';
            ctx.lineWidth = 12;
            ctx.setLineDash([]);
            ctx.stroke();
            // Main line
            ctx.beginPath();
            ctx.moveTo(0, barrierY);
            ctx.lineTo(w, barrierY);
            ctx.lineWidth = this.phase === 'alpha' ? 3 : 5;
            ctx.setLineDash(this.phase === 'alpha' ? [12, 8] : []);
            ctx.strokeStyle = this.phase === 'alpha' ? '#ff4444' : '#ff0000';
            ctx.stroke();
        }
        ctx.restore();

        // Coins
        for (const coin of this.coins) {
            Assets.draw(ctx, 'coin', coin.x, coin.y, coin.radius);
        }

        // Entities — draw sorted by y for natural overlap
        const sorted = this.entities.slice().sort((a, b) => a.y - b.y);
        for (const ent of sorted) {
            ctx.save();

            // Tag flash effect
            if (ent.tagCooldown > 0) {
                ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(ent.tagCooldown * 12));
            }

            // Outer glow (soft colored circle behind everything)
            ctx.beginPath();
            ctx.arc(ent.x, ent.y, ent.radius + 8, 0, Math.PI * 2);
            const glowAlpha = ctx.globalAlpha;
            ctx.fillStyle = roleColor(ent.role);
            ctx.globalAlpha = glowAlpha * 0.35;
            ctx.fill();
            ctx.globalAlpha = glowAlpha;

            // Sprite / fallback shape
            Assets.draw(ctx, getAssetKey(ent.role), ent.x, ent.y, ent.radius);

            // Thick colored border ring so role is instantly visible
            ctx.beginPath();
            ctx.arc(ent.x, ent.y, ent.radius + 2, 0, Math.PI * 2);
            ctx.strokeStyle = roleColor(ent.role);
            ctx.lineWidth = 3;
            ctx.stroke();

            // Player indicator — pulsing white ring
            if (ent.isPlayer) {
                const pulse = 1 + 0.15 * Math.sin(performance.now() / 200);
                ctx.beginPath();
                ctx.arc(ent.x, ent.y, (ent.radius + 7) * pulse, 0, Math.PI * 2);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }

            ctx.restore();
        }

        // HUD
        if (this.player) {
            const bc = this.entities.filter(e => isBunnyTeam(e.role)).length;
            UI.drawHUD(ctx, this.player, this.phase, bc, w);
        }

        // Overlays
        if (this.state === 'upgradeMenu') {
            UI.drawUpgradeMenu(ctx, this.player, w, h);
        }
        if (this.state === 'gameover') {
            UI.drawGameOver(ctx, this.winner, w, h);
        }
    },
};
