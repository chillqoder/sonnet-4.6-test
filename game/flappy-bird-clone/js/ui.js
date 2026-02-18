// UI rendering — all Russian text lives here

class UI {
  drawStartScreen(ctx) {
    const W = CONFIG.CANVAS_WIDTH;
    const H = CONFIG.CANVAS_HEIGHT;

    // Dimmed overlay
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.fillRect(0, 0, W, H);

    // Title panel
    this._drawPanel(ctx, W / 2 - 145, 190, 290, 110, 'rgba(0,0,0,0.45)', '#fff');

    // Title text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFE566';
    ctx.strokeStyle = '#7B4B00';
    ctx.lineWidth = 4;
    ctx.font = 'bold 46px "Arial Black", Arial, sans-serif';
    ctx.strokeText('FLAPPY BIRD', W / 2, 248);
    ctx.fillText('FLAPPY BIRD', W / 2, 248);

    // Subtitle (Russian)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 3;
    ctx.font = 'bold 21px Arial, sans-serif';
    ctx.strokeText('Нажмите чтобы начать', W / 2, 355);
    ctx.fillText('Нажмите чтобы начать', W / 2, 355);

    // Controls hint
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = '15px Arial, sans-serif';
    ctx.lineWidth = 2;
    ctx.strokeText('Пробел  /  Клик  /  Касание', W / 2, 385);
    ctx.fillText('Пробел  /  Клик  /  Касание', W / 2, 385);

    ctx.textAlign = 'left';
  }

  drawHUD(ctx, score) {
    // Score centered at top
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px "Arial Black", Arial, sans-serif';
    ctx.strokeStyle = '#00000088';
    ctx.lineWidth = 5;
    ctx.strokeText(String(score), CONFIG.CANVAS_WIDTH / 2, 62);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(score), CONFIG.CANVAS_WIDTH / 2, 62);
    ctx.textAlign = 'left';
  }

  drawGameOver(ctx, score, bestScore) {
    const W = CONFIG.CANVAS_WIDTH;
    const H = CONFIG.CANVAS_HEIGHT;

    // Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, W, H);

    // Result panel
    const panelW = 290;
    const panelH = 230;
    const panelX = (W - panelW) / 2;
    const panelY = H / 2 - panelH / 2 - 20;

    this._drawPanel(ctx, panelX, panelY, panelW, panelH, '#F5D66B', '#8B6914');

    // "Игра окончена"
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5C3D11';
    ctx.font = 'bold 28px "Arial Black", Arial, sans-serif';
    ctx.fillText('Игра окончена', W / 2, panelY + 52);

    // Divider
    ctx.strokeStyle = 'rgba(139,105,20,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 20, panelY + 68);
    ctx.lineTo(panelX + panelW - 20, panelY + 68);
    ctx.stroke();

    // Score row
    ctx.fillStyle = '#3A2500';
    ctx.font = '19px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Счёт', panelX + 28, panelY + 102);
    ctx.textAlign = 'right';
    ctx.font = 'bold 19px Arial, sans-serif';
    ctx.fillText(String(score), panelX + panelW - 28, panelY + 102);

    // Best score row
    ctx.font = '19px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Рекорд', panelX + 28, panelY + 132);
    ctx.textAlign = 'right';
    ctx.font = 'bold 19px Arial, sans-serif';
    ctx.fillStyle = score >= bestScore && score > 0 ? '#CC2200' : '#3A2500';
    ctx.fillText(String(bestScore), panelX + panelW - 28, panelY + 132);

    // Restart button
    const btnW = 180;
    const btnH = 46;
    const btnX = W / 2 - btnW / 2;
    const btnY = panelY + panelH - 65;

    this._drawPanel(ctx, btnX, btnY, btnW, btnH, '#4CAF50', '#2E7D32');

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px "Arial Black", Arial, sans-serif';
    ctx.fillText('Рестарт', W / 2, btnY + 31);

    ctx.textAlign = 'left';
  }

  _drawPanel(ctx, x, y, w, h, fill, stroke) {
    const r = 14;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }
}
