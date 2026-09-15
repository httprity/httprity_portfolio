import type { Achievement } from '../data/portfolio';
import './AchievementCard.css';

/**
 * [ 01 ]
 * 2ND
 * RUNNER-UP
 * ----
 * IUT 12TH ICT FEST · GAMEJAM
 */
export function AchievementCard({ item, delay = 0 }: { item: Achievement; delay?: number }) {
  return (
    <li className="acard reveal" style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}>
      <span className="acard__index mono mono--muted" aria-hidden="true">
        [ {item.index} ]
      </span>
      <span className="acard__result">
        {item.result.map((line, i) => (
          <span key={i} className="acard__line">
            {line}
          </span>
        ))}
      </span>
      <span className="acard__meta mono">
        <span className="acard__event">{item.event}</span>
        {item.category && <span className="acard__cat mono--muted">{item.category}</span>}
      </span>
    </li>
  );
}
