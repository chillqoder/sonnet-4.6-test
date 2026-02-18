/**
 * main.js — Entry point for MVPBot landing page
 */

import { initAnimations } from './animations.js';
import { initForms } from './forms.js';
import { renderTokenCalc } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  renderTokenCalc();
  initForms();
  initAnimations();
});
