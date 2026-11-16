'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X, Instagram, Linkedin } from 'lucide-react';
import { assets, navigation, site } from '@/data/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = panel.current?.querySelector<HTMLAnchorElement>('a');
    first?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (e.key !== 'Tab') return;
      const links = panel.current?.querySelectorAll<HTMLElement>('button, a');
      if (!links?.length) return;
      const all: HTMLElement[] = Array.from(links);
      const index = all.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && index === 0) { e.preventDefault(); all[all.length - 1].focus(); }
      else if (!e.shiftKey && index === all.length - 1) { e.preventDefault(); all[0].focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = before; document.removeEventListener('keydown', onKey); };
  }, [open]);
  useEffect(() => { const close = () => { if (window.innerWidth > 1180) setOpen(false); }; window.addEventListener('resize', close); return () => window.removeEventListener('resize', close); }, []);
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Team Maverick home" onClick={() => setOpen(false)}><Image src={assets.logo} alt="" width={58} height={46} preload /><span>TEAM<br /><b>MAVERICK</b></span></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([name, href]) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}>{name}</Link>)}</nav>
    <span className="header-location">PUNE, IN <span className="status-dot" /></span>
    <button ref={toggle} className="menu-toggle" tabIndex={open ? -1 : undefined} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open menu" onClick={() => setOpen(!open)}><Menu /></button>
    {open && <div ref={panel} id="mobile-navigation" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><div className="mobile-menu-top"><span className="eyebrow">EXPLORE MAVERICK</span><button aria-label="Close navigation" onClick={() => { setOpen(false); toggle.current?.focus(); }}><X size={21} /></button></div><nav aria-label="Mobile navigation">{navigation.map(([name, href], i) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={path === href ? 'page' : undefined}><span>0{i + 1}</span>{name}<ArrowUpRight size={22} /></Link>)}</nav><p>STUDENT ENGINEERS. SHARED AMBITION.</p></div>}
  </header>;
}
export function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div><Link href="/" className="footer-wordmark">TEAM MAVERICK<span>↑</span></Link><p>Student engineers. Shared ambition.<br />{site.institution}</p></div><div className="footer-links">{navigation.slice(1).map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}<Link href="/team">Team & Alumni</Link></div><div className="footer-address"><span className="eyebrow">FIND US IN THE WORKSHOP</span><p>{site.address}</p><div className="social-links"><a href={site.instagram} aria-label="Team Maverick on Instagram" target="_blank" rel="noopener noreferrer"><Instagram size={19} /></a><a href={site.linkedin} aria-label="Team Maverick on LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin size={19} /></a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Team Maverick</span><span>DESIGNED TO RACE. ENGINEERED WITH INTENT.</span><a href="#main">BACK TO TOP ↑</a></div></footer>;
}
