# TODO

Generated from thermo-nuclear code quality review of content-separation refactor (109
commits, ~5600 lines added).

## Critical

- [x] **Fix broken content watcher** — `vite.config.ts:20` calls
  `spawnSync("bun", ["scripts/compile.js"])` but the file was renamed to `compile.cjs`
  (commit `73a0a02`). Only `compile.cjs` exists in `scripts/`. The dev server's
  hot-reload for markdown changes silently fails on every edit.
  Fix the filename, update the comment on line 7, and the error message on line 26.
  *(Fixed in 4a26191 + 6517b1b)*

## Structural — High Priority

- [ ] **Extract shared filter UI from AcademicCollection / FilteredGallery** — These two
  components share ~180 lines of identical filter state machine and UI (type tabs, tag
  popover with match-mode toggle, active chip display, count summary).
  The duplication means every filter change must be applied in two places.
  Extract a `<FilterControls>` component that owns the entire filter state
  (`activeType`, `selectedTags`, `matchMode`), the `toggleTag`/`clearTags`/
  `handleTypeChange` handlers, and the filter UI JSX. AcademicCollection and
  FilteredGallery import it and keep only their rendering logic (layout switching,
  CardGrid vs CardScroller).

- [ ] **Abstract all scroll galleries into `PaginatedScroller` with configurable card
  components** — CardScroller (119 lines) and ImageGallery (150 lines) independently
  implement the same horizontal paginated scroll pattern (`scrollRef`,
  `canLeft`/`canRight`/`page`, `updateAffordance`, arrow buttons, edge fades, page
  dots). Both duplicate ~60 lines of scroll management.

  Instead of extracting a hook (which still leaves two components with separate render
  logic), create a single `PaginatedScroller` component that handles all scroll
  mechanics and accepts configurable renderers per page slot.
  The cards themselves become the configurable component:

  ```
  <PaginatedScroller items={...} columns={3} rows={3}>
    {(item, index) => <AcademicCard {...item} />}
  </PaginatedScroller>
  ```

  Card types include:
  - **AcademicCard** — for notes, PDFs, research papers (current AcademicCard shape)
  - **ImageCard** — for gallery images (current ImageGallery card shape with caption
    overlay)

  ImageGallery's grid mode (non-scroller) stays as a separate simple renderer.
  This removes the scroll-logic duplication entirely and makes adding new scrollable
  card types a one-liner.

## Decisions

- **Fail loudly, never silently.** Any unrecognized or invalid state must produce an
  immediate, visible signal — console error, thrown error, or visible UI indicator.
  No silent fallbacks, no graceful degradation that hides the problem.
  - PageShell's REGISTRY fallback (`REGISTRY[type] || REGISTRY['collection']`) must be
    replaced with an explicit warning/error for unrecognized component types.
  - CompiledPage's missing `.catch()` on dynamic import must be added.
  - Any other silent-fallback or noop-default pattern in the codebase should be
    converted to loud failure.

## Architectural — Medium Priority

- [ ] **Fix REGISTRY slot data model drift** — The `SlotRenderer` type signature
  `(el, items, types, rawData)` forces all renderers to accept parameters they ignore.
  Worse, the data extraction layer assumes all TOML sources have shape
  `{ items, types }`, but `galleries.toml` and `links.toml` have different structures.
  The `gallery-grid` and `link-group` renderers work around this by receiving `rawData`
  and discarding the pre-extracted `items`.

  Fix: either give each component type its own data resolver, or make the extraction
  polymorphic so each slot type gets the correct data slice without needing `rawData` as
  an escape hatch.

- [x] **Replace silent fallback for unrecognized component types** — PageShell:250
  silently defaults unknown `data-component` values to `collection`. A typo like
  `data-component="galllery-grid"` renders wrong content with no signal.
  Replace with a console error in dev mode, or render a visible "Unknown component type"
  placeholder. *(Fixed in 18e437a — extracted `getRenderer()` that console.errors and
  returns null)*

- [x] **Add loading and error states to CompiledPage** — Unlike BlogPost (which has
  loading spinner, error content, and MathJax typesetting), CompiledPage has no
  `.catch()` on its dynamic `import(...html?raw)` call, no loading indicator, and no
  null-guard on `setHtml` after unmount.
  A failed import renders an empty page.
  Add loading/error states consistent with BlogPost's pattern.
  *(Implemented + tested in 523b4e5)*

## Cleanup

- [x] **Fix hardcoded absolute path in screenshot test** — `tests/screenshots.spec.ts:4`
  had `SCREENSHOT_DIR` hardcoded to
  `/home/dzack/.gemini/antigravity/brain/cee037cd-5ddf-4388-a1b1-084fff45bfd9/scratch`.
  Changed to
  `process.env.SCREENSHOT_DIR || path.resolve(__dirname, '../test-results/screenshots')`.
  Also added `test-results/` to `.gitignore`.

- [ ] **Externalize nav items from NavBar** — The five navigation items are hardcoded in
  `src/components/NavBar.tsx:5-11`. Per AGENTS.md Rule 5 (Absolute Separation of
  Content), move them to `content/databases/` or a similar config source so the app
  shell contains zero hardcoded content.
