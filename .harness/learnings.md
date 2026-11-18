# Learnings

(distilled by the curator; every session reads this first. Keep it short and true.)

## Run and test
- Start/smoke: `bash .harness/init.sh` (idempotent; bundle install into vendor/bundle, build, Jekyll dev server on http://127.0.0.1:4000, pid in .harness/server.pid, smoke-checks /blog/pi-bench-harness-iterations/ for `page__title`).
- Server runs with `--no-watch`: after EVERY edit run `bash .harness/build.sh` (quiet build into _site; errors in /private/tmp/hllj_jekyll_build.log) before verifying in the browser.
- Verify commands per feature: `.harness/feature-list.sh show <ID>` (the `verify` array, usually build + grep over _site).
- Good test posts: pi-coding-agent-setup (blockquotes, code), pi-bench-harness-iterations (tables, no images), rsna-knee-abnormality-detection-wrap-up (6 images). Paths are /blog/<slug>/.
- Browser checks: measure DOM at 375/768/1280 (documentElement scrollWidth == viewport). Screenshots in the pane were sometimes blank; DOM measurements via JS work.

## Conventions
- Post UX styles: `_sass/minimal-mistakes/_post-ux.scss` (imported from `_sass/minimal-mistakes.scss`). Post UX behavior: `assets/js/post-ux.js`, loaded (defer) from `_includes/footer/custom.html`.
- Post layout tweaks (lazy imgs) live in the single.html layout via Liquid; build-time image dims in `_plugins/img_dimensions.rb` (post_render hook).
- Scope selectors to `.page__content` so teasers/related cards/avatars are untouched.
- JS enhancements (table wrap, lightbox, copy button, TOC scroll-spy) are DOM-only; source HTML has no wrappers. Keep them idempotent (no double wrapping).
- Workflow commit pattern: `F0xx: claim`, `F0xx: <desc>`, `tester: F0xx pass|fail`.

## Gotchas
- Do add intrinsic width/height at build time (F016): JS-set dims after load still cause layout shift and unloaded lazy imgs measure height 0.
- Avoid relying on the local Jekyll plugin on classic GitHub Pages builds: it only runs with Actions/local build; remote images get no dims.
- Captions rely on markdown `![](..)` followed by `*caption*` (em right after img) or figcaption.
- Wide content: put long code/tables in internal scroll containers (pre overflow-x auto, div.table-wrap); inline code needs `overflow-wrap:anywhere`, else page scrollWidth exceeds viewport.
- Text column is only ~402px wide at 768 and 1280 (layout issue, relevant to F025/F026/F036).
- Related-post teaser images are outside post-image styling; lightbox skips images inside links and teasers.
- Tester independently injects probes (long strings, forced widths); self-check the same edge cases before claiming.
- Contrast (F035): do audit text contrast against the real page bg (#eee) with a JS pass before claiming; the old accent #2a6df4 (3.94:1) and footer #0092ca (3.52:1) failed AA. Current AA-safe tokens: link #1c55c4, muted #565e66, footer/TOC header #00688f, share btn #1a6fb0 (_post-ux.scss end, ~line 740). Reuse these; do not reintroduce lighter blues.
- prefers-reduced-motion cannot be emulated in the browser pane; tester checks the CSS only.

## Decisions
- None from humans so far. Contrast target: dark text on tinted bg, AA or better (F018 used #1f2933, ~13:1).

## Open risks
- Remaining: F035 (retest), F036-F042; earlier F019-F034 done except dark mode F020/F021 if still open (dark mode F020/F021, nav/cards F029/F030, blog index F032/F033, responsive audit F036, print F037, SEO F038, 404 F039, search F040, footer F041, final review F042). New CSS must be checked again in dark mode once F020 lands.
- F035 retry (contrast fix) awaits tester; dark mode contrast unchecked until F020.
- Remote images get no dimensions; classic Pages builds skip _plugins.
