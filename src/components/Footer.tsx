import { identity, socials } from '../data/portfolio';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__id">
          <span className="footer__name">{identity.name}</span>
          <span className="mono mono--muted">{identity.footerLine}</span>
        </div>

        <ul className="footer__links mono">
          {socials.map((s, i) => (
            <li key={s.label}>
              {i > 0 && (
                <span className="mono--faint" aria-hidden="true">
                  ·{' '}
                </span>
              )}
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="footer__legal mono mono--muted">
          <span>© 2026 {identity.name}</span>
          <span>Designed &amp; built by me.</span>
        </div>
      </div>
    </footer>
  );
}
