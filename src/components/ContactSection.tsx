import { contact, emailHref, socials } from '../data/portfolio';
import './ContactSection.css';

export function ContactSection() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-heading">
      <div className="container">
        <p className="mono mono--accent reveal">{contact.eyebrow}</p>

        <h2 id="contact-heading" className="contact__heading reveal" style={{ '--reveal-delay': '60ms' } as React.CSSProperties}>
          {contact.heading}
          <span className="contact__cursor" aria-hidden="true">
            _
          </span>
        </h2>

        <div className="contact__row reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
          <p className="contact__support">{contact.supporting}</p>
          <div className="contact__actions">
            <a href={emailHref} className="btn btn--primary">
              {contact.cta}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <ul className="contact__links">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="ascii-link"
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
