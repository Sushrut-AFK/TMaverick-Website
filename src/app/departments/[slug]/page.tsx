import type { Metadata } from 'next';
import Link from 'next/link';
import { PhotoImage as Image } from '@/components/photo-viewer';
import { notFound } from 'next/navigation';
import { departments, assets } from '@/data/site';
import { PageIntro } from '@/components/page-intro';
import { Action } from '@/components/ui';
import { Motion } from '@/components/motion';
export function generateStaticParams() { return departments.map(d => ({ slug: d.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return { title: departments.find(d => d.slug === slug)?.name ?? 'Department' }; }
export default async function Department({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const d = departments.find(d => d.slug === slug); if (!d) notFound();
  const next = departments[(departments.indexOf(d) + 1) % departments.length];
  return <main id="main"><Motion><PageIntro title={d.name} label="Engineering department" description={d.short} /><div className="page-content"><div className="editorial-split"><div className="editorial-photo"><Image src={assets.car} alt="Avira 2.0, the integrated vehicle these departments develop" fill sizes="(max-width:600px) 100vw,50vw" /></div><div><span className="eyebrow">THE DISCIPLINE</span><p style={{ marginTop: 24 }}>{d.description}</p><span className="system-focus">{d.focus}</span><p>Learn more about this department’s current work and opportunities by connecting with Team Maverick.</p><Action href="/join">Join the team</Action></div></div><div className="callout"><Link className="text-link" href="/departments">← All departments</Link><Action href={`/departments/${next.slug}`}>Next: {next.name}</Action></div></div></Motion></main>;
}
