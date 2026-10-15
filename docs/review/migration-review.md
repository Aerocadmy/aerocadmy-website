# Next.js migration review

Reviewed the App Router entry points, configuration, all page components, animation lifecycle, asset mapping, dialogs, search, filtering and responsive layouts. The initial production build and TypeScript check passed; the reported problems were predominantly visual and interaction regressions.

## Fixed

| Finding | Correction |
| --- | --- |
| Tiny motors/camera/controller and misplaced arm/motor attachment points | Source PNGs have large transparent canvases. Measured visible component bounds and applied CSS/SVG display cropping without changing the raster files. Cropped dimensions are available before playback starts. |
| Battery/controller/sensor/body images appeared at the wrong times | Restored separate battery, controller, sensor and body-frame assets to their respective timeline phases. The bare frame remains composed of its actual animated parts until the battery seats. |
| Completion reverted to older hardware and lost the latest battery/controller/sensor | Completion retains the current body/sensor image and finishes it with the existing animated camera and four propellers. |
| The old frame carried unwanted electronics | The body-frame entrance uses the cleaned bare-frame image. |
| Headline/buttons/features clipped below a short desktop viewport | Scaled the initial copy with the desktop canvas and supplied an initial hero height before hydration. |
| Mobile header and animation used conflicting heights | Replaced hardcoded 96px animation offsets with the shared responsive `--nav-h` value. |
| Mobile learning card overflowed the viewport and covered the scene | Stacked the mobile learning panel above the stage, constrained its width, and tightened mobile spacing. |
| Duplicate logo and crowded desktop navigation | Kept one properly sized wordmark; tablet navigation uses the menu drawer. |
| Missing orbit paths | The SVG clone inherited `display:none`; its displayed clone is now visible. |
| Images were measured before they loaded, and stale callbacks could survive Strict Mode cleanup | Wait for load/error before starting playback, measure complete bounds, and cancel pending listeners and animation frames when the effect cleans up. |
| React state was updated on every animation frame | Update lesson/visibility state only when those values change; the continuous timeline still reads actual scroll position directly. |
| Reintroduced clickable step controls | Removed the step pills. Native scrolling remains continuous; the initial assembly CTA and replay remain available. |
| Search keyboard shortcut only closed an already open modal | Navbar now owns the open/close shortcut. |
| Hardware search results scrolled to the explorer without selecting the matching part | Wired the selected result into the explorer. Lesson results now scroll to the corresponding timeline segment. |
| Category filters could retain an unrelated detail panel | Select a matching component when the category changes. |
| Advisor form retained the wrong program across successive track selections | Synchronize program selection when the dialog opens; reset submission/loading state and cancel the pending demo timer on close. |
| Dialogs lacked keyboard focus containment and usable field labels | Added Escape handling, focus trapping/restoration, background scroll lock, accessible names and associated labels. Mobile cards can scroll within the viewport. |
| Narrow comparison columns and colliding testimonial badges | Keep the comparison inside its own horizontal scroll region; badges can wrap. |
| Lint command required interactive setup | Installed the matching Next.js lint configuration and dependencies; lint is now non-interactive. |
| Development logged missing webpack cache files and stale hot-update requests | Give development its own `.next-dev` directory so a production build cannot overwrite a live development cache. |

## Asset cleanup

The canonical runtime images are the 15 PNGs in `public/component images`. `src/lib/assets.ts` centralizes their URL-encoded paths. Superseded images and byte-identical authoring copies were removed only after their replacement files were verified. Current generation notes are retained under `docs/asset-prompts`, outside the served image directory. The legacy HTML uses file references into the same public folder and contains no embedded raster image data.

`npm run check:assets` checks PNG existence/signatures, legacy image references, and absence of embedded raster image data. `scripts/inspect-image-bounds.cjs` only reads PNG pixels to generate layout bounds; it never changes the source images.

## Validation

- Desktop browser: opening hero, native forward/reverse scroll, each assembly phase, completed build and transition to following sections.
- Responsive browser: 390 x 844 mobile and 1024 x 768 tablet; no horizontal page overflow and correct 76px/96px sticky offsets.
- Search result selection, category/detail synchronization, Ctrl+K open and Escape close.
- First and second program buttons select the correct program in successive advisor dialogs.
- Mobile advisor form fits the viewport; Shift+Tab wraps from the first control to the last, and Escape closes the dialog.
- `npm run typecheck`: passed.
- `npm run lint`: passed with zero warnings/errors.
- `npm run check:assets`: passed for all 15 public PNGs and the legacy image references; no embedded raster image data.
- `npm run build`: passed; static home route generated successfully.

## Remaining integration / production gaps

1. Advisor and newsletter submissions simulate success in client state. They do not contact a backend or persist requests.
2. Footer privacy, terms and aviation-safety links point to sections that have not been implemented.
3. `npm audit --omit=dev` reports two vulnerable production packages: Next.js (critical) and its nested PostCSS (high). The installed Next.js is 14.2.35. The official Windows-hosted remote-code-execution advisory affects versions >=13.4 and <15.5.24; patched releases listed are 15.5.24 and 16.3.3. A framework upgrade is required before Windows hosting. No major framework migration or forced audit fix was mixed into these UI corrections.

Sources: [Next.js Windows advisory](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36), [Next.js 14 public assets](https://nextjs.org/docs/14/app/building-your-application/optimizing/static-assets), [Next.js 14 ESLint](https://nextjs.org/docs/14/app/building-your-application/configuring/eslint), [React effect lifecycle](https://react.dev/reference/react/useEffect).
