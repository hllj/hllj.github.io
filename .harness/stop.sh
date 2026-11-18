#!/bin/bash
cd "$(dirname "$0")/.." || exit 0
PID_FILE=.harness/server.pid
[[ -f "$PID_FILE" ]] && { kill "$(cat "$PID_FILE")" 2>/dev/null; rm -f "$PID_FILE"; }
exit 0
