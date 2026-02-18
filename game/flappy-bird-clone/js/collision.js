// Collision detection — isolated module, no side effects

function _rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Returns true if player collides with any pipe rectangle
function checkPipeCollision(playerBounds, pipeBounds) {
  for (const rect of pipeBounds) {
    if (_rectsOverlap(playerBounds, rect)) return true;
  }
  return false;
}

// Returns true if player hit the ground or flew above the ceiling
function checkBoundaryCollision(playerBounds) {
  const groundY = CONFIG.CANVAS_HEIGHT - CONFIG.GROUND_HEIGHT;
  if (playerBounds.y + playerBounds.height >= groundY) return true;
  if (playerBounds.y <= 0) return true;
  return false;
}

// Returns true if the bird passed a new pipe this frame (marks it as scored)
function checkPipePassed(playerX, pipes) {
  let scored = false;
  for (const pipe of pipes) {
    if (!pipe.scored && pipe.x + CONFIG.PIPE_WIDTH < playerX) {
      pipe.scored = true;
      scored = true;
    }
  }
  return scored;
}
