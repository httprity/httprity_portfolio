import { useEffect, useRef, useState } from 'react';
import { useCanHover, useReducedMotion } from '../hooks/useMediaQuery';
import './HalftonePortrait.css';

/** Soft, shadow-preserving pink ASCII screen, sampled from the original photo. */
export const HALFTONE = {
  DOT_SPACING: 2.8, DOT_SPACING_MOBILE: 2.4, REVEAL_MS: 1300,
} as const;
type Status = 'loading' | 'ready' | 'missing';
type Props = {
  src: string; alt: string; className?: string; mode?: 'ascii' | 'pixels';
  onGrid?: (grid: { cols: number; rows: number }) => void;
};
type Grid = { cols: number; rows: number; spacing: number; lum: Float32Array; alpha: Float32Array };
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
function sampleImage(img: HTMLImageElement, mask: HTMLImageElement, width: number, height: number, spacing: number): Grid {
  const cols = Math.min(260, Math.max(1, Math.round(width / spacing)));
  const cell = width / cols;
  const rows = Math.max(1, Math.round(height / cell));
  const off = document.createElement('canvas');
  off.width = cols; off.height = rows;
  const ctx = off.getContext('2d', { willReadFrequently: true })!;
  // Keep the whole hair silhouette: trim only the unused space above the head.
  const sourceY = img.naturalHeight * 0.17;
  const sourceH = img.naturalHeight * 0.83;
  const scale = Math.max(cols / img.naturalWidth, rows / sourceH);
  const sw = cols / scale, sh = rows / scale;
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, sourceY, sw, sh, 0, 0, cols, rows);
  const { data } = ctx.getImageData(0, 0, cols, rows);
  // The generated key supplies only the silhouette; all facial pixels stay original.
  ctx.clearRect(0, 0, cols, rows);
  ctx.drawImage(mask, (img.naturalWidth - sw) / 2 / img.naturalWidth * mask.naturalWidth,
    sourceY / img.naturalHeight * mask.naturalHeight,
    sw / img.naturalWidth * mask.naturalWidth, sh / img.naturalHeight * mask.naturalHeight,
    0, 0, cols, rows);
  const key = ctx.getImageData(0, 0, cols, rows).data;
  const alpha = new Float32Array(cols * rows);
  for (let i = 0; i < alpha.length; i++) {
    const green = key[i * 4 + 1] - Math.max(key[i * 4], key[i * 4 + 2]);
    alpha[i] = green > 25 ? 0 : 1;
  }
  const raw = new Float32Array(cols * rows);
  for (let i = 0; i < raw.length; i++) raw[i] = data[i * 4] / 255;
  const lum = new Float32Array(raw.length);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const i = y * cols + x;
    const avg = (raw[y * cols + Math.max(0, x - 1)] + raw[y * cols + Math.min(cols - 1, x + 1)] + raw[Math.max(0, y - 1) * cols + x] + raw[Math.min(rows - 1, y + 1) * cols + x]) / 4;
    // Lift black hair without clipping it; retain local strands and facial edges.
    lum[i] = clamp01(Math.pow(raw[i], 0.64) + (raw[i] - avg) * 0.65);
  }
  return { cols, rows, spacing: cell, lum, alpha };
}
type RenderOpts = { progress: number; cursor: { x: number; y: number; strength: number } | null; mode: 'ascii' | 'pixels' };
function render(ctx: CanvasRenderingContext2D, grid: Grid, dpr: number, opts: RenderOpts) {
  const { cols, rows, spacing, lum, alpha } = grid;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cols * spacing, rows * spacing);
  ctx.font = 'bold ' + (spacing * 1.45) + 'px monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const chars = '.:;=+x#%@';
  for (let y = 0; y < rows; y++) {
    const reveal = clamp01(opts.progress * 1.4 - y / rows * 0.4);
    for (let x = 0; x < cols; x++) {
      if (!alpha[y * cols + x]) continue;
      const cx = (x + 0.5) * spacing, cy = (y + 0.5) * spacing;
      const c = opts.cursor;
      const glow = c ? Math.max(0, 1 - Math.hypot(cx - c.x, cy - c.y) / 100) * c.strength : 0;
      const v = clamp01(lum[y * cols + x] + glow * 0.1);
      // Empty shadows and gaps are genuinely transparent, never a colored tile.
      const opacity = clamp01(Math.pow(v, 0.7) * 1.3) * reveal;
      if (opacity < 0.035) continue;
      const bottomFade = clamp01((1 - y / rows) / 0.09);
      ctx.fillStyle = 'rgb(255 172 188 / ' + (opacity * bottomFade) + ')';
      if (opts.mode === 'pixels') {
        ctx.fillRect(x * spacing, y * spacing, spacing - 0.8, spacing - 0.8);
      } else {
        ctx.fillText(chars[Math.min(chars.length - 1, Math.floor(v * chars.length))], cx, cy);
      }
    }
  }
}

export function HalftonePortrait({ src, alt, className, onGrid, mode = 'ascii' }: Props) {
  const onGridRef = useRef(onGrid);
  onGridRef.current = onGrid;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>('loading');
  const canHover = useCanHover();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setStatus('missing');
      return;
    }

    let img: HTMLImageElement | null = null;
    let mask: HTMLImageElement | null = null;
    let grid: Grid | null = null;
    let dpr = 1;
    let raf = 0;
    let revealStart = 0;
    let progress = reducedMotion ? 1 : 0;
    const cursor = { x: 0, y: 0, strength: 0, target: 0 };
    let disposed = false;

    const paint = () => {
      if (!grid) return;
      render(ctx, grid, dpr, {
        progress, mode,
        cursor: cursor.strength > 0.001 ? cursor : null,
      });
    };

    // Only animates while something is actually changing (reveal or cursor decay).
    const tick = (t: number) => {
      raf = 0;
      if (disposed) return;
      let busy = false;
      if (progress < 1) {
        if (!revealStart) revealStart = t;
        progress = clamp01((t - revealStart) / HALFTONE.REVEAL_MS);
        busy = progress < 1;
      }
      if (Math.abs(cursor.target - cursor.strength) > 0.005) {
        cursor.strength += (cursor.target - cursor.strength) * 0.18;
        busy = true;
      } else {
        cursor.strength = cursor.target;
      }
      paint();
      if (busy) raf = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const layout = () => {
      if (!img || !mask || !img.complete || !mask.complete || !img.naturalWidth || !mask.naturalWidth) return;
      const rect = wrap.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width === 0 || height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const mobile = window.matchMedia('(max-width: 700px)').matches;
      const spacing = mobile ? HALFTONE.DOT_SPACING_MOBILE : HALFTONE.DOT_SPACING;
      grid = sampleImage(img, mask, width, height, spacing);
      onGridRef.current?.({ cols: grid.cols, rows: grid.rows });
      canvas.width = Math.round(grid.cols * grid.spacing * dpr);
      canvas.height = Math.round(grid.rows * grid.spacing * dpr);
      canvas.style.width = `${grid.cols * grid.spacing}px`;
      canvas.style.height = `${grid.rows * grid.spacing}px`;
      paint();
      if (progress < 1) schedule();
    };

    const ro = new ResizeObserver(() => layout());

    img = new Image();
    mask = new Image();
    img.decoding = mask.decoding = 'async';
    const loaded = () => {
      if (disposed || !img?.complete || !mask?.complete || !img.naturalWidth || !mask.naturalWidth) return;
      setStatus('ready'); ro.observe(wrap); layout();
    };
    img.onload = mask.onload = loaded;
    img.onerror = mask.onerror = () => !disposed && setStatus('missing');
    img.src = src;
    mask.src = '/portrait-silhouette-key.png';

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      cursor.target = 1;
      schedule();
    };
    const onLeave = () => {
      cursor.target = 0;
      schedule();
    };
    const interactive = canHover && !reducedMotion;
    if (interactive) {
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerleave', onLeave);
    }

    return () => {
      disposed = true;
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [src, canHover, reducedMotion, mode]);

  return (
    <div
      ref={wrapRef}
      className={['halftone', className, status === 'ready' ? 'is-ready' : ''].filter(Boolean).join(' ')}
      data-status={status}
    >
      <canvas ref={canvasRef} className="halftone__canvas" role="img" aria-label={alt} />
      {status === 'missing' && (
        <div className="halftone__missing" role="img" aria-label={alt}>
          <span className="mono mono--muted" aria-hidden="true">
            [PORTRAIT_01]
            <br />
            SOURCE / MISSING
            <br />
            ADD /public{src}
          </span>
        </div>
      )}
    </div>
  );
}
