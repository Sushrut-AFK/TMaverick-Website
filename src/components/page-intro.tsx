import Link from 'next/link';
export function PageIntro({ title, label, description }: { title: string; label: string; description: string }) {
  return <section className="page-intro"><div className="breadcrumb"><Link href="/">Team Maverick</Link><span>/</span>{label}</div><span className="eyebrow">{label}</span><h1 data-hero-line>{title}</h1><p data-hero-line>{description}</p></section>;
}
