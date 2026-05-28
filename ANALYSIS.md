# Architectural / Design Analysis

Date: 2026-05-27

Basis: live repository inspection, `GOALS.md`, `AGENTS.md`, `README.md`,
`content/CONTENT-GUIDE.md`, the current source/test tree, and one run of `just test`.

## Verdict

The core design is still maintainable: `content/` owns content, Pandoc owns document
structure, `src/compile.cjs` owns manifest generation, and React is mostly a static
HTML injector plus island hydrator. The bespoke Pandoc-first architecture is justified
because the repo depends on Pandoc defaults, templates, Lua filters, math, TikZ, and
Obsidian-style content normalization in ways that Hugo/Jekyll/Astro would not preserve
without a rewrite.

The repo is not yet minimal or fully refinable. The main risk is not one giant
monkey-patch; it is residue from iterative agent work: SPA routing in a non-SPA,
dependency inventory from the original template, weak tests mixed with real browser
proofs, and local machine paths in content/pandoc defaults despite a rule forbidding
them.

## Findings

### Browser tests used the wrong page-readiness signal

Pattern: the repository has a good unified gate, but its browser tests were waiting for
global network quiescence rather than repository-owned rendered state.

Concrete evidence:

- `README.md` defines `just test` as the canonical proof loop.
- `justfile:25-38` compiles, builds, syncs to Nginx, runs Vitest, then runs the selected
  Playwright tests against `http://localhost/website`.
- A live `just test` run on 2026-05-27 initially failed with 62/63 Playwright tests
  passing and one timeout in `tests/math-alignment.spec.ts:16`.
- The failure was `page.goto(..., waitUntil: 'networkidle')` timing out on a rendered
  page with an embedded YouTube iframe.
- The same `networkidle` pattern appeared in the rest of the Playwright suite, including
  `tests/integrity.spec.ts`, `tests/visual.spec.ts`, `tests/tikzcd-center.spec.ts`,
  `tests/toc-position.spec.ts`, `tests/toc-responsive.spec.ts`,
  `tests/responsive-layout.spec.ts`, `tests/screenshots.spec.ts`, and
  `tests/utils/assert_toc_links.js`.
- The tests now use `domcontentloaded`; MathJax tests additionally wait for
  `article.post-content` and `MathJax.startup.promise`.

Why this matters:

The gate is real, but `networkidle` is structurally wrong for pages with embedded
third-party media. The test should wait for page-owned readiness and then assert the
owned contract: no console errors, no unhydrated island placeholders, no MathJax errors,
and stable rendered geometry.

Failure mode: broken proof-loop inversion / external-state bypass.

### Non-SPA architecture still carries SPA routing

Pattern: runtime architecture and dependency choices contradict the documented static
file model.

Concrete evidence:

- `AGENTS.md` says every URL is a literal file served by Nginx and there is no
  client-side routing.
- `src/App.tsx:2` imports `BrowserRouter`, `Route`, and `Routes`.
- `src/App.tsx:15-18` wraps the whole app in `BrowserRouter basename="/website"` with a
  catch-all route.
- `src/pages/CompiledPage.tsx:2` imports `useLocation` only to read the pathname at
  `src/pages/CompiledPage.tsx:62`.
- `src/pages/NotFound.tsx:1-5` and `src/components/NavLink.tsx:1-14` are still
  React-Router compatibility code.
- `package.json:58` still depends on `react-router-dom`.

Why this matters:

This does not break the site by itself, but it teaches future readers and agents the
wrong model. A static Nginx/Pandoc site should not need a SPA router to identify
`window.location.pathname`. Removing it reduces conceptual surface and removes a
dependency whose presence invites future client-side route logic.

Failure mode: no design principles / myopic goal-seeking.

### Dependency inventory is still template-shaped

Pattern: the source tree has been partially cleaned, but `package.json` still preserves
the scaffold-era dependency universe.

Concrete evidence:

- `find src/components/ui -type f -name '*.tsx' | wc -l` reports 9 UI primitive files,
  not the 48 described in the stale earlier audit.
- Live import search found only Radix tooltip, toast, slot, scroll-area, popover, and
  checkbox imported from source.
- `package.json:17-64` still lists many unused scaffold dependencies, including Radix
  accordion, alert-dialog, aspect-ratio, avatar, collapsible, context-menu, dialog,
  dropdown-menu, hover-card, label, menubar, navigation-menu, progress, radio-group,
  select, separator, slider, switch, tabs, toggle, toggle-group, plus `cmdk`,
  `date-fns`, `embla-carousel-react`, `input-otp`, `react-day-picker`,
  `react-hook-form`, `react-resizable-panels`, `recharts`, and `vaul`.
- The live `just test` build transformed 1,749 modules and emitted
  `dist/assets/index.js` at 1,076.27 kB, 267.54 kB gzip, with Vite warning that a chunk
  exceeded 500 kB.

Why this matters:

The owned UI source has shrunk, but dependency ownership has not followed. This keeps
audit surface, update churn, and bundle pressure from components the app does not use.
The maintainable direction is dependency deletion, not more local wrappers.

Failure mode: slop accretion / dependency residue.

### Local machine paths violate the repository contract

Pattern: content/Pandoc configuration still contains machine-specific absolute paths,
and one content file contains an absolute note path.

Concrete evidence:

- `content/defaults/page.yaml:7` points to
  `/home/dzack/.pandoc/filters/components.lua`.
- `content/defaults/post.yaml:7-12` points to six filters under
  `/home/dzack/.pandoc/filters/`.
- `content/blog/derived-algebraic-geometry-1.md:18` contains an absolute
  `/home/dzack/notes/...` path.
- `rg -n '/home/dzack' src scripts tests content package.json justfile vite.config.ts
  playwright.config.ts` found those entries.

Why this matters:

`AGENTS.md` forbids hardcoded `/home/dzack/...` paths in scripts and configuration.
For this repo, the deeper problem is source-of-truth split: the Pandoc defaults claim to
be reproducible project inputs, but the filters actually live outside the repo. Either
the repo should explicitly declare the external Pandoc filter dependency as a local
contract, or it should vendor/link those filters into a project-owned path and route
defaults through that.

Failure mode: hard-coding as split truth.

### The compiler is coherent, but validation is split across JavaScript and external Lua

Pattern: `src/compile.cjs` is a readable linear compiler, but several contracts are
duplicated or partially validated before Pandoc and then enforced again by external
filters.

Concrete evidence:

- `src/compile.cjs:31-48` defines Zod schemas for blog/page metadata.
- `src/compile.cjs:298-303` defines accepted component types.
- `src/compile.cjs:309-342` walks the Pandoc JSON AST only to validate component type
  names.
- `src/compile.cjs:245-253` then regex-checks generated HTML for unfiltered
  `.component` divs.
- The content guide defines component types and attributes separately in
  `content/CONTENT-GUIDE.md`.

Why this matters:

This is not monkey-patch hell yet, but it is the area most likely to become it. The
compiler, Lua filter, content guide, and React registry all know pieces of the component
contract. The maintainable endpoint is one canonical schema for component declarations
and generated island payloads, with the compiler validating the same contract the
filter/registry consumes.

Failure mode: spaghetti data flow / partial contract grounding.

### Island hydration accepts unknown payloads and swallows mount failures

Pattern: the island boundary is explicit but weakly typed and error-laundering.

Concrete evidence:

- `src/pages/CompiledPage.tsx:16` types route `islands` as `unknown[]`.
- `src/components/ComponentMount.tsx:13-18` defines `ComponentData` as an index
  signature over `any`.
- `src/components/ComponentMount.tsx:20-41` casts island payload fields into component
  props.
- `src/components/ComponentMount.tsx:59-72` catches JSON/render failures and logs them
  instead of failing the page or exposing a testable error state.

Why this matters:

The island registry is the one legitimate runtime interlock between Pandoc output and
React. It should be the strongest contract in the app, not the loosest. Today a bad
payload can become a console error and an unhydrated island, which the browser tests may
catch indirectly, but the app boundary itself does not assert the schema it owns.

Failure mode: typing collapse / error laundering.

### Several tests are useful, but the suite mixes real proof with proxy checks

Pattern: high-value browser tests and GOALS contract tests are mixed with tests that
prove file names, string presence, sampled routes, or implementation commentary.

Concrete evidence:

- Strong tests: `src/test/goals-contract.test.ts:133-381` creates real content files,
  runs the real compiler, verifies manifest/routes/fail-fast behavior, preview, and
  sitemap integration.
- Strong tests: `tests/math-alignment.spec.ts`, `tests/math-macros.spec.ts`, and
  `tests/tikzcd-center.spec.ts` run against the deployed Nginx output.
- Weak tests: `src/test/build-pipeline.test.ts:37-61` checks that `compile.cjs` exists
  and that `vite.config.ts` mentions `compile.cjs`.
- Weak test: `src/pages/CompiledPage.test.tsx:5-13` mocks `react-router-dom`, renders
  the real generated home HTML, and asserts a content string. During `just test`, this
  passing test emitted React warnings about synchronously unmounting a root while React
  was already rendering.
- Coverage gaps: `tests/responsive-layout.spec.ts:12-14`,
  `tests/toc-position.spec.ts:23`, and `tests/toc-responsive.spec.ts:22` sample only
  the first two blog posts.
- Redundancy: `tests/integrity.spec.ts:14-51` and `tests/visual.spec.ts:14-100` both
  iterate manifest routes, collect page/console errors, and check component hydration.

Why this matters:

The suite has real proof surfaces, but the weak tests dilute signal and make it easier
for future agents to point to green checks without knowing which checks matter. The test
surface should be reorganized around owned contracts: compile contract, static rendered
contract, island hydration contract, and visual/layout contract.

Failure mode: content-free verification / assertion commentary mismatch.

### Test code uses destructive deletion despite repo policy

Pattern: tests directly remove generated and temporary content with `rmSync`.

Concrete evidence:

- `src/test/goals-contract.test.ts:76-90` uses `rmSync(..., { force: true })` to clean
  generated proof artifacts and temporary content files.
- The project instructions say never use `rm`; use recoverable deletion for manual
  deletions.

Why this matters:

This is not the same risk as a manual `rm -rf`, because these are test-created fixtures,
but the mismatch should be made explicit. Either codify that test-owned temporary
fixtures may be deleted directly, or move proof fixtures into a temp directory outside
`content/` so cleanup cannot touch real content paths.

Failure mode: policy contradiction / process split.

### Content purity enforcement has a known exception

Pattern: the Markdown purity rule is automated but currently permits one content file to
violate the rule.

Concrete evidence:

- `src/test/goals-contract.test.ts:383-397` checks raw block-level HTML in `content/**/*.md`
  but excludes `grad-recommendations.md`.
- `content/blog/grad-recommendations.md:372` contains a raw `<script async
  src="https://platform.twitter.com/widgets.js" ...>` tag.
- A direct search with
  `find content -path 'content/**/*.md' -print | xargs rg -n '<(div|ul|li|section|article|nav|header|footer|table|script|style)(\s|>|/)'`
  found that script tag.

Why this matters:

The exception means the rule and content reality disagree. If Twitter embeds are still
required, they should be represented as a Pandoc component/filter declaration, not raw
HTML inside Markdown. If not required, the script should be removed and the exception
deleted.

Failure mode: fallback laundering / checker weakening.

## Off-the-Shelf Alternatives

Hugo, Jekyll, Zola, VitePress, Docusaurus, Gatsby, and Next static export are worse fits
for this repository because they would either replace Pandoc or fight the static
file-per-route deployment model. Astro is the closest conceptual match because it has
native islands, but adopting it would require porting the Pandoc Lua filter ecosystem to
Remark/Rehype or shelling out to Pandoc inside Astro, which would preserve much of the
current owned compiler surface while adding a framework.

The practical reduction path is to keep the bespoke Pandoc compiler and delete the
nonessential frontend/runtime surface:

- remove React Router and route from `window.location.pathname`;
- remove unused scaffold dependencies from `package.json`;
- replace or directly import the few UI primitives that remain;
- make the island payload schema explicit and fail-fast;
- move the component declaration contract into one canonical schema consumed by docs,
  compiler validation, and runtime tests;
- make browser waits target repository-owned readiness instead of `networkidle`;
- merge redundant Playwright route-integrity specs.

## Test Audit Summary

Keep and strengthen:

- `src/test/goals-contract.test.ts` for real compile/manifest/fail-fast contracts.
- Browser tests that load Nginx-served output and inspect visible MathJax, TikZ, chrome,
  route coverage, and hydration.
- Visual snapshots when intentionally updated with a milestone.

Repair:

- Replace `networkidle` waits in MathJax tests with `domcontentloaded` plus explicit
  MathJax readiness and page-owned selectors.
- Remove or convert `src/test/build-pipeline.test.ts` checks into a lint/tooling check
  if the file-name convention remains important.
- Replace the mocked `CompiledPage` content-string test with a small shell/island
  contract test using controlled manifest/HTML fixtures, or rely on browser tests.
- Stop sampling only `slice(0, 2)` for TOC/responsive tests; either check all matching
  manifest routes or choose fixtures by meaningful structural properties.
- Merge `tests/integrity.spec.ts` and overlapping parts of `tests/visual.spec.ts`.

## Negative Findings

- Searched: `tree -a -I 'node_modules|.git|dist|.generated' -L 3`, repository docs
  (`AGENTS.md`, `GOALS.md`, `README.md`, `content/CONTENT-GUIDE.md`), source/test files
  under `src/` and `tests/`, import searches, path searches, and one `just test` run.
- Found: no evidence that the core Pandoc -> manifest -> generated HTML -> island
  hydration architecture is fundamentally wrong; found several maintainability defects
  around dependencies, routing, schema ownership, and tests.
- Conclusion: based on current evidence, the repo should be refined in place rather than
  migrated to an off-the-shelf SSG.
- Confidence: Medium-high.
- Gaps: I did not run `just test-release`, `knip`, `depcheck`, or a bundle visualizer;
  unused dependency findings are based on source import search, not a dedicated
  dependency analyzer.

## Decision

Maintain the opinionated Pandoc-based architecture. Do not replace it with a generic
SSG. The next architecture work should delete nonessential frontend surface and tighten
the compiler/runtime/test contracts around the manifest and island payloads.
