# .harness

State for the wreck-it-ralph long-running agent harness. Agents work in fresh contexts; everything they need is here and in git.

- `feature_list.json`  source of truth; agents only change statuses via `./feature-list.sh claim|pass|fail|ask`
- `proposals.json`     backlog changes (add / amend / drop features) awaiting human approval (`./backlog.sh`)
- `learnings.md`       distilled lessons (curator); read this first
- `progress.md`        append-only session log (older entries rotate into `progress/`)
- `init.sh`            starts the app + smoke test, run at the start of every session
- `config.json`        pipeline, limits, permission mode (headless), final verification
- `mcp.json`           browser (Playwright) MCP config, web preset only
- `agents/`            optional custom agents (see the plugin's templates/agents)
- `step.sh`, `run.sh`, `status.sh`, `backlog.sh`  gates, headless runner, status, proposals (wrappers into the plugin)

Stop a running loop: `touch .harness/STOP`.
