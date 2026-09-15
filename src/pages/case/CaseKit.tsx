import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/portfolio';
import { AsciiDivider } from '../../components/AsciiDivider';
import './Case.css';

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */

type HeaderProps = {
  index: string;
  name: string;
  aside?: string;
  tagline: string;
  tags: readonly string[];
  hero: string;
  heroAlt: string;
  meta: readonly { k: string; v: string }[];
};

export function CaseHeader({ index, name, aside, tagline, tags, hero, heroAlt, meta }: HeaderProps) {
  return (
    <header className="case-head">
      <div className="container">
        <Link to="/#work" className="ascii-link case-back">
          Back to work
        </Link>

        <div className="case-head__grid">
          <div>
            <p className="mono mono--accent">P/{index}</p>
            <h1 className="case-title">
              {name}
              {aside && (
                <span className="case-title__aside" lang="bn">
                  {aside}
                </span>
              )}
            </h1>
          </div>
          <div className="case-head__right">
            <p className="case-tagline">{tagline}</p>
            <p className="mono mono--muted case-tags">{tags.join(' · ')}</p>
          </div>
        </div>

        <figure className="case-hero">
          <span className="case-corner case-corner--tl" aria-hidden="true">+</span>
          <span className="case-corner case-corner--tr" aria-hidden="true">+</span>
          <span className="case-corner case-corner--bl" aria-hidden="true">+</span>
          <span className="case-corner case-corner--br" aria-hidden="true">+</span>
          <img src={hero} alt={heroAlt} decoding="async" fetchPriority="high" />
        </figure>

        <dl className="case-meta">
          {meta.map((m) => (
            <div key={m.k} className="case-meta__item">
              <dt className="mono mono--muted">{m.k}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

type SectionProps = {
  index: string;
  label: string;
  heading?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  wide?: boolean;
  id?: string;
};

export function CaseSection({ index, label, heading, intro, children, wide, id }: SectionProps) {
  return (
    <>
      <AsciiDivider />
      <section className="case-section" id={id} aria-labelledby={heading ? `${id ?? index}-h` : undefined}>
        <div className="container">
          <div className={`case-section__grid ${wide ? 'case-section__grid--wide' : ''}`}>
            <div className="case-section__label mono">
              <span className="mono--accent" aria-hidden="true">
                [{index}]
              </span>
              <span>{label}</span>
              <span className="mono--faint case-section__rule" aria-hidden="true">
                ////////////
              </span>
            </div>
            <div className="case-section__body">
              {heading && (
                <h2 id={`${id ?? index}-h`} className="case-h2">
                  {heading}
                </h2>
              )}
              {intro && <div className="case-intro">{intro}</div>}
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Small primitives                                                     */
/* ------------------------------------------------------------------ */

export function Glance({ items }: { items: readonly { value: string; label: string }[] }) {
  return (
    <ul className="glance" aria-label="At a glance">
      {items.map((g) => (
        <li key={g.label}>
          <span className="glance__value">{g.value}</span>
          <span className="glance__label">{g.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function Stack({ groups }: { groups: readonly { group: string; items: readonly string[]; note: string }[] }) {
  return (
    <div className="stack">
      {groups.map((g, i) => (
        <div key={g.group} className="stack__row">
          <div className="stack__group">
            <span className="mono mono--faint" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{g.group}</h3>
          </div>
          <ul className="stack__items">
            {g.items.map((it) => (
              <li key={it} className="stack__chip mono">
                {it}
              </li>
            ))}
          </ul>
          <p className="stack__note">{g.note}</p>
        </div>
      ))}
    </div>
  );
}

export function Points({ items, columns = 2 }: { items: readonly (readonly [string, string])[]; columns?: 1 | 2 | 3 }) {
  return (
    <ul className={`points points--${columns}`}>
      {items.map(([t, d], i) => (
        <li key={t}>
          <span className="mono mono--faint" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{t}</h3>
          <p>{d}</p>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="callout">
      <span className="callout__mark" aria-hidden="true">
        ::
      </span>
      <div>
        <h3 className="callout__title">{title}</h3>
        <div className="callout__body">{children}</div>
      </div>
    </aside>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose">{children}</div>;
}

export function NextProject({ slug }: { slug: string }) {
  const idx = projects.findIndex((p) => p.slug === slug);
  const next = idx >= 0 ? projects[(idx + 1) % projects.length] : null;
  if (!next) return null;
  return (
    <>
      <AsciiDivider />
      <div className="container case-next">
        <span className="mono mono--muted">Next project</span>
        <Link to={`/work/${next.slug}`} className="case-next__link">
          <span className="mono mono--faint" aria-hidden="true">
            P/{next.index}
          </span>
          {next.name}
          <span aria-hidden="true"> ↗</span>
        </Link>
        <p className="case-next__summary">{next.summary}</p>
      </div>
    </>
  );
}
