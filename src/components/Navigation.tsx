import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { identity, nav } from '../data/portfolio';
import './Navigation.css';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  // Anchor links must resolve back to the home page from /work/*.
  const href = (hash: string) => (onHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`nav ${scrolled || open ? 'is-scrolled' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label={`${identity.name} — home`}>
          <span className="nav__mark mono" aria-hidden="true">
            {identity.mark}/
          </span>
          <span className="nav__name">{identity.name}</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={href(item.href)} className="nav__link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="nav__toggle mono"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
          <span aria-hidden="true">{open ? ' ×' : ' +'}</span>
        </button>
      </div>

      <nav id="mobile-menu" className="nav__mobile" aria-label="Primary (mobile)" hidden={!open}>
        <ul className="container">
          {nav.map((item, i) => (
            <li key={item.href}>
              <a href={href(item.href)} className="nav__mobile-link" onClick={() => setOpen(false)}>
                <span className="mono mono--faint" aria-hidden="true">
                  0{i + 1}
                </span>
                {item.label}
                <span className="nav__mobile-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
