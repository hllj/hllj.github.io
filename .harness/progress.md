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

## F009 Test report (tester, session 10)
init ok, rebuilt. 375px on pi-bench-harness-iterations and how-i-setup-this-blog: TOC collapsed by default (31px, menu display none, aria-expanded false), toggle button or title click expands (448px capped / 156px, aria-expanded true), TOC link click collapses, re-toggle works, no horizontal overflow (scrollWidth 375). TOC sits at y~390-600, within first viewport. Screenshot pane blank so DOM measurements used. Result: pass.

## 2026-11-18 - F010 (coder, session 11)
Added _includes/anchor-headings.html (Liquid; appends a server-rendered "#" a.header-link to h1-h4 with ids; used in single.html for {{ content }}). Theme JS also injects runtime header-links, so post-ux.js removes those duplicates. CSS in _post-ux.scss: hidden until heading hover or link focus (always 0.5 opacity on hover:none devices). Verified at 4000: 17 headings each with exactly 1 link; clicking sets hash to the heading id. Known: :focus opacity not observable in unfocused pane (rule present in built CSS). Posts body headings are h1 in this blog, so h1 is included too.

## F010 Test report (tester, session 11)
init ok. pi-bench-harness-iterations: 17 content headings (h1/h2 in body) each have exactly 1 a.header-link ("#", href=#id, aria-label); no duplicates (theme runtime links removed); only id-less h4 is the TOC title (no anchor needed). Clicking a link sets location.hash to the heading's (unicode, percent-encoded) id. Opacity 0 by default, focus -> opacity 1; hover rule and hover:none 0.5 rule present in built CSS. Real mouse hover not reproducible in the pane (:hover never matched), so hover verified via CSS rules only. Other posts: link counts match id'd headings; home page has none. Result: pass.

## 2026-11-18 - F011 (coder, session 12)
Code blocks restyled in _post-ux.scss: dark theme (#161b22, text #e6edf3, token colors), 8px radius, 16/24px padding, mono stack 14px, language label bar via ::before per language class (bash/json/python/js/ts/yaml/etc; hidden for plaintext). Verified in browser on pi-coding-agent-setup: 4 blocks (json, bash x3) with radius 8px, padding, mono font, labels shown, no overflow. Known issues: languages outside the CSS list get no label.

## F011 Test report (tester, session 12)
init ok. pi-coding-agent-setup: 4 blocks (json, bash x3): radius 8px, padding 16/24, bg #161b22, text #e6edf3 (~14:1 contrast), ui-monospace 14px, language label shown via ::before ("json"/"bash"). Other posts: python blocks present, plaintext block gets no label (intended). 375px: no horizontal overflow, pre overflow-x auto. Inline code unaffected (light bg, dark text). Known issue (languages outside CSS list get no label) judged acceptable ("when known"). Result: pass.

## 2026-11-18 - F012 (coder, session 13)
Added copy button to every `.highlighter-rouge` block (post-ux.js appends button.code-copy; clipboard API with execCommand fallback; text "Copied" for 2s then "Copy"; "Failed" on error). Styles in _post-ux.scss (visible on block hover/focus, always on hover:none devices). Verified on pi-coding-agent-setup: 4 blocks/4 buttons; click -> "Copied", clipboard text equals block text, resets to "Copy" after ~2.3s; verify grep passes. Known issues: none.

## F012 Test report (tester, session 13)
init ok, rebuilt. pi-coding-agent-setup: 4 .highlighter-rouge blocks, exactly 1 button.code-copy each. Real clicks (not synthetic): text "Copied" at 0.5s and 1.5s, back to "Copy" by ~2.7s; navigator.clipboard.writeText received text equal to block text (multi-line, backslash continuations) for blocks 1 and 4. Probe: synthetic JS click without user activation gave "Failed" and reset to "Copy" (error path works, expected in unfocused pane). Button hidden (opacity 0) until hover/focus by design. Real paste check not possible in pane (cmd+v no-op). Result: pass.

## 2026-11-18 - F013 (coder, session 14)
Code blocks already scrolled internally (pre overflow-x auto from F011). Added to _post-ux.scss: inline code `overflow-wrap:anywhere` + `pre{max-width:100%}`. Verified at 375px on pi-coding-agent-setup: documentElement scrollWidth 375; 3 of 4 pre blocks have scrollWidth > clientWidth (scroll internally) and none exceed viewport; an injected 300-char inline code wraps (right edge 361px). Known issues: none.

## F013 Test report (tester, session 14)
init ok. 375px on pi-coding-agent-setup, pi-bench-harness-iterations, how-i-setup-this-blog: documentElement scrollWidth 375 on all, no element (outside pre) extends past viewport; pre overflow-x auto, long ones scroll internally (scrollWidth 447/441/415 > clientWidth 349). Probes: injected 400-char and long-path inline code (wrap, right edge 361px), 3800px-wide pre with CJK (scrollLeft works, page width stays 375), 300-char inline code in a table (right 363). Result: pass.

## 2026-11-18 - F014 (coder, session 15)
Added image/figure CSS to _post-ux.scss: img block, max-width 100%, height auto, centered, 8px radius; caption (em right after img, or figcaption) centered, italic, 0.85rem, muted color. Verified on rsna-knee wrap-up at 375/768/1280: 6 images fill the content column (right edge within column), scrollWidth == viewport, radius 8px, captions styled. Known issues: captions rely on the "![](..)\n*caption*" markdown pattern.

## F014 Test report (tester, session 15)
init ok. rsna-knee wrap-up at 375/768/1280: 6 content images (SVG, natural 1200px) fill their paragraph/column exactly (375: 12..363; 768/1280: width 402 = paragraph width, 0px offsets), display block, radius 8px, documentElement scrollWidth == viewport at all three. Captions (em after img) italic, centered, 0.85rem, muted rgb(91,101,115) for all 6. 4 other imgs on page are related-post teasers (outside scope, unrounded). Screenshot pane blank; DOM measurements used. Note: text column is only ~402px wide at 768 and 1280 (layout, not F014). Result: pass.

## 2026-11-18 - F015 (coder, session 16)
Added image lightbox in post-ux.js (click/Enter on .page__content img opens fixed overlay with full-size img + close button; Esc, overlay click or button closes; focus returns to the opener; body scroll locked) plus styles in _post-ux.scss. Skips images inside links and related/archive teasers. Verified on rsna-knee wrap-up: 6 triggers; open -> overlay, focus on close button, natural width 1200; Esc closes and focus returns; overlay click closes and focus returns; verify grep passes. Known issues: none.

## F015 Test report (tester, session 16)
init ok. rsna-knee-abnormality-detection-wrap-up (6 triggers). Open: fixed full-viewport overlay (z 10000), focus on close button, full-size 1200px image shown at 960px, html scroll locked. Esc closes, focus returns to opener, scroll restored. Enter on focused image opens; close button, overlay click and clicking the big image all close and return focus. Rapid double click yields one overlay. Teaser images (related) do not open it. Esc/Tab handled via keydown trap. Real mouse not used (synthetic clicks in pane). Result: pass.

## 2026-11-18 session 17 - F016
Layout single.html adds loading="lazy" decoding="async" to all content imgs via Liquid replace; post-ux.js ensures lazy/async/alt and sets width/height from natural size on load (CSS height:auto keeps ratio). Verified: rsna wrap-up built HTML has 6 lazy imgs; verify grep passes. Known: width/height only set after load (no intrinsic dims in markdown source); pi-bench post has no images.

## F016 Test report (tester, session 17)
init ok. rsna wrap-up: 6/6 content imgs have loading=lazy, decoding=async, alt; teaser/avatar imgs untouched. Probe: built HTML has no width/height/aspect-ratio on any content img; JS adds dims only after load, and an unloaded lazy image measures height 0, so layout still shifts on load. Result: FAIL (layout-shift part of description unmet).

## 2026-11-18 session 18 - F016 (retry)
Added _plugins/img_dimensions.rb: post_render hook adds intrinsic width/height (PNG/GIF/JPEG header or SVG width/height/viewBox) to local <img> tags at build time; CSS height:auto keeps ratio. Verified on rsna wrap-up: all 6 content imgs have width/height in built HTML; unloaded lazy imgs measure 312-402px tall (not 0). Verify cmd passes. Known: local plugin does not run on classic GitHub Pages builds (needs Actions/local build); remote images get no dims.

## Test report (tester, session 18) F016
Rebuilt; rsna wrap-up built HTML: 6/6 content imgs loading=lazy, decoding=async, alt, width/height. In browser, unloaded lazy imgs (complete=false) measure 312-402px (ratio-correct, not 0); cache-busted clone had height 462 before and after load (no shift); scrollWidth==viewport. Teasers/avatar untouched. Known limit (Pages classic build, remote imgs) out of scope. Result: pass.

## 2026-11-18 session 19 - F017 (coder)
post-ux.js wraps every .page__content table in div.table-wrap (overflow-x auto, focusable); _post-ux.scss adds zebra rows, bordered sticky thead cells. Verified on pi-bench-harness-iterations at 375px: 5 tables wrapped, page scrollWidth 375; forcing a 700px cell makes wrapper scrollWidth 858 vs client 351 while page stays 375. Verify cmd passes. Known: none.

## F017 Test report (tester, session 19)
init ok. pi-bench-harness-iterations at 375px: 5 tables, each wrapped once in div.table-wrap (overflow-x auto, tabindex 0); page scrollWidth 375. Probe: forced 900px min-width on a table: wrapper scrollWidth 900 vs client 351, scrollLeft settable to 200, page stays 375. Zebra: even tbody rows rgb(248,249,250), odd transparent; th sticky, 2px bottom and 1px side borders, bg rgb(241,243,245). Source HTML has no wrapper (JS only, no double wrapping on load). Result: pass.

## 2026-11-18 session 20 - F018 (coder)
Added blockquote and .notice/.notice--* styles to _post-ux.scss: 4px accent left border, tinted background, dark text (#1f2933, ~13:1 contrast), warning/danger/success variants. Verified on pi-coding-agent-setup (5 blockquotes): computed border 4px rgb(59,130,160), bg rgb(238,246,250); injected notice--warning styled. Run .harness/build.sh after edits. Known: none.

## F018 Test report (tester, session 20)
init ok. pi-coding-agent-setup: 5 blockquotes all 4px rgb(59,130,160) left border, bg rgb(238,246,250), text rgb(31,41,51), contrast 13.5:1, padding 13.6/20.4px. Probes: injected .notice--danger (4px red border, tinted bg, dark text), bare .notice (styled), nested blockquote (border applies). Result: pass.
Curator (session 20): refreshed .harness/learnings.md.

## 2026-11-18 session 21 - F019 (coder)
Added to _post-ux.scss: inline links underlined (1px, thicker on hover), focus-visible 3px outline; footnote refs and back-links get a 24x24 tap target, accent color, hover underline; .footnotes block with top border and :target highlight. Verified with a temporary post containing a footnote (removed): footnote ref 24x24.75, link underlined, hrefs #fn:1 / #fnref:1, scrollWidth ok. No existing post has footnotes. Known: none.

## F019 Test report (tester, session 21)
init ok. No post has real footnotes, so injected kramdown-style markup (sup>a.footnote, .footnotes li>a.reversefootnote) into pi-bench post. Inline links underlined 1px (2px hover rule present); footnote ref 24x24.75 inline-block accent color; back-link 24x24; click ref -> #fn:1, back -> #fnref:1; li:target bg rgb(255,248,197) text rgb(31,41,51); keyboard Tab focus shows 3px solid accent outline; scrollWidth == viewport. Hover not exercised with real mouse. Result: pass.

## 2026-11-18 session 22 - F020 (coder)
Dark mode: head inline script sets html[data-theme] from localStorage 'theme' or prefers-color-scheme before paint (no flash); masthead .theme-toggle button (aria-pressed) toggles and persists; new _sass/minimal-mistakes/_dark.scss overrides colors under html[data-theme="dark"] (body, masthead, text, tables, blockquote/notices, footnotes, toc). Verified on pi-bench post: init light, click -> dark (bg rgb(13,17,23), localStorage dark, aria-pressed true), reload stays dark; verify cmd passes. Not verified with real OS dark emulation (logic: matchMedia fallback). Known: footer keeps skin colors; other page types (index, archive) only lightly themed (F021 covers polish).

## F020 Test report (tester, session 22)
init ok. pi-bench post: cleared storage, light by default, masthead .theme-toggle click -> data-theme dark, body bg rgb(13,17,23), localStorage dark, aria-pressed true. Reload: stays dark, text rgb(230,237,243), no contrast problems; theme script is in head before body (no flash by construction; paint not captured). Emulated OS dark with empty storage: starts dark. Probe: toggle to light under OS dark, reload -> stays light (stored choice beats OS). Result: pass.

## 2026-11-18 session 23 - F021 (coder)
Extended _dark.scss: dark footer (bg #010409, muted links), hero overlay text forced white, share buttons keep white text (twitter darkened for contrast), pager, thead bg. Verified with a JS audit on pi-coding-agent-setup in dark (transitions disabled): 0 light backgrounds, 0 text elements under 4.5:1, incl. code, tables, blockquotes, TOC, related, footer, share. Note: background pane tabs do not run CSS transitions, so computed colors lag; disable transitions when auditing. Known: none.

## F021 Test report (tester, session 23)
init ok, rebuilt. Dark-mode JS audit (transitions off) on pi-coding-agent-setup: 0 light bgs, 0 text <4.5:1 (no TOC on that post). On rsna wrap-up (TOC, 6 imgs, 13 tables, sidebar, related): 0 light bgs, images brightness(.92), scrollWidth ok, but TOC title ".toc .nav__title" contrast 3.92:1 (230,237,243 on 31,111,235). Result: FAIL. Screenshots blank in pane (known); DOM measurement used.

## 2026-11-18 F021 (retry)
- Fixed TOC header contrast in dark mode: .toc .nav__title bg #1f6feb -> #1a4f9c (text #e6edf3, 6.7:1). Build OK, compiled CSS contains new value.
- Lesson: audit a post WITH a TOC (rsna-knee-abnormality-detection-wrap-up) too.

## F021 Test report (tester, session 24)
init ok, rebuilt. Dark-mode audit (transitions off) on rsna wrap-up (TOC): 0 light bgs, 0 text <4.5:1, TOC title bg rgb(26,79,156), scrollWidth==viewport. pi-bench post: 0 light bgs; only sr-only label (visually hidden) flagged. Result: pass.

## 2026-11-18 session 25 - F022 (coder)
Back-to-top: static `button.back-to-top[hidden]` in _layouts/single.html (dated pages), wired in post-ux.js (shows when scrollY>600, click -> scrollTo top, behavior auto if prefers-reduced-motion, focuses h1), styled in _post-ux.scss (fixed 44px round, dark-mode variant, hidden in print). Verified on pi-bench: hidden/display none at top, displayed after 1200px scroll, click gives intermediate scroll positions (1072,559,274) then 0 and hides; scrollWidth ok; verify cmd passes. Reduced-motion path not exercised in browser. Known: none.

## F022 Test report (tester, session 25)
init ok. pi-bench post at 375px: hidden at scrollY 0 and 500, shown at 700 and 4000 (44x44 fixed, right edge 359, aria-label Back to top). Click from 4000: intermediate positions 3969,3846,3535,...,84 then 0 (smooth), button hides, focus moves to H1. Rapid double click ok; scrollWidth 375. Reduced motion: JS uses auto and CSS sets scroll-behavior auto under prefers-reduced-motion (code-inspected; real OS emulation not run). Note: right after viewport resize first measurements lagged (rAF), re-run was fine. Result: pass.

## 2026-11-18 session 26 - F023 (coder)
Masthead auto-hide on post pages: post-ux.js adds html.masthead-autohide (only when #reading-progress exists), toggles .is-hidden on scroll (down >4px past masthead height hides, up >4px or near top shows, focusin reveals); CSS makes masthead sticky + translateY(-100%) when hidden, dark bg variant, reduced-motion/print safe. Heading scroll-margin-top raised 4.5rem -> 5.5rem (masthead is 77px) so anchor jumps land below it. Verified on rsna wrap-up: sticky, hidden after scrolling down (top -77), shown on scroll up (top 0), anchor jump heading top 88px > masthead 77px, scrollWidth ok. Known: after a big programmatic jump the masthead did not hide in the background pane (rAF throttling); heading is clear of it either way.

## F023 Test report (tester, session 26)
init ok. rsna wrap-up at 1000px: real wheel scroll down 5 ticks -> masthead.is-hidden, top -73; wheel up -> class removed, sliding back (top ~0). Programmatic instant scrolls did not trigger (rAF in background pane), wheel did. TOC anchors via hash: heading top 77px with masthead bottom 73 (clear); when arriving while hidden heading at 20px (masthead hidden, fine). Home page: no masthead-autohide class, position relative (post-only). Mobile 375 pi-bench: hides on wheel down, returns on wheel up, scrollWidth 375. Result: pass.

## 2026-11-18 session 27 - F024 (coder)
Breadcrumb `nav.post-breadcrumbs` (Blog / truncated title) added at top of _layouts/single.html for dated pages, placed BEFORE the hero include since the hero overlay holds the title on these posts (inside inner-wrap it rendered below the hero). Deliberately not using class `breadcrumbs` (theme CSS pushes it down); styles in _post-ux.scss (dark variant, hidden in print). Verified on pi-bench at 375px: link href /blog/, nav bottom 99 above title top 135, scrollWidth 375; verify cmd passes. Known: none.

## F024 Test report (tester, session 27)
init ok. pi-bench post (1024px): nav.post-breadcrumbs above h1 (nav bottom 112 < h1 top 160), Blog link href /blog/, click navigates to /blog/ (200). Present on all 4 posts, absent on home. Mobile 375 short-title post: nav bottom 99 < h1 135, scrollWidth 375, link height 24, long title truncated with ellipsis. Light link rgb(57,62,70), dark rgb(122,167,255) on rgb(13,17,23) fine. Result: pass.

## 2026-11-18 session 28 - F025 (coder)
Compact author sidebar on posts: new block at end of _post-ux.scss scoped to `.layout--single .sidebar`: avatar 72px, small name, bio clamped to 3 lines, opacity 1, social links in 2-col grid at >=1024px (sidebar height 443 -> 306 at 1280); below 1024px an inline author line (36px avatar, name, 1-line bio, 32px Follow button, hairline borders; height 74 -> 50 at 375). Hidden in print. Verified in browser at 1280 and 375: scrollWidth == viewport. Known: none. Dropdown links on mobile not clicked through.

## F025 Test report (tester, session 28)
init ok, rebuilt. pi-bench post at 1280: sidebar 282x294 (avatar 72, bio 2 lines, 6 links), scrollWidth 1280. At 375: sidebar is a 50px inline author line (avatar 36, name, 1-line bio, 32px Follow button), sits just before content, scrollWidth 375; Follow dropdown opens as popup (no layout shift, sidebar stays 50px) and toggles closed. At 768 on rsna wrap-up: 52px line, scrollWidth 768. Dark mode: name/bio rgb(230,237,243), transparent bg, fine. Screenshots blank (known), DOM measurements used. Result: pass.

## 2026-11-18 session 29 - F026 (coder)
Wide posts: appended `.wide .page__content` block to _post-ux.scss so paragraphs containing images (incl. captions), figures, tables, pre lift the 50ch cap. Verified on rsna wrap-up at 1280: text paragraphs 603px, images 944px (full column), code 942, TOC sticky at right with 33 links, scrollWidth 1280. At 375: images 351, scrollWidth 375, TOC link click sets hash. Known: none.

## F026 Test report (tester, session 29)
init ok. rsna wrap-up at 1280 (JS measurement; pane screenshots are cropped): p 402px (~62 chars/line), li 563, img 944, table 678-944, pre 942, scrollWidth 1280, TOC 33 links. Probe: scrolled mid-page, full-width image overlaps sticky TOC (z-index 10, opaque, 230px wide, 1559px tall); elementFromPoint at the overlap hits TOC title, so right ~24% of wide figures is hidden under the TOC. Result: FAIL. Fix idea: keep figures out of TOC column (max-width to content minus TOC) or make TOC not overlap.

## 2026-11-18 F026 (retry)
- Wide blocks (figures, tables, pre) now max-width calc(100% - 230px - 2rem) at >=1024px so the sticky floated TOC never covers them. Verified at 1280 on rsna wrap-up: imgs 678px (text 402px), no block rect intersects TOC rect, scrollWidth 1280.

## F026 Test report (tester, session 30)
init ok, rebuilt (CSS contains calc(100% - 230px - 2rem)). rsna wrap-up at 1280: text p 600px, li 563, img/table/pre max 678 (stop short of TOC at x1032), 0 tables overflowing, TOC sticky 33 links. Scrolled to y=3000/6000/9000/13000: 0 img/table/pre intersect TOC rect (earlier failure fixed). scrollWidth 1280. At 375: img 351, pre 349, scrollWidth 375. Result: pass.

## 2026-11-18 session 31 - F027 (coder)
Tag chips at post bottom (.page__taxonomy-item) restyled to pill chips matching header chips (_post-ux.scss, hidden in print). /tags/ archive page was missing (404): added _pages/tags.md (layout tags) so tag links resolve to /tags/#tag; /categories/ already existed. Verified at 1024: 5 chips with 999px radius, /tags/ 200 with anchors, scrollWidth ok; verify cmd passes. Known: none.

## F027 Test report (tester, session 31)
init ok. pi-bench post at 1024: 5 tag chips (.page__taxonomy-item), radius 999px, 1px border, 2px 10px padding, hrefs /tags/#x. Click "pi" -> /tags/#pi, anchor exists. /tags/ and /categories/ both 200 with anchors for benchmark, swe-bench, blog. Comma separators hidden; at 375 chips wrap to 2 rows, scrollWidth 375. Note: post footer has only tags (post has no front-matter category; header category chip links /categories/#blog). Result: pass.

## 2026-11-18 session 32 - F028 (coder)
Share row: added `button.copy-link` to _includes/social-share.html; handler at end of assets/js/post-ux.js copies the canonical URL (link[rel=canonical] href with the existing double slash after host collapsed; fallback execCommand), label flips to "Copied" for 2s plus aria-live status. Share row restyled (pill buttons, 40px, flex wrap, hidden in print) in _post-ux.scss. Verified on pi-bench at 1024 with stubbed clipboard: wrote https://hllj.github.io/blog/pi-bench-harness-iterations/, label Copied then reverted, scrollWidth ok; verify cmd passes. Known: pre-existing canonical tag has `//` (F038 SEO); browser may cache old JS (hard reload).

## F028 Test report (tester, session 32)
init ok. pi-bench post at 1024 (stubbed clipboard): 4 pill buttons 40px tall in one row (Twitter, Facebook, LinkedIn, Copy link). Click Copy link -> writeText("https://hllj.github.io/blog/pi-bench-harness-iterations/") (canonical with the `//` collapsed), label "Copied" + aria-live "Link copied", reverts to "Copy link" after ~2s; second rapid click also fine. At 375: icon-only 48x40 buttons in one row, scrollWidth 375, single copy-link button. Real OS clipboard not read. Result: pass.

## 2026-11-18 session 33 - F029 (coder)
Prev/next post nav rewritten as two cards (_includes/post_pagination.html, styles at end of _post-ux.scss): label, title, date; missing neighbour shows a dashed disabled card ("No older/newer posts"); stacks at <=600px; dark variant; hidden in print. Verified: pi-bench shows two 388px cards with dates at 1024, scrollWidth ok; oldest/newest posts show one disabled card; verify cmd passes. Known: dark variant selector (html[data-theme=dark]/:root.dark) to be rechecked in F020.

## F029 Test report (tester, session 33)
init ok. Fetched all 19 posts: every middle post has two cards (prev/next) with title + date; first post (how-i-setup-this-blog) has disabled prev "No older posts" + next card; last (rsna wrap-up) has prev card + disabled next "No newer posts" (dashed, opacity .55, non-link). pi-bench at 1024: two 388x138 cards, scrollWidth 1024. Clicking next navigated to the rsna post. At 375: cards stack (351 wide, 89/56 tall), scrollWidth 375. Dark variant not verified (my guessed selector did not trigger it; left to F020 as coder noted). Result: pass.

## 2026-11-18 session 34 - F030 (coder)
Related posts restyled as cards (end of _post-ux.scss, scoped .layout--single .page__related): CSS grid 1 col <600px, 2 cols >=600, 4 cols >=1500; 16:9 cropped teaser, title clamped 3 lines, date + read time, excerpt clamped 4 lines, dark variant. Verified pi-bench: 2 cols (388px cards) at 1024, 1 col 351px at 375, scrollWidth ok; verify cmd passes. Known: none.

## F030 Test report (tester, session 34)
init ok, rebuilt. pi-bench: "You may also enjoy" has 4 cards each with teaser img, title, excerpt, date + read time. 1024: 2 cols (388px), 375: 1 col (351px), 1700: 4 cols (223px, equal 340px height), scrollWidth == viewport at all three. 4 other posts checked: each renders 4 grid items. Dark mode not checked. Result: pass.

## 2026-11-18 session 35 - F031 (coder)
Disqus now lazy: comments.html shows heading ("Leave a comment"), intro text and a "Load comments" button; _includes/comments-providers/disqus.html injects embed.js only on click (retry on error). Styles at end of _post-ux.scss (top border, 3rem spacing, hidden in print). Verified in production build: button present, no disqus script in DOM before click, scrollWidth ok; verify cmd passes. Did not click (would hit the real Disqus). Known: none.

## F031 Test report (tester, session 35)
init.sh builds dev (comments only render in production), so rebuilt with JEKYLL_ENV=production. pi-bench at 1024: section heading "Leave a comment" (h4, 20px, uppercase), intro text, "Load comments" button 45px, 1px top border, 48px margin-top, 24px padding. Before click and after scrolling to page bottom: 0 disqus scripts, 0 disqus resource requests, #disqus_thread empty. Clicked twice rapidly (Disqus append stubbed, real service not hit): exactly one embed.js script added, button -> "Loading comments...", disabled; onload hides button+intro. scrollWidth 1024 and 375. Result: pass. Note: _site left as production build.

## 2026-11-18 session 36 - F032 (coder)
Blog index cards: archive-single.html now outputs tag chips (.archive__item-tags; hidden in related posts and print); card styling with hover lift/shadow/border, dark variant, appended to _post-ux.scss scoped to `.layout--posts .entries-grid`. Verified at 1024: 19 cards with title, date, read time, excerpt, tags, radius 10px, hover transition, scrollWidth ok; verify cmd passes. Known: none.

## F032 Test report (tester, session 36)
init ok. /blog/ at 1024: 19 cards, each with title, excerpt, date, read time; tags chips (pill, 999px) on all 14 posts; the 5 entries without tags are projects/reading items with no tags in source (not a defect). Hover on card: translateY(-3px), shadow 0 8px 20px, border color change (0.15s transition). scrollWidth 1024; at 375 cards 351px, scrollWidth 375. Dark mode not checked. Result: pass.

## 2026-11-18 session 37 - F033 (coder)
Pagination (on / and /page2..4/; /blog/ is unpaginated) restyled as pill buttons with dark current-page highlight, disabled prev/next, wrap, dark variant, print hidden; taxonomy archives (/categories/, /tags/) got bordered section headings and pill index (_post-ux.scss end). Verified /page2/: current "2" dark bg/white text, all 40px pills, scrollWidth 1024; /categories/ heading border 1px. Known: dark variant unchecked until F020.

## F033 Test report (tester, session 37)
init ok. /page2/ at 1024: pagination pills 40px, radius 999px, current "2" dark bg/white text (distinct from white pills), scrollWidth 1024. Fetched /: Previous disabled, 1 current; /page4/: 4 current, Next disabled. /blog/ is unpaginated (no pagination markup; cards from F032). /categories/ and /tags/: headings with 1px bottom border, index pills 999px radius. At 375 on /page3/: pagination one row, 351 wide, scrollWidth 375. Screenshots rendered blank in the pane, so verified via computed styles. Dark mode not checked (F020). Result: pass.

## 2026-11-18 session 38 - F034 (coder)
post-meta.html: read time now ceil(words/wpm), min 1 (was floor+1); 'Updated <date>' span shown only when last_modified_at set and differs from date. Added last_modified_at: 2026-11-18 to pi-bench post as sample. Verified: pi-bench shows Updated + 20 min read, pi-coding-agent-setup has no Updated span; verify cmd passes. Known: none.

## F034 Test report (tester, session 38)
init ok. pi-bench (last_modified_at set): meta shows date, "Updated November 18, 2026" (page__meta-updated), "20 min read". The other 3 /blog/ posts have no Updated span (only pi-bench sets last_modified_at). Read time checked against Jekyll's own strip_html/number_of_words: formula is ceil(words/200), min 1; rendered counts 226->2, 3211->17, ~4000->20 (section word count includes TOC/share so slightly higher), 6138->~30. Not exercised: last_modified_at equal to date (read from template logic only). Result: pass.

## 2026-11-18 session 39 - F035 (coder)
A11y: aria-labels on landmarks (skip links, primary nav, TOC aside/nav, main, footer); global :focus-visible ring (3px blue, lighter in dark); skip links become a fixed visible box on focus; global prefers-reduced-motion block (no smooth scroll, transitions/animations ~0). Styles at end of _post-ux.scss. Verified in browser: first Tab focuses "Skip to primary navigation" (fixed, 3px outline), click goes to #site-nav; labels present; verify cmd passes. Known: contrast not audited site-wide beyond earlier features; dark mode ring selector html[data-theme=dark] (F020).

## F035 Test report (tester, session 39)
init ok. Post at 1024: first Tab focuses "Skip to primary navigation" (fixed, 3px outline); 79 focusable elements all show an outline when focused; landmarks have aria-labels (Skip links, Primary, Breadcrumb, TOC, Main content, Site footer). Served CSS contains prefers-reduced-motion:reduce rules (scroll-behavior auto, animation/transition ~0); emulation of the media feature not possible in pane, checked in CSS only. Contrast measured: body text 12.6:1 OK, but content/TOC links #2a6df4 on #eee = 3.94:1 and footer copyright white on #0092ca = 3.52:1 -> fail AA. Result: FAIL (contrast).

## 2026-11-18 session 40 - F035 retry (coder)
Fixed contrast failures: accent/link color #2a6df4 -> #1c55c4 (5.7:1 on #eee), muted text #565e66, footer and TOC header bg #00688f (white 6:1), twitter share btn #1a6fb0, inline code in lead dark. Ran a JS audit over all visible text on pi-bench: 0 elements below 4.5:1 (assuming #eee page bg). Known: dark mode contrast unchecked (F020).

## 2026-11-18 curator: refreshed learnings (F035 contrast gotcha and tokens)

## 2026-11-18 session 41 - F035 (coder, claim)
Rebuilt and re-audited contrast in-browser (text nodes, effective bg walked through ancestors, 4.5:1 / 3:1 large) on pi-bench, pi-coding-agent-setup, rsna wrap-up and /blog/: 0 failures except the visually-hidden "Toggle search" label (clipped, not visible). Verify cmd passes. Session 40 fix (link #1c55c4, footer/TOC #00688f, muted #565e66) holds. Claimed F035. Known: dark mode contrast unchecked until F020.

## F035 Test report (tester, session 41)
init ok. pi-bench at 1024: real Tab -> "Skip to primary navigation" fixed 249x53, 3px outline; Enter -> #site-nav. 92 focusables, 0 without a focus ring. Own contrast audit over all visible text nodes (effective bg walked up ancestors, AA 4.5/3): 0 failures (image-bg nodes skipped). Landmarks labelled (Skip links, Primary, Breadcrumb, TOC sidebar, On this page, More posts, Site footer). CSS has prefers-reduced-motion:reduce rules (scroll-behavior auto, animation/transition ~0); media emulation not possible in pane, CSS only. Dark mode unchecked (F020). Result: pass.

## 2026-11-19 session 42 - F036 (coder)
Responsive audit: measured via same-origin iframes at 320/375/768/1024/1440 on 3 posts and /blog/ (+/page2/): scrollWidth == clientWidth everywhere already. Tap targets: added min 40x40 for nav links, site title, breadcrumbs, chips, taxonomy items, footer links, TOC links, header anchors, code-copy, share buttons, author Follow button, archive titles (end of _post-ux.scss). Re-audit: 0 controls below 40px (inline prose links excluded by design). Known: dark mode unchecked (F020).

## F036 Test report (tester, session 42)
init ok. Via same-origin iframes at 320/375/768/1024/1440 on pi-bench post, pi-coding-agent-setup, rsna wrap-up, how-i-setup-this-blog, /blog/, /page2/, /categories/: documentElement scrollWidth == clientWidth in all 35 combos. Own tap-target audit (all a/button, excluding skip links and inline prose links by design): 0 below 40px; spot check at 320 on pi-bench shows nav, toggles, header anchors, copy buttons, Follow all 40px. Overflowing elements at 320 are code spans inside scrollable code blocks (no page overflow). Inline prose links 16-37px high (excluded, reasonable). Dark mode unchecked (F020). Result: pass.

## 2026-11-18 session 43 - F037 (coder)
Print stylesheet appended to _post-ux.scss: hides skip links, masthead, progress, back-to-top, breadcrumbs, TOC, share, post-nav, comments, related, tags footer; single full-width column, black on white; external links get " (url)" after; pre wraps (no overflow); tables/images fit. Verified by unwrapping the compiled @media print rules into screen styles in the browser (real print preview not available): only title + meta row + content visible, links show URLs, pre fits, scrollWidth == viewport. Verify cmd passes. Known: dark mode unchecked (F020).

## F037 Test report (tester, session 43)
init ok. Used real print rendering: headless Chrome --print-to-pdf on pi-bench post (13 pages), pdftotext/pdftoppm. Good: no masthead, TOC, share, comments, related, sidebar; external links followed by (url); max text x 578pt < 612 page width (no overflow); tables fit. FAIL: page 1 prints the hero overlay banner (dark background image) with white title/meta/lead on it; with background graphics off (browser default) title would be white-on-white. Print CSS does not reset .page__hero overlay colors/background. Result: fail.

## 2026-11-18 F037 (retry)
- Added @media print block at end of _post-ux.scss: hero/overlay bg none, black text, no padding, lead + hero image hidden (lead duplicated content).
- Verified: headless Chrome print-to-pdf (use --headless=new --virtual-time-budget=5000) of pi-bench post, 12 pages; page 1 is black-on-white title, meta, content. Verify cmd passes.

## F037 Test report (tester, session 44)
init ok. Real print via headless Chrome --print-to-pdf of pi-bench (12pp), pi-coding-agent-setup (12pp), rsna wrap-up (23pp). pi-bench page 1: black-on-white title, meta, content; hero banner/lead duplicate gone (rendered PNG checked); no masthead/TOC/share/comments/related text; URLs appended to external links; max text x 578pt < 612 (other posts also within page). Result: pass.

## 2026-11-18 session 45 - F038 (coder)
SEO tags (og:title/description/url/image, twitter:card, canonical, description) already existed via theme. Fixed: site url trailing slash caused "//" in canonical/og:url (config url now no trailing slash); description truncated to 160 chars in _includes/seo.html (was full excerpt); default og_image set (/images/2022-thumb.jpeg) for pages without images. Verified in built _site on posts and index. Verify cmd passes. Known: og:locale stays en_US.

## F038 Test report (tester, session 45)
init ok. Fetched live pages: pi-bench, home, /blog/ plus built how-i-setup-this-blog, pi-coding-agent-setup, rsna wrap-up. All have description (truncated ~160 chars with ellipsis), og:title/description/url/image/type, twitter:card (summary_large_image on posts with image, summary otherwise), twitter:title/description/image, canonical with no double slash. og:image URLs resolve 200 (default 2022-thumb.jpeg, pi-bench-dashboard.png). Result: pass.

## 2026-11-18 session 46 - F039 (coder)
Added _pages/404.md (layout single, permalink /404.html) with message and Home / Blog buttons. Built; /nonexistent/ on dev server returns 404 with the styled page (server restart needed once to pick up 404.html since it runs --no-watch). Verify cmd passes. Known: none.

## F039 Test report (tester, session 46)
init ok. /nonexistent/, /blog/nope/x, /foo.html all return HTTP 404 with the styled page (site CSS, masthead, footer, Lato font, no horizontal overflow); h1 "Page not found", friendly text, buttons Go to Home (/) and Browse the Blog (/blog/). Nit: "1 min read" meta shown on 404 (cosmetic). Result: pass.

## 2026-11-18 session 47 - F040 (coder)
Search (lunr overlay) already focused input on open and showed title+snippet. Added in assets/js/lunr/lunr-en.js: empty-query hint, friendly escaped "No results for ..." message, aria-live on results; small styles at end of _post-ux.scss. Verified in browser: focus on #search after toggle, "harness" gives 2 results with snippets, gibberish gives no-results message, empty shows hint, no overflow. Known: none.

## F040 Test report (tester, session 47)
init ok. In browser: toggle focuses #search; "harness" -> 2 results with title+snippet; gibberish and an HTML-injection string -> escaped "No results for ..." message; unicode "viet" returns 18 results; clearing shows hint; results aria-live=polite. Nit: hint not shown on very first open until query cleared. Result: pass.

## 2026-11-18 session 48 - F041 (coder)
Footer template already skipped links without url; removed the empty GitLab/Bitbucket entries from footer.links in _config.yml. Built: no fa-gitlab/fa-bitbucket in post HTML; footer shows Twitter, Facebook, GitHub, Instagram, Feed in one aligned row (same y, 40px high), copyright line present, no overflow. Verify cmd passes. Known: none.

## F041 Test report (tester, session 48)
init ok. Live post footer: links Twitter, Facebook, GitHub, Instagram, Feed (all with hrefs, same row, 40px high), then Jekyll/Minimal Mistakes row, copyright line present; no gitlab/bitbucket on post, /, /blog/, 404. At 320px: no overflow, icons wrap to 2 rows. Result: pass.

## 2026-11-18 session 49 - F042 (coder)
Review only, no code changes. Posts: CNN-Architecture-Part-2 (long Vietnamese), pi-coding-agent-setup (code), rsna wrap-up (images). In 375/768/1280 x light/dark (iframe + data-theme): documentElement scrollWidth == viewport in all 18 combos, no content element overflowing outside pre/table-wrap, dark bg #0d1117 / text #e6edf3, light text #24292f. Fresh-tab console on all 3 posts: no errors; no broken images. (Console errors seen earlier came from my iframe probe/stale buffer, not fresh loads.) Verify cmd passes. Known: none.

## F042 Test report (tester, session 49)
init ok. Opened CNN-Architecture-Part-2 and pi-coding-agent-setup at 375 light: no console errors, scrollWidth==375, no broken images. FAIL: masthead at 375 has site-subtitle (x73-173) overlapping the Home menu item (x155-219); Home shows clipped as "ome". Persistent after reload, on all posts. Did not complete remaining viewport/theme combos since a visible layout bug already contradicts "no layout bugs". Result: fail.

## 2026-11-18 session 50 - F042 retry (coder)
Fixed masthead collision: at <600px .site-subtitle hidden (display:none) and .site-title flex-shrink:0 (end of _post-ux.scss). Previously subtitle (x73-173) overlapped Home (x155-219).
Verified with getBoundingClientRect (pairwise overlap of nav children, nav items, page title/meta/breadcrumbs/chips; scrollWidth; links clipping) at 320/375/768/1280 x light/dark on rsna wrap-up and pi-coding-agent-setup: no overlaps, scrollWidth==viewport. At 375: title 12-73, links 85-219 all visible; at 320: Home visible, rest in hamburger menu. Verify cmd passes. Known: none.

## F042 Test report (tester, session 50)
init ok. Retested after masthead fix: CNN-Architecture-Part-2 (375 light+dark, scrolled content), pi-coding-agent-setup (375 dark, 1280 light), rsna wrap-up (375 dark, 768 dark). Masthead at 375: title 12-73, Home/Blog/toggle/search/hamburger 85-363 no overlap, Home fully visible (screenshots). scrollWidth==viewport at 375/768/1280; 0 broken images; no content img beyond viewport; dark bg #0d1117; console errors none. Code blocks scroll internally. Nit (not failing): breadcrumb "Blog" link (40px min-height tap target, inline-flex) sits ~12px lower than the "/ title" crumb on every post at all widths. Screenshot right after navigation sometimes captured an unpainted page (capture lag), a re-capture was fine. Result: pass.

## 2026-11-18 session 51 - F043 (coder)
Masthead: .site-title now flex align-items:center gap:12px (measured gap 12px, vertical centers equal at 700/768/1024/1280); masthead sticky bg changed #fff -> #eee (= page bg, so it matches transparent breadcrumb in light; dark both #0d1117). Title left == breadcrumb left (12/14/16/18px). Tagline now hidden below 700px (was 600): at 600-699 title+tagline overlapped the nav. Verified via iframes at 375/600/699/700/768/1024/1280, scrollWidth==viewport; verify cmd passes. Known: tagline hidden 600-699px (collides with nav otherwise).

## F043 Test report (tester, session 51)
init ok. Measured via iframes at 375/600/699/700/768/1024/1280 in light and dark on pi-bench-harness-iterations. Title text vs .site-subtitle (Range rects): gap 12px at 700/768/1024/1280, vertical centers diff <=0.25px. Title left 12/14/16/18 == breadcrumb "Blog" link left == h1 left. Masthead bg == html bg (#eee light, #0d1117 dark), breadcrumb transparent so one band; scrollWidth==viewport everywhere. Screenshot at 1280 dark looks right. Note: tagline hidden at 600-699px (coder's choice to avoid nav collision; description says subtitle shown "including 600-900px" but also allows hiding below 600) - judged acceptable since no overlap/abutting occurs. Result: pass.

## 2026-11-18 session 52 - F044 (coder)
Breadcrumb: ol/li now flex align-items:center, li min-height 40px (same as link tap target), separator gap symmetric 0.5rem each side (end of _post-ux.scss). Measured at 375/768/1280 x light/dark: link vs current crumb vertical center diff 0, left edge == masthead title left (12/14/18), scrollWidth==viewport. Verify cmd passes. Known: none.

## F044 Test report (tester, session 52)
init ok. Iframe measurements on pi-bench-harness-iterations and rsna wrap-up at 375/768/1280 x light/dark: Blog link vs "/ title" crumb vertical center diff 0 (text center within 0.5px), li height 40 both; separator symmetric (gap link->crumb == ::before margin-right, 6/7/9px); breadcrumb left == masthead title left (12/14/18); scrollWidth==viewport. Probe: injected very long multi-word title: at 375/768 it wraps to its own row without overflow (right edge within viewport), at 1280 stays on one line. CNN-Architecture-Part-2 slug no longer exists (no li) so skipped. Result: pass.

## 2026-11-18 session 53 - F045 (coder)
TOC polish (end of _post-ux.scss): toggle hidden again at >=1024 (a later display:inline-flex rule was overriding the media query, causing the empty box); toggle bg none; .toc__menu a weight 400 (active 500), text-decoration none (needed .page__content .toc specificity to beat the F019 inline-link underline), explicit padding-left per level (9/21/33/45px incl 3px border), uniform vertical padding. Verified at 1024 and 375: underline none, weights 400/500, padding levels consistent, toggle none on desktop, chevron toggle 40x40 transparent on mobile, scrollWidth==viewport, one .is-active entry. Dark mode: only colors inherited, no new colors added. Known: none.

## F045 Test report (tester, session 53)
init ok. Browser at 1280 and 375 on pi-bench-harness-iterations: desktop toggle display none (no grey box), mobile chevron toggle 40x40 transparent, expands OK; .toc__menu a weight 400 (active 500), text-decoration none; padding-left consistent per level (10.5/24 desktop, 6/15 mobile); active entry follows scroll (Tong quan -> Ket luan), dark theme renders fine; scrollWidth==viewport. FAIL: entry spacing uneven - nested ul margin-bottom 18px gives 58px gap after each nested group vs 40px elsewhere. Result: fail.

## 2026-11-18 F045 retry
- Fix: `.toc .toc__menu ul { margin: 0; }` in _post-ux.scss (nested ul had 18px margin-bottom causing 58px gap).
- Verified in browser: for every TOC link, top-to-next-top delta equals its own height (zero extra gap; 40px single-line, 49px two-line wrap) on pi-bench-harness-iterations (nested, 17 links) at 1280 light and 375 dark, and rsna-knee-abnormality-detection-wrap-up (33 links) at 375 dark and 1280 light. scrollWidth == viewport.

## F045 Test report (tester, session 54)
init ok, rebuilt. pi-bench-harness-iterations: 17 TOC links, gap between consecutive links 0 everywhere (even spacing, nested group gap fixed) at 1024 light; weights 500 active/400 others, underline none, padding 9/21px; desktop toggle hidden. 375 dark: chevron toggle flex 40x40 transparent bg, expands, gaps uniform, scrollWidth==375. Active highlight tracks real wheel scroll (Tong quan -> Viec tiep theo), exactly one active. Result: pass.

## 2026-11-18 session 55 - F046 (coder)
TOC collapse now at all widths: CSS collapse rules moved out of the max-width media query in _post-ux.scss, desktop toggle-hide rules removed. post-ux.js: state in localStorage key `toc-open` (try/catch), default open >=1024 / closed <1024 unless saved; only manual toggles persist (link-click auto-close on mobile does not). Verified at 1024 and 375: toggle/aria-expanded/display, persistence across reload, scrollWidth==viewport. Dark mode uses currentColor only. Known: none.

## F046 Test report (tester, session 55)
init ok. pi-bench-harness-iterations at 1280: default open (aria-expanded true, menu 540px), real click collapses (aria false, menu display none, localStorage toc-open=0), reload keeps collapsed, re-expand persists open (toc-open=1) across reload. 375 (storage cleared): default collapsed, toggle cycles open/closed/open with aria-expanded and menu height 0/487, scrollWidth==375. Dark (data-theme) toggle color rgb(230,237,243) on #0d1117. Console errors only livereload websocket and unrelated 404s (not from TOC). Screenshot right after dark navigation was unpainted (known capture lag). Result: pass.

## 2026-11-18 session 56 - F047 (coder)
Post footer rhythm (end of _post-ux.scss): .page__meta and .page__share were floated left (clear both), which swallowed the share/post-nav margins (cards touched share row). Set float:none on both (higher-specificity selectors), tags margin-bottom 0, share margin-top 24px, post-nav margin-top 24px, gap 16px. Measured via iframes at 375/768/1280 x light/dark: tags->share 24, share->card 25 (incl. 1px nav border-top), card gap 16 (side-by-side and stacked), scrollWidth==viewport. Verify cmd passes. Known: none.

## F047 Test report (tester, session 56)
init ok. Iframe measurements on pi-bench-harness-iterations at 375/768/1280 x light/dark: footer tags bottom -> share top 24px; share bottom -> first card top 25px (incl 1px border); card gap 16px both side by side (1280, cards 318-782 / 798-1262) and stacked (375); floats none; scrollWidth==viewport. Screenshot unpainted (known capture lag), relied on measurements. Result: pass.

## 2026-11-18 session 57 - F048 (coder)
Blog index year pills: root cause of bad landing was floated entries of the previous section overflowing, so the h2 (clear:both) sat hundreds of px below its section top and the browser scrolled to the section box. Fix (end of _post-ux.scss): .taxonomy__section display:flow-root + scroll-margin-top 5.5rem (also on h2), html scroll-padding-top, pill :focus-visible ring; smooth scroll now only inside prefers-reduced-motion:no-preference (auto otherwise). Verified at 1024 (pane): all 5 pills and direct /blog/#2021 land with h2 top 112px (>0, bottom<viewport); verify cmds pass. Pane stalls smooth scroll, so tested with scroll-behavior:auto override. Masthead is not sticky on the blog index (autohide only on posts). Known: 375/768/dark not separately measured (layout is width-independent CSS).

## F048 Test report (tester, session 57)
init ok. /blog/: 5 pills (2026,2025,2023,2022,2021), each href matches exactly one id. Hash navigation (scroll-behavior auto override) at 1024 top-level and iframes 375/768/1280 x light/dark: every year h2 lands at top 84px (375/768) or 112px (1280), bottom ~115-143 < viewport, none under masthead (masthead not sticky on index, scrolled off); scrollWidth<=viewport. CSS: html{scroll-behavior:auto}, smooth only in prefers-reduced-motion:no-preference, plus reduce->auto; .taxonomy__index a:focus-visible 3px ring. Synthetic a.click() and direct-load #2021 did not scroll in the pane because smooth scrolling stalls here (rAF stalled, generic pane artifact, also stalls for plain scrollTo smooth); landing verified through hash with auto instead. Result: pass.

## 2026-11-18 session 58 - F049 (coder)
Blog index year headings: gap between h2 rule and first card was only 12-18px and card top border (same color, 1px) read as a second rule. Changed `.taxonomy__section .archive__subtitle` (_post-ux.scss) to margin-bottom 1.5rem and a 2px #c3ccd5 rule (dark rule color override #30363d kept). Measured iframes at 375/768/1280: gap 18/21/27px for all 5 sections incl 2026, no ::before/::after/hr/grid borders, scrollWidth==viewport. Pane screenshots blank (known), relied on DOM measurement. Verify cmd passes. Known: none.

## F049 Test report (tester, session 58)
init ok. Iframes at 375/768/1280 x light/dark, all 5 year sections: h2 2px bottom rule, gap h2 bottom -> first card 18/21/27px, scrollWidth==viewport. Orchestrator symptom (second line behind first card row): at 1280 2026 section, elementsFromPoint scanned the gap columns between cards 1-2, 2-3 and right of last card from h2 bottom-3 to card top+6: only H2 then SECTION (no line element); no hr/::before/::after/shadow/border except card own borders. Real headless Chrome screenshots (1280x800, light and dark) show a single rule under "2026", clear gap, no second line in card gaps or right of cards. Dark rule color computes #30363d once transitions are disabled (pane stalls 0.2s transitions, artifact). Note (out of scope): dark-mode year pill counts are nearly invisible. Result: pass.
