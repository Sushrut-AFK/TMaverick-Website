import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export function Action({ href, children, light = false, external = false }: { href: string; children: React.ReactNode; light?: boolean; external?: boolean }) {
  const cls = `action ${light ? 'action-light' : ''}`;
  return external ? <a className={cls} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={18} /></a> : <Link className={cls} href={href}>{children}<ArrowUpRight size={18} /></Link>;
}
export function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number} /</span>{children}</div>;
}
