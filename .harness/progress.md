# Progress log

(append-only; older entries were moved to progress/archive-*.md; distilled lessons are in learnings.md)

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

## 2026-11-18 session 59 - F050 (coder)
Blog index grid: .entries-grid used floated .grid__item with span() widths (3 of 12 etc.) leaving the right third empty. Replaced with CSS grid at end of _post-ux.scss (minmax(0,1fr) columns: 1 <600px, 2 >=600, 3 >=1000), floats/margins reset. Verified real headless Chrome screenshots at 768/1280/1600 (cards flush to rule, 3 cols) plus iframe measurement at 375/768/1280/1600 x light/dark: cols 1/2/3, last card right edge gap 0, single-card year (2022) left aligned at normal card width, scrollWidth==viewport. Note: headless Chrome screenshot at 375 renders at a wider min layout width (looks cropped); use iframe measurement there. Known: none.

## F050 Test report (tester, session 59)
init ok. Iframes at 375/768/1280/1600 x light/dark, all 5 year sections: .entries-grid columns 1/2/3/3, last-row-agnostic check: rightmost card right edge equals year heading rule right edge (gap 0) for every section with >=2 cards; cards left-aligned (left offset 0); single-card 2022 stays normal width (351/363/303px) left aligned; scrollWidth==viewport everywhere. Content area caps at 1280 so 1600 matches. Real headless Chrome screenshot at 1280: 3 cards flush to rule, no empty third. Result: pass.

## 2026-11-18 session 60 - F051 (coder)
Archive "Back to top" links in posts/tags/categories layouts used class .back-to-top, so they inherited the floating 44px circle (fixed, overflow). Renamed to .archive__back-top and styled as a 44px-high right-aligned text link (end of _post-ux.scss, dark and print variants). The floating button in single.html keeps .back-to-top, unchanged (still 1 on post pages). Measured iframes 375/768/1280 x light/dark: 5 links, scrollWidth<=clientWidth, height 44, position static, page scrollWidth==viewport; real headless Chrome screenshot at 1280 shows the link right-aligned under the card row. Verify cmd passes. Known: none.

## F051 Test report (tester, session 60)
init ok. /blog/ iframes 375/768/1280 x light/dark: 5 .archive__back-top links, height 44, position static, no bg/radius, scrollWidth<=clientWidth, gap to card row 6-9px, page scrollWidth==viewport. Dark (transitions disabled) color rgb(154,167,180) on #0d1117. Real headless Chrome 1280 screenshot: right-aligned "BACK TO TOP" text link below each year's cards, clear of cards, single rule. (Dark screenshot not obtainable: head script resets theme; relied on computed colors.) Post page: exactly 1 .back-to-top, hidden/0x0 at top, 44x44 circle fixed in viewport after scroll at 375; it is icon-only SVG (no text label), its CSS unchanged in diff. Result: pass.

## 2026-11-18 session 60 - curator
Refreshed learnings.md (dark mode done, headless Chrome visual checks, claim/tester gotchas, backlog F052-F057).

## 2026-11-18 session 61 - F052 (coder)
Compact author sidebar block in _post-ux.scss (and the author button min-size rule) no longer scoped to .layout--single; now targets .sidebar on all layouts, print rule generic. Iframe measurement at 1280/768/375 x light/dark on post, / and /categories/ (blog index and /about/ have no author sidebar / no about page): avatar 72px (36px <1024), same name/bio font sizes, same link row offsets (45px pitch, 2 columns), scrollWidth==viewport. Headless Chrome screenshot of / shows the compact layout like the post. Known: 45px row pitch comes from the existing 44px tap-target rule (.sidebar a), same on every page; duplicate Email is F054.

## F052 Test report (tester, session 61)
init ok. Real headless Chrome 1280 screenshots of post, /, /categories/: same compact sidebar (72px avatar, name, 2-line bio, Follow button, location, 2-column link rows); matches post page. Iframe measurements 1280/768/375 x light/dark on post, /, /categories/, /tags/: avatar 72/36/36px, name/bio font sizes identical, link rows identical offsets (21/45 pitch), scrollWidth<=viewport. /blog/ and /projects/ have no author sidebar. Follow dropdown at 768 and 375 on /, /categories/ and post: closed by default, opens on click (display block, within viewport, 7 items), closes on second click, no overflow; identical on all three. Note: aria-expanded not set on Follow button on any page (pre-existing, same on post). Result: pass.

## 2026-11-18 session 62 - F053 (coder)
Sidebar spacing (end of _post-ux.scss, after the .sidebar button.btn rule): >=1024px Follow button gets margin-bottom 12px; on (hover:hover)(pointer:fine) .sidebar .author__urls li/a are flex, min-height 26px, a margin 0 (theme had a 5px bottom margin causing 31px pitch + inline-block baseline gap). Touch devices keep the 40px tap targets. Measured iframes post, /, /categories/ at 1280/768/375: Follow->location gap 12px, every row pitch exactly 26px (incl. location row and open dropdown), scrollWidth==viewport; headless Chrome screenshot of post at 1280 shows gap and compact rows. Known: dark not separately screenshotted (no color changes).

## F053 Test report (tester, session 62)
init ok. Real headless Chrome 1280 screenshots of post (1300px tall) and /: Follow button has clear 12px gap above the location line, link rows even and compact, 2 columns. Iframe measurements (transitions disabled, theme set) on post, /, /categories/ at 1280/768/375 x light/dark: 1280 Follow bottom -> location top 12px; every row pitch exactly 26px (also with open dropdown at 768/375, absolute below button, no overlap); anchors 26px high; scrollWidth==viewport. Touch: compact rules only inside (hover:hover)(pointer:fine); coarse pointer keeps existing .sidebar a min-height 40px (verified by reading CSS, could not emulate coarse pointer). Result: pass.

## 2026-11-18 session 63 - F054 (coder)
Cause confirmed on built pages: _config.yml author.links had an Email item and author.email is also set, so author-profile.html rendered Email first (links loop) and last (email block). Removed the links Email item. Before: Email, Twitter, Facebook, GitHub, Instagram, Email. After on /, /categories/, a post: Twitter, Facebook, GitHub, Instagram, Email (single mailto:vanhop3499@gmail.com link; Website has no url so is not rendered). /blog/ has no author sidebar, /about/ is not a page. Headless Chrome screenshot of / shows Email once at the end. Email now sits last instead of first. Known: none.

## 2026-11-18 session 64 - F054
- No code change (fix already committed). Rebuilt; ran amended verify commands: pass. /, /categories/, /tags/, pi-bench post each show Email once (fa-envelope x1) plus Twitter, Facebook, GitHub, Instagram. Headless Chrome screenshot of / sidebar viewed: 5 links, Email once, no empty entry.

## Session 65 - F054
Rebuilt, ran all 3 verify entries (rc=0), confirmed Email once plus Twitter/Facebook/GitHub/Instagram on /, /categories/, /tags/ and a post. Claimed. No code changes.

## F054 Test report (tester, session 65)
init ok. Parsed ul.author__urls on /, /categories/, /tags/ and pi-bench post (served :4000): each lists Twitter (twitter.com/hopbui3/), Facebook, GitHub, Instagram, Email (mailto:vanhop3499@gmail.com) exactly once, each with a valid href and icon+label; Email is last only, no empty icon-only entry (the "Custom Social Profile Link" li is inside an HTML comment, not rendered). Real headless Chrome 1280 screenshots of / and the post (1500px tall) viewed: sidebar shows Twitter, Facebook, GitHub, Instagram, Email once each. Result: pass.

## Session 66 - F055 (coder)
Home Recent posts now uses the /blog/ card rules: the F032 card block, its dark-mode and print rules in _post-ux.scss gained a `.layout--home .entries-list .archive__item` selector (one rule set, comma-shared), plus a small single-column grid (gap 1.25rem) for `.layout--home .entries-list`. Tags are pills via the same shared rules. Iframe measurement at 375/768/1280: home card vs /blog/ card computed styles identical (radius 10px, 1px border #d9dee3, white bg, title 700 weight no underline, meta/excerpt/tag sizes), scrollWidth==viewport. Headless Chrome screenshot of / at 1280 shows bordered cards with pill tags. Known: /blog/ hides excerpts at 375 (theme rule), home shows them; dark not screenshotted.

## F055 Test report (tester, session 66)
init ok. Real headless Chrome 1280 screenshots of / (full page, Recent posts section) and /blog/: home Recent posts are white bordered rounded cards with bold non-underlined titles, date/read-time meta, excerpt and pill tags, 5 cards with even gaps, pagination below; not the unstyled symptom (no giant underlined titles, no bullet tag list). Iframe computed-style comparison home card vs /blog/ card at 375/768/1280 x light/dark (transitions disabled, data-theme set): card, title, link, meta, excerpt style props all identical (radius 10px, border, bg, fonts, no underline); tag pill styles identical (light and dark values differ correctly); scrollWidth==viewport. Widths differ by design (single column vs grid). Focus-within on a home card gives the same lift (translateY -3px), shadow and border as /blog/; hover rules are shared selectors. Note: in dark, hover/focus border-color stays the dark border on both (identical behaviour). Excerpt hidden at 375 on /blog/ (theme rule) but shown on home: acceptable. Result: pass.

## Session 67 - F056 (coder)
Home chips were already pills (F055) but plain text. archive-single.html now renders each tag as `<li><a href="{{ '/tags/' | relative_url }}#{{ tag | slugify }}">` (shared by /blog/ and home, hidden in single related cards and print as before). _post-ux.scss: chip link inherits chip color (AA, same as before), no underline, 999px radius, :focus-visible outline 2px #1c55c4 (dark #79b8ff). All 11 home slugs exist as ids on /tags/. Headless Chrome 1280 screenshot of / shows pill chips in a row with no bullets. Known: 375/768 and dark not re-measured (no layout change; shared rules).

## F056 Test report (tester, session 67)
Real headless Chrome 1280 screenshots of / (Recent posts) and /blog/: home chips are pill chips in a wrapping row, no bullets, same look as /blog/ chips. Iframe measurements at 375/768/1280 x light/dark (transitions disabled, data-theme set) on / and /blog/: li list-style none, radius 999px, padding 2px 10px, ul flex-wrap wrap gap 6px, identical styles on both pages, scrollWidth==viewport; chip text/bg contrast 9.86 in light (#323f4b on #f3f5f7) and dark (#c9d1d9 on #21262d); no underline (underline on hover). All 16 home and 28 /blog/ chips link to /tags/#slug and every slug exists as an id on /tags/ (200). Focus ring: :focus-visible gives 2px solid rgb(28,85,196) light / rgb(121,184,255) dark. Single post page: tag ul display none (related-card chips still hidden). Notes: computed display of li is list-item (flex item) but with no marker, not a visible bullet; chip font is small (8.6px at 375, 13px at 1280) identical to prior /blog/ behaviour. Result: pass.

## Session 68 - F057 (coder)
Home heading styled like /blog/ section headings (1.25rem, 2px rule, dark rule colour), card list gaps and pagination verified, added "View all posts" pill link to /blog/ in _layouts/home.html (CSS end of _post-ux.scss). Iframe measurements at 375/768/1280 x light/dark on / and /page2/: 5 cards, gaps all equal (15/18/23px), pagination pill gaps 6px equal, same pill styles as F033, link 40px high, scrollWidth==viewport. Headless Chrome 1280 screenshot of / viewed. Known: /blog/ has no pagination (year groups), so pagination is compared to F033 styles directly.

## F057 Test report (tester, session 68)
init ok. Real headless Chrome screenshots of / (tall, 1280) and /page2/ viewed: "Recent posts" heading with 2px rule, bordered cards with pill chips, equal gaps, pagination pills (current page dark-filled, Previous disabled on p1) centered, "View all posts" pill below pagination without collision. Iframe measurements (transitions disabled, data-theme set) on /, /page2/, /blog/ at 375/768/1280 x light/dark: heading font 15/17.5/22.5px, 700, 2px bottom rule, identical to /blog/ year headings (margin-top 24-36px on home only); 5 cards each page, gaps exactly equal (15/17.5/22.5px); cards same width as heading; pagination pill gaps 6px equal, current page inverted colors light and dark; View all posts href /blog/, 40px high, 12-14px below pagination, readable colors; scrollWidth==viewport everywhere. F055 cards and F056 chips (page 2 shows chips) not regressed. Notes: page2 hero images are broken (relative path, pre-existing, out of scope); link text is small at 375 (10.8px, same root scale as other pills). Console errors not checked via Browser pane. Result: pass.

## Session 69 - F058 (coder)
index.html intro imgs now use `{{ '/images/..' | relative_url }}` (were relative `images/...`, 404 on /pageN/). Built; verify cmd passes; curl on /, /page2/, /page3/: both intro images and avatar return 200. No other relative src/href in index.html. Known: none.

## F058 Test report (tester, session 69)
init ok. curl on /, /page2/, /page3/, /page4/: every img src is root-relative (/images/...) and returns 200 (Tet Hue photo, home_page_1, avatar); no relative src/href left in page content; /page5/ is 404 (does not exist). index.html uses relative_url for both intro images. Did not check naturalWidth in a browser (HTTP 200 + valid src only). Result: pass.

## Session 70 - F059 (coder)
TOC restyled as content-sized inline-flex button (fit-content, gap max(.6rem,10px)), float/sticky rule and 60vh scroll removed, default collapsed unless saved. Measured on rsna post: button 103px wide, menu overflow visible, scrollHeight==clientHeight, aria-expanded toggles. Known: browser pane viewport was ~0 wide so 375/768/1280 and dark not measured; styles are width-independent.

## F059 Test report (tester, session 70)
init ok. Iframe measurements (data-theme set) at 375/768/1280 x light/dark on rsna post and how-i-setup-this-blog: toc header is content-sized (143/157/187px wide vs 351/740/944px column), 40px high, icon-text gap 10-10.8px, menu closed height 0 by default (localStorage cleared), click opens: overflowY visible, maxHeight none, scrollHeight==clientHeight (1320 for 33 entries, 200 for 5), all links visible, aria-expanded true/false toggles, click again collapses, no horizontal overflow. pi-bench post: default collapsed, toggle persists toc-open. Note: /blog/pi-coding-agent-setup/ has no TOC (fewer than 3 headings, pre-existing by toc rule). Browser pane width was 0 so screenshot not useful; focus ring and keyboard Enter/Space not exercised by real key events (button element, native). Result: pass.

## Session 71 - F060 (coder)
_post-ux.scss: text measure cap now `min(100%, 60ch)` (was 50ch), removed the 230px floated-TOC calc rule, and added `.layout--single .page/.page__related { padding-right: 0 }` at large breakpoints so non-wide posts (how-i-setup-this-blog) match wide ones. Headless Chrome iframe: p width 720px at 1280 on both posts (was ~402), 562 at 768 (cap), 351 at 375; scrollWidth==viewport; ~65-70 chars/line. Known: dark not re-measured (no colour changes).

## F060 Test report (tester, session 71)
init ok. Iframe measurements (data-theme set) at 375/768/1280 x light/dark on pi-coding-agent-setup, pi-bench-harness-iterations, rsna-knee wrap-up (wide) and how-i-setup-this-blog (non-wide): p/ul/ol/blockquote widths identical across posts: 351/563/724px (was ~402 at 1280); ~72 chars/line at 1280 (under 80); no pre/table/img/figure extends past .page; scrollWidth==viewport everywhere. Result: pass.

## Session 72 - F059 rework (coder)
_post-ux.scss: `.page__content nav.toc` now fit-content, border 0, box-shadow none, background none; removed `.toc--js {width:100%}`; aside wrapper reset (auto width, no bg/border); open menu gets own light bg/border only when open. Note Sass minifies `background: transparent` to rgba(0,0,0,0), so verify needs `background: none`. Headless Chrome iframe: computed border 0px, shadow none, bg transparent; collapsed nav width == button width (143px at 375); open menu overflow visible, scrollHeight==clientHeight. Author sidebar files untouched (verify passes). Known: dark and 1900px not screenshot-checked.

## F059 rework Test report (tester, session 72)
init ok. Iframe measurements (data-theme set) at 375/768/1280/1900 x light/dark on rsna, pi-bench, how-i-setup posts: nav.toc border 0, shadow none, float none, static, aside wrapper transparent/no border/shadow; nav width == header width (143/171/187), menu overflow visible, scrollHeight==clientHeight, aria-expanded toggles back, no horizontal overflow. Screenshot dark 1280: only blue button visible. FAIL: dark computed nav.toc background is rgb(22,27,34) (html[data-theme=dark] .toc rule), spec requires transparent. Not exercised: real keyboard events, scroll-spy.
