# Aerocadmy

Next.js 14 App Router website with a continuous, scroll-driven drone assembly and learning journey.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. On Windows PowerShell with script execution restrictions, use `npm.cmd` instead of `npm`.

## Checks

```sh
npm run typecheck
npm run lint
npm run check:assets
npm run build
```

Run `npm run start` after a successful production build. Development uses `.next-dev` and production uses `.next`, preventing their caches from overwriting each other.

## Source and images

- `src/app`: page, metadata and global styles.
- `src/components/hero/DroneHeroAssembly.tsx`: client animation, image-load lifecycle and native scroll timeline.
- `src/lib/assets.ts`: canonical image paths and CSS display cropping.
- `src/lib/image-bounds.json`: visible component bounds, excluding transparent padding.
- `public/component images`: hero assembly source images, served by Next.js as `/component%20images/...`.
- `public/images`: generated industry and course visuals; each source atlas is displayed in separate quarters using CSS.
- `docs/asset-prompts`: retained generation notes.
- `index-main.html`: legacy prototype. Its file references use the same public component directory; no embedded image data.

The source PNG files are unchanged. CSS crops their transparent padding to preserve the component sizes and anchors used by the animation. Run `node scripts/inspect-image-bounds.cjs` after replacing a source component image to update its display bounds.

The timeline is bare frame -> battery -> flight controller -> sensor -> clean body frame -> camera and four propellers. The completed assembly retains the latest battery/controller/sensor rather than swapping back to an older drone photograph. No Previous/Next controls or scroll snapping are used.

## Course catalogue and waitlists

The homepage and `/courses` show the planned recorded catalogue in Engineering
Foundations and Industry Applications. Each `/courses/[slug]` preview contains its
outline, prerequisites, outcome, proposed project, resources, and course-specific
waitlist. The live internship is a separate `/programs/drone-technology-internship`
page. No recorded-course prices, durations, release dates, or certificates are set.

`POST /api/waitlist` validates name, email, phone, and a known `courseSlug`. It
returns 201 only after saving the submission to the Supabase
`waitlist_entries` table. The server-only Supabase service-role key is required;
there is no public endpoint for reading submissions, and submitting does not send
email or SMS. Apply the SQL migration in
`supabase/migrations/20261022000000_initial.sql` before starting the app.

## Learning direction and counselling

The homepage course finder maps interests to the Fundamentals course, either
recorded-course path, or the live internship. `/courses?path=engineering` and
`/courses?path=applications` open the matching catalogue filter. Unknown path
values show the full recorded catalogue.

The following counselling section collects profession, optional field of study or
work, drone experience, primary interest, goal, learning format, contact details,
optional callback window, and optional questions. Answers persist when moving
between the three steps. The stated callback window is a preference in IST, not
a booked appointment. Success appears only after a server save.

`POST /api/counselling` validates the choices and contact details and saves the
complete answers to the Supabase `counselling_requests` table, including the
contact request, timestamp, and callback timezone. No public reading endpoint,
automatic phone call, email, or SMS is provided.

The Supabase migration also creates `payment_events` for verified Razorpay
webhook auditing and the `marketing-public` Storage bucket for public brochure
assets. See `docs/razorpay-setup.md` for environment variables and asset upload.

## Other integration still needed

Run only one development server per generated cache directory. The normal server uses `.next-dev`; a separate preview must set `NEXT_DEV_DIR=.next-preview` and use another port. Changing the port alone does not isolate Next.js output. Production builds use `.next`.

The advisor form and newsletter currently simulate successful submission locally. They do not send requests or store data. Connect these to a real backend before offering them to visitors. The footer privacy, terms and safety anchors also have no corresponding pages/sections yet.

The production dependency audit also flags the installed Next.js 14.2.35 and its nested PostCSS. A patched framework upgrade is required before Windows hosting; see the migration review for the official advisory and patch versions.

See `docs/review/migration-review.md` for the migration findings and validation.
