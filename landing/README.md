# MVPBot Landing Page

Static marketing landing page for **MVPBot** — an AI platform to launch startups in 14 days.

---

## Quick Start

Open `index.html` directly in any modern browser — no build step required.

```bash
# Optional: local dev server for module support (avoids CORS on file://)
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

> **Note:** Because the JS uses ES modules (`type="module"`), opening `index.html` via `file://` may trigger CORS errors in some browsers. Use a local server (see above) for full functionality.

---

## Project Structure

```
/
├── index.html              # Main landing page (all sections)
├── css/
│   └── styles.css          # All styles, CSS variables, responsive layout
├── js/
│   ├── main.js             # Entry point — imports and initializes modules
│   ├── animations.js       # GSAP scroll animations, hero entrance, FAQ accordion
│   ├── forms.js            # Lead form validation, submission, success modal
│   └── utils.js            # Token calculation, helpers (TOKEN_PRICE_RUB)
├── assets/
│   ├── images/             # Static images
│   ├── illustrations/      # SVG illustrations
│   ├── lottie/             # Lottie animation JSON files
│   └── fonts/              # Self-hosted fonts (optional)
└── README.md
```

---

## Swapping the Form Endpoint

The lead form currently falls back to a demo mode if the endpoint is unconfigured. To connect a real backend:

1. Open `js/forms.js`.
2. Find the `FORM_ENDPOINT` constant near the top of the file.
3. Replace the value with your endpoint:

   **Formspree:**
   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```

   **Netlify Forms:** add `netlify` attribute to `<form id="lead-form">` in `index.html` and set:
   ```js
   const FORM_ENDPOINT = '/'; // Netlify handles it automatically
   ```

   **Custom API:**
   ```js
   const FORM_ENDPOINT = 'https://your-api.com/api/leads';
   ```

4. Remove or adjust the demo-mode fallback `catch` block in `handleSubmit()` if desired.

---

## Swapping the Hero Illustration (Lottie)

The hero currently uses an inline SVG diagram. To use a Lottie animation:

1. Add your Lottie JSON to `assets/lottie/hero.json`.
2. In `index.html`, replace the `<svg class="hero-svg-scene">` block with:
   ```html
   <div id="hero-lottie" style="width:100%;max-width:500px;aspect-ratio:1;"></div>
   ```
3. Add the Lottie CDN script before the closing `</body>`:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js" defer></script>
   ```
4. In `js/animations.js`, inside `initAnimations()`, add:
   ```js
   if (typeof lottie !== 'undefined') {
     lottie.loadAnimation({
       container: document.getElementById('hero-lottie'),
       renderer: 'svg',
       loop: true,
       autoplay: true,
       path: 'assets/lottie/hero.json',
     });
   }
   ```

---

## Token Pricing

The token calculation is driven by a single constant in `js/utils.js`:

```js
export const TOKEN_PRICE_RUB = 0.33;
```

Change this value and the pricing card will recalculate automatically on page load (`renderTokenCalc()` is called in `main.js`).

---

## Color Palette

All colors are CSS custom properties in `css/styles.css`:

| Variable        | Value     | Usage                  |
|-----------------|-----------|------------------------|
| `--bg`          | `#0f1720` | Page background        |
| `--surface`     | `#0b1220` | Section backgrounds    |
| `--green-700`   | `#0f8b5f` | Primary green          |
| `--green-500`   | `#2dd4bf` | Accent / teal          |
| `--green-300`   | `#7ee7c6` | Light accents          |
| `--muted`       | `#94a3b8` | Body / secondary text  |

---

## Libraries (loaded via CDN)

| Library          | Purpose                  | Version |
|------------------|--------------------------|---------|
| GSAP             | Animations               | 3.12.5  |
| ScrollTrigger    | Scroll-driven animations | 3.12.5  |

All other functionality (FAQ accordion, mobile nav, form handling) is vanilla JS.

---

## Accessibility

- Semantic HTML5 elements (`header`, `nav`, `main`, `section`, `article`, `footer`).
- ARIA roles and attributes on interactive elements.
- Focus trap inside the success modal; `Esc` key closes it.
- All animations respect `prefers-reduced-motion`.
- `:focus-visible` styles for keyboard navigation.

---

## Browser Support

Modern browsers (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+). No IE support.
