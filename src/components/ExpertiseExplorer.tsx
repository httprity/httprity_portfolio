import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { expertise } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useMediaQuery';
import './ExpertiseExplorer.css';

const symbols = ['▧', '✳', '</>', '⌖'];
const captions = ['Shape the experience', 'Make intelligence useful', 'Bring the idea to life', 'Ask better questions'];
const stages = [
  ['Interface', 'Strategy', 'Visuals', 'Research'],
  ['Train', 'Integrate', 'Generate', 'Evaluate'],
  ['Frontend', 'Components', 'AI tools', 'APIs'],
  ['Discover', 'Experiment', 'Evaluate', 'Connect'],
];

function SkillDiagram({ discipline, skill, onSelect }: { discipline: number; skill: number; onSelect: (index: number) => void }) {
  const points = [[105, 100], [315, 100], [315, 280], [105, 280]];
  return (
    <div className="expert-lab__diagram">
      <svg viewBox="0 0 420 380" aria-hidden="true">
        <defs>
          <pattern id={`lab-grid-${discipline}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".24" />
          </pattern>
        </defs>
        <rect width="420" height="380" fill={`url(#lab-grid-${discipline})`} />
        <g className="expert-lab__orbit">
          <circle cx="210" cy="190" r="132" fill="none" stroke="currentColor" strokeDasharray="2 10" opacity=".28" />
          <path d="M210 58h8M210 322h-8M78 190v8M342 190v-8" stroke="currentColor" strokeWidth="3" />
        </g>
        {points.map(([x, y], i) => <path key={i} className={`expert-lab__connection ${skill === i ? 'is-selected' : ''}`} d={`M${x} ${y} L210 190`} />)}
        {discipline === 0 && <g className="expert-lab__core">
          <rect x="150" y="139" width="120" height="100" rx="3" />
          <path d="M150 157h120M164 148h3m5 0h3m5 0h3M164 174h32v48h-32zM210 177h44m-44 12h32m-32 13h44m-44 13h25" />
          <rect className="expert-lab__pulse" x="164" y="174" width="32" height="48" fill="currentColor" opacity=".15" />
        </g>}
        {discipline === 1 && <g className="expert-lab__core">
          {[0, 1, 2].map(row => [0, 1, 2].map(col => <g key={`${row}-${col}`}>
            {col < 2 && [0, 1, 2].map(next => <path key={next} d={`M${170 + col * 40} ${154 + row * 36}L${210 + col * 40} ${154 + next * 36}`} opacity=".3" />)}
            <circle className="expert-lab__pulse" style={{ animationDelay: `${(row + col) * 180}ms` }} cx={170 + col * 40} cy={154 + row * 36} r="5" />
          </g>))}
        </g>}
        {discipline === 2 && <g className="expert-lab__core">
          <rect x="146" y="140" width="128" height="100" rx="3" />
          <path d="M146 160h128M157 150h4m5 0h4m5 0h4M179 179l-15 12 15 12m62-24 15 12-15 12m-22-28-15 38" />
          <path className="expert-lab__pulse" d="M162 226h64" strokeWidth="3" />
        </g>}
        {discipline === 3 && <g className="expert-lab__core">
          <circle cx="205" cy="183" r="37" />
          <path d="m232 210 31 31M183 184h44m-22-22v44" />
          <circle className="expert-lab__pulse" cx="205" cy="183" r="19" strokeDasharray="3 5" />
        </g>}
      </svg>
      {points.map(([x, y], i) => (
        <button key={i} type="button" className="expert-lab__node" style={{ left: `${x / 420 * 100}%`, top: `${y / 380 * 100}%` }}
          aria-label={`Explore ${expertise[discipline].capabilities[i].title}`} aria-pressed={skill === i} onClick={() => onSelect(i)}>
          <span className="expert-lab__node-dot">0{i + 1}</span>
          <span>{stages[discipline][i]}</span>
        </button>
      ))}
    </div>
  );
}

export function ExpertiseExplorer() {
  const [discipline, setDiscipline] = useState(0);
  const [skill, setSkill] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const item = expertise[discipline];
  const capability = item.capabilities[skill];
  const running = visible && !paused && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  const select = (index: number) => { setDiscipline(index); setSkill(0); };
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % expertise.length;
    else if (event.key === 'ArrowLeft') next = (index + expertise.length - 1) % expertise.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = expertise.length - 1;
    else return;
    event.preventDefault(); select(next); tabs.current[next]?.focus();
  };

  return (
    <div ref={root} className="expert-lab reveal" data-running={running}>
      <div className="expert-lab__bar mono">
        <span><span className="expert-lab__status" /> FOUR DISCIPLINES. ONE CONNECTED PRACTICE.</span>
        <span className="expert-lab__hint">CHOOSE A DISCIPLINE ↙</span>
      </div>
      <div className="expert-lab__tabs" role="tablist" aria-label="Explore my expertise">
        {expertise.map((entry, i) => (
          <button key={entry.index} type="button" role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel`} aria-selected={discipline === i}
            tabIndex={discipline === i ? 0 : -1} ref={el => { tabs.current[i] = el; }} onClick={() => select(i)} onKeyDown={event => navigate(event, i)}>
            <span className="expert-lab__tab-top mono"><span>{entry.index}</span><span>{discipline === i ? '↘' : '↗'}</span></span>
            <span className="expert-lab__symbol" aria-hidden="true">{symbols[i]}</span>
            <span className="expert-lab__tab-title">{entry.title}</span>
            <span className="expert-lab__tab-caption">{captions[i]}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${discipline}`} className="expert-lab__panel">
        <div className="expert-lab__visual" onPointerMove={event => {
          if (reduced || paused || event.pointerType !== 'mouse') return;
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty('--lab-x', `${((event.clientX - rect.left) / rect.width - .5) * 9}px`);
          event.currentTarget.style.setProperty('--lab-y', `${((event.clientY - rect.top) / rect.height - .5) * 9}px`);
        }} onPointerLeave={event => { event.currentTarget.style.setProperty('--lab-x', '0px'); event.currentTarget.style.setProperty('--lab-y', '0px'); }}>
          <div className="expert-lab__visual-label mono"><span>{item.index} / {item.title}</span><span aria-hidden="true">[ + ]</span></div>
          <SkillDiagram key={discipline} discipline={discipline} skill={skill} onSelect={setSkill} />
          <p className="expert-lab__visual-hint mono">FOLLOW A NODE. EXPLORE A SKILL.</p>
        </div>
        <div className="expert-lab__details">
          <p className="mono mono--muted">EXPLORE THE PRACTICE <span className="mono--accent">/ 0{skill + 1}</span></p>
          <div className="expert-lab__skills" role="group" aria-label={`${item.title} skills`}>
            {item.capabilities.map((entry, i) => <button key={entry.title} type="button" aria-pressed={skill === i} onClick={() => setSkill(i)}>
              <span className="mono">0{i + 1}</span><span>{entry.title}</span><span aria-hidden="true">{skill === i ? '−' : '+'}</span>
            </button>)}
          </div>
          <div className="expert-lab__description" aria-live="polite" aria-atomic="true">
            <div key={`${discipline}-${skill}`} className="expert-lab__description-content">
              <h3>{capability.title}</h3>
              <p>{capability.detail}.</p>
            </div>
          </div>
          <a href="#work" className="expert-lab__work ascii-link">See what I’ve built <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="expert-lab__footer mono">
        <span><span className="mono--accent">{item.index}</span> / 04 <span className="expert-lab__footer-name">— {captions[discipline]}</span></span>
        <div>
          {!reduced && <button type="button" aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? 'Resume motion ▷' : 'Pause motion Ⅱ'}</button>}
          <button type="button" aria-label="Next discipline" onClick={() => select((discipline + 1) % expertise.length)}>Next ↗</button>
        </div>
      </div>
    </div>
  );
}
