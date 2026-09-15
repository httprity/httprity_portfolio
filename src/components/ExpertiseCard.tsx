import { useId, useState } from 'react';
import type { Expertise } from '../data/portfolio';
import './ExpertiseCard.css';

/**
 * Minimal at rest: index, title, ↗.
 * Desktop (hover-capable): details fade in on hover / focus.
 * Touch: the header is a button that expands the details in-flow.
 * The button works everywhere, so keyboard users never depend on hover.
 */
export function ExpertiseCard({ item, delay = 0 }: { item: Expertise; delay?: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article
      className="xcard reveal"
      data-open={open}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      <button
        type="button"
        className="xcard__head"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="xcard__index mono mono--muted" aria-hidden="true">
          {item.index}
        </span>
        <span className="xcard__title">
          <span className="sr-only">{item.index}. </span>
          {item.title}
        </span>
        <span className="xcard__arrow" aria-hidden="true">
          ↗
        </span>
      </button>

      <div id={panelId} className="xcard__panel">
        <div className="xcard__clip">
          <dl className="xcard__list">
          {item.capabilities.map((c) => (
            <div key={c.title} className="xcard__cap">
              <dt>{c.title}</dt>
              <dd>{c.detail}</dd>
            </div>
          ))}
          </dl>
        </div>
      </div>
    </article>
  );
}
