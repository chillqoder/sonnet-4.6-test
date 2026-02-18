// Game configuration constants — single source of truth for all tunable values

const CONFIG = {
  // Canvas logical resolution
  CANVAS_WIDTH: 360,
  CANVAS_HEIGHT: 640,

  // Physics
  GRAVITY: 1800,          // px/s²
  FLAP_VELOCITY: -520,    // px/s (upward impulse)
  MAX_FALL_VELOCITY: 650, // px/s (terminal velocity)

  // Bird
  BIRD_X: 80,             // fixed horizontal position
  BIRD_WIDTH: 36,
  BIRD_HEIGHT: 28,

  // Pipes
  PIPE_WIDTH: 65,
  PIPE_GAP: 158,          // vertical gap between top and bottom pipe
  PIPE_SPEED: 175,        // px/s
  PIPE_INTERVAL: 1.8,     // seconds between spawns
  PIPE_MIN_GAP_CENTER: 160,
  PIPE_MAX_GAP_CENTER: 430,
  PIPE_CAP_HEIGHT: 24,
  PIPE_CAP_OVERHANG: 5,

  // Ground
  GROUND_HEIGHT: 80,

  // Visual colors
  PIPE_COLOR: '#73BF2E',
  PIPE_DARK_COLOR: '#5A9E1E',
  BIRD_COLOR: '#F5C518',
  BIRD_WING_COLOR: '#D4A017',
  BIRD_EYE_COLOR: '#1a1a1a',
};
