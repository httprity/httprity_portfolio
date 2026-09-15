import { useRef, useState } from 'react';
import { about, achievements, experience, projects, type Project } from '../data/portfolio';
import { useCanHover } from '../hooks/useMediaQuery';
import { useReveal } from '../hooks/useReveal';
import { AchievementCard } from '../components/AchievementCard';
import { AsciiDivider } from '../components/AsciiDivider';
import { ContactSection } from '../components/ContactSection';
import { ExperienceRow } from '../components/ExperienceRow';
import { ExpertiseExplorer } from '../components/ExpertiseExplorer';
import { Hero } from '../components/Hero';
import { ProjectPreview } from '../components/ProjectPreview';
import { ProjectRow } from '../components/ProjectRow';
import { SectionLabel } from '../components/SectionLabel';
import './Home.css';

export function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);

  const canHover = useCanHover();
  const workRef = useRef<HTMLUListElement>(null);
  const [previewed, setPreviewed] = useState<Project | null>(null);

  return (
    <div ref={pageRef}>
      <Hero />

      {/* ------------------------------------------------ 01 / EXPERTISE */}
      <AsciiDivider />
      <section id="expertise" className="section" aria-labelledby="expertise-heading">
        <div className="container">
          <header className="section-head">
            <div className="reveal">
              <SectionLabel index="01" label="Expertise" />
            </div>
            <div className="section-head__body reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
              <h2 id="expertise-heading" className="h2">
                What I work across
              </h2>
              <p className="section-head__intro">
                I like working across the layers of a product — from the problem and experience to the
                technology underneath it.
              </p>
            </div>
          </header>

          <ExpertiseExplorer />
        </div>
      </section>

      {/* ------------------------------------------------ 02 / SELECTED WORK */}
      <AsciiDivider />
      <section id="work" className="section work" aria-labelledby="work-heading">
        <div className="container">
          <header className="section-head">
            <div className="reveal">
              <SectionLabel index="02" label="Selected work" />
            </div>
            <div className="section-head__body section-head__body--wide reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
              <h2 id="work-heading" className="h2">
                Things I’ve built, designed, and experimented with.
              </h2>
              <p className="section-head__intro">
                A collection of products where design, software, and AI meet real problems.
              </p>
            </div>
          </header>

          <ul ref={workRef} className="plist" onPointerLeave={() => setPreviewed(null)}>
            {projects.map((p, i) => (
              <ProjectRow key={p.slug} project={p} delay={i * 50} onEnter={setPreviewed} onLeave={() => setPreviewed(null)} />
            ))}
          </ul>
          {canHover && <ProjectPreview project={previewed} area={workRef} />}
        </div>
      </section>

      {/* ------------------------------------------------ 03 / EXPERIENCE */}
      <AsciiDivider />
      <section id="experience" className="section" aria-labelledby="experience-heading">
        <div className="container">
          <header className="section-head">
            <div className="reveal">
              <SectionLabel index="03" label="Experience" />
            </div>
            <div className="section-head__body reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
              <h2 id="experience-heading" className="h2">
                Where I’ve been putting this into practice.
              </h2>
            </div>
          </header>

          <ul className="elist">
            {experience.map((item, i) => (
              <ExperienceRow key={item.period} item={item} delay={i * 60} />
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ 04 / ACHIEVEMENTS */}
      <AsciiDivider />
      <section id="achievements" className="section" aria-labelledby="achievements-heading">
        <div className="container">
          <header className="section-head">
            <div className="reveal">
              <SectionLabel index="04" label="Achievements" />
            </div>
            <div className="section-head__body reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
              <h2 id="achievements-heading" className="h2">
                A few things I’ve done along the way.
              </h2>
            </div>
          </header>

          <ul className="agrid">
            {achievements.map((item, i) => (
              <AchievementCard key={item.index} item={item} delay={i * 60} />
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ 05 / ABOUT */}
      <AsciiDivider />
      <section id="about" className="section about" aria-labelledby="about-heading">
        <div className="container about__grid">
          <div className="reveal">
            <SectionLabel index="05" label="A little about me" />
          </div>
          <div className="about__body">
            <h2 id="about-heading" className="about__heading reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
              {about.heading}
            </h2>
            <div className="about__text reveal" style={{ '--reveal-delay': '140ms' } as React.CSSProperties}>
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="about__exploring reveal" style={{ '--reveal-delay': '200ms' } as React.CSSProperties}>
              <span className="mono mono--muted">{about.exploringLabel}</span>
              <ul className="about__tags">
                {about.exploring.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 06 / CONTACT */}
      <AsciiDivider />
      <ContactSection />
    </div>
  );
}
