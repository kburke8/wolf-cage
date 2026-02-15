// Simple bot AI
const AI = {

    update(entity, entities, coins, barrierY, phase, dt) {
        if (entity.isPlayer) return;

        if (isBunnyTeam(entity.role)) {
            this.bunnyAI(entity, entities, coins);
        } else {
            this.wolfAI(entity, entities);
        }

        // Wall avoidance — steer away from edges
        this.avoidWalls(entity);
    },

    // Bunny: flee nearest wolf, otherwise drift toward coins
    bunnyAI(entity, entities, coins) {
        let nearestWolf = null;
        let nearestWolfDist = Infinity;

        for (const other of entities) {
            if (other === entity || !isWolfTeam(other.role)) continue;
            const d = Collisions.distance(entity, other);
            if (d < nearestWolfDist) {
                nearestWolfDist = d;
                nearestWolf = other;
            }
        }

        const dangerRadius = 200;

        if (nearestWolf && nearestWolfDist < dangerRadius) {
            // Run away from wolf
            let fx = entity.x - nearestWolf.x;
            let fy = entity.y - nearestWolf.y;
            const len = Math.sqrt(fx * fx + fy * fy) || 1;
            entity.vx = fx / len;
            entity.vy = fy / len;
            return;
        }

        // Safe — go toward nearest coin
        let nearestCoin = null;
        let nearestCoinDist = Infinity;

        for (const coin of coins) {
            const d = Collisions.distance(entity, coin);
            if (d < nearestCoinDist) {
                nearestCoinDist = d;
                nearestCoin = coin;
            }
        }

        if (nearestCoin) {
            const dx = nearestCoin.x - entity.x;
            const dy = nearestCoin.y - entity.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            entity.vx = dx / len;
            entity.vy = dy / len;
        } else {
            // Wander randomly
            if (Math.random() < 0.02) {
                const angle = Math.random() * Math.PI * 2;
                entity.vx = Math.cos(angle);
                entity.vy = Math.sin(angle);
            }
        }
    },

    // Wolf: chase nearest bunny
    wolfAI(entity, entities) {
        let nearestBunny = null;
        let nearestBunnyDist = Infinity;

        for (const other of entities) {
            if (other === entity || !isBunnyTeam(other.role)) continue;
            const d = Collisions.distance(entity, other);
            if (d < nearestBunnyDist) {
                nearestBunnyDist = d;
                nearestBunny = other;
            }
        }

        if (nearestBunny) {
            const dx = nearestBunny.x - entity.x;
            const dy = nearestBunny.y - entity.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            entity.vx = dx / len;
            entity.vy = dy / len;
        } else {
            if (Math.random() < 0.02) {
                const angle = Math.random() * Math.PI * 2;
                entity.vx = Math.cos(angle);
                entity.vy = Math.sin(angle);
            }
        }
    },

    // Push velocity away from arena walls when close to edge
    avoidWalls(entity) {
        const margin = 50;
        const w = CONFIG.CANVAS_WIDTH;
        const h = CONFIG.CANVAS_HEIGHT;
        const strength = 0.4;

        if (entity.x < margin)     entity.vx += strength;
        if (entity.x > w - margin) entity.vx -= strength;
        if (entity.y < margin)     entity.vy += strength;
        if (entity.y > h - margin) entity.vy -= strength;

        // Re-normalize
        const len = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
        if (len > 1) {
            entity.vx /= len;
            entity.vy /= len;
        }
    },
};
