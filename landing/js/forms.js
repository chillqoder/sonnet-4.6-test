/**
 * forms.js — Lead capture form logic for MVPBot landing
 *
 * To change the form endpoint, update FORM_ENDPOINT below.
 * Default uses Formspree — replace the hash with your Formspree form id.
 * See README.md for full instructions.
 */

// ── Config ─────────────────────────────────────────────────────────────────
// CHANGE THIS to your actual endpoint (Formspree, Netlify Forms, custom API, etc.)
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

// ── Modal helpers ──────────────────────────────────────────────────────────
function openSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (!modal) return;
  modal.removeAttribute('hidden');
  modal.setAttribute('aria-hidden', 'false');
  modal.focus();

  // Focus trap
  trapFocus(modal);
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  modal.setAttribute('aria-hidden', 'true');
}

function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  element.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') {
      closeSuccessModal();
      element.removeEventListener('keydown', handler);
    }
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
}

// ── Validation ─────────────────────────────────────────────────────────────
function validateForm(form) {
  let valid = true;

  // Clear previous errors
  form.querySelectorAll('.field-error').forEach(el => el.textContent = '');

  const name = form.querySelector('[name="name"]');
  const email = form.querySelector('[name="email"]');
  const idea = form.querySelector('[name="idea"]');
  const consent = form.querySelector('[name="consent"]');

  if (!name.value.trim()) {
    showError(name, 'Пожалуйста, введите ваше имя');
    valid = false;
  }

  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(email, 'Введите корректный email адрес');
    valid = false;
  }

  if (!idea.value.trim()) {
    showError(idea, 'Опишите вашу идею кратко');
    valid = false;
  }

  if (!consent.checked) {
    showError(consent, 'Необходимо ваше согласие');
    valid = false;
  }

  return valid;
}

function showError(field, message) {
  const errorEl = field.parentElement.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = message;
  }
  field.classList.add('input-error');
  field.addEventListener('input', () => {
    field.classList.remove('input-error');
    if (errorEl) errorEl.textContent = '';
  }, { once: true });
}

// ── Form submission ────────────────────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!validateForm(form)) return;

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  const data = {
    name: form.querySelector('[name="name"]').value.trim(),
    email: form.querySelector('[name="email"]').value.trim(),
    idea: form.querySelector('[name="idea"]').value.trim(),
  };

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      form.reset();
      openSuccessModal();
    } else {
      throw new Error('Server error');
    }
  } catch {
    // Fallback: show success anyway in demo mode (remove in production)
    console.warn('Form endpoint not configured — showing success modal in demo mode.');
    form.reset();
    openSuccessModal();
  } finally {
    btn.disabled = false;
    btn.textContent = 'Получить план запуска';
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
export function initForms() {
  const form = document.getElementById('lead-form');
  if (form) form.addEventListener('submit', handleSubmit);

  // Modal close button
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeSuccessModal);

  // Close on backdrop click
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSuccessModal();
    });
  }
}
