# ADR-0011 · Phones get the same experience in a cheaper form; Chrome and Safari are both first-class

- Status: accepted · Date: 2026-09-06

## Context

The first mobile pass (September 5) protected performance by switching things off below 900 px or on touch devices: the sky stopped twinkling, nebula gas stopped drifting, the trajectory's solar system became a static picture above the entries, and section backdrops were a 16:9 photo stretched behind sections several screens tall (a blurry sliver). Rubo reviewed the site on his phone and asked for the opposite: phones must keep the animations, adapted, and the site must look right in Chrome and Safari. Separately, closing interactions (leaving a nebula, returning from the CV) had no animation while opening ones did, and the browser's root cross-fade stacked with the dome shutter.

## Decision

1. **Adapt, do not remove.** Below 900 px / on coarse pointers every animation exists in a cheaper form: sky twinkle at 12 fps (1 fps only under `saveData` or low `deviceMemory`), nebula gas drift at half speed (transform-only), backdrop breathe kept. Only `prefers-reduced-motion` switches motion off.
2. **Trajectory on phones**: the solar system is a 7.5 rem **sticky strip** under the nav (`order: -1`, gradient to the page background); entries scroll under it and the camera keeps gliding to the planet of the entry being read.
3. **Section backdrops on phones** become a band at the top of the section (`height: min(70vh, 32rem)`) that fades into the background, so the photo keeps its framing; the credit moves to the band's top edge.
4. **Closing mirrors opening**: nebula panels leave with `.panel.is-leaving` (`sink`, 320 ms) before `hidden`; the "back" button returns focus to the nebula. The dome shutter is the only page transition (`::view-transition-*(root)` animations are off) and is fail-safe: it reopens on `astro:page-load` and after a timeout even if a navigation aborts.
5. **Test in both engines**: Playwright runs the smoke suite in Chromium (desktop, Pixel 7) and **WebKit** (Desktop Safari, iPhone 14), locally and in CI. WebKit is the Safari engine; it is the only way to catch Safari-only behaviour from Windows or Linux.
6. **CSP without `upgrade-insecure-requests`**: WebKit applies it even to `http://127.0.0.1`, which broke every font and navigation in the Safari-engine tests against `astro preview`; HTTPS is already forced by the `.dev` HSTS preload and by Cloudflare.

## Consequences

- Lighthouse mobile may move a few points because of the 12 fps twinkle; the CI workflow records it. If it drops below 75, lower the phone twinkle to 8 fps before removing it.
- Any new animation must ship with its phone form and its reduced-motion form in the same commit (`docs/DESIGN.md` → Responsive and browser rules).
- The e2e suite takes roughly twice as long (four projects, `workers: 1`).
- Lightning CSS (via Tailwind 4) already emits `-webkit-` prefixes such as `-webkit-backdrop-filter`; do not hand-write vendor prefixes.
