# JSON Image Cleaner

A fully client-side Next.js application that validates image URLs inside a JSON file, lets you review and filter records by image status, and downloads a cleaned JSON containing only the items you select.

**No backend. No external APIs. All processing happens in your browser.**

---

## Features

- **Drag & drop** or file picker JSON upload (auto-detects root array or first nested array)
- **Automatic image URL detection** — recursively finds all HTTP(S) URLs in every record
- **Parallel image validation** — up to 8 concurrent loads with 8 s timeout per image
- **Live status cards** — `All valid`, `All broken`, `Some broken`, `No images`, `Loading`
- **Tabs** — filter by status (All, All valid, Any valid, Some broken, All broken, No images, Selected)
- **Metrics panel** — live counters, click to jump to the matching tab
- **Bulk selection** — select all on tab / any valid / all valid / none / invert
- **Export** — download selected items as a new JSON file (`json-image-cleaner-YYYYMMDD.json`)
- **Copy to clipboard** — selected items as JSON
- **Image gallery modal** — carousel with keyboard navigation (← →, Esc)
- **Full JSON modal** — formatted JSON viewer with copy button
- **Re-scan** — re-validate all images from scratch

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and drop a JSON file onto the page.

A sample file is at `public/samples/sample.json`.

---

## Build

```bash
npm run build
npm start
```

---

## Tests

Unit tests cover `findAllStrings` and `isLikelyImageUrl`:

```bash
npm test
```

---

## Project Structure

```
src/
  types/index.ts            — TypeScript interfaces
  lib/
    utils.ts                — findAllStrings, isLikelyImageUrl, helpers
    imageValidator.ts       — validateImage with semaphore concurrency limiter
    jsonParser.ts           — JSON parsing and array auto-detection
    store.tsx               — React Context + useReducer global state
  components/
    UploadPanel.tsx         — Drag & drop file upload
    MetricsPanel.tsx        — Live metric counters
    TabsBar.tsx             — Filter tabs
    ActionBar.tsx           — Bulk select + export + re-scan
    CardsGrid.tsx           — Responsive card grid (content-visibility for perf)
    CardItem.tsx            — Individual record card with thumbnails
    ModalViewer.tsx         — Full JSON viewer modal
    ImageGalleryModal.tsx   — Image carousel modal
  app/
    page.tsx                — Main page (client)
    layout.tsx              — Root layout
    globals.css             — Global styles + Tailwind
public/
  samples/sample.json       — Example JSON file
__tests__/
  utils.test.ts             — Unit tests (14 cases)
```

---

## Tech Stack

- **Next.js 16** (App Router, client-only page)
- **React 19** + TypeScript
- **Tailwind CSS v4**
- No backend, no external APIs
