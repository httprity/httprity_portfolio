import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { bikolpo } from '../../../data/cases/bikolpo';

export const FullRead = createContext(false);

export const chapters = [
  { id: 'product', title: 'Try the product', hint: 'Change a delivery route', ownership: 'I built a dashboard that helps a delivery team decide which routes to change.', prompt: 'Try “Use this route” below. Then change the rainfall to see when a detour helps and when it does not.' },
  { id: 'context', title: 'Why I rebuilt it', hint: 'Who I built it for', ownership: 'I changed the product from finding one route to checking a whole evening of deliveries.', prompt: 'See why I added a separate answer for trips that are at risk but have no useful detour.' },
  { id: 'system', title: 'How it works', hint: 'From weather to a recommendation', ownership: 'I made the app reuse saved routes, so it can check new weather without waiting for the route service.', prompt: 'Open a step to see what happens. Below the steps, you can explore the tools I used.' },
  { id: 'model', title: 'How I tested it', hint: 'Results and what they mean', ownership: 'I created flood examples to train the model, then tested it on roads left out of training.', prompt: 'The scores below come from simulated floods. They do not show how well the model works during real floods.' },
  { id: 'decisions', title: 'Why these choices', hint: 'Decisions and their reasons', ownership: 'I made the warnings easier to act on and added safeguards for service failures and conflicting updates.', prompt: 'Open a choice to see what I did, the problem it solves, and how it works.' },
  { id: 'reflection', title: 'What I learned', hint: 'Mistakes & next steps', ownership: 'I wrote down my mistakes and what I would need to improve before a delivery team could use this.', prompt: 'These are the lessons from the rebuild and the next changes I would make.' },
] as const;

export function Chapter({ id, active, children }: { id: string; active: string; children: ReactNode }) {
  const full = useContext(FullRead);
  return <div className="bx-chapter" id={`chapter-${id}`} hidden={!full && active !== id}>{children}</div>;
}

/** Full source copy stays mounted and searchable in the full reading view. */
export function Points({ items }: { items: readonly (readonly [string, string])[]; columns?: 1 | 2 | 3 }) {
  const full = useContext(FullRead);
  const [opened, setOpened] = useState<Set<number>>(() => new Set([0]));
  const id = useId();
  return <ul className="bx-points">
    {items.map(([title, detail], i) => {
      const open = full || opened.has(i);
      return <li key={title}>
        <h3><button type="button" aria-expanded={open} aria-controls={`${id}-${i}`} disabled={full}
          onClick={() => setOpened(previous => { const next = new Set(previous); if (next.has(i)) next.delete(i); else next.add(i); return next; })}>
          <span className="mono mono--accent">{String(i + 1).padStart(2, '0')}</span>
          <span>{title}</span><span aria-hidden="true">{open ? '−' : '+'}</span>
        </button></h3>
        <div id={`${id}-${i}`} hidden={!open}><p>{detail}</p></div>
      </li>;
    })}
  </ul>;
}

export function StackExplorer() {
  const full = useContext(FullRead);
  const [active, setActive] = useState(0);
  const id = useId();
  return <div className="bx-stack">
    <div className="bx-stack__nav" role="group" aria-label="Explore the technology layers">
      {bikolpo.stack.map((group, i) => <button type="button" key={group.group} aria-pressed={active === i} aria-controls={`${id}-${i}`} onClick={() => setActive(i)}>
        <span className="mono">0{i + 1}</span>{group.group}<span aria-hidden="true">↗</span>
      </button>)}
    </div>
    <div>{bikolpo.stack.map((group, i) => <section className="bx-stack__panel" id={`${id}-${i}`} aria-label={group.group} key={group.group} hidden={!full && active !== i}>
      <h3>{group.group}</h3>
      <ul className="stack__items">{group.items.map(item => <li className="stack__chip mono" key={item}>{item}</li>)}</ul>
      <p>{group.note}</p>
    </section>)}</div>
  </div>;
}
