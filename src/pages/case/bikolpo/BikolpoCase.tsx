import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { bikolpo as c } from '../../../data/cases/bikolpo';
import { projects } from '../../../data/portfolio';
import { useReveal } from '../../../hooks/useReveal';
import { Callout, CaseSection, Glance, NextProject, Prose } from '../CaseKit';
import { ModelPanel, Outcomes, Pipeline, StormStory, TodayBoard } from './BikolpoWidgets';
import { Chapter, FullRead, Points, StackExplorer, chapters } from './Explorer';
import './explorer.css';

export function BikolpoCase() {
  const project = projects.find(p => p.slug === c.slug)!;
  const ref = useRef<HTMLElement>(null);
  const explorer = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [params, setParams] = useSearchParams();
  const active = chapters.some(ch => ch.id === params.get('chapter')) ? params.get('chapter')! : 'product';
  const full = params.get('view') === 'all';
  const currentIndex = chapters.findIndex(ch => ch.id === active);
  const current = chapters[currentIndex];
  useReveal(ref);

  useEffect(() => {
    document.title = c.name + ' — ' + project.summary;
    return () => { document.title = 'Samprity Haque — Product · AI/ML · Development'; };
  }, [project.summary]);

  const go = (chapter: string, all = false) => {
    const next = new URLSearchParams(params);
    next.set('chapter', chapter);
    if (all) next.set('view', 'all'); else next.delete('view');
    setParams(next, { preventScrollReset: true });
    requestAnimationFrame(() => {
      const target = all ? document.getElementById('chapter-' + chapter) : explorer.current;
      target?.scrollIntoView({ behavior: 'instant' });
      document.getElementById('bx-reading-heading')?.focus({ preventScroll: true });
    });
  };

  return <FullRead.Provider value={full}><main ref={ref} className={full ? 'bx-all' : 'bx-guided'}>
    <header className="container bx-head">
      <Link to="/#work" className="ascii-link case-back">Back to work</Link>
      <div className="bx-hero">
        <div>
          <p className="mono bx-kicker"><span className="mono--accent">P/{c.index} · Interactive case study</span><span className="mono--muted">Solo prototype</span></p>
          <h1 className="case-title">{c.name}<span className="case-title__aside" lang="bn">{c.bengali}</span></h1>
          <p className="case-tagline">{c.tagline}</p>
          <p className="mono mono--muted case-tags">{project.tags.join(' · ')}</p>
          <div className="bx-actions">
            <button type="button" className="btn btn--primary" onClick={() => go('product')}>Try changing a route <span aria-hidden="true">↓</span></button>
            <button type="button" className="btn btn--ghost" onClick={() => go('system')}>See how I built it <span aria-hidden="true">↗</span></button>
          </div>
        </div>
        <button type="button" className="bx-preview" aria-label="Enlarge the Bikolpo product preview" onClick={() => dialog.current?.showModal()}>
          <img src={c.hero} alt={c.heroAlt} fetchPriority="high" />
          <span className="mono">Website + delivery dashboard <span aria-hidden="true">Expand ↗</span></span>
        </button>
      </div>
      <div className="bx-ownership">
        <div><span className="mono mono--accent">My contribution</span><p>I chose the problem, designed the screens, and built the prediction model, server, and website.</p><small>Built on my own · used AI tools for the frontend rebuild</small></div>
        <div><span className="mono mono--accent">The key decision</span><p>Check all planned deliveries and suggest a different route only when it helps.</p><small>One route search became a plan for the whole team</small></div>
        <div><span className="mono mono--accent">What works so far</span><p>The demo works and has 67 automated tests. I tested the model on roads it did not train on.</p><small>Uses simulated floods · not yet tested on real floods or used by a delivery team</small></div>
      </div>
      <details className="bx-meta" open={full || undefined}>
        <summary>More about my role, the timeline, and the current status</summary>
        <dl className="case-meta">{c.meta.map(m => <div className="case-meta__item" key={m.k}><dt className="mono mono--muted">{m.k}</dt><dd>{m.v}</dd></div>)}</dl>
      </details>
    </header>

    <div className="container bx-explorer" ref={explorer}>
      <div className="bx-toolbar">
        <div><h2 id="bx-reading-heading" tabIndex={-1}>Explore the case study</h2><p>Try the demo, then explore what I built and why.</p></div>
        <button type="button" className="bx-mode" aria-pressed={full} onClick={() => go(active, !full)}>{full ? 'Return to guided view' : 'Read everything'} <span aria-hidden="true">{full ? '−' : '+'}</span></button>
      </div>
      <div className="bx-layout">
        <nav className="bx-nav" aria-label="Case study chapters">
          <span className="mono">{full ? 'All 6 chapters open' : 'Choose a chapter'}</span>
          <ol>{chapters.map((chapter, i) => <li key={chapter.id}><button type="button" aria-current={active === chapter.id ? 'step' : undefined} aria-controls={'chapter-' + chapter.id} onClick={() => go(chapter.id, full)}>
            <span className="mono">0{i + 1}</span><span><strong>{chapter.title}</strong><small>{chapter.hint}</small></span>
          </button></li>)}</ol>
          <p className="bx-nav__note">For the product story, start with 01–02.<br />For how I built and tested it, see 03–05.<br /><br />The full details are available in “Read everything”.</p>
        </nav>
        <div className="bx-content">
          {!full && <div className="bx-intro"><span className="mono mono--accent">0{currentIndex + 1} / 06 · My contribution</span><h2>{current.ownership}</h2><p>{current.prompt}</p></div>}
<Chapter id="product" active={active}>
<CaseSection
        index="04"
        label="The product"
        id="product"
        heading="Which deliveries need a different route?"
        intro={
          <p>
            The <strong>Today</strong> dashboard shows 64 planned trips. In this demo, 21 need attention:
            10 have a better route and 11 do not. It also shows the weather, its source, and a short summary.
            Try changing a route below. This interactive example uses the app’s own figures.
            “Flood exposure” means the estimated share of a journey on roads that may flood.
          </p>
        }
      >
        <TodayBoard />
        <div style={{ marginTop: 'var(--space-7)' }}>
          <h3 className="case-h3">What changes when the rain gets heavier?</h3>
          <p className="case-sub">
            Choose a rainfall level to compare two routes for the same journey. This also appears on the product’s landing page.
            In extreme rain, both routes are badly affected, so the app stops recommending a detour.
          </p>
          <StormStory />
        </div>
      </CaseSection>
</Chapter>

<Chapter id="context" active={active}>
<CaseSection index="02" label="Problem" id="problem" heading="The fastest route can take a driver through flooded roads.">
        <Prose>
          <p>{c.problem.lede}</p>
          {c.problem.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Points items={c.problem.hard} columns={2} />
        </div>
      </CaseSection>

<CaseSection
        index="03"
        label="What I changed"
        id="idea"
        heading={c.idea.heading}
        intro={c.idea.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      >
        <Outcomes />
        <Callout title={c.idea.insight.title}>{c.idea.insight.body}</Callout>
      </CaseSection>
</Chapter>

<Chapter id="system" active={active}>
<CaseSection
        index="05"
        label="How it works"
        id="pipeline"
        heading="How the app decides what to recommend"
        intro={<p>The model estimates flood risk. I wrote separate rules to decide which trips need attention and whether a detour is worth taking. Open a step to follow the process.</p>}
      >
        <Pipeline />
      </CaseSection>

<CaseSection index="01" label="Tools I used" id="stack" heading="What I used to build each part" intro="Choose a part of the app to see the tools and why I used them.">
        <StackExplorer />
      </CaseSection>
</Chapter>

<Chapter id="model" active={active}>
<CaseSection
        index="06"
        label="The model"
        id="model"
        heading="How I tested the flood prediction model"
        intro={
          <p>
            I generated 874,200 examples, each describing one road section for one hour. The model uses 18 inputs
            to estimate whether that section will flood. I used scikit-learn’s HistGradientBoostingClassifier.
            The simulator creates storms, river levels, and ground conditions. Ground height and drainage change
            how much rain it takes to cause flooding, rather than simply adding a fixed amount to the risk.
            The simulation methods are explained under “Roads & weather” in the tools section.
          </p>
        }
      >
        <ModelPanel />
      </CaseSection>
</Chapter>

<Chapter id="decisions" active={active}>
<CaseSection index="07" label="Design" id="design" heading="How I made the results easier to understand">
        <Points items={c.design} columns={2} />
      </CaseSection>

<CaseSection index="08" label="Engineering" id="engineering" heading="How I handled failures and conflicting actions">
        <Points items={c.engineering} columns={2} />
      </CaseSection>
</Chapter>

<Chapter id="reflection" active={active}>
<CaseSection index="09" label="Learned" id="learned">
        <ol className="learned">
          {c.learned.map(([t, d], i) => (
            <li key={t} className="reveal" style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
              <span className="mono mono--accent" aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </CaseSection>

<CaseSection
        index="10"
        label="Next"
        id="next"
        heading="What I would improve before real-world use"
        intro={
          <p>
            The model is tested against a simulation I wrote, not real floods. The ground map uses only 26 reference points,
            and the whole city gets one rainfall value. As rain rises within a range of about 30 mm, the board can go
            from no trips affected to every trip affected. These limitations set the priorities below.
          </p>
        }
      >
        <Points items={c.next} columns={2} />
      </CaseSection>
</Chapter>
          {!full && <div className="bx-next">
            {currentIndex > 0 && <button type="button" onClick={() => go(chapters[currentIndex - 1].id)}>← {chapters[currentIndex - 1].title}</button>}
            {currentIndex < chapters.length - 1 ? <button type="button" onClick={() => go(chapters[currentIndex + 1].id)}>Next: {chapters[currentIndex + 1].title} →</button> : <button type="button" onClick={() => go('product')}>Back to the product ↑</button>}
          </div>}
        </div>
      </div>
    </div>
    <div className="container"><Glance items={c.glance} /></div>
    <NextProject slug={c.slug} />
    <dialog className="bx-modal" ref={dialog} aria-label="Bikolpo product preview" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <button type="button" onClick={() => dialog.current?.close()} autoFocus>Close preview ×</button>
      <img src={c.hero} alt={c.heroAlt} />
    </dialog>
  </main></FullRead.Provider>;
}
