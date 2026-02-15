// All tunable game constants in one place
const CONFIG = {
    CANVAS_WIDTH: 960,
    CANVAS_HEIGHT: 640,

    // Base speeds (pixels per second)
    BUNNY_SPEED: 200,
    CAPTAIN_SPEED: 240,
    WOLF_SPEED: 240,
    ALPHA_SPEED: 280,

    ENTITY_RADIUS: 24,

    // Bot counts (total entities = NUM_BOTS + 1 player)
    NUM_BOTS: 11,
    NUM_CAPTAINS: 2,

    // Coins
    COIN_RADIUS: 10,
    COIN_VALUE: 25,
    COIN_SPAWN_INTERVAL: 1.2, // seconds between spawns
    MAX_COINS: 30,
    INITIAL_COINS: 8,

    // Barrier phase durations (seconds)
    PHASE_CLOSED_DURATION: 10,
    PHASE_ALPHA_DURATION: 15,

    // Upgrades
    SPEED_UPGRADE_COST: 20,
    MONEY_UPGRADE_COST: 15,
    SPEED_UPGRADE_BONUS: 25,       // extra px/s per level
    MONEY_UPGRADE_MULTIPLIER: 0.5, // +50% gold per level
    MAX_UPGRADE_LEVEL: 5,

    // Economy
    TAG_GOLD_REWARD: 30,
    WINNER_BONUS_GOLD: 50,

    // Tagging
    TAG_COOLDOWN: 1, // seconds — prevents instant re-tagging
};
