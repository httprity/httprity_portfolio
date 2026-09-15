import type { Experience } from '../data/portfolio';
import './ExperienceRow.css';

/** Restrained table row:  PERIOD | COMPANY / ROLE | description */
export function ExperienceRow({ item, delay = 0 }: { item: Experience; delay?: number }) {
  return (
    <li className="erow reveal" style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}>
      <span className="erow__period mono mono--muted">{item.period}</span>
      <span className="erow__who">
        <span className="erow__company">{item.company}</span>
        <span className="erow__role mono">{item.role}</span>
      </span>
      {item.description && <p className="erow__desc">{item.description}</p>}
    </li>
  );
}
