// UI drawing: HUD, menus, overlays
const UI = {

    // ── Start Screen ────────────────────────────────────────────────
    drawStartScreen(ctx, w, h) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 52px monospace';
        ctx.fillText('WOLF CAGE', w / 2, h / 2 - 60);

        ctx.font = '22px monospace';
        ctx.fillStyle = '#ccc';
        ctx.fillText('Click to Play', w / 2, h / 2 + 10);

        ctx.font = '15px monospace';
        ctx.fillStyle = '#888';
        ctx.fillText('WASD / Arrows = Move    E = Upgrades', w / 2, h / 2 + 50);
    },

    // ── In-game HUD ─────────────────────────────────────────────────
    drawHUD(ctx, player, phase, bunnyCount, w) {
        const pad = 12;

        // Background strip
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, w, 40);

        ctx.font = 'bold 15px monospace';

        // Role (left)
        ctx.textAlign = 'left';
        ctx.fillStyle = roleColor(player.role);
        ctx.fillText('Role: ' + player.role.toUpperCase(), pad, 27);

        // Gold
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Gold: ' + Math.floor(player.gold), 180, 27);

        // Phase (center)
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff6666';
        ctx.font = 'bold 17px monospace';
        const phaseLabel =
            phase === 'closed'   ? 'BARRIER CLOSED' :
            phase === 'alpha'    ? 'ALPHA WOLF' :
                                   'WOLF CAGE';
        ctx.fillText(phaseLabel, w / 2, 27);

        // Bunny count (right)
        ctx.textAlign = 'right';
        ctx.fillStyle = '#8f8';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('Bunnies: ' + bunnyCount, w - pad, 27);
    },

    // ── Upgrade Menu Overlay ────────────────────────────────────────
    drawUpgradeMenu(ctx, player, w, h) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, w, h);

        const mw = 340, mh = 250;
        const mx = (w - mw) / 2, my = (h - mh) / 2;

        // Panel
        ctx.fillStyle = '#1e1e3a';
        ctx.fillRect(mx, my, mw, mh);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.strokeRect(mx, my, mw, mh);

        ctx.textAlign = 'center';

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('UPGRADES', w / 2, my + 36);

        // Gold display
        ctx.fillStyle = '#FFD700';
        ctx.font = '15px monospace';
        ctx.fillText('Gold: ' + Math.floor(player.gold), w / 2, my + 62);

        // Speed upgrade
        const sCost = CONFIG.SPEED_UPGRADE_COST * (player.speedLevel + 1);
        const sMax = player.speedLevel >= CONFIG.MAX_UPGRADE_LEVEL;
        ctx.fillStyle = sMax ? '#555' : '#4CAF50';
        ctx.font = '16px monospace';
        ctx.fillText(
            sMax ? '[1] Speed: MAX' :
                   '[1] Speed Lv' + (player.speedLevel + 1) + '  -  ' + sCost + 'g',
            w / 2, my + 105
        );

        // Money upgrade
        const mCost = CONFIG.MONEY_UPGRADE_COST * (player.moneyLevel + 1);
        const mMax = player.moneyLevel >= CONFIG.MAX_UPGRADE_LEVEL;
        ctx.fillStyle = mMax ? '#555' : '#2196F3';
        ctx.fillText(
            mMax ? '[2] Money: MAX' :
                   '[2] Money Lv' + (player.moneyLevel + 1) + '  -  ' + mCost + 'g',
            w / 2, my + 145
        );

        // Close hint
        ctx.fillStyle = '#aaa';
        ctx.font = '14px monospace';
        ctx.fillText('[E] Close', w / 2, my + 210);
    },

    // ── Game Over Screen ────────────────────────────────────────────
    drawGameOver(ctx, winner, w, h) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.font = 'bold 40px monospace';
        ctx.fillStyle = winner === 'bunny' ? '#4CAF50' : '#f44336';
        ctx.fillText(
            winner === 'bunny' ? 'BUNNY WINS!' : 'WOLVES WIN!',
            w / 2, h / 2 - 20
        );

        ctx.font = '20px monospace';
        ctx.fillStyle = '#aaa';
        ctx.fillText('Click to play again', w / 2, h / 2 + 30);
    },
};

// Helper shared with other modules
function roleColor(role) {
    switch (role) {
        case 'bunny':   return '#4CAF50';
        case 'captain': return '#2196F3';
        case 'wolf':    return '#f44336';
        case 'alpha':   return '#CE93D8';
        default:        return '#fff';
    }
}
