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
