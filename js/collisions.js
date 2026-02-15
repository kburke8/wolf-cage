// Collision helpers
const Collisions = {

    // True when two circles overlap
    circleOverlap(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < a.radius + b.radius;
    },

    distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Keep entity inside the arena
    clampToArena(entity, width, height) {
        const r = entity.radius;
        if (entity.x < r) entity.x = r;
        if (entity.x > width - r) entity.x = width - r;
        if (entity.y < r) entity.y = r;
        if (entity.y > height - r) entity.y = height - r;
    },

    // Barrier enforcement — blocks wolves from crossing the red line
    // depending on the current phase.
    enforceBarrier(entity, barrierY, phase) {
        if (!isWolfTeam(entity.role)) return; // bunnies pass freely

        const canCross =
            phase === 'wolfcage' ||
            (phase === 'alpha' && entity.role === 'alpha');
        if (canCross) return;

        // Determine which side the entity was on before this frame's move
        const wasAbove = entity.prevY < barrierY;

        if (wasAbove) {
            // Must stay above
            if (entity.y + entity.radius > barrierY) {
                entity.y = barrierY - entity.radius;
                entity.vy = 0;
            }
        } else {
            // Must stay below
            if (entity.y - entity.radius < barrierY) {
                entity.y = barrierY + entity.radius;
                entity.vy = 0;
            }
        }
    },
};
