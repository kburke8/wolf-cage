// Entity factory and role helpers

function createEntity(x, y, role, isPlayer) {
    return {
        x: x,
        y: y,
        prevY: y,
        vx: 0,
        vy: 0,
        radius: CONFIG.ENTITY_RADIUS,
        role: role,       // 'bunny' | 'captain' | 'wolf' | 'alpha'
        isPlayer: !!isPlayer,
        gold: 0,
        speedLevel: 0,
        moneyLevel: 0,
        tagCooldown: 0,   // seconds remaining
    };
}

function getBaseSpeed(role) {
    switch (role) {
        case 'bunny':   return CONFIG.BUNNY_SPEED;
        case 'captain': return CONFIG.CAPTAIN_SPEED;
        case 'wolf':    return CONFIG.WOLF_SPEED;
        case 'alpha':   return CONFIG.ALPHA_SPEED;
        default:        return CONFIG.BUNNY_SPEED;
    }
}

function getEffectiveSpeed(entity) {
    return getBaseSpeed(entity.role) + entity.speedLevel * CONFIG.SPEED_UPGRADE_BONUS;
}

function getGoldMultiplier(entity) {
    return 1 + entity.moneyLevel * CONFIG.MONEY_UPGRADE_MULTIPLIER;
}

function isBunnyTeam(role) {
    return role === 'bunny' || role === 'captain';
}

function isWolfTeam(role) {
    return role === 'wolf' || role === 'alpha';
}

function getAssetKey(role) {
    return role; // keys match: bunny, captain, wolf, alpha
}
