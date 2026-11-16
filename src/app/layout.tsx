import type { Metadata, Viewport } from 'next';
import { Header, Footer } from '@/components/shell';
import { PhotoViewer } from '@/components/photo-viewer';
import './globals.css';
import './refinements.css';

export const metadata: Metadata = {
  title: { default: 'Team Maverick — Engineered with intent.', template: '%s | Team Maverick' },
  description: 'Meet Team Maverick, the Formula Student team from PVG’s College of Engineering and Technology, Pune. Explore Avira 2.0, our engineering, and the people behind the car.',
  icons: { icon: '/images/logo-trimmed.png' },
};
export const viewport: Viewport = { themeColor: '#0d1010' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PhotoViewer><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /></PhotoViewer></body></html>;
}
