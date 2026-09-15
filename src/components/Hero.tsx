import { identity } from '../data/portfolio';
import { HalftonePortrait } from './HalftonePortrait';
import './Hero.css';

export function Hero() {
  const [headlineStart, headlineEnd] = identity.headline.split('experiences');

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero__grid">
        <p className="hero__eyebrow mono mono--accent reveal">{identity.eyebrow}</p>

        <h1 id="hero-heading" className="hero__title reveal" style={{ '--reveal-delay': '60ms' } as React.CSSProperties}>
          {headlineStart}<a
            className="hero__highlight"
            href="#work"
            title="Explore my work"
            onPointerMove={(event) => {
              if (event.pointerType !== 'mouse') return;
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty('--highlight-x', ((event.clientX - rect.left) / rect.width * 100) + '%');
            }}
            onPointerLeave={(event) => event.currentTarget.style.removeProperty('--highlight-x')}
          ><span>experiences{headlineEnd}</span></a>
        </h1>

        <figure className="hero__portrait reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
          <div className="hero__frame">
            <HalftonePortrait src={identity.portrait.src} alt={identity.portrait.alt} />
          </div>
          <figcaption className="hero__caption mono mono--muted">
            {identity.supporting}
          </figcaption>
        </figure>

        <div className="hero__body reveal" style={{ '--reveal-delay': '140ms' } as React.CSSProperties}>
          <p className="hero__lede">{identity.body}</p>
          <div className="hero__ctas">
            <a href={identity.primaryCta.href} className="btn btn--primary">
              {identity.primaryCta.label}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a href={identity.secondaryCta.href} className="btn btn--ghost">
              {identity.secondaryCta.label}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
