#!/bin/bash
# Quiet, deterministic Jekyll build into _site (used by init.sh and verify commands).
cd "$(dirname "$0")/.." || exit 1
bundle exec jekyll build --quiet >/private/tmp/hllj_jekyll_build.log 2>&1 || { tail -30 /private/tmp/hllj_jekyll_build.log; exit 1; }
