import { useEffect, useRef } from 'react';
import type { Project } from '../data/portfolio';
import './ProjectPreview.css';

type Props = {
  project: Project | null;
  /** Element whose pointer movement the preview follows. */
  area: React.RefObject<HTMLElement | null>;
};

/**
 * Floating preview that trails the cursor over the project list (desktop only —
 * the parent mounts it only on hover-capable devices). Switching projects
 * re-runs a short dither→image transition. Purely decorative: aria-hidden.
 */
export function ProjectPreview({ project, area }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = area.current;
    if (!el || !host) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    let primed = false;

    const GAP = 28;
    const tick = () => {
      raf = 0;
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      // anchor the card up-right of the pointer; flip when it would leave the viewport
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = pos.x + GAP + w > innerWidth ? pos.x - GAP - w : pos.x + GAP;
      const y = pos.y - GAP - h < 72 ? pos.y + GAP : pos.y - GAP - h;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(target.x - pos.x) > 0.3 || Math.abs(target.y - pos.y) > 0.3) {
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!primed) {
        // first contact: snap instead of flying in from (0,0)
        pos.x = target.x;
        pos.y = target.y;
        primed = true;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    host.addEventListener('pointermove', onMove);
    return () => {
      host.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [area]);

  return (
    <div ref={ref} className={`ppreview ${project ? 'is-visible' : ''}`} aria-hidden="true">
      {project && (
        <div className="ppreview__card" key={project.slug}>
          {project.image ? (
            <img src={project.image} alt="" loading="lazy" decoding="async" className="ppreview__img" />
          ) : (
            <div className="ppreview__placeholder">
              <span className="ppreview__big mono">{project.index}</span>
              <span className="mono mono--muted">{project.name}</span>
            </div>
          )}
          <span className="ppreview__dots" />
        </div>
      )}
    </div>
  );
}
