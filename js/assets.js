// Loads sprite images; falls back to colored shapes when PNGs are missing
const Assets = {
    images: {},

    load(callback) {
        const sources = {
            bunny: 'assets/bunny.PNG',
            captain: 'assets/captain-bunny.PNG',
            wolf: 'assets/wolf.PNG',
            alpha: 'assets/alpha-wolf.PNG',
            coin: 'assets/coin.PNG',
            background: 'assets/background.PNG',
        };

        let remaining = Object.keys(sources).length;

        const onDone = () => {
            remaining--;
            if (remaining <= 0) callback();
        };

        for (const [key, src] of Object.entries(sources)) {
            const img = new Image();
            img.onload = () => { this.images[key] = img; onDone(); };
            img.onerror = onDone; // missing asset — will use fallback
            img.src = src;
        }
    },

    draw(ctx, key, x, y, radius) {
        const img = this.images[key];
        if (img) {
            const size = radius * 2;
            ctx.drawImage(img, x - radius, y - radius, size, size);
        } else {
            this.drawFallback(ctx, key, x, y, radius);
        }
    },

    drawFallback(ctx, key, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fallbackColor(key);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw role initial so shapes are identifiable
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + Math.round(radius) + 'px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.fallbackLabel(key), x, y + 1);
    },

    fallbackColor(key) {
        switch (key) {
            case 'bunny':   return '#4CAF50';
            case 'captain': return '#2196F3';
            case 'wolf':    return '#f44336';
            case 'alpha':   return '#9C27B0';
            case 'coin':    return '#FFD700';
            default:        return '#888';
        }
    },

    fallbackLabel(key) {
        switch (key) {
            case 'bunny':   return 'B';
            case 'captain': return 'C';
            case 'wolf':    return 'W';
            case 'alpha':   return 'A';
            case 'coin':    return '$';
            default:        return '?';
        }
    },
};
