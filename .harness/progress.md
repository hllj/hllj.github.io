# Progress log

(append-only; one entry per session)

## 2026-11-18 - Initializer
Goal: Improve the UI/UX for my blog pages with post page.
Existing site: Jekyll 4.4 + Minimal Mistakes 4.22 theme (vendored in _layouts/_includes/_sass; remote_theme in _config.yml but local files used), skin "air", Disqus comments (production only), lunr search, paginate 5. Posts in _posts/<category>/. Post layout: _layouts/single.html; styles: _sass/minimal-mistakes/*.scss via assets/css/main.scss; custom hooks: _includes/head/custom.html, _includes/footer/custom.html. Vendored JS is built with npm (assets/js/main.min.js); new JS should go in a separate assets/js/post-ux.js.
Assumptions: scope is the post page first, then blog index/archives for consistency. Reference posts: /blog/pi-bench-harness-iterations/ (code), /blog/pi-coding-agent-setup/ (code-heavy), RSNA Knee wrap-up (Vietnamese, wide, images). Do not rewrite post content.
Run: .harness/init.sh (bundle install into vendor/bundle, build, serve http://127.0.0.1:4000, smoke test). Server uses --no-watch: after edits run `bash .harness/build.sh` to refresh _site. Stop: .harness/stop.sh.
Test: no test suite exists; verify commands build with .harness/build.sh and grep _site output. Behaviour is verified by the tester in the browser (Playwright). Keep verify-grep markers (class names/ids) as named in the features.
Features: .harness/feature_list.json (42 features, F001-F042).
Notes: sass emits many deprecation warnings (harmless). Do not commit _site or vendor/bundle.

## 2026-11-18 - F001 (coder)
Baseline only, no code changes. init.sh passes (server up, smoke ok). Verify command passes: build.sh succeeds and _site/blog/pi-bench-harness-iterations/index.html contains page__title; h1.page__title served at http://127.0.0.1:4000/blog/pi-bench-harness-iterations/.
Known issues: none. Next: F002.

## 2026-11-18 - F001 (tester)
Ran init.sh (server up, smoke ok). curl of post page: 200, h1.page__title with title text, page__content present with 60 paragraphs. Probes: sibling post and home return 200. No browser used (HTTP-level check). Result: pass.

## 2026-11-18 - F002 (coder)
Added _sass/minimal-mistakes/_post-ux.scss (:root{--post-ux:1}) imported in minimal-mistakes.scss; assets/js/post-ux.js loaded with defer from _includes/footer/custom.html. Verified: verify command passes, script served 200 by local server. Known issues: none. Next: F003.

## 2026-11-18 - F002 (tester)
Ran init.sh (ok). Post page HTML includes defer post-ux.js; script served 200; main.css contains --post-ux: 1. In browser: data-post-ux="1" on html, computed --post-ux = 1, no console errors. Probe: home page also loads script. Result: pass.

## 2026-11-18 - F003 (coder)
Defined --pux-* tokens (type scale, spacing scale, accent, text/muted/border colors, content width) in _sass/minimal-mistakes/_post-ux.scss and applied them to .page__title, .page__content headings/body/links and .page__meta. Verified: verify command passes (--pux-accent in main.css), post page 200. Not visually checked in browser. Known issues: --pux-content-width is defined but not yet applied to layout (later width feature). Next: F004.

## 2026-11-18 - F003 (tester)
Rebuilt; --pux-accent in main.css. Browser (1024px) on /blog/pi-coding-agent-setup/ and pi-bench-harness-iterations: body 17px (token base), h2 30px, link color rgb(42,109,244)=accent, text rgb(36,41,47), meta 13px (xs), line-heights per tokens. Note: hero-overlay posts keep white title/meta and the overlay rule (1.953em) wins over the title token (~39px vs 38px); minor, out of scope (hero styling). --pux-bg/--pux-content-width not yet applied (coder noted). Result: pass.

## 2026-11-18 - F004 (coder)
Added Inter (Google Fonts, vietnamese subset) link in _includes/head/custom.html; --pux-font-body now Inter/Be Vietnam Pro stack; .page__content text blocks max-width 70ch, line-height 1.7, h2 border/weight, h4 muted. Verified in browser on RSNA wrap-up post: paragraph width ~750px at 17px (~72 chars), font Inter, lh 28.9px, h2 30px. Known issues: Google Fonts needs network; falls back to system stack offline. That post has no h3, so h3/h4 hierarchy checked only via CSS sizes (24/20px).

## 2026-11-18 - F004 (tester)
init ok; rebuilt; main.css has Inter. Browser 1280px on RSNA wrap-up: Inter loaded, lh 1.7 (32.5px), mb 27px, h2 33.75px/700 bordered, vietnamese glyphs ok. But p font-size 19.125px, width 845px, measured 72-88 chars/line (avg ~81) > ~75 limit. Post has no h3 (hierarchy only h2/h4; h4 is white in hero overlay). Result: fail (measure too wide at 1280).

## F004 retry (session 5)
Cause of prior fail: 70ch at 19.125px root (xl) gave ~81 chars/line. Changed .page__content text-block max-width to 50ch in _sass/minimal-mistakes/_post-ux.scss. Measured at 1280px on RSNA wrap-up (per-character range rects, 30 long paragraphs): mean 62.5, max 71 chars/line; max-width 603px. verify command passes. Note: _site must be rebuilt (bash .harness/build.sh) before measuring.

## F004 (tester, session 5)
Rebuilt; 1280px RSNA wrap-up: 37 long paragraphs measured per-character: mean 56, max 69 chars/line (<=75); Inter active, lh 32.5px (1.7), mb 27px, h2 33.75/700, h4 14.3/600 (no h3 in post). Probe: pi-coding-agent-setup p width 603px, no horizontal overflow. Result: pass.

## 2026-11-18 - F005 (coder, session 6)
Added _includes/post-meta.html (single row: date, "N min read", category chips), used in _layouts/single.html header and page__hero.html (overlay posts). Footer now only shows tags (removed duplicate categories/updated-date lines). Styles appended to _post-ux.scss (chips, overlay colors, title spacing). Verified: build ok, verify grep ok, browser screenshot of hero post shows single row. Known issues: none. Archive pages still use page__meta.html.

## F005 (tester, session 6)
init ok; rebuilt. Browser on pi-bench-harness-iterations (hero overlay) and pi-coding-agent-setup: title 39px, 12px margin, exactly one .page__meta--row in header: date, "N min read", category chip (links to /categories/#blog); no duplicate read-time/date/category in footer (only Tags). Screenshot confirms single row. No horizontal overflow at 1024px. Note: hero teaser paragraph sits between title and meta row (hero layout), judged acceptable. Result: pass.

## 2026-11-18 - F006 (coder, session 7)
Added fixed #reading-progress bar (only when page.date, i.e. posts) in _layouts/single.html, styles in _post-ux.scss, scroll logic (rAF, scaleX) in assets/js/post-ux.js. Verified in browser: scroll 0/50/100% gives scaleX 0/0.5/1, position fixed top 0; not in home page HTML; verify grep passes. Known issues: none.

## F006 Test report (tester, session 7)
init ok, rebuilt. Browser on pi-bench-harness-iterations: scroll 0/50/75/100% gives scaleX 0/0.5/0.75/1, bar fixed top 0, 3px, accent color, aria-valuenow updates. Reload at scrollY 5000 restores bar to 0.333. Not present on home or categories (and only 4 post pages include it). Note: rAF updates lag under very short waits in the pane; fine with 1s waits. Result: pass.

## 2026-11-18 - F007 (coder, session 8)
single.html: TOC auto-enabled for posts (page.date) with >=3 h2/h3 unless `toc: false`; label fixed to "On this page". _post-ux.scss: html smooth scroll (respects reduced motion), heading scroll-margin-top 4.5rem, and sticky right float TOC for `.wide` posts (MM disables the right sidebar there). Verified at 1280px on pi-bench-harness-iterations: 17 entries, aside position sticky, stays at top 27px after scrolling 2500px, hash target lands at 81px (masthead is not sticky). Smooth animation not observable in the hidden pane. Known issues: pi-coding-agent-setup has `toc: false` front matter so no TOC (explicit opt-out).

## F007 Test report (tester, session 8)
init ok, rebuilt. Built HTML: toc present on how-i-setup-this-blog, pi-bench-harness-iterations, rsna wrap-up; absent only on pi-coding-agent-setup (explicit toc:false opt-out, accepted). Browser 1280px on pi-bench-harness-iterations: label "On this page", 17 entries, aside position sticky, top 27px at scrollY 2500 and 5000 (and 7069), no horizontal overflow; clicking entry #9 lands heading in view (scroll-margin 81px, html scroll-behavior smooth). Animation itself not observable; screenshot pane was blank so JS measurements used. Result: pass.

## 2026-11-18 - F008 (coder, session 9)
Added TOC scroll-spy in assets/js/post-ux.js (rAF scroll handler; active = last heading whose top is within 120px of viewport top; last entry at page bottom; sets .is-active + aria-current) and .is-active styles (accent color, bold, left border, tint) in _post-ux.scss. Verified at 1280px on pi-bench-harness-iterations: exactly one active entry at all tested scroll positions, matching heading positions (e.g. scrollY 3244 -> "Những thay đổi chính", 5976 -> "Mình đã đổi gì từ v2 sang"). Note: html smooth scroll makes scrollTo animate, so wait/read scrollY after. Known issues: none.

## F008 Test report (tester, session 9)
init ok. Browser 1280x800 on pi-bench-harness-iterations (17 TOC entries). Swept scrollY 0..max step 700 (24 positions, 1.2s settle): exactly one .is-active entry, always equal to last TOC heading with top<=140px. Clicked TOC entry #10: after smooth scroll settles, that entry is the single active one, aria-current=true, 3px left border, weight 600, accent color; screenshot confirms. Notes: with <=250ms waits the pane lagged (rAF in hidden pane), not a product bug. At bottom of page the sticky TOC (818px) is taller than an 800px viewport so last entries may be cut off; minor, out of scope. Result: pass.

## 2026-11-18 - F009 (coder, session 10)
Mobile TOC collapsible: post-ux.js adds a toggle button + .toc--js/.is-open (click title toggles; link click collapses on <1024px); _post-ux.scss (max-width 1023px) makes the TOC static full-width, menu hidden unless open (max-height 60vh scroll). Verified at 375px on pi-bench-harness-iterations: collapsed by default (31px high, menu display none), tap expands (448px, aria-expanded true), no horizontal overflow; desktop 1024 keeps menu visible and toggle hidden. Known issues: without JS the TOC stays expanded. TOC sits at top of content (below hero teaser/meta).
