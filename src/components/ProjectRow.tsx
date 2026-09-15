import { Link } from 'react-router-dom';
import type { Project } from '../data/portfolio';
import './ProjectRow.css';

type Props = {
  project: Project;
  delay?: number;
  onEnter?: (p: Project) => void;
  onLeave?: () => void;
};

export function ProjectRow({ project, delay = 0, onEnter, onLeave }: Props) {
  const titleId = `project-${project.slug}`;
  return (
    <li
      className="prow reveal"
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      onPointerEnter={() => onEnter?.(project)}
      onPointerLeave={onLeave}
    >
      <Link to={`/work/${project.slug}`} className="prow__link" aria-labelledby={titleId}>
        <span className="prow__index mono mono--muted" aria-hidden="true">
          P/{project.index}
        </span>

        <span className="prow__main">
          <span id={titleId} className="prow__name">
            {project.name}
          </span>
        </span>

        <span className="prow__aside">
          <span className="prow__summary">{project.summary}</span>
          <span className="prow__tags mono mono--faint">
            {project.tags.map((t, i) => (
              <span key={t}>
                {i > 0 && <span aria-hidden="true"> · </span>}
                {t}
              </span>
            ))}
          </span>
        </span>

        <span className="prow__cta ascii-link" aria-hidden="true">
          {project.cta} ↗
        </span>
      </Link>
    </li>
  );
}
