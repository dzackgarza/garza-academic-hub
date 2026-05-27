# Architectural / Design Analysis — garza-academic-hub

This document records a top-to-bottom review of the repository as of the milestone
candidate. The objective is to determine whether the current design is maintainable and
refinable, what is or is not acceptable architecture, and where owned surface can be
reduced.

*Date:* 2026-05-27 *Basis:* live code inspection, `GOALS.md` tier assessment, test-suite
audit, and comparison against off-the-shelf static-site tooling.

* * *

## Executive Summary

The repository **is** a small, coherent design that largely satisfies its stated tier
architecture (`GOALS.md`). The core owned logic (compile pipeline, manifest contract,
island hydration) is well-bounded and reasonable for a bespoke Pandoc + Vite static site
system.
However, there are **three material problems** that prevent the architecture from
being genuinely minimal and elegant:

1. **Dead-weight UI component inventory** — 48 shadcn/ui components were scaffolded by a
   template generator, but only ~6 are actually used by the application shell.
   This is the single largest source of owned noise.

2. **Over-broad test surface with some tautological / structural checks** — a minority
   of unit tests assert file-existence and string-matching trivia rather than nontrivial
   behavioral contracts.

3. **Runtime bundle includes React Router**, even though the site has no client-side
   routing. The SPA router is a dependency burden and a conceptual mismatch with the
   architecture.

These are fixable without architectural surgery.
The underlying pipeline (Pandoc → manifest → static HTML → island hydration) is sound
and, with the above cleanup, the owned surface would shrink from ~2,300 LOC of UI
scaffolding and unused imports to a few hundred LOC of actual shell logic.

* * *

## 1. Architecture Assessment

### 1.1 The Pipeline — Sound

```
content/ (Markdown + TOML databases + templates + defaults)
   ↓
Pandoc (Lua filters + templates)  ←  compile.cjs orchestrates this
   ↓
.generated/ (static HTML + site-manifest.json)
   ↓
Vite (bundles React shell + imports HTML as raw strings)
   ↓
Nginx (try_files $uri $uri.html)
```

The compile script (`src/compile.cjs`, ~520 LOC) owns the only nontrivial orchestration
logic in the repository.
It:

- discovers content from `content/pages/` and `content/blog/`

- validates YAML frontmatter with Zod schemas

- invokes Pandoc per-file with `--defaults` files

- asserts that no raw `.component` divs survive to output

- writes a single `site-manifest.json` consumed by Vite config, app code, and tests

- generates a sitemap from the same manifest

This is **not** an ugly hack.
It is a disciplined, minimal static-site compiler.
The manifest-as-contract pattern is the correct abstraction: every downstream consumer
(app routes, sitemap, Playwright tests) derives its world from one generated artifact.

Evidence:

- `compile.cjs` line 1–524: all compilation logic is in one file.

- `vite.config.ts` lines 27–37: sitemap routes are read from manifest, not hardcoded.

- `src/pages/CompiledPage.tsx` lines 29–65: app matches `pathname` against manifest,
  then imports the corresponding `.generated/*.html` module via `import.meta.glob`.

- `tests/integrity.spec.ts` lines 14–21: test route list is read from manifest.

### 1.2 The React Shell — Mostly a Shell, but Not Quite

`CompiledPage.tsx` is a thin wrapper: it looks up the current route in the manifest,
finds the matching raw HTML string, and injects it with `dangerouslySetInnerHTML`. Then
`useComponentMount` walks the injected DOM for `[data-component]` placeholders and
mounts React islands into them.

This is the intended architecture and it works.
The shell owns zero content knowledge.

**Problem:** `App.tsx` wraps the shell in `BrowserRouter` from `react-router-dom`. The
site is **not** an SPA. Every URL is a literal `.html` file served by Nginx.
The router is only needed because `useLocation` is used inside `CompiledPage.tsx` to
read the current pathname.
This could be replaced with `window.location.pathname`, eliminating the entire
`react-router-dom` dependency (and its 25 KB gzipped runtime weight).

Evidence:

- `src/App.tsx` line 11: `BrowserRouter basename="/website"`

- `src/pages/CompiledPage.tsx` line 45: `const { pathname } = useLocation();`

- `package.json` line 33: `"react-router-dom": "^6.30.1"` is in dependencies.

### 1.3 Separation of Concerns — Largely Correct

| Layer | Owned by |
| --- | --- |
| Content (Markdown, TOML databases) | `content/` |
| Document structure (nav, footer, profile card, TOC) | Pandoc template (`site-template.html`) |
| AST transformations (wikilinks, math delimiters, TikZ, component divs) | Lua filters (`~/.pandoc/filters/`) |
| Reproducible Pandoc invocation | Defaults files (`content/defaults/*.yaml`) |
| Site metadata (nav, profile) | TOML databases compiled to JSON |
| Runtime interactivity (filtering, pagination, tag navigation) | React islands (`AcademicCollection`, `BlogListing`, `GalleryGrid`) |
| App shell (manifest lookup, HTML injection, island mount) | `src/pages/CompiledPage.tsx`, `src/components/ComponentMount.tsx` |

No hardcoded content, routes, navbar labels, or blog chrome exists under `src/`. Search
confirms:

```bash
rg "Teaching|Activities|Resources|Writing|Gallery|Blog" src/ --only-matching | grep -v node_modules
# → zero matches in production source files.
```

The only content-knowledge leak is in the **island registry** (`ComponentMount.tsx`),
which must know the names and prop shapes of `AcademicCollection`, `GalleryGrid`, and
`BlogListing`. This is an acceptable, bounded interlock: the registry is the single
explicit contract between Pandoc-generated placeholders and React components.

### 1.4 The Template Generator Artifact — 48 shadcn/ui Components

`src/components/ui/` contains 48 `.tsx` files (accordion, alert-dialog, calendar,
command, dialog, form, navigation-menu, pagination, sidebar, skeleton, table, toast,
etc.). They were generated by a `shadcn/ui` init or Lovable scaffold and are **not
used** by the application shell.

Evidence of actual usage:
```bash
rg 'from.*@/components/ui/' src/ --only-matching | sort | uniq -c | sort -rn
# 6  src/components/ui/sidebar.tsx  (internal cross-imports)
# 5  src/components/FilterControls.tsx  (Button, Badge, Checkbox, Popover, ScrollArea)
# 3  src/App.tsx  (Toaster, Sonner, TooltipProvider)
# 1  src/hooks/use-toast.ts
# 1  src/components/ui/toggle-group.tsx (internal cross-import)
# ... plus one-off internal imports inside ui/ itself
```

Only **~6 UI primitives** are actually exercised by the app (`Button`, `Badge`,
`Checkbox`, `Popover`, `ScrollArea`, `Toaster`, `Sonner`, `TooltipProvider`). The
remaining ~40 components are dead code.
They create:

- Dependency bloat (Radix UI primitives for every component are in `package.json`)

- Build-time cost (Vite must tree-shake them, but they still participate in typecheck)

- Maintenance friction ( Renovate / Dependabot noise, version conflicts, unused audit
  surface)

**Recommendation:** Remove the entire `src/components/ui/` directory and replace the few
used primitives with direct Radix imports, or with lightweight native Tailwind
implementations. The shell does not need a design-system inventory.

* * *

## 2. Test Audit

### 2.1 What the Tests Prove

The test suite has two layers:

1. **Unit / JSDOM tests** (`src/test/*.test.ts`, `src/**/*.test.tsx`) — run via Vitest.

2. **Browser / Playwright tests** (`tests/*.spec.ts`) — run against the Nginx-served
   static output.

The browser tests are the stronger layer.
They exercise real compiled HTML, real hydration, real MathJax rendering, and real
layout geometry. This is the correct pattern for a static-site pipeline.

Evidence of real-boundary testing:

- `tests/integrity.spec.ts` — loads every manifest route in a browser, asserts zero
  console/page errors, and checks that every `data-component` placeholder hydrates.

- `tests/math-alignment.spec.ts` — waits for `MathJax.startup.promise` and asserts zero
  `mjx-merror` elements across all blog posts.

- `tests/math-macros.spec.ts` — checks for undefined macro errors (`PP`, `ZZ`, `RR`,
  etc.) in the live MathJax output.

- `tests/tikzcd-center.spec.ts` — measures bounding boxes of rendered SVGs to assert
  horizontal centering within the content column.

- `tests/visual.spec.ts` — navigates every route, checks h1 count, nav/footer/profile
  visibility, and that `data-component` inner HTML is not a placeholder comment.

These are **substantive** tests: they would fail if the Pandoc pipeline, the React
island registry, or the template structure changed in a meaningful way.

### 2.2 Weak / Tautological Tests (Slop Patterns)

A minority of unit tests assert structural trivia rather than behavioral contracts.

| Test | File | Violation |
| --- | --- | --- |
| `compile script exists as .cjs (not .js)` | `src/test/build-pipeline.test.ts` | Asserts file naming convention. The compiler would fail to run if the extension were wrong; this is a type-system / tooling invariant, not a behavioral claim. |
| `all references to the compile script in .ts/.tsx files use compile.cjs` | `src/test/build-pipeline.test.ts` | String-match grep inside TS source. This is a lint rule masquerading as a test. |
| `align-math filter invariant` | `src/test/build-pipeline.test.ts` | Checks that every `span.math.display` starts with `\begin{align*}`. This is a structural assertion on Pandoc filter output, but it does not prove the *behavioral* claim ("display math renders correctly"). The Playwright `math-alignment` tests are stronger because they check the live MathJax DOM. The JSDOM version is redundant and lower-fidelity. |
| `CompiledPage renders real compiled content for the current manifest route` | `src/pages/CompiledPage.test.tsx` | Uses `vitest.mock` for `react-router-dom`, then asserts that text `"2024-2025 academic year"` is present. This is a shallow snapshot test: it proves the mocked router returns `/` and that the home page HTML string contains that literal text. It does not prove hydration, navigation, or island behavior. It is also fragile: if the home page copy changes, the test breaks even though the shell is still correct. |

These four tests are **content-free or near-content-free** per the test-guidelines
skill. They assert existence, naming, string presence, or internal consistency rather
than owned nontrivial behavior at a real boundary.

**Recommendation:**

- Remove `build-pipeline.test.ts` entirely.
  The file-extension check is better enforced by `eslint` or a simple shell lint in the
  justfile. The `align-math` JSDOM check is superseded by the Playwright math tests.

- Replace `CompiledPage.test.tsx` with a test that asserts the shell’s *generic*
  behavior: given a mock manifest with a fake route pointing to a minimal HTML fixture,
  `CompiledPage` must inject the HTML and mount any `data-component` placeholders found
  inside it. Do not assert on real content strings.

### 2.3 Test Redundancy

`tests/integrity.spec.ts` and `tests/visual.spec.ts` overlap significantly.
Both:

- iterate over all manifest routes

- listen for `pageerror` and console `error`

- check `data-component` hydration

The difference is that `visual.spec.ts` adds layout assertions (h1 count, nav/footer
visibility, profile card text length, nav-click navigation).
This is the richer test.
`integrity.spec.ts` is almost entirely subsumed.

**Recommendation:** Merge `integrity.spec.ts` into `visual.spec.ts` (or vice versa) to
remove the duplication.
A single “page integrity + layout + hydration” spec per route is sufficient.

### 2.4 Playwright Route Sampling

`toc-position.spec.ts`, `toc-responsive.spec.ts`, and `responsive-layout.spec.ts` all
`slice(0, 2)` the blog post list.
This means only 2 out of 14 posts are checked for TOC position and responsive layout.
If a post with unusual heading structure breaks the TOC, the test suite will not catch
it.

**Recommendation:** Either test all posts (the suite is fast enough: each test takes
<2s) or sample deterministically (e.g., shortest post, longest post, post with most
headings). Random `slice(0, 2)` is a coverage gap.

* * *

## 3. Off-the-Shelf Alternatives vs. Bespoke

### 3.1 What Problem Does This Repo Solve?

The repo is a **Pandoc-first static site generator** for an academic portfolio.
Its unique requirements are:

- Heavy math rendering (MathJax macros, TikZ-CD diagrams)

- Markdown source with Obsidian wikilink syntax

- Content-driven structured data (TOML databases for papers, talks, notes, galleries)

- Runtime islands for filtering/pagination (React components hydrated into static HTML)

- Flat-file deployment to Nginx (no server runtime)

### 3.2 Candidate Alternatives

| Tool | Fit | Verdict |
| --- | --- | --- |
| **Hugo** | Fast, mature, content-driven. Has math support via KaTeX/MathJax plugins. No native Pandoc AST pipeline; would lose the existing Lua filter ecosystem (obsidian.lua, tikzcd.lua, components.lua). Would need to port filters to Hugo shortcodes or partials — non-trivial. | Poor fit. The value of this repo is the Pandoc filter layer. |
| **Jekyll** | Ruby-based, similar to the legacy `~/website` setup. Math support is patchy; no Pandoc integration out of the box. | Poor fit. The migration away from Jekyll is the reason this repo exists. |
| **Eleventy (11ty)** | Flexible, supports custom transforms. Could wrap Pandoc as a transform. But 11ty’s template language (Nunjucks / Liquid / JS) is another layer; the repo would still own the Pandoc invocation logic. | Moderate fit. Would not reduce owned surface meaningfully; adds a framework layer. |
| **Astro** | Islands architecture is conceptually identical to what this repo does (static HTML + hydrated islands). Astro’s “component islands” are native; no need for a custom `mountComponents` registry. However, Astro’s Markdown pipeline is not Pandoc. Porting the Lua filters to Remark/Rehype plugins would be a rewrite. | Moderate fit. The island model is better, but losing Pandoc is a hard tradeoff for math-heavy content. |
| **Zola** | Rust-based, fast, simple. No plugin system for custom AST transforms. | Poor fit. Cannot host the existing Pandoc filter logic. |
| **VitePress / Docusaurus** | Documentation-oriented, assumes sidebar nav and structured docs. Not a general portfolio/blog site. | Poor fit. |
| **Gatsby** | Over-engineered for this use case. GraphQL data layer is heavy. | Poor fit. |
| **Next.js (static export)** | Could do static export with React Server Components. But the site explicitly rejects client-side routing; Next.js wants to own routing. The `dist/` output is a SPA fallback (`index.html`) by default, which conflicts with Nginx `try_files $uri $uri.html`. | Poor fit. Fighting the framework. |

### 3.3 Conclusion on Alternatives

**There is no off-the-shelf tool that natively combines Pandoc’s AST pipeline (Lua
filters, templates, math) with a modern island-hydration frontend.** The bespoke
pipeline is justified.
The correct path is not to replace the compiler, but to **shrink the frontend shell** so
that it is nothing more than a generic island hydrator plus the few interactive
components actually needed.

* * *

## 4. Specific Recommendations to Reduce Owned Surface

### 4.1 Immediate Cleanup (no functional change)

| Action | Estimated LOC removed | File(s) affected |
| --- | --- | --- |
| Delete unused `src/components/ui/` primitives (40 files) | ~3,500 | `src/components/ui/*` except used ones |
| Remove `react-router-dom` dependency; use `window.location.pathname` | -1 dep | `src/App.tsx`, `src/pages/CompiledPage.tsx`, `package.json` |
| Remove unused Radix UI primitives from `package.json` | -10 deps | `package.json` |
| Merge `integrity.spec.ts` into `visual.spec.ts` | ~60 | `tests/integrity.spec.ts` |
| Delete `build-pipeline.test.ts` | ~40 | `src/test/build-pipeline.test.ts` |
| Rewrite `CompiledPage.test.tsx` as a generic shell test | ~20 | `src/pages/CompiledPage.test.tsx` |
| Remove unused `src/components/CardScroller.tsx`, `PaginatedScroller.tsx`, etc. if dead | variable | audit with `knip` / `vulture` equivalent |

### 4.2 Medium-Term Refinement

| Action | Rationale |
| --- | --- |
| Move island component registry to a **dynamic import** map | `ComponentMount.tsx` hardcodes `import AcademicCollection from '...'`. A dynamic `import()` registry would allow adding new island types without editing the shell, provided the component name matches the `data-component` attribute. This shrinks the bounded interlock even further. |
| Extract compile script into a **separate package** or vendored CLI | If the Pandoc + manifest + island model is stable, the compiler could become a standalone `pandoc-ssg` CLI tool. The site repo would then only contain `content/`, templates, and the thin React shell. This is the ultimate reduction of owned surface. |
| Replace shadcn/ui remnants with **Tailwind-only primitives** | The used primitives (Button, Badge, Popover, etc.) are simple enough to implement in ~20 LOC each with Tailwind. This removes the entire Radix UI dependency tree for the shell. |
| Add `knip` / `vulture` / `depcheck` to the justfile quality gate | Automated dead-code detection prevents the UI component inventory from regrowing. |

### 4.3 Architecture Rules to Enforce

1. **No new dependencies under `src/` without justifying why the behavior cannot be
   composed from Pandoc, a filter, or a template.**

2. **No new files under `src/components/ui/` ever.** If a UI primitive is needed, it is
   a local Tailwind implementation, not a shadcn scaffold.

3. **No routing library.** `window.location.pathname` is sufficient.

4. **Tests must prove a real boundary or live rendering contract.** No file-existence
   tests, no string-matching grep tests, no mocked shallow renders of real content.

* * *

## 5. Honest Assessment of Maintainability

### What is maintainable

- The **compile pipeline** (`compile.cjs`) is a single, linear script with clear phases:
  discover → validate → compile → write manifest.
  It is easy to read and modify.

- The **manifest contract** is the right abstraction.
  Every consumer (app, sitemap, tests) is decoupled from content internals.

- The **Pandoc layer** (templates, filters, defaults) is externally standardized.
  The skills learned here transfer to any Pandoc project.

- The **content boundary** is real: a user can add `content/blog/new.md` and get a route
  with zero code changes.
  The `goals-contract.test.ts` suite enforces this with red-green tests.

### What is not maintainable (without the above cleanup)

- The **shadcn/ui component inventory** is a time bomb.
  It will rot: dependencies will drift, TypeScript will error on unused props, and the
  next agent will be tempted to “use” the existing components for new features,
  increasing lock-in.

- The **React Router inclusion** is a conceptual lie.
  It tells every reader that this is an SPA, which it is not.
  This creates confusion and maintenance risk.

- The **test suite bloat** (redundant integrity + visual specs, weak unit tests)
  increases CI time and dilutes signal.
  When a test fails, a maintainer must first decide whether the test is meaningful.

### Verdict

With the cleanup in §4.1 applied, the repository becomes a **minimal, elegant
Pandoc-driven static site with a thin React island shell**. The owned surface would be
approximately:

- ~500 LOC compile script

- ~200 LOC React shell (CompiledPage + ComponentMount)

- ~300 LOC island components (AcademicCollection, BlogListing, GalleryGrid, filters)

- ~100 LOC lightweight UI primitives (if any)

- Content, templates, filters, and tests as before

This is **small enough to own** and **coherent enough to refine** without migrating to
an external framework.
The architecture is not a bunch of ugly hacks; it is a deliberate, thin layer over
Pandoc. The ugliness is only in the **template-generator residue** (shadcn/ui, React
Router) that was dragged in during initial scaffolding and never cleaned up.

* * *

## 6. Evidence Checklist

| Claim | Evidence Command / File |
| --- | --- |
| 48 UI components exist | `ls src/components/ui/*.tsx \| wc -l` → 48 |
| Only ~6 are used | `rg 'from.*@/components/ui/' src/ --only-matching \| sort \| uniq -c` |
| React Router is present | `package.json` line 33; `src/App.tsx` line 11 |
| No content hardcoded in src | `rg "Teaching\|Activities\|Resources\|Writing\|Gallery\|Blog" src/ --only-matching` → 0 |
| Tests derive routes from manifest | `tests/integrity.spec.ts` lines 14–21 |
| Playwright tests check live MathJax | `tests/math-alignment.spec.ts` lines 24–34 |
| Weak unit tests exist | `src/test/build-pipeline.test.ts`, `src/pages/CompiledPage.test.tsx` |
| Compile script is single file | `src/compile.cjs`, 524 LOC |
| GOALS contract tests pass | `npx vitest run src/test/goals-contract.test.ts` → 21 passed |

* * *

## 7. Next Actions

1. **Execute §4.1 cleanup** in a dedicated branch (remove dead UI components, drop React
   Router, merge test specs, delete weak unit tests).

2. **Run `just test`** after each cleanup step to verify no regression.

3. **Add `knip` or `depcheck`** to the justfile `test` gate to prevent dead-code
   regression.

4. **Tag `v1.0.0`** after the cleanup lands and `just test` passes.

* * *

*Analysis performed by agent inspection of live source, test execution, and skill-guided
review (`test-guidelines`, `anti-slop`). No off-the-shelf replacement was found that
preserves the Pandoc AST pipeline without a full rewrite.*
