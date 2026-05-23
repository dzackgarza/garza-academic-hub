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

- [x] **Fix compile.js runtime inconsistency** — Fixed in `73a0a02`. Renamed to
  `compile.cjs`, replaced `Bun.spawnSync` with `child_process.spawnSync`. Works with
  both `bun` and `node`.

- [x] **Decompose src/index.css** — Fixed in `3e6b99b`. Moved blog post layout + TOC
  styles to `src/styles/blog-post-layout.css` (imported by BlogPost.tsx), academic page
  content to `src/styles/academic-content.css` (imported by PageShell.tsx).
  index.css reduced from 227 to 99 lines.

- [ ] **Tidy scratch/ directory** — Move test/verification scripts from `scratch/` into
  `tests/` or a `tools/` directory.
  Exclude generated screenshots (`.png`) from version control.

- [x] **Migrate binary assets to Git LFS** — 164 binary files in `public/assets/`
  migrated to LFS across all history.
  Tracked patterns: *.png, *.jpg, *.jpeg, *.mp4, *.gif, *.webp, *.ico, *.avif.
  Repo size reduced from ~31 MB to pointer files.
