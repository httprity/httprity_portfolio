import { useEffect, type ComponentType } from 'react';
import { Link, useParams } from 'react-router-dom';
import { caseStudyOutline, projects } from '../data/portfolio';
import { AsciiDivider } from '../components/AsciiDivider';
import { BikolpoCase } from './case/bikolpo/BikolpoCase';
import './ProjectPage.css';

/** Projects with a written case study render their own page. */
const cases: Record<string, ComponentType> = {
  bikolpo: BikolpoCase,
};

/**
 * Project detail route. Projects with a case study render it; the rest show
 * the header from data plus the intended outline — clearly marked.
 */
export function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const idx = projects.findIndex((p) => p.slug === slug);
  const next = idx >= 0 ? projects[(idx + 1) % projects.length] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug]);

  const Case = slug ? cases[slug] : undefined;
  if (Case) return <Case />;

  if (!project) {
    return (
      <main className="container ppage">
        <p className="mono mono--muted">[404]</p>
        <h1 className="ppage__title">No project at this address.</h1>
        <Link to="/#work" className="ascii-link ppage__back">
          Back to work
        </Link>
      </main>
    );
  }

  return (
    <main className="ppage">
      <div className="container">
        <Link to="/#work" className="ascii-link ppage__back">
          Back to work
        </Link>

        <p className="mono mono--accent ppage__index">P/{project.index}</p>
        <h1 className="ppage__title">{project.name}</h1>
        <p className="ppage__summary">{project.summary}</p>
        <p className="ppage__tags mono mono--muted">{project.tags.join(' · ')}</p>
      </div>

      <AsciiDivider label="CASE STUDY / IN PROGRESS" />

      <div className="container ppage__outline">
        <p className="ppage__note">
          The full write-up for this project is in progress. It will cover:
        </p>
        <ol className="ppage__list">
          {caseStudyOutline.map((s, i) => (
            <li key={s}>
              <span className="mono mono--faint" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {next && (
        <>
          <AsciiDivider />
          <div className="container ppage__next">
            <span className="mono mono--muted">Next project</span>
            <Link to={`/work/${next.slug}`} className="ppage__next-link">
              <span className="mono mono--faint" aria-hidden="true">
                P/{next.index}
              </span>
              {next.name}
              <span aria-hidden="true"> ↗</span>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
