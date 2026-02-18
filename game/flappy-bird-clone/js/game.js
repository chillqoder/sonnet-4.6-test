// Game loop, state management, and scene coordination

const STATE = { START: 'START', PLAYING: 'PLAYING', GAME_OVER: 'GAME_OVER' };

class Game {
  constructor(canvas, input) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = input;

    this.player = new Player();
    this.pipes = new Pipes();
    this.ui = new UI();

    this.state = STATE.START;
    this.score = 0;
    this.bestScore = 0;

    // Scroll offsets for ground and clouds
    this._groundScroll = 0;
    this._cloudScroll = 0;

    // Static cloud positions (relative to their scroll layer)
    this._clouds = [
      { x: 40,  y: 95,  r: 26 },
      { x: 90,  y: 85,  r: 20 },
      { x: 68,  y: 108, r: 18 },
      { x: 210, y: 130, r: 30 },
      { x: 265, y: 120, r: 23 },
      { x: 243, y: 145, r: 18 },
      { x: 340, y: 170, r: 25 },
      { x: 380, y: 160, r: 19 },
    ];

    this._lastTime = null;
    this._rafId = null;
    this._audioCtx = null;

    // Register input handler
    this.input.onFlap(() => this._handleFlap());
  }

  start() {
    this._lastTime = performance.now();
    this._rafId = requestAnimationFrame((ts) => this._loop(ts));
  }

  // ─── Input ──────────────────────────────────────────────────────────────────

  _handleFlap() {
    // Initialize audio on first user gesture (browser policy)
    if (!this._audioCtx) this._initAudio();

    if (this.state === STATE.START) {
      this._beginGame();
    } else if (this.state === STATE.PLAYING) {
      this.player.flap();
      this._soundFlap();
    } else if (this.state === STATE.GAME_OVER) {
      this._beginGame();
    }
  }

  // ─── State transitions ───────────────────────────────────────────────────────

  _beginGame() {
    this.state = STATE.PLAYING;
    this.score = 0;
    this.player.reset();
    this.pipes.reset();
    this.player.flap(); // immediate first flap
  }

  _triggerGameOver() {
    this.state = STATE.GAME_OVER;
    if (this.score > this.bestScore) this.bestScore = this.score;
    this._soundHit();
  }

  // ─── Loop ───────────────────────────────────────────────────────────────────

  _loop(timestamp) {
    this._rafId = requestAnimationFrame((ts) => this._loop(ts));

    // Cap deltaTime to avoid spiral-of-death on tab switch
    const dt = Math.min((timestamp - this._lastTime) / 1000, 0.05);
    this._lastTime = timestamp;

    this._update(dt);
    this._render();
  }

  // ─── Update ─────────────────────────────────────────────────────────────────

  _update(dt) {
    // Ground and clouds always scroll (even on start/game-over screens)
    this._groundScroll -= CONFIG.PIPE_SPEED * dt;
    if (this._groundScroll <= -48) this._groundScroll += 48;

    this._cloudScroll -= 35 * dt;
    if (this._cloudScroll <= -CONFIG.CANVAS_WIDTH) this._cloudScroll += CONFIG.CANVAS_WIDTH;

    if (this.state === STATE.START) {
      // Gently bob the bird on the start screen
      this.player.y = CONFIG.CANVAS_HEIGHT / 2 + Math.sin(Date.now() / 420) * 14;
      return;
    }

    if (this.state === STATE.PLAYING) {
      this.player.update(dt);
      this.pipes.update(dt);

      const playerBounds = this.player.getBounds();

      if (
        checkPipeCollision(playerBounds, this.pipes.getBounds()) ||
        checkBoundaryCollision(playerBounds)
      ) {
        this._triggerGameOver();
        return;
      }

      if (checkPipePassed(this.player.x, this.pipes.pipes)) {
        this.score++;
        this._soundScore();
      }
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  _render() {
    const ctx = this.ctx;
    const W = CONFIG.CANVAS_WIDTH;
    const H = CONFIG.CANVAS_HEIGHT;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H - CONFIG.GROUND_HEIGHT);
    sky.addColorStop(0, '#1a8eb5');
    sky.addColorStop(1, '#4EC0CA');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Scrolling clouds
    this._renderClouds(ctx);

    // Pipes (hidden on start screen)
    if (this.state !== STATE.START) {
      this.pipes.draw(ctx);
    }

    // Bird
    this.player.draw(ctx);

    // Ground (drawn last so it covers pipe bottoms)
    this._renderGround(ctx);

    // UI overlays
    if (this.state === STATE.START) {
      this.ui.drawStartScreen(ctx);
    } else if (this.state === STATE.PLAYING) {
      this.ui.drawHUD(ctx, this.score);
    } else if (this.state === STATE.GAME_OVER) {
      this.ui.drawHUD(ctx, this.score);
      this.ui.drawGameOver(ctx, this.score, this.bestScore);
    }
  }

  _renderClouds(ctx) {
    ctx.fillStyle = 'rgba(255,255,255,0.68)';
    const W = CONFIG.CANVAS_WIDTH;
    for (const c of this._clouds) {
      // Two copies side-by-side for seamless scroll
      for (let offset = 0; offset <= W; offset += W) {
        const cx = ((c.x + this._cloudScroll) % W + W) % W + offset - W;
        ctx.beginPath();
        ctx.arc(cx, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  _renderGround(ctx) {
    const groundY = CONFIG.CANVAS_HEIGHT - CONFIG.GROUND_HEIGHT;
    const W = CONFIG.CANVAS_WIDTH;
    const stripeW = 24;

    // Grass top
    ctx.fillStyle = '#8DB33A';
    ctx.fillRect(0, groundY, W, 18);

    // Sand base
    ctx.fillStyle = '#DED895';
    ctx.fillRect(0, groundY + 18, W, CONFIG.GROUND_HEIGHT - 18);

    // Animated stripes
    ctx.fillStyle = '#C8B860';
    for (let x = this._groundScroll; x < W + stripeW; x += stripeW * 2) {
      ctx.fillRect(x, groundY + 22, stripeW, 14);
    }
  }

  // ─── Audio (Web Audio API — no external files needed) ───────────────────────

  _initAudio() {
    try {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this._audioCtx = null;
    }
  }

  _playTone(freq, duration, type, gain) {
    if (!this._audioCtx) return;
    try {
      const osc = this._audioCtx.createOscillator();
      const g = this._audioCtx.createGain();
      osc.connect(g);
      g.connect(this._audioCtx.destination);
      osc.type = type || 'square';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.15, this._audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this._audioCtx.currentTime + duration);
      osc.start(this._audioCtx.currentTime);
      osc.stop(this._audioCtx.currentTime + duration);
    } catch (e) { /* audio errors are non-fatal */ }
  }

  _soundFlap() {
    this._playTone(460, 0.07, 'square', 0.14);
  }

  _soundScore() {
    this._playTone(880, 0.09, 'sine', 0.18);
    setTimeout(() => this._playTone(1108, 0.09, 'sine', 0.16), 85);
  }

  _soundHit() {
    this._playTone(220, 0.25, 'sawtooth', 0.28);
    setTimeout(() => this._playTone(160, 0.35, 'sawtooth', 0.22), 90);
  }
}
