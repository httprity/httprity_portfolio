# Portfolio — Samprity Haque

Vite + React 19 + TypeScript. Plain CSS with design tokens (no Tailwind), react-router only for `/work/:slug`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run typecheck
```

## Where things live

| What | Where |
| --- | --- |
| **All copy & data** (identity, nav, expertise, projects, experience, achievements, about, contact, socials) | `src/data/portfolio.ts` |
| Design tokens, type scale, primitives (`.mono`, `.ascii-link`, `.btn`, `.reveal`) | `src/styles/global.css` |
| Halftone portrait renderer + tuning knobs | `src/components/HalftonePortrait.tsx` |
| Landing page composition | `src/pages/Home.tsx` |
| Project detail route (outline only for now) | `src/pages/ProjectPage.tsx` |
| Portrait source image | `public/portrait.jpg` |

## TODO before publishing

- [ ] `src/data/portfolio.ts` → `socials`: replace the three `TODO` hrefs (GitHub, LinkedIn, mailto).
- [ ] Add project preview images to `public/work/<slug>.jpg` and set `image` on each project (the floating hover preview falls back to a numbered placeholder until then).
- [ ] Write the case studies — `ProjectPage` currently shows the intended outline, clearly labelled "in progress".

## Tuning the halftone

Everything is in the `HALFTONE` constant at the top of `HalftonePortrait.tsx`:

| Knob | Effect |
| --- | --- |
| `DOT_SPACING` / `DOT_SPACING_MOBILE` | Distance between dot centres (CSS px). Smaller = finer screen. |
| `MAX_RADIUS` | Dot radius at white as a fraction of spacing. `0.5` = dots just touch; `>0.5` = highlights fuse solid. |
| `LEVELS.BLACK` / `LEVELS.WHITE` | Black/white points. Raise `BLACK` to crush the grey background into empty paper; lower it to recover hair sheen. |
| `CONTRAST`, `GAMMA` | Tone curve after levels. |
| `THRESHOLD` | Luminance below which no dot is drawn. |
| `ZOOM`, `FOCAL` | Crop: `ZOOM` 1 = object-fit cover; `FOCAL` picks the anchor point (0–1). |
| `STAGGER` | Offset alternate rows (print-like) vs strict pixel grid. |
| `CURSOR_RADIUS`, `CURSOR_STRENGTH` | Pointer-proximity effect (desktop only, off under `prefers-reduced-motion`). |

Renderer notes: one `<canvas>`, sampled once per resize (ResizeObserver), DPR capped at 2, column count capped at `MAX_SAMPLE_COLS`. It only animates during the initial reveal and while the cursor is over it. If `portrait.jpg` is missing, a dither field with a visible note is rendered instead.

## Gotcha

`D:\postcss.config.mjs` (a stray file in the parent directory) is ignored via `css.postcss` in `vite.config.ts`. Don't remove that line.
