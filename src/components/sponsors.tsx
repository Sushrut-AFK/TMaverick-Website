'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { sponsors } from '@/data/site';

function SponsorList({ duplicate = false }: { duplicate?: boolean }) {
  return <ul className="sponsor-group" aria-hidden={duplicate || undefined}>{sponsors.map(s => <li className="sponsor-cell" key={s.name}>{s.url && !duplicate ? <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} website`}><Image src={s.image} alt={s.name} width={180} height={80} /></a> : <Image src={s.image} alt={duplicate ? '' : s.name} width={180} height={80} />}</li>)}</ul>;
}
export function SponsorGrid({ animated = false }: { animated?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (root.current) root.current.dataset.enhanced = 'true'; }, []);
  if (!animated) return <div className="sponsor-grid"><SponsorList /></div>;
  return <div ref={root} className="sponsor-marquee" data-paused={paused} aria-label="Team Maverick sponsors"><div className="sponsor-window"><div className="sponsor-track"><SponsorList /><SponsorList duplicate /></div></div><div className="sponsor-marquee-footer"><span>PARTNERS IN THE MAKING.</span><button onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Play sponsor animation' : 'Pause sponsor animation'}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? 'Play' : 'Pause'}</button></div></div>;
}
