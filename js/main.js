// Entry point — boots after assets finish loading
(function () {
    const canvas = document.getElementById('gameCanvas');

    Assets.load(() => {
        Game.init(canvas);

        let lastTime = performance.now();

        function loop(now) {
            const dt = Math.min((now - lastTime) / 1000, 0.05); // cap to avoid spiral
            lastTime = now;

            Game.update(dt);
            Game.render();

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    });
})();
