# Suggested Commands

A directory of everyday terminal operations in the workspace.

## Development Server

Runs Vite dev server with automated `compile-posts.js` predev compilation step:
```bash
bun run dev
```

## Production Building

Compiles posts and runs Vite packaging:
```bash
bun run build
```

## Manual Markdown Compilation

Force re-compiles all source posts in `src/content/blog/posts/` into `src/content/blog/compiled/`:
```bash
bun scripts/compile-posts.js
```

## Visual Verification Suite

Spins up a headless browser, renders all primary routes, and captures full-page layout verification screenshots to `scratch/screenshots/`:
```bash
bun scratch/verify_all_pages.js
```

## Local Preview

Spins up a local server to serve the built static production assets:
```bash
bun run preview
```
