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
