import type { Metadata } from 'next';
import { PhotoImage as Image } from '@/components/photo-viewer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { Motion } from '@/components/motion';
import { SponsorGrid } from '@/components/sponsors';
import { Action, SectionLabel } from '@/components/ui';
import { alumni, assets, departments, results, site } from '@/data/site';

const pages: Record<string, { title: string; label: string; description: string }> = {
  about: { title: 'Built on curiosity.', label: 'About us', description: 'Student engineers from Pune. Connected by a shared ambition to take an idea from the drawing board to the track.' },
  cars: { title: 'Ideas. Made real.', label: 'Our cars', description: 'Explore the machines that carry our engineering forward. Each build is a lesson. Each season is a new challenge.' },
  departments: { title: 'Every system counts.', label: 'Departments', description: 'One car requires many ways of thinking. Meet the technical and organisational disciplines behind Team Maverick.' },
  achievements: { title: 'Earned on track.', label: 'Achievements', description: 'The results reflect the work: design decisions, workshop hours, testing, and a team that carries the ambition together.' },
  sponsors: { title: 'Progress is a team effort.', label: 'Our partners', description: 'The organisations supporting the engineering, tools, and manufacturing behind our Formula Student journey.' },
  team: { title: 'Once a Maverick.', label: 'Team & alumni', description: 'The car brings us together. The experience stays with us. Meet the culture and alumni behind Team Maverick.' },
  join: { title: 'Your place is in the making.', label: 'Join us', description: 'Bring curiosity, commitment, and the willingness to learn. Discover the work and take your first step toward Team Maverick.' },
  contact: { title: 'Start a conversation.', label: 'Contact', description: 'For partnerships, recruitment, or a conversation about engineering, reach Team Maverick through our official channels.' },
};
export function generateStaticParams() { return Object.keys(pages).map(page => ({ page })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const { page } = await params; return { title: pages[page]?.label ?? 'Page not found' }; }

function Photo({ src, alt, wide = false }: { src: string; alt: string; wide?: boolean }) {
  return <div className={wide ? 'wide-photo' : 'editorial-photo'} data-image-reveal><Image src={src} alt={alt} fill sizes={wide ? '100vw' : '(max-width: 600px) 100vw, 50vw'} /></div>;
}
function Callout({ title = 'There is a place for your curiosity.', href = '/join', cta = 'Join Team Maverick' }: { title?: string; href?: string; cta?: string }) {
  return <div className="callout"><h2>{title}</h2><Action href={href}>{cta}</Action></div>;
}
function About() {
  return <><div className="editorial-split"><div><SectionLabel number="01">THE TEAM</SectionLabel><h2>THEORY MEETS<br /><em>REALITY.</em></h2></div><div><p>Team Maverick represents PVG’s College of Engineering and Technology, Pune, in Formula Student competition. The team brings students together to design and build a single-seat racing car.</p><p>It is a complete engineering challenge: understand a problem, develop a solution, manufacture it, and validate it under competition conditions. Our work spans the vehicle’s mechanical systems, electronics, and the communication and partnerships that make a season possible.</p><Action href="/departments">Explore our departments</Action></div></div><Photo src={assets.team} alt="Team Maverick at competition" wide /><div className="editorial-split"><h2>A CLASSROOM<br />WITHOUT <em>WALLS.</em></h2><div><p>Formula Student puts engineering decisions to the test. Teams must explain their designs, consider costs, and demonstrate how their vehicles perform in dynamic events.</p><p>For Maverick, the workshop is where disciplines meet: chassis, vehicle dynamics, aerodynamics, braking, transmission, and powertrain / LV. Sponsorship & PR and the media team tell the story and build relationships around that work.</p></div></div><Callout /></>;
}
function Cars() {
  return <><div className="car-feature"><Photo src={assets.car} alt="Avira 2.0 on track" /><div><span className="eyebrow">2025 / SUPRA SAE INDIA</span><h2>AVIRA <em>2.0</em></h2><p>The latest challenger featured on the team’s official website. All India Rank 1 in the combustion vehicle category at SUPRA SAE India 2025.</p><Action href="/cars/avira-2">Explore Avira 2.0</Action></div></div><div id="heritage"><SectionLabel number="02">THE VEHICLE ARCHIVE</SectionLabel><h2>BEFORE THE<br /><span className="muted">NEXT CHAPTER.</span></h2><div className="car-history"><article><Photo src="/images/avira-2024.png" alt="Avira at Formula Bharat 2024" /><h3>AVIRA</h3><p>Formula Bharat / 2024</p></article><article><Photo src="/images/supra-2024.jpg" alt="Avira at SUPRA 2024" /><h3>AVIRA</h3><p>SUPRA / 2024</p></article></div><p className="source-note">Names, event labels, and images follow the team’s official car archive. The two 2024 entries represent published competition appearances.</p></div><Callout title="Understand the engineering." href="/departments" cta="Meet the departments" /></>;
}
function Departments() {
  return <><div className="directory">{departments.map((d, i) => <Link href={`/departments/${d.slug}`} className="directory-row" key={d.slug}><span>{String(i + 1).padStart(2, '0')}</span><h2>{d.name}</h2><p>{d.short}</p><ArrowUpRight size={24} /></Link>)}</div><Callout /></>;
}
function Achievements() {
  return <><div className="editorial-split"><div><span className="eyebrow">SUPRA SAE INDIA / 2025</span><h2 style={{ marginTop: 20 }}>ALL INDIA<br /><em>RANK 01.</em></h2></div><div><p>Avira 2.0 took the overall win in the combustion vehicle category, according to the results published by Team Maverick.</p><p>The same published record includes first places in acceleration and skidpad, second in endurance, and third in autocross.</p></div></div><Photo src={assets.trophies} alt="Trophies and awards photographed by Team Maverick" wide /><h2>THE 2025 RECORD</h2><table className="results-table"><caption className="sr-only">Team Maverick’s published SUPRA SAE India 2025 results</caption><thead><tr><th scope="col">Competition</th><th scope="col">Event</th><th scope="col">Rank</th></tr></thead><tbody>{results.map(r => <tr key={r.event}><td>SUPRA SAE India 2025</td><td>{r.event}</td><td>{Number(r.rank)}<sup>{r.suffix}</sup></td></tr>)}</tbody></table><p className="source-note">Source: <a href="https://www.tmaverick.in/avira2" target="_blank" rel="noopener noreferrer" className="underline">Team Maverick’s Avira 2.0 page</a>. Published team results; independently issued timing sheets are not included in this V1.</p><Callout title="Meet the car behind the results." href="/cars/avira-2" cta="Explore Avira 2.0" /></>;
}
function Sponsors() {
  return <><div className="editorial-split"><h2>BEHIND EVERY<br /><em>BREAKTHROUGH.</em></h2><div><p>Formula Student brings education and industry together. Our partners help put engineering tools and manufacturing possibilities within reach of student ambition.</p><p>These organisations are listed on the official Team Maverick website. We display the original logos with equal prominence because published sponsorship tiers are unavailable.</p></div></div><SponsorGrid /><div className="callout"><div><h2>BUILD SOMETHING WITH US.</h2><p>Speak to the team about a sponsorship or technical partnership.</p></div><Action href="/contact">Become a partner</Action></div></>;
}
function Team() {
  return <><Photo src={assets.team} alt="Team Maverick’s student team at a competition" wide /><div className="editorial-split"><h2>THE EXPERIENCE<br /><em>STAYS WITH YOU.</em></h2><div><p>Teamwork is built in design reviews, manufacturing sessions, and competition days. Students learn to take responsibility for a system while working toward a shared vehicle.</p><p>The official alumni archive documents how former Mavericks carry this experience into engineering, research, and other careers.</p></div></div><SectionLabel number="02">FROM THE ALUMNI ARCHIVE</SectionLabel><div className="alumni-grid">{alumni.map(a => <article key={a.name} className="alumni-profile"><div className="alumni-portrait"><Image src={a.image} alt={a.name} fill sizes="140px" /></div><div><h3>{a.name}</h3><span className="eyebrow">{a.role}</span><p>{a.description}</p></div></article>)}</div><p className="source-note">Paraphrased reflections from the official alumni archive; these are not direct quotations. A verified current-season member roster is not yet available.</p><Action href="https://www.tmaverick.in/alumni" external>Read the alumni archive</Action><Callout /></>;
}
function Join() {
  return <><div className="editorial-split"><Photo src={assets.team} alt="Join the students behind Team Maverick" /><div><h2>BRING YOUR<br /><em>WILL TO BUILD.</em></h2><p style={{ marginTop: 25 }}>From vehicle systems to media and partnerships, the team brings together different skills around one engineering challenge.</p><p>Applications use the form linked from the official Team Maverick website. Check that form or contact the team for current recruitment dates and eligibility.</p><Action href={site.apply} external>Open official application</Action></div></div><div className="editorial-split"><div><SectionLabel number="02">YOUR FIRST STEPS</SectionLabel><h2>START WITH<br /><span className="muted">CURIOSITY.</span></h2></div><div className="numbered-steps"><div><section><h3>Find your discipline</h3><p>Explore our departments and think about the work that interests you.</p><Link href="/departments" className="text-link">Meet the departments <ArrowUpRight size={15} /></Link></section></div><div><section><h3>Tell us about yourself</h3><p>Use the official application form. Explain your interests and what you hope to learn.</p></section></div><div><section><h3>Stay in touch</h3><p>Follow the team’s official channels for updates. The team will provide current details about its selection process.</p></section></div></div></div></>;
}
function Contact() {
  return <><div className="editorial-split"><div><SectionLabel number="01">AT THE WORKSHOP</SectionLabel><h2>FIND US<br /><em>IN PUNE.</em></h2><p className="contact-address" style={{ marginTop: 28 }}>{site.institution}</p><p>{site.address}</p><Action href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.institution + ' ' + site.address)}`} external>Get directions</Action></div><div><SectionLabel number="02">OFFICIAL CHANNELS</SectionLabel><p>For sponsorship, technical collaborations, and general enquiries, message the team through its official social profiles.</p><div className="contact-options"><Action href={site.instagram} external>Instagram</Action><Action href={site.linkedin} external>LinkedIn</Action><Action href={site.apply} external>Recruitment application</Action></div><p className="source-note">A current public team email address and telephone number could not be verified. Contact links point to the channels published on the official website.</p></div></div><Photo src={assets.team} alt="Team Maverick in the paddock" wide /></>;
}
const contents: Record<string, React.ComponentType> = { about: About, cars: Cars, departments: Departments, achievements: Achievements, sponsors: Sponsors, team: Team, join: Join, contact: Contact };
export default async function ContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!pages[page]) notFound();
  const Content = contents[page];
  return <main id="main"><Motion><PageIntro {...pages[page]} /><div className="page-content"><Content /></div></Motion></main>;
}
