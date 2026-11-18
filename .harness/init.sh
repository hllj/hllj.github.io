#!/bin/bash
# Idempotent: installs gems locally, builds, starts jekyll dev server on :4000, smoke tests a post page.
set -u
cd "$(dirname "$0")/.." || exit 1
ROOT="$PWD"
PORT=4000
PID_FILE="$ROOT/.harness/server.pid"
POST=/blog/pi-bench-harness-iterations/

command -v ruby >/dev/null || { echo "ruby missing: install Ruby (human action)"; exit 1; }
command -v bundle >/dev/null || { echo "bundler missing: install bundler (human action)"; exit 1; }
bundle config set --local path vendor/bundle >/dev/null 2>&1
bundle check >/dev/null 2>&1 || bundle install --quiet || { echo "bundle install failed"; exit 1; }

bash .harness/build.sh || { echo "jekyll build failed"; exit 1; }

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null && curl -fs "http://127.0.0.1:$PORT/" >/dev/null; then
  echo "server already running"
else
  [[ -f "$PID_FILE" ]] && kill "$(cat "$PID_FILE")" 2>/dev/null
  nohup bundle exec jekyll serve --host 127.0.0.1 --port $PORT --livereload false --skip-initial-build --no-watch >/private/tmp/hllj_jekyll_serve.log 2>&1 &
  echo $! > "$PID_FILE"
fi
# --no-watch: re-run .harness/build.sh after edits to refresh the served _site.

for i in $(seq 1 30); do
  curl -fs "http://127.0.0.1:$PORT/" >/dev/null && break
  sleep 1
done
curl -fs "http://127.0.0.1:$PORT$POST" | grep -q 'page__title' || { echo "SMOKE FAIL: post page not rendered at $POST"; exit 1; }
echo "ok: http://127.0.0.1:$PORT$POST"
