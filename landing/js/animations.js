/**
 * animations.js — GSAP ScrollTrigger + hero animations for MVPBot landing
 *
 * To swap the hero Lottie illustration, replace the SVG/canvas in index.html
 * with a <div id="hero-lottie"> and call lottie.loadAnimation() below.
 * See README.md for Lottie setup instructions.
 */

import { prefersReducedMotion } from './utils.js';

// ── Header scroll state ────────────────────────────────────────────────────
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Mobile nav toggle ──────────────────────────────────────────────────────
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('is-open', !open);
  });

  // Close on nav link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  });
}

// ── Hero entrance ──────────────────────────────────────────────────────────
function initHeroAnimation(gsap) {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero__tag', { opacity: 0, y: 20, duration: 0.5 })
    .from('.hero__title', { opacity: 0, y: 30, duration: 0.7 }, '-=0.2')
    .from('.hero__subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.hero__features', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
    .from('.hero__ctas', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('.hero__visual', { opacity: 0, x: 40, duration: 0.9 }, '-=0.7');
}

// ── Hero illustration orbit animation ─────────────────────────────────────
function initHeroOrbit(gsap) {
  if (prefersReducedMotion()) return;

  const orbitItems = document.querySelectorAll('.orbit-item');
  orbitItems.forEach((item, i) => {
    gsap.to(item, {
      rotation: 360,
      duration: 12 + i * 3,
      repeat: -1,
      ease: 'none',
      transformOrigin: `${50 + (i % 2 === 0 ? 80 : 110)}px center`,
    });
  });

  // Floating glow
  gsap.to('.hero-glow', {
    scale: 1.15,
    opacity: 0.7,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

// ── Scroll-triggered section animations ───────────────────────────────────
function initScrollAnimations(gsap, ScrollTrigger) {
  if (prefersReducedMotion()) return;

  // Generic fade-up for AOS-like elements
  gsap.utils.toArray('[data-anim]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay,
      ease: 'power2.out',
    });
  });

  // Feature cards stagger
  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length) {
    gsap.from(featureCards, {
      scrollTrigger: {
        trigger: '.features__grid',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }

  // Timeline cards stagger
  const timelineCards = document.querySelectorAll('.timeline-card');
  if (timelineCards.length) {
    gsap.from(timelineCards, {
      scrollTrigger: {
        trigger: '.timeline__track',
        start: 'top 80%',
      },
      opacity: 0,
      y: 60,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power2.out',
    });
  }

  // Pricing cards
  const pricingCards = document.querySelectorAll('.pricing-card');
  if (pricingCards.length) {
    gsap.from(pricingCards, {
      scrollTrigger: {
        trigger: '.pricing__grid',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.4)',
    });
  }

  // Marketplace cards
  const marketCards = document.querySelectorAll('.market-card');
  if (marketCards.length) {
    gsap.from(marketCards, {
      scrollTrigger: {
        trigger: '.marketplace__grid',
        start: 'top 80%',
      },
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }

  // Agent cards
  const agentCards = document.querySelectorAll('.agent-card');
  if (agentCards.length) {
    gsap.from(agentCards, {
      scrollTrigger: {
        trigger: '.agents__grid',
        start: 'top 80%',
      },
      opacity: 0,
      y: 40,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out',
    });
  }
}

// ── FAQ accordion ──────────────────────────────────────────────────────────
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      // Close all
      items.forEach(i => {
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-answer').hidden = true;
        i.classList.remove('is-open');
      });
      // Open clicked (toggle)
      if (!open) {
        trigger.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        item.classList.add('is-open');
      }
    });
  });
}

// ── Smooth scroll for anchor links ─────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });
}

// ── Hero SVG float animation (CSS fallback handled in styles) ──────────────
function initSvgFloat(gsap) {
  if (prefersReducedMotion()) return;
  const svg = document.querySelector('.hero-svg-scene');
  if (!svg) return;
  gsap.to(svg, {
    y: -12,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

// ── CTA pulse ──────────────────────────────────────────────────────────────
function initCtaPulse(gsap) {
  if (prefersReducedMotion()) return;
  const cta = document.querySelector('.btn-primary.hero-cta');
  if (!cta) return;
  gsap.to(cta, {
    boxShadow: '0 0 0 10px rgba(45, 212, 191, 0)',
    duration: 1.5,
    repeat: -1,
    ease: 'power2.out',
  });
}

// ── Main init ──────────────────────────────────────────────────────────────
export function initAnimations() {
  initHeader();
  initMobileNav();
  initFaq();
  initSmoothScroll();

  // GSAP-dependent animations
  if (typeof gsap !== 'undefined') {
    initHeroAnimation(gsap);
    initHeroOrbit(gsap);
    initSvgFloat(gsap);
    initCtaPulse(gsap);

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      initScrollAnimations(gsap, ScrollTrigger);
    }
  }
}
