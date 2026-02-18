// Centralized input system — all event listeners registered exactly once

class Input {
  constructor() {
    this._flapCallback = null;
    this._lastFlapTime = 0;
    this._COOLDOWN_MS = 150;
    this._bound = false;
  }

  // Register a single flap handler (replaces any previous)
  onFlap(callback) {
    this._flapCallback = callback;
    if (!this._bound) {
      this._bindListeners();
      this._bound = true;
    }
  }

  _bindListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this._triggerFlap();
      }
    });

    document.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this._triggerFlap();
    });

    document.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._triggerFlap();
    }, { passive: false });
  }

  _triggerFlap() {
    const now = performance.now();
    if (now - this._lastFlapTime < this._COOLDOWN_MS) return;
    this._lastFlapTime = now;
    if (this._flapCallback) this._flapCallback();
  }
}
