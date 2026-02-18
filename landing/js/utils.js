/**
 * utils.js — Shared utilities for MVPBot landing
 */

// ── Token Pricing ──────────────────────────────────────────────────────────
export const TOKEN_PRICE_RUB = 0.33;

/**
 * Calculate how many tokens a given ruble amount buys.
 * @param {number} rubles
 * @returns {number}
 */
export function calcTokens(rubles) {
  return Math.floor(rubles / TOKEN_PRICE_RUB);
}

/**
 * Format a number with thin-space thousands separator (Russian style).
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
  return n.toLocaleString('ru-RU');
}

// ── DOM helpers ────────────────────────────────────────────────────────────
export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function $$(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

// ── Reduced motion ─────────────────────────────────────────────────────────
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── Debounce ───────────────────────────────────────────────────────────────
export function debounce(fn, ms = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ── Inject token calculation into pricing card ─────────────────────────────
export function renderTokenCalc() {
  const tokenAmount = 990;
  const tokens = calcTokens(tokenAmount);
  const el = document.getElementById('token-calc');
  if (el) {
    el.textContent = `${formatNumber(tokenAmount)} ₽ ÷ ${TOKEN_PRICE_RUB} ₽ = ${formatNumber(tokens)} токенов`;
  }
}
