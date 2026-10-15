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
- `public/component images`: the single active image directory, served by Next.js as `/component%20images/...`.
- `docs/asset-prompts`: retained generation notes.
- `index-main.html`: legacy prototype. Its file references use the same public component directory; no embedded image data.

The source PNG files are unchanged. CSS crops their transparent padding to preserve the component sizes and anchors used by the animation. Run `node scripts/inspect-image-bounds.cjs` after replacing a source component image to update its display bounds.

The timeline is bare frame -> battery -> flight controller -> sensor -> clean body frame -> camera and four propellers. The completed assembly retains the latest battery/controller/sensor rather than swapping back to an older drone photograph. No Previous/Next controls or scroll snapping are used.

## Integration still needed

The advisor form and newsletter currently simulate successful submission locally. They do not send requests or store data. Connect these to a real backend before offering them to visitors. The footer privacy, terms and safety anchors also have no corresponding pages/sections yet.

The production dependency audit also flags the installed Next.js 14.2.35 and its nested PostCSS. A patched framework upgrade is required before Windows hosting; see the migration review for the official advisory and patch versions.

See `docs/review/migration-review.md` for the migration findings and validation.
