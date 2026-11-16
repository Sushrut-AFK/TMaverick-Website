'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { departments } from '@/data/site';
import { SectionLabel } from './ui';
import { ExplodedCar, type ExplodedCarHandle } from './exploded-car';

export function Engineering() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const scene = useRef<ExplodedCarHandle>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      ScrollTrigger.create({ trigger: '.department-steps', start: 'top 65%', end: 'bottom 85%', onUpdate: self => scene.current?.setProgress(self.progress) });
      gsap.utils.toArray<HTMLElement>('[data-department-step]').forEach((el, index) => {
        ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 60%', onEnter: () => setActive(index), onEnterBack: () => setActive(index) });
      });
    }, root);
    return () => context.revert();
  }, []);
  return <section id="engineering" ref={root} className="engineering section-pad"><div className="engineering-title"><SectionLabel number="04">THE ENGINEERING</SectionLabel><h2 data-reveal>ONE MACHINE.<br /><span className="muted">EVERY DISCIPLINE.</span></h2><p>Scroll to separate.<br />Discover how the systems fit.</p></div><div className="engineering-layout"><div className="engineering-sticky"><ExplodedCar ref={scene} active={active} /><div className="department-index" aria-label="Explore engineering departments">{departments.map((d, i) => <a href={`#system-${d.slug}`} key={d.slug} className={active === i ? 'active' : ''} aria-current={active === i ? 'step' : undefined}>{String(i + 1).padStart(2, '0')}<span>{d.name}</span></a>)}</div></div><div className="department-steps">{departments.map((d, i) => <article key={d.slug} data-department-step id={`system-${d.slug}`} className="department-step"><span className="eyebrow">SYSTEM {String(i + 1).padStart(2, '0')} / 08</span><h3>{d.name}</h3><h4>{d.short}</h4><p>{d.description}</p><span className="system-focus">{d.focus}</span><Link className="text-link" href={`/departments/${d.slug}`}>Explore department <ArrowUpRight size={17} /></Link></article>)}</div></div></section>;
}
