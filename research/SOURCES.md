# Content and asset provenance

Accessed 14 November 2026. Official Team Maverick pages are the primary content source. Website claims are attributed to the team rather than represented as independently certified results.

| Source | Used for |
| --- | --- |
| https://www.tmaverick.in/ | Logo, cyan brand accent, team/institution, eight actual departments, five competition results, sponsor logos, official application and social URLs, address |
| https://www.tmaverick.in/avira2 | Avira 2.0, SUPRA SAE India 2025, KTM 390cc engine, spaceframe, custom DAQ / PCBs / LV architecture |
| https://www.tmaverick.in/cars | Avira at Formula Bharat 2024 and SUPRA 2024; corresponding authentic photos |
| https://www.tmaverick.in/alumni | Alumni names, graduation years, team roles and paraphrased experiences |
| https://veloceracing.in/ | Requested reference: retrieved its HTML shell and metadata only; no claim of visual review |
| https://fonts.google.com/specimen/Barlow+Condensed | Condensed display font; SIL Open Font License included locally |
| https://fonts.google.com/specimen/Inter | Body font; SIL Open Font License included locally |

The first web retrieval of Team Maverick returned 503; direct retrieval subsequently succeeded. Original source HTML is preserved as `official-home.html`, `avira2.html`, and `cars.html` for verification. Do not use old source-page scripts in the application.

## Editorial decisions

- Original logo inspected on a dark background: white winged emblem. Cyan selected from official styling (#0D98BA) and visible blue/cyan car livery, adjusted slightly to #16A7C7 for this design.
- Published results: overall CV category AIR 1; acceleration 1st; skidpad 1st; endurance 2nd; autocross 3rd. Corrected source typo “2st” to “2nd”. Other ranks omitted because the source dynamically counts from zero and was not reliable enough to extract.
- “Powertrain / LV” retained as the actual department. Electronics & DAQ not invented as a separate department.
- 2024 archive entries are presented as event appearances, not asserted to be two separate chassis.
- Alumni reflections are paraphrases, not quote marks or fabricated testimonials. Current employers are omitted because they may change.
- Sponsor tiers, cash values, current-season contractual status, current member roster, founding year, vehicle mass, measured output, acceleration times, phone and email were not established.
- Google Maps uses a search for the verified institution/address, not fabricated geographic coordinates.

## Rights and replacement

Downloaded only publicly served original team assets for this local requested redesign. No third-party racing stock images or Veloce assets were used. No public deployment occurred. Ownership and permission to publish the team’s photographs and sponsor marks must be confirmed by the team before launch. Each downloaded file is mapped to its original URL in `asset-manifest.json`.

Replace imagery in `public/images` and update `src/data/site.ts` as needed. Higher-resolution landscape photography would materially improve desktop image quality: the source Avira 2.0 racing photo is 748 × 500. The logo derivative only trims transparent padding and resizes the original.

## Temporary 3D demonstration added at the user's request

The user explicitly requested an open-source Formula Student substitute until Avira CAD becomes available. The model is from https://github.com/simscape/Formula-Student-Vehicle-Simscape at commit 6bcec3828e49102f21841b3239bfaf3632dfec8d. The full upstream BSD redistribution licence is retained in public/models/formula-student/LICENSE.txt. CAD conversion, wheel meshes, hardpoint-based suspension links, and editorial changes are described in public/models/formula-student/SOURCE.md. This demonstration is visibly identified as not Avira 2.0 and does not supply or imply specifications for Team Maverick's car.
