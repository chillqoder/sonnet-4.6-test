// Pipe generation, update, and rendering

class Pipes {
  constructor() {
    this.pipes = [];
    this._timer = 0;
  }

  reset() {
    this.pipes = [];
    this._timer = 1.0; // first pipe arrives quickly
  }

  update(dt) {
    // Spawn timer
    this._timer -= dt;
    if (this._timer <= 0) {
      this._spawnPipe();
      this._timer = CONFIG.PIPE_INTERVAL;
    }

    // Move pipes left
    for (const pipe of this.pipes) {
      pipe.x -= CONFIG.PIPE_SPEED * dt;
    }

    // Remove pipes that are fully off-screen (left side)
    this.pipes = this.pipes.filter(p => p.x + CONFIG.PIPE_WIDTH + CONFIG.PIPE_CAP_OVERHANG > -10);
  }

  _spawnPipe() {
    const range = CONFIG.PIPE_MAX_GAP_CENTER - CONFIG.PIPE_MIN_GAP_CENTER;
    const gapCenter = CONFIG.PIPE_MIN_GAP_CENTER + Math.random() * range;
    this.pipes.push({
      x: CONFIG.CANVAS_WIDTH + 20,
      gapCenter,
      scored: false,
    });
  }

  draw(ctx) {
    for (const pipe of this.pipes) {
      this._drawPair(ctx, pipe);
    }
  }

  _drawPair(ctx, pipe) {
    const halfGap = CONFIG.PIPE_GAP / 2;
    const groundY = CONFIG.CANVAS_HEIGHT - CONFIG.GROUND_HEIGHT;
    const topBottom = pipe.gapCenter - halfGap;   // bottom y of top pipe
    const botTop = pipe.gapCenter + halfGap;       // top y of bottom pipe
    const capH = CONFIG.PIPE_CAP_HEIGHT;
    const capOver = CONFIG.PIPE_CAP_OVERHANG;
    const pw = CONFIG.PIPE_WIDTH;

    // --- Top pipe ---
    // Body
    ctx.fillStyle = CONFIG.PIPE_COLOR;
    ctx.fillRect(pipe.x, 0, pw, topBottom - capH);

    // Cap
    ctx.fillStyle = CONFIG.PIPE_DARK_COLOR;
    ctx.fillRect(pipe.x - capOver, topBottom - capH, pw + capOver * 2, capH);

    // Highlight stripe
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(pipe.x + 7, 0, 10, topBottom);

    // --- Bottom pipe ---
    // Cap
    ctx.fillStyle = CONFIG.PIPE_DARK_COLOR;
    ctx.fillRect(pipe.x - capOver, botTop, pw + capOver * 2, capH);

    // Body
    ctx.fillStyle = CONFIG.PIPE_COLOR;
    ctx.fillRect(pipe.x, botTop + capH, pw, groundY - botTop - capH);

    // Highlight stripe
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(pipe.x + 7, botTop, 10, groundY - botTop);
  }

  // Returns collision rectangles (without cap overhang for fair gameplay)
  getBounds() {
    const halfGap = CONFIG.PIPE_GAP / 2;
    const groundY = CONFIG.CANVAS_HEIGHT - CONFIG.GROUND_HEIGHT;
    const bounds = [];

    for (const pipe of this.pipes) {
      const topBottom = pipe.gapCenter - halfGap;
      const botTop = pipe.gapCenter + halfGap;

      // Top pipe
      bounds.push({ x: pipe.x, y: 0, width: CONFIG.PIPE_WIDTH, height: topBottom });

      // Bottom pipe
      bounds.push({ x: pipe.x, y: botTop, width: CONFIG.PIPE_WIDTH, height: groundY - botTop });
    }

    return bounds;
  }
}
