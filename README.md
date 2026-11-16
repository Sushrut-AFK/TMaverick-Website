# Team Maverick website

Next.js 16 / React 19 website for Team Maverick, the Formula Student team from PVG's College of Engineering and Technology, Pune.

## Local development

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000. To preview on a phone, use the development server's Network URL while both devices are connected to the same Wi-Fi.

## Project structure

- `src/app/page.tsx`: photographic homepage with the latest car, engineering, team, achievements, partners, and recruitment.
- `src/app/[page]/page.tsx`: editorial pages for the team, cars, achievements, sponsors, recruitment, and contact.
- `src/components/motion.tsx`: scoped GSAP hero entrances, reveals, image masks, and parallax.
- `src/components/engineering.tsx`: scroll-driven department narrative.
- `src/components/exploded-car.tsx`: lazy-loaded Three.js scene with a temporary licensed Formula Student model, assembly slider, and department highlighting.
- `src/components/photo-viewer.tsx`: photo hover interactions and native dialog viewer.
- `src/components/sponsors.tsx`: accessible sponsor loop with pause, hover/focus control, and a reduced-motion grid.
- `src/app/refinements.css`: spacing and interaction/scene styles.
- `src/data/site.ts`: central facts, departments, results, partners, alumni, official links, and primary assets.
- `public/images/`: authentic assets downloaded from Team Maverick.
- `public/fonts/`: locally hosted Barlow Condensed and Inter, with OFL licences.
- `research/`: source snapshots and asset/content provenance.
- `scripts/verify.mjs`: browser route, responsive, accessibility, navigation, and animation checks.

## Animation architecture

`Motion` uses `gsap.context` and `gsap.matchMedia` to scope and clean up hero entrances, section reveals, image masks, and desktop parallax. The reduced-motion preference bypasses these timelines. Content is rendered visibly on the server; animation is progressive enhancement, with no CSS hiding content before JavaScript loads.

Engineering uses native document scrolling and CSS sticky positioning. ScrollTrigger drives part separation in a lazy-loaded Three.js scene and highlights the current department. The scene renders on demand rather than running an idle animation loop. Reduced motion keeps the car assembled; the keyboard-accessible slider still allows deliberate manual inspection. Resource cleanup covers animation frames, observers, fetches, geometries, materials, and the renderer.

The temporary 3D scene uses the BSD-licensed MathWorks Formula Student model. It is visibly labelled **temporary / not Avira 2.0**. Source CAD, wheel geometry, and suspension hardpoints are preserved; separation distances are illustrative. No engine/electronics internals are invented. See `public/models/formula-student/SOURCE.md` and `LICENSE.txt`. Replace the GLB and its per-node `extras.explode` / `extras.focus` metadata with Avira's approved model when available.

The sponsor strip uses a seamless CSS loop with one accessible set of links, decorative duplicates, explicit pause/play, and pause on hover/focus. Reduced-motion and no-JavaScript visitors get a still grid. Photo enlargement uses native `dialog` focus trapping and Escape handling. Hover transforms use CSS `scale`, so they do not overwrite GSAP parallax transforms.

## Browser verification

Chrome must be installed. Start the completed production build in one terminal, then:

```powershell
npm.cmd run typecheck
$env:TEST_URL='http://localhost:3000'
node scripts/verify.mjs
node scripts/verify-interactions.mjs
```

The scripts write screenshots and JSON reports under ignored `test-results/`. They check 18 routes, a 404, widths 360/390/768/1440/1920, visible image loading, overflow, automated WCAG A/AA rules, mobile focus cycling/Escape/navigation, scroll-driven assembly, keyboard assembly controls, sponsor animation/pause, photo hover/viewer/Escape/focus restoration, reduced motion, and content with JavaScript disabled. Automated checks do not establish complete accessibility or Core Web Vitals compliance.

## Content and remaining inputs

See `research/SOURCES.md` and `research/asset-manifest.json`. All photographs, logos, portraits, results, and specifications come from the official team website. The separate temporary 3D demo is credited to MathWorks and is not Avira. Copy is newly written; alumni reflections are paraphrased and explicitly labelled. No invented member roster, dates, sponsor tiers, or vehicle figures are included.

The official recruitment form and official social accounts provide working external paths; there is no form submission backend. The project runs locally; no public deployment is configured here.
