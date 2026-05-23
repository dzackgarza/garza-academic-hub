# TODO

Generated from thermo-nuclear code quality review of the content-separation refactor (38
commits ahead of `origin/main`, ~7,700 lines added).

* * *

## Blocker

- [x] **BlogListing.tsx missing imports** — Fixed in `7b90fca`. Added `useState`,
  `useEffect`, `FileText`, `Clock`, `SectionHeading` imports.
  Replaced `useSearchParams`/`Link` with direct DOM APIs (`URLSearchParams`,
  `window.history.pushState`, `<a>` tags) because PageShell renders islands via
  standalone `createRoot()` calls that don't inherit the parent tree's `BrowserRouter`
  context.

## Structural — High Priority

- [x] **Collapse 6 identical page components into one** — Fixed in `29c4c5d`. Created
  `src/pages/CompiledPage.tsx` with a `ROUTE_CONFIG` map.
  Deleted all 6 redundant files.
  Net -98 lines.

- [x] **Deduplicate REGISTRY pipeline in PageShell** — Fixed in `<pending commit>`.
  Extracted `resolveCollectionData()` helper that unifies the
  filter/typeMap/icon/applyFilter pipeline.
  All three renderers (`collection`, `card-grid`, `scroll-gallery`) now call it.
  Each renderer only specifies its unique component and layout props.

- [x] **Enable TypeScript strict mode** — Fixed in `c9fa435`. Enabled `strict: true` in
  `tsconfig.app.json`, removed redundant false overrides.
  Fixed the one real error: `src/content/galleries.ts:18` accessed `.items` on
  `{ galleries: Gallery[] }`.

- [x] **Remove stale compiled output directory** — Fixed in `5660d70`. Deleted
  `src/content/blog/compiled/` (15 files, 1172 lines removed).

- [ ] **Fix compile.js runtime inconsistency** — `scripts/compile.js` uses
  `require('fs')`, `require('yaml')` (Node CJS) but also `Bun.spawnSync(...)` (Bun-only
  API). Running with `node scripts/compile.js` fails at `Bun is not defined`. Either
  switch to `child_process.spawnSync` for Node-only consistency, or add
  `#!/usr/bin/env bun` and use `Bun` APIs throughout.

- [ ] **Decompose src/index.css** — Migrates feature-specific styles (blog post layout,
  TOC card, academic page content) out of the global CSS entry point into CSS modules
  co-located with the components that own them.

- [ ] **Tidy scratch/ directory** — Move test/verification scripts from `scratch/` into
  `tests/` or a `tools/` directory.
  Exclude generated screenshots (`.png`) from version control.

- [ ] **Consider LFS or external hosting for binary assets** — ~180 image/video files
  added to `public/assets/images/` (~multiple MB). The `worldofmath.svg` alone is 1,806
  lines. This adds significant bloat to every clone.
