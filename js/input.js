// Keyboard input tracker
const Input = {
    keys: {},

    init() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    },

    isDown(key) {
        return !!this.keys[key.toLowerCase()];
    },

    // Returns a normalized {dx, dy} for WASD / arrow movement
    getMovement() {
        let dx = 0, dy = 0;
        if (this.isDown('w') || this.isDown('arrowup'))    dy -= 1;
        if (this.isDown('s') || this.isDown('arrowdown'))  dy += 1;
        if (this.isDown('a') || this.isDown('arrowleft'))  dx -= 1;
        if (this.isDown('d') || this.isDown('arrowright')) dx += 1;

        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) { dx /= len; dy /= len; }

        return { dx, dy };
    },
};
