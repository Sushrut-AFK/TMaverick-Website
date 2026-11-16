# V1 verification — 14 November 2026

Executed locally on Windows, Node 24.18, Next.js 16.4.6, React 19.3.1, Tailwind 4.3.5, GSAP 3.15.1. Dependency versions are captured by `package-lock.json`.

| Check | Result |
| --- | --- |
| `npm.cmd run lint` | Passed, zero errors and warnings |
| `npm.cmd run typecheck` | Passed |
| `npm.cmd run build` | Passed; all 18 content routes prerendered |
| Production browser verification | Passed, `node scripts/verify.mjs`, Chrome headless |
| Content routes | 18/18 returned HTTP 200, each with one H1 |
| Unknown route | Returned HTTP 404 |
| Homepage viewport widths | 360, 390, 768, 1440, 1920 pixels; no document overflow |
| Homepage imagery | All loaded at all five tested widths |
| Mobile menu | Escape restores trigger focus; Tab cycles inside menu; navigation closes menu |
| Animation | Active department changes on scroll; no uncaught browser errors |
| Reduced motion | Browser viewport/image tests run with reduced motion enabled |
| JavaScript disabled | Hero and engineering headings remain available |
| Axe automated WCAG 2 A/AA and 2.1 AA | No violations on home, Join, Contact, Departments, and mobile menu |
| Development server | Homepage returned HTTP 200 on localhost:3001 |
| Production dependency audit | `npm.cmd audit --omit=dev --json`: zero vulnerabilities |

Visual review included the desktop hero, full desktop homepage, mobile hero, active engineering story, and mobile menu. Browser artifacts and the machine-readable report are under ignored `test-results/`.

The checks found and resolved a mobile engineering-grid overflow and light-section text contrast issues. A development warning about image quality was resolved by explicitly allowing qualities 75 and 90 in Next.js configuration.

## Practical limits and remaining work

- No public deployment was requested or performed. A local development preview can remain running when requested by the user.
- No real-device, Safari, Firefox, screen-reader, Lighthouse, or field Core Web Vitals audit was performed. Automated accessibility checks are partial coverage.
- Main car photography from the official site is only 748 × 500; high-resolution originals remain the most valuable visual upgrade.
- Current roster, recruitment dates/eligibility, sponsorship tiers/current contractual status, direct email/phone, more vehicle measurements, and independent competition score sheets remain unverified.
- Asset publication rights need confirmation before public launch. Original URLs are recorded in the asset manifest.
- The full development-dependency audit reports eight moderate entries in the ESLint / TypeScript-ESLint / minimatch chain. The production-only audit is clean. No forced major dependency overrides were introduced.
- The current exploded view is a clearly labelled, BSD-licensed MathWorks Formula Student demonstration. Avira-specific CAD remains unavailable and must replace it later. The source and limitations are recorded in `public/models/formula-student/SOURCE.md`.
- The official application form and social links were copied from the team’s published links; submission, recruitment availability, and external account ownership were not tested.

## Interaction update verification

After the user authorised a temporary open-source FSAE model, added a 35-node licensed CAD scene, sliding sponsor strip, photo hover effects and viewer, and cleaner spacing. The final production build and lint passed. Both browser scripts passed against the production server: all 18 routes, all five widths, visible image loading, and previous navigation checks; plus actual WebGL loading, scroll separation, assembled/exploded keyboard control, marquee movement and pause, photo hover, dialog Escape/focus restoration, and reduced motion. No uncaught page errors or automated WCAG A/AA violations were reported on the checked pages, mobile menu, or photo dialog. The local development preview remains at http://localhost:3000 for the user.
