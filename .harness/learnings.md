# Learnings

(distilled by the curator; every session reads this first. Keep it short and true.)

## Run and test
- Start/smoke: `bash .harness/init.sh` (idempotent; bundle install into vendor/bundle, build, Jekyll dev server on http://127.0.0.1:4000, pid in .harness/server.pid, smoke-checks /blog/pi-bench-harness-iterations/ for `page__title`).
- Server runs with `--no-watch`: after EVERY edit run `bash .harness/build.sh` (quiet build into _site; errors in /private/tmp/hllj_jekyll_build.log) before verifying in the browser.
- Verify commands per feature: `.harness/feature-list.sh show <ID>` (the `verify` array, usually build + grep over _site).
- Good test posts: pi-coding-agent-setup (blockquotes, code), pi-bench-harness-iterations (tables, no images), rsna-knee-abnormality-detection-wrap-up (6 images). Paths are /blog/<slug>/.
- Visual checks: the Browser pane screenshots are blank and smooth scroll/CSS transitions stall there. Use real headless Chrome (`--headless=new --virtual-time-budget=5000 --screenshot=...`, then view the image); for 375px use iframe measurement (headless min layout width is wider); disable transitions before reading dark-mode computed colors (head script resets theme, so dark screenshots are unreliable).
- Measure DOM at 375/768/1280 (documentElement scrollWidth == viewport) in light and dark.

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

- Coder must run the claim command (`F0xx: claim`) or the tester is skipped and a session is wasted.
- scrollWidth and overlap-free rectangles alone missed real defects (masthead tagline overlap, TOC spacing, second rule behind cards): test the user's reported symptom directly (elementsFromPoint scans, screenshots).
- Blog index: grid is CSS grid at end of _post-ux.scss (1/2/3 cols); the old float grid__item span() left a third empty. Archive back-to-top uses `.archive__back-top`; `.back-to-top` is the floating post button only (do not reuse the class).
- New feature ids are assigned in approval order: approve proposals that others depend on first.

## Decisions
- None from humans so far. Contrast target: dark text on tinted bg, AA or better (F018 used #1f2933, ~13:1).

## Open risks
- Dark mode (F020/F021) is DONE and passing; new CSS must still be checked in dark mode (note: dark-mode year pill counts on /blog/ are nearly invisible).
- Backlog TODO: F052-F057 (author sidebar consistency/spacing/duplicate Email, home Recent posts cards/tags/heading). 51/57 passing.
- Remote images get no dimensions; classic Pages builds skip _plugins.
