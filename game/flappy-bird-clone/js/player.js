// Bird physics and rendering — movement logic only

class Player {
  constructor() {
    this.x = CONFIG.BIRD_X;
    this.y = CONFIG.CANVAS_HEIGHT / 2;
    this.velocityY = 0;
    this.width = CONFIG.BIRD_WIDTH;
    this.height = CONFIG.BIRD_HEIGHT;
    this.rotation = 0;     // radians, positive = nose down
    this._wingOffset = 0;  // wing animation
    this._wingDir = 1;
  }

  reset() {
    this.x = CONFIG.BIRD_X;
    this.y = CONFIG.CANVAS_HEIGHT / 2;
    this.velocityY = 0;
    this.rotation = 0;
    this._wingOffset = 0;
  }

  flap() {
    this.velocityY = CONFIG.FLAP_VELOCITY;
    this.rotation = -0.35; // tilt upward on flap
  }

  update(dt) {
    // Euler integration
    this.velocityY += CONFIG.GRAVITY * dt;
    this.velocityY = Math.min(this.velocityY, CONFIG.MAX_FALL_VELOCITY);
    this.y += this.velocityY * dt;

    // Smoothly rotate nose toward velocity direction
    const targetRot = (this.velocityY / CONFIG.MAX_FALL_VELOCITY) * (Math.PI * 0.55);
    this.rotation += (targetRot - this.rotation) * 0.14;

    // Wing flap animation
    this._wingOffset += this._wingDir * dt * 9;
    if (Math.abs(this._wingOffset) > 0.45) this._wingDir *= -1;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const w = this.width;
    const h = this.height;

    // Wing (behind body)
    ctx.fillStyle = CONFIG.BIRD_WING_COLOR;
    ctx.beginPath();
    ctx.ellipse(-4, this._wingOffset * 9, w * 0.3, h * 0.22, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = CONFIG.BIRD_COLOR;
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye white
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w * 0.22, -h * 0.18, 7, 0, Math.PI * 2);
    ctx.fill();

    // Eye pupil
    ctx.fillStyle = CONFIG.BIRD_EYE_COLOR;
    ctx.beginPath();
    ctx.arc(w * 0.22 + 1.5, -h * 0.18, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#F5A623';
    ctx.beginPath();
    ctx.moveTo(w * 0.48, -2);
    ctx.lineTo(w * 0.48 + 11, -4);
    ctx.lineTo(w * 0.48 + 11, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Slightly inset bounds for forgiving collision
  getBounds() {
    const m = 5;
    return {
      x: this.x - this.width / 2 + m,
      y: this.y - this.height / 2 + m,
      width: this.width - m * 2,
      height: this.height - m * 2,
    };
  }
}
