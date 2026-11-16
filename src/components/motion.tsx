'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Motion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('[data-hero-line]', { y: 65, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', clearProps: 'all' });
        gsap.from('[data-hero-image]', { scale: 1.07, duration: 1.7, ease: 'power2.out', clearProps: 'transform' });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
          gsap.from(el, { y: 30, opacity: 0, duration: 0.75, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, clearProps: 'all' });
        });
        if (window.innerWidth > 768) gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => {
          gsap.fromTo(el, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });
        gsap.utils.toArray<HTMLElement>('[data-image-reveal]').forEach(el => {
          gsap.from(el, { clipPath: 'inset(8% 5% 8% 5%)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, clearProps: 'clipPath' });
        });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <div ref={root}>{children}</div>;
}
