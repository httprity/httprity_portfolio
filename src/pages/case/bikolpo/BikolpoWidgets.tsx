import { useContext, useEffect, useId, useRef, useState } from 'react';
import { bikolpo } from '../../../data/cases/bikolpo';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import './bikolpo.css';
import { FullRead } from './Explorer';

/* ------------------------------------------------------------------ */
/* helpers                                                              */
/* ------------------------------------------------------------------ */

/** Counts from the previous value to the next — a figure that changes is counted, not replaced. */
function useCountUp(value: number, ms = 520) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    if (reduced) {
      setShown(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    if (from === value) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (value - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    // land on the true value by timeout even if the frame clock stalls
    const timeout = window.setTimeout(() => {
      setShown(value);
      fromRef.current = value;
    }, ms + 80);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [value, ms, reduced]);
  return shown;
}

/* ------------------------------------------------------------------ */
/* 1. Three outcomes                                                    */
/* ------------------------------------------------------------------ */

export function Outcomes() {
  const full = useContext(FullRead);
  const [active, setActive] = useState(1); // "No better route" is the argument
  const id = useId();
  const o = bikolpo.idea.outcomes[active];
  if (full) return <div className="outcomes">{bikolpo.idea.outcomes.map(outcome => <section className="outcomes__panel" key={outcome.key}><h3>{outcome.label}</h3><p>{outcome.short}</p><p className="outcomes__detail">{outcome.detail}</p></section>)}</div>;
  return (
    <div className="outcomes">
      <div className="outcomes__tabs" role="tablist" aria-label="The three outcomes">
        {bikolpo.idea.outcomes.map((it, i) => (
          <button
            key={it.key}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel`}
            tabIndex={active === i ? 0 : -1}
            className={`outcomes__tab ${active === i ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : null;
              if (next !== null) {
                e.preventDefault();
                setActive(next);
                document.getElementById(id + '-tab-' + next)?.focus();
              }
            }}
          >
            <span className="mono mono--faint" aria-hidden="true">
              0{i + 1}
            </span>
            <span className="outcomes__name">{it.label}</span>
            <span className="outcomes__short">{it.short}</span>
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="outcomes__panel">
        <span className="mono mono--accent">Why the app gives this answer</span>
        <p className="outcomes__verdict">{o.label}</p>
        <p className="outcomes__detail">{o.detail}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Today board — a real state change                                 */
/* ------------------------------------------------------------------ */

export function TodayBoard() {
  const { board } = bikolpo;
  const [rerouted, setRerouted] = useState(false);
  const [kept, setKept] = useState(false);
  const attention = useCountUp(board.counts.attention - (rerouted ? 1 : 0));
  const reroutable = useCountUp(board.counts.reroutable - (rerouted ? 1 : 0));
  const noBetter = board.counts.noBetter;
  const changed = rerouted ? 1 : 0;

  return (
    <div className="board" aria-label="Interactive reconstruction of the Today board">
      <div className="demo-label mono mono--faint">
        <span>Try it · uses the app’s demo figures</span>
        <span>{board.scenarioLabel}</span>
      </div>

      <div className="board__frame">
        <div className="board__top">
          <div className="board__counts">
            <Count n={board.counts.planned} label="Trips planned" />
            <Count n={attention} label="Need attention" tone="attention" />
            <Count n={reroutable} label="Can be rerouted" tone="accent" />
            <Count n={noBetter} label="No better route" />
          </div>
          <div className="board__weather">
            <span className="mono mono--faint">Weather outlook</span>
            <strong>Heavy rain expected</strong>
            <span className="board__weather-sub">6 PM – 10 PM · 72 mm expected</span>
            <span className="mono mono--accent board__weather-tag">{board.scenarioLabel}</span>
          </div>
        </div>

        <p className="board__sentence" aria-live="polite">
          {reroutable} of the {attention} affected trips can be rerouted. The other {noBetter} have no better route
          available.
        </p>

        <div className="board__trips">
          {/* Trip A — reroute recommended */}
          <article className={`trip ${rerouted ? 'is-rerouted' : ''}`}>
            <header className="trip__head">
              <span className="mono mono--faint">{rerouted ? 'Rerouted' : 'Needs attention'}</span>
              <h4>{board.trip.corridor}</h4>
              <span className={`trip__verdict mono ${rerouted ? 'mono--faint' : 'mono--accent'}`}>
                {rerouted ? 'Alternative in use' : 'Reroute recommended'}
              </span>
            </header>
            <div className="trip__compare">
              <div className="trip__route">
                <span className="mono mono--faint">Current route</span>
                <strong>{board.trip.current.minutes} min</strong>
                <span className="trip__exposure trip__exposure--3">{board.trip.current.exposure}</span>
              </div>
              <span className="trip__arrow" aria-hidden="true">
                →
              </span>
              <div className="trip__route">
                <span className="mono mono--faint">Bikolpo recommends</span>
                <strong>{board.trip.proposed.minutes} min</strong>
                <span className="trip__exposure trip__exposure--2">{board.trip.proposed.exposure}</span>
                <span className="trip__delta">{board.trip.proposed.delta}</span>
              </div>
            </div>
            <p className="trip__why">
              <span className="mono mono--faint">Why · </span>
              {board.trip.why}
            </p>
            <div className="trip__actions">
              <button type="button" className={`btn ${rerouted ? 'btn--ghost' : 'btn--primary'}`} onClick={() => setRerouted((v) => !v)}>
                {rerouted ? 'Undo' : 'Use this route'}
                {!rerouted && (
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </button>
            </div>
          </article>

          {/* Trip B — no better route */}
          <article className={`trip trip--keep ${kept ? 'is-kept' : ''}`}>
            <header className="trip__head">
              <span className="mono mono--faint">{kept ? 'Acknowledged' : 'Needs attention'}</span>
              <h4>Another affected trip</h4>
              <span className="trip__verdict mono mono--muted">No better route found</span>
            </header>
            <p className="trip__why">
              The other routes are also likely to flood. The app has no better route to offer.
              You can acknowledge this by choosing “Keep current route”.
            </p>
            <div className="trip__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setKept((v) => !v)} aria-pressed={kept}>
                {kept ? 'Kept · undo' : 'Keep current route'}
              </button>
            </div>
          </article>
        </div>

        <div className={`board__impact ${changed ? 'is-visible' : ''}`} aria-live="polite">
          {changed ? (
            <>
              <strong>{board.impact}</strong>
              <span className="board__impact-sub">{board.impactSub}</span>
            </>
          ) : (
            <span className="mono mono--faint">Change a route to see how many trips changed and how much travel time was added.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Count({ n, label, tone }: { n: number; label: string; tone?: 'attention' | 'accent' }) {
  return (
    <div className={`count ${tone ? `count--${tone}` : ''}`}>
      <span className="count__n">{n}</span>
      <span className="count__label mono mono--faint">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Storm story — one corridor, three rainfall levels                  */
/* ------------------------------------------------------------------ */

export function StormStory() {
  const [i, setI] = useState(1);
  const s = bikolpo.storm[i];
  const wet = i / 2; // 0, .5, 1 — drives the schematic

  return (
    <div className="storm">
      <div className="demo-label mono mono--faint">
        <span>Try it · one journey at three rainfall levels</span>
        <span>Simplified route drawing</span>
      </div>

      <div className="storm__grid">
        <div className="storm__controls">
          <div className="seg" role="group" aria-label="Rainfall level">
            {bikolpo.storm.map((st, k) => (
              <button key={st.mm} type="button" aria-pressed={i === k} onClick={() => setI(k)}>
                {st.mm} mm
              </button>
            ))}
          </div>
          <p className="storm__title">
            <span className="mono mono--faint">{s.title} · </span>
            <span className={`storm__verdict ${i === 1 ? 'is-accent' : ''}`}>{s.verdict}</span>
          </p>
          <p className="storm__note">{s.note}</p>

          <div className="storm__cards">
            <RouteCard label="Fastest route" r={s.fastest} />
            <RouteCard label="Bikolpo" r={s.bikolpo} highlight={i === 1} />
          </div>
        </div>

        <figure className="storm__fig">
          <svg viewBox="0 0 600 300" role="img" aria-label={`Schematic of the corridor at ${s.mm} mm: fastest route ${s.fastest.exposure}, Bikolpo route ${s.bikolpo.exposure}.`}>
            <defs>
              <pattern id="lowground" width="7" height="7" patternUnits="userSpaceOnUse">
                <circle cx="3.5" cy="3.5" r={0.6 + wet * 1.6} fill="var(--accent)" />
              </pattern>
            </defs>
            {/* the low ground the fastest road crosses */}
            <ellipse cx="300" cy="215" rx="190" ry="62" fill="url(#lowground)" opacity={0.25 + wet * 0.65} />
            <text x="300" y="292" textAnchor="middle" className="storm__svgtext">
              LOW GROUND · DRAINAGE 0.2
            </text>
            {/* alternative — higher ground */}
            <path
              d="M40 220 C 120 120, 220 60, 320 70 S 500 90, 560 60"
              className={`storm__route storm__route--alt storm__route--l${s.bikolpo.level}`}
              style={{ opacity: i === 0 ? 0.35 : 1 }}
            />
            {/* fastest — through the low ground */}
            <path d="M40 220 C 140 235, 220 240, 320 220 S 480 140, 560 60" className={`storm__route storm__route--l${s.fastest.level}`} />
            <circle cx="40" cy="220" r="5" className="storm__node" />
            <circle cx="560" cy="60" r="5" className="storm__node" />
            <text x="40" y="250" className="storm__svgtext">
              ORIGIN
            </text>
            <text x="560" y="40" textAnchor="end" className="storm__svgtext">
              DESTINATION
            </text>
            <text x="330" y="262" textAnchor="middle" className="storm__svgtext storm__svgtext--fg">
              FASTEST · {s.fastest.minutes} MIN
            </text>
            <text x="250" y="52" className="storm__svgtext storm__svgtext--fg" style={{ opacity: i === 0 ? 0.4 : 1 }}>
              BIKOLPO · {s.bikolpo.minutes} MIN
            </text>
          </svg>
          <figcaption className="mono mono--faint">
            This is a simplified drawing. More dots mean heavier rain. The actual app shows routes from
            OpenRouteService on a map drawn with MapLibre.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

function RouteCard({ label, r, highlight }: { label: string; r: { minutes: number; exposure: string; level: number }; highlight?: boolean }) {
  return (
    <div className={`rcard ${highlight ? 'is-highlight' : ''}`}>
      <span className="mono mono--faint">{label}</span>
      <strong>{r.minutes} min</strong>
      <span className={`trip__exposure trip__exposure--${r.level}`}>{r.exposure}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Pipeline                                                          */
/* ------------------------------------------------------------------ */

export function Pipeline() {
  const full = useContext(FullRead);
  const [open, setOpen] = useState(0);
  const id = useId();
  return (
    <div className="pipe">
      <div className="pipe__io mono mono--muted">
        <span>
          <span className="mono--accent">IN</span> 64 planned deliveries + the evening’s weather
        </span>
        <span>
          <span className="mono--accent">OUT</span> for each trip: a recommendation, reason, and action · for the team: totals,
          a summary, and the effect of route changes
        </span>
      </div>
      <ol className="pipe__steps">
        {bikolpo.pipeline.map((p, i) => {
          const isOpen = full || open === i;
          return (
            <li key={p.step} className={`pipe__step ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="pipe__head"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                disabled={full}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="mono mono--faint">{String(i + 1).padStart(2, '0')}</span>
                <span className="pipe__name">{p.step}</span>
                <span className="mono mono--muted pipe__tag">{p.tag}</span>
                <span className="pipe__plus" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div id={`${id}-${i}`} className="pipe__panel" hidden={!isOpen}>
                <p>{p.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Model panel + step response                                       */
/* ------------------------------------------------------------------ */

export function ModelPanel() {
  const m = bikolpo.model;
  return (
    <div className="model">
      <div className="model__grid">
        <div className="model__metrics">
          <span className="mono mono--faint">Results on 120 roads left out of training</span>
          <table>
            <tbody>
              {m.metrics.map((r) => (
                <tr key={r.k}>
                  <th scope="row">{r.k}</th>
                  <td>
                    <span className="model__v">{r.v}</span>
                    <span className="model__ref mono mono--faint">{r.ref}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="model__validation">{m.validation}</p>
        </div>

        <StepChart />
      </div>

      <ul className="model__constraints">
        {m.constraints.map(([t, d], i) => (
          <li key={t}>
            <span className="mono mono--accent" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ul>

      <p className="model__not">
        <span className="mono mono--faint">What these results cannot prove · </span>
        {m.notModel}
      </p>
    </div>
  );
}

function StepChart() {
  const [sample, setSample] = useState(2);
  const pts = bikolpo.model.curve;
  const W = 520;
  const H = 240;
  const px = { l: 44, r: 16, t: 20, b: 40 };
  const x = (mm: number) => px.l + (mm / 100) * (W - px.l - px.r);
  const y = (n: number) => H - px.b - (n / 64) * (H - px.t - px.b);
  // documented step response: 0 until ~50 mm, 21 until ~80 mm, then all 64
  const d = `M${x(0)} ${y(0)} H${x(50)} V${y(21)} H${x(80)} V${y(64)} H${x(100)}`;
  return (
    <figure className="chart">
      <div className="bx-chart-controls" role="group" aria-label="Inspect a sampled rainfall level">
        {pts.map((point, index) => <button type="button" key={point.mm} aria-pressed={sample === index} onClick={() => setSample(index)}>{point.mm} mm</button>)}
      </div>
      <p className="bx-chart-result" aria-live="polite"><strong>{pts[sample].trips} / 64</strong> trips need attention at {pts[sample].mm} mm</p>
      <span className="mono mono--faint">How many deliveries need attention as rainfall increases</span>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Step chart: trips needing attention stay at 0 up to about 50 mm of rain, jump to 21, then to all 64 at 80 mm.">
        {[0, 21, 64].map((n) => (
          <g key={n}>
            <line x1={px.l} x2={W - px.r} y1={y(n)} y2={y(n)} className="chart__grid" />
            <text x={px.l - 8} y={y(n) + 4} textAnchor="end" className="chart__t">
              {n}
            </text>
          </g>
        ))}
        {[0, 20, 40, 60, 80, 100].map((mm) => (
          <text key={mm} x={x(mm)} y={H - px.b + 18} textAnchor="middle" className="chart__t">
            {mm}
          </text>
        ))}
        <text x={W - px.r} y={H - 4} textAnchor="end" className="chart__t">
          MM / 12H
        </text>
        <text x={px.l} y={12} className="chart__t">
          TRIPS NEEDING ATTENTION
        </text>
        <path d={d} className="chart__line" />
        {pts.map((p) => (
          <g key={p.mm}>
            <circle cx={x(p.mm)} cy={y(p.trips)} r={p.mm === pts[sample].mm ? 8 : p.demo ? 6 : 4} className={`chart__pt ${p.demo ? 'is-demo' : ''}`} />
            {p.demo && (
              <text x={x(p.mm)} y={y(p.trips) - 12} textAnchor="middle" className="chart__t chart__t--accent">
                DEMO · 72 MM
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption>{bikolpo.model.curveNote}</figcaption>
    </figure>
  );
}
