// Entry point — creates canvas, handles scaling, initializes game
// No gameplay logic here.

function init() {
  const canvas = document.getElementById('game-canvas');

  // Set logical resolution
  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;

  // Scale canvas to fill window while preserving aspect ratio
  function resize() {
    const scaleX = window.innerWidth / CONFIG.CANVAS_WIDTH;
    const scaleY = window.innerHeight / CONFIG.CANVAS_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    canvas.style.width = Math.floor(CONFIG.CANVAS_WIDTH * scale) + 'px';
    canvas.style.height = Math.floor(CONFIG.CANVAS_HEIGHT * scale) + 'px';
  }

  window.addEventListener('resize', resize);
  resize();

  // Wire up systems and start
  const input = new Input();
  const game = new Game(canvas, input);
  game.start();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
