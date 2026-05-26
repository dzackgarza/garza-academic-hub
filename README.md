# garza-academic-hub

Pandoc-driven static academic website.
Content lives under `content/`, compiled to HTML via Pandoc filters and templates, built
with Vite, served via Nginx.

## Proof Loop

One command proves the entire pipeline: generate macros, typecheck, compile, build, sync
to the Nginx static root, run unit tests, and verify MathJax rendering against the fresh
deployment.

```bash
just test
```

This is the canonical quality gate.
Run it before every push.
It produces fresh static artifacts and runs browser tests against the exact output
served by Nginx — no stale state.

## Workflow

```bash
just test          # full proof loop (macros → compile → build → sync → vitest → playwright)
just test-staging  # playwright against current Nginx state (no rebuild)
just preview <file>  # compile one markdown file to stdout
just build         # alias for just test (test already deploys)
```

## Architecture

`content/` → Pandoc (Lua filters + templates + defaults files) → `.generated/` → Vite
build → `dist/` → rsync to `/var/www/html/website/` (Nginx static root).

The app (`src/`) is a generic React shell.
It owns no content, headings, routes, navigation, profile data, or blog chrome.
See `GOALS.md` for the tiered architecture.
