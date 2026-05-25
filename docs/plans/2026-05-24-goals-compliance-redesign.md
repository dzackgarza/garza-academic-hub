# GOALS Compliance Redesign and Migration Plan

**Goal:** Move the site back to the `GOALS.md` architecture: `content/` is the editable CMS boundary, Pandoc templates/filters own page structure and most presentation, and the app layer is a generic compiler/ingestion/rendering shell.

**Architecture:** The build pipeline discovers Markdown and data files under `content/`, validates them against explicit schemas, compiles each source file with Pandoc defaults/templates/Lua filters, emits a route manifest plus static HTML/assets, and leaves the React/Vite side with only generic route loading, island hydration, and static serving. Site-specific page chrome, blog chrome, nav/profile/footer layout, page type choices, and route inclusion move out of `src/` and into content-owned Markdown, YAML/TOML metadata, Pandoc templates, and Lua filters.

**Primary sources consulted:**
- Local source of truth: `GOALS.md`, `AGENTS.md`, `content/CONTENT-GUIDE.md`, `justfile`, `scripts/compile.cjs`, `src/App.tsx`, `src/pages/CompiledPage.tsx`, `src/pages/BlogPost.tsx`, `src/components/PageShell.tsx`, `tests/routes.ts`, `vite.config.ts`.
- Current docs: Pandoc manual/Lua filters/templates/defaults via Context7 and official `pandoc.org`, Playwright assertions/screenshots/ARIA docs via Context7 and `playwright.dev`, Vite static assets/build/preview docs via Context7 and `vite.dev`.
- Audit references: `llm-failure-modes` sections on coding, investigation, and testing failures; `anti-slop` references for code and design patterns.

---

## Defect Statement

The current repo only partially implements the desired model.

Observed violations:

- `src/App.tsx` hardcodes top-level routes.
- `src/pages/CompiledPage.tsx` hardcodes page route configuration and sidebar choices.
- `src/pages/BlogPost.tsx` owns post layout, related-post logic, legacy-stub UI, metadata footer, and adjacent-post navigation that should be content/template controlled.
- `src/components/AcademicLayout.tsx`, `src/components/NavBar.tsx`, and `src/components/ProfileSidebar.tsx` keep site chrome in React instead of Pandoc templates/content databases.
- `src/components/PageShell.tsx` contains a content-specific slot registry, ad hoc source lookup, weak `any`/index signatures, permissive missing-source behavior, and app-owned data-to-component mapping.
- `src/content/*.ts` imports content databases into app modules, keeping content interpretation in `src/`.
- `tests/routes.ts` requires manual route updates when content changes, which contradicts automatic content discovery.
- `scripts/compile.cjs` hand-parses frontmatter with regex, silently skips malformed posts, injects metadata defaults, strips frontmatter before Pandoc sees it, and does not emit a canonical route manifest for the app/tests.
- `vite.config.ts` discovers only blog slugs for the sitemap and hardcodes non-blog routes.

Correct final state:

- Adding `content/blog/new.md` produces `/blog/new` after `just compile` and `just check`, without editing `src/`, tests, or config.
- Adding `content/resources.md` or `content/pages/resources.md` produces `/resources` by the same mechanism.
- Page layout, nav, footer, profile/sidebar, blog metadata blocks, post navigation, lists, galleries, and page type choices are driven by Markdown metadata, content databases, Pandoc templates, and filters.
- React code has no content-specific route lists, no hardcoded page names, no hardcoded post chrome, and no content database imports outside generic manifest/island hydration code.
- Tests derive routes from the same generated manifest as the app and assert on real rendered pages.

## Non-Negotiable Constraints

- `content/` is the CMS boundary. Content editors must not edit `src/` to add pages, posts, layout choices, nav items, sidebars, galleries, or included page sections.
- Pandoc remains the document compiler. Prefer Pandoc defaults files, templates, metadata files, and Lua filters before adding app logic.
- App code may orchestrate compilation, import generated artifacts, serve generated pages, and hydrate explicitly declared islands. It must not know site-specific headings, page names, card datasets, navbar labels, or blog post structure.
- Fail fast on invalid content. Do not skip malformed posts, invent default dates, swallow missing data sources, or render empty placeholders for unknown component types.
- Use mature dependencies for parsing/validation instead of hand-rolled string logic: Pandoc for Markdown metadata/body parsing, a real schema validator for generated manifests and content databases, Playwright for rendered-page behavior.
- No fallback architecture. Remove legacy slot names and compatibility aliases after migrating content to the new vocabulary.
- Verification must use real content files, real Pandoc output, real Vite/preview serving, and Playwright browser assertions. Mocks are allowed only for narrow unit tests that do not claim system correctness.
- Every implementation step must checkpoint first, write a failing test or failing content fixture where applicable, then make the minimal change that turns the real check green.

## Target Content Model

Use these content-owned canonical shapes:

- `content/pages/*.md`
  - Each file becomes a route by filename.
  - `content/pages/home.md` maps to `/`.
  - Frontmatter controls `title`, `route`, `template`, `layout`, `nav`, `sidebar`, `order`, `description`, and optional sitemap metadata.
- `content/blog/*.md`
  - Each file becomes `/blog/<slug>`.
  - Frontmatter controls `title`, `date`, `updated`, `tags`, `categories`, `excerpt`, `template`, and explicit legacy redirect/link metadata when needed.
- `content/databases/*.toml`
  - Structured site data for nav, profile, galleries, links, and academic collections.
  - These files are read by the compiler/filter layer, not imported by site-specific React modules.
- `content/templates/*.html`
  - Pandoc templates for full page structure: base shell, page layout, post layout, list/archive layout, profile/sidebar blocks, TOC blocks, nav/footer slots.
- `content/filters/*.lua`
  - AST transformations for includes, transclusion, collection rendering placeholders, gallery declarations, and validated island declarations.
- `content/defaults/*.yaml`
  - Pandoc defaults files for page/post/archive builds: reader/writer options, filters, templates, metadata files, TOC options, math settings.
- `.generated/site-manifest.json`
  - Single generated contract consumed by app, sitemap, and tests. It includes route path, source path, output HTML path, content type, title, template, needed islands, and sitemap fields.

## Recommended Tooling

Keep the stack small and standard:

- Pandoc CLI with defaults files, custom HTML templates, metadata/frontmatter, and Lua filters.
- Node/Bun orchestration only for filesystem discovery, schema validation, invoking Pandoc, writing manifests, and copying generated artifacts.
- `zod` or equivalent for manifest/content schema validation at compile time. This repo already depends on `zod`; use it before adding another validator.
- `smol-toml` can remain for TOML parsing, but parsing should happen in the compiler/generator path unless an island genuinely needs client-side data.
- Vite can remain as the dev/build wrapper and static asset handler. Generated pages/assets should use documented `publicDir`, `base`, `build`, and `preview` behavior rather than custom serving logic.
- React should remain only if islands need client interactivity. Static page chrome and document structure should come from generated HTML, not React components.
- Playwright should be the authority for rendered route checks, visible headings, navigation, island hydration, screenshots when visually relevant, and ARIA snapshots for stable page structure.

## Migration Phases

### Establish the Generated Contract

Objective: create the manifest contract before moving rendering ownership.

Files:

- Modify: `scripts/compile.cjs` or replace it with a small compiler module under `scripts/`.
- Create: `content/defaults/page.yaml`, `content/defaults/post.yaml`.
- Create: `.generated/site-manifest.json`.
- Create: tests for manifest generation from real `content/` fixtures.

Tasks:

- Define the manifest schema with exact route, source, output, type, title, template, and island fields.
- Replace regex frontmatter parsing with Pandoc/native metadata extraction or a parser that preserves Pandoc semantics and rejects malformed frontmatter.
- Discover all Markdown files under `content/pages/` and `content/blog/`.
- Map `home.md` to `/`; map other page files to `/<slug>`; map blog files to `/blog/<slug>`.
- Assert duplicate routes fail compilation.
- Assert missing required metadata fails compilation.
- Assert unknown template names fail compilation.
- Emit one manifest used by app, sitemap, and tests.

Acceptance:

- A real fixture `content/pages/resources.md` added in a test produces `/resources` in `.generated/site-manifest.json`.
- A real fixture `content/blog/new.md` added in a test produces `/blog/new`.
- Malformed frontmatter fails `just compile` with a specific file path and schema error.
- No compiler path silently skips content or invents metadata.

Validation:

- `just compile`
- `just test` for manifest tests
- `jq` inspection of `.generated/site-manifest.json`

### Move Page and Post Structure Into Pandoc

Objective: make templates own document structure and remove blog/page chrome from React.

Files:

- Modify: `content/templates/page-template.html`.
- Modify: `content/templates/post-template.html`.
- Create: shared template partials if the chosen Pandoc template approach supports them cleanly; otherwise keep repeated structure inside template files until there is a proven reuse mechanism.
- Modify: blog/page Markdown frontmatter to select templates/layouts.
- Modify: `src/pages/BlogPost.tsx` after red tests prove the current app-owned chrome is the violation.

Tasks:

- Move blog title, date, updated date, tags, categories, TOC, adjacent links, related links, legacy notice, and post footer into the Pandoc post template or compiler-provided metadata.
- Move page sidebar/profile/nav/footer layout decisions into templates and metadata.
- Ensure Pandoc receives complete Markdown documents with metadata, not stripped body-only input.
- Generate complete HTML fragments or complete route documents consistently; choose one output shape and make the app consume only that shape.
- Remove React-owned special cases for blog post metadata and route-specific page chrome.

Acceptance:

- The generated HTML for a blog post contains the post header, metadata block, body, and post navigation before React loads it.
- `src/pages/BlogPost.tsx` no longer maps over tags/categories or constructs adjacent/related post UI.
- `src/pages/CompiledPage.tsx` no longer knows which routes have sidebars.
- Template selection is visible in content frontmatter or a content-owned defaults/database file.

Validation:

- `just preview content/blog/<real-post>.md` renders a usable single-page HTML preview with the same template path used by the compiler.
- `just compile`
- Playwright route assertion for one blog post checks rendered title, metadata, body heading, and navigation link visibility.

### Replace Hardcoded App Routes With Manifest Routing

Objective: make the app generic over generated content.

Files:

- Modify: `src/App.tsx`.
- Modify: `src/pages/CompiledPage.tsx`.
- Remove or shrink: `src/pages/BlogPost.tsx`.
- Modify: `vite.config.ts`.
- Modify: `tests/routes.ts`.

Tasks:

- Import the generated manifest in the app.
- Build routes by mapping manifest entries instead of writing route declarations by hand.
- Resolve generated HTML by manifest entry, not by route-specific switch maps.
- Generate sitemap routes from the manifest, not from separate filesystem scans.
- Generate Playwright route lists from the manifest, not a committed manual array.
- Keep the 404 route generic.

Acceptance:

- Adding a content page changes the generated manifest and automatically changes app routes, sitemap routes, and E2E route coverage.
- No file under `src/` contains string literals for concrete content routes except generic path patterns needed by the router.
- `tests/routes.ts` does not contain hand-listed blog slugs.

Validation:

- `rg -n "'/(teaching|activities|writing|gallery|blog)'|\"/(teaching|activities|writing|gallery|blog)\" src tests vite.config.ts`
- `just compile`
- `just check`
- Playwright navigation to every manifest route.

### Move Site Chrome Out of React

Objective: eliminate site-specific layout and content from React shell components.

Files:

- Modify or delete: `src/components/AcademicLayout.tsx`.
- Modify or delete: `src/components/NavBar.tsx`.
- Modify or delete: `src/components/ProfileSidebar.tsx`.
- Modify: `content/databases/navigation.toml`.
- Modify: `content/databases/profile.toml`.
- Modify: `content/templates/*.html`.

Tasks:

- Render navbar, profile/sidebar, and footer through Pandoc templates using content database metadata.
- Decide whether TOML databases are converted to Pandoc metadata files during compile or read by a Lua filter. Use one path as the source of truth.
- Remove `@/content/navigation` and `@/content/profile` imports from React.
- Leave React layout only as a root container for generated HTML and islands.

Acceptance:

- Navigation labels/order can be changed by editing `content/databases/navigation.toml` and running compile.
- Profile/sidebar content can be changed by editing `content/databases/profile.toml` and running compile.
- React no longer contains `D. Zack Garza`, copyright text, profile fields, or navbar labels.

Validation:

- `rg -n "D\\. Zack Garza|copyright|profile|navItems|navigation.toml|profile.toml" src`
- Playwright assertion that nav links and profile fields are visible on generated pages.

### Formalize Pandoc-Flavored Islands and Transclusion

Objective: keep dynamic components explicit and content controlled while avoiding app-owned content logic.

Files:

- Modify: `content/filters/components.lua`.
- Create: additional Lua filters only when they own a clear Pandoc AST transformation.
- Modify: `src/components/PageShell.tsx`.
- Modify: island components under `src/components/islands/` or create that boundary explicitly.
- Modify: `content/CONTENT-GUIDE.md`.

Tasks:

- Replace legacy component names with a small, documented island vocabulary.
- Validate all island attributes during compile and fail on unknown type, missing source, missing gallery/group id, invalid layout, invalid columns/rows, or missing data records.
- Move data selection/filtering to compile time where possible.
- Keep client-side React only for behavior that is genuinely interactive after page load.
- Add transclusion syntax using a Pandoc filter for content includes, with explicit include roots and cycle detection.
- Remove app-side permissive behavior such as missing TOML source warnings and `{}` fallbacks.

Acceptance:

- A content author can declare an island in Markdown with Pandoc fenced div syntax documented in `content/CONTENT-GUIDE.md`.
- Invalid island declarations fail `just compile`.
- `PageShell` no longer parses arbitrary TOML paths or contains the full site-specific registry.
- No legacy aliases remain after content migration.

Validation:

- Real compile test with a valid gallery/listing island.
- Real compile test with an invalid island type that fails before Vite starts.
- Playwright assertion that a generated page hydrates the declared island and remains navigable.

### Remove App-Side Content Data Modules

Objective: eliminate the `src/content` content interpretation layer.

Files:

- Delete or empty after migration: `src/content/*.ts`.
- Modify import sites in `src/components/*`, `src/pages/*`, and island modules.
- Move any reusable type contracts to generated manifest schemas or island-specific generated JSON.

Tasks:

- Move content database parsing into the compiler.
- Emit island payload JSON per route or per island when client interactivity needs runtime data.
- Import generated island payloads through generic manifest references, not hardcoded database imports.
- Remove `@content` alias if it is no longer needed by app code.

Acceptance:

- `src/content/` is gone or contains no imports from `content/databases`.
- No app file imports `@content/databases/*.toml`.
- Content database schema failures are reported during compile.

Validation:

- `rg -n "@content|content/databases|src/content" src vite.config.ts tests`
- `just compile`
- `just check`

### Rebuild Tests Around Real Rendered Content

Objective: make tests prove GOALS compliance rather than activity.

Files:

- Modify: `tests/routes.ts`.
- Modify: `tests/visual.spec.ts`.
- Modify: `tests/screenshots.spec.ts`.
- Modify/add: compiler integration tests under `src/test/` or `tests/compile/`.
- Modify: `justfile`.

Tasks:

- Generate route tests from `.generated/site-manifest.json`.
- Add a real content fixture workflow: create a temporary Markdown page/post inside a test sandbox or fixture content tree, run the compiler, and assert route/HTML output.
- Add Playwright tests that run against the built or previewed app and assert visible headings/body/nav links for every manifest route.
- Add ARIA snapshots for stable nav/page structure where appropriate.
- Keep visual screenshots for layout regressions, but never use screenshots as the only proof that content routing works.
- Add raw Markdown purity checks over `content/**/*.md` for block-level HTML.
- Add hardcoded path checks for `/home/dzack` scoped to source/config/script files.
- Add source separation checks that fail if concrete content route names or content database imports appear in `src/`.

Acceptance:

- Tests fail if a new content page is not routable.
- Tests fail if a malformed page silently compiles.
- Tests fail if app code reintroduces hardcoded content route lists.
- Tests fail if route coverage is manually stale.

Validation:

- `just test`
- `just e2e`
- `just check`
- Browser/Playwright visual inspection with cited route URLs before claiming visual completion.

### Content Parity With Legacy Site

Objective: make `GOALS.md` Goal 2 auditable instead of aspirational.

Files:

- Create: generated parity inventory under `.generated/legacy-parity.json` or a checked-in planning ledger if it represents stable target mapping rather than transient status.
- Inspect: `/home/dzack/website/_pages`, `/home/dzack/website/_posts`, `/home/dzack/website/_data`, `/home/dzack/website/assets`.
- Modify: `content/` only for migrated content.

Tasks:

- Inventory legacy Jekyll pages, posts, collections, navigation, layouts, includes, and assets.
- Map each legacy route to a new content source or an explicit exclusion.
- Migrate Markdown content into `content/pages` and `content/blog` with clean frontmatter.
- Move legacy data into `content/databases` or plain Markdown as appropriate.
- Copy or reference assets through content-owned paths.
- Add redirect metadata only when a legacy URL needs preservation.

Acceptance:

- Every legacy `_posts/*.md` entry has a corresponding `content/blog/*.md` entry or a documented exclusion.
- Every relevant legacy `_pages/*` entry has a corresponding content page or documented exclusion.
- The generated route inventory can be compared against the legacy inventory.

Validation:

- `tree -a -L 3 /home/dzack/website`
- inventory script output comparing legacy and new route sets
- Playwright smoke checks for representative migrated pages/posts

## Audit Gates

Apply these gates before each migration branch is considered ready.

### GOALS Compliance Gate

- Can a new Markdown page/post be added under `content/` and become routable with no `src/`, test, or config edit?
- Does the generated manifest drive app routes, sitemap routes, and E2E routes?
- Is every page/post structure decision content/template/filter owned?
- Does `just preview <content-file>` use the same Pandoc defaults/template/filter path as the full compile?

### LLM Failure Modes Gate

Check explicitly for:

- Specification drift: did the implementation reduce app-owned content logic, or only rename it?
- Slop accretion: did the change add wrappers/registries instead of deleting React content logic?
- Reimplementation impulse: did the code hand-roll parsing/routing/schema behavior that Pandoc, Vite, Playwright, or `zod` already provides?
- Outcome blindness: do tests prove the user workflow, not just object existence?
- Content-free verification: are assertions checking real route/content semantics rather than `length > 0`?
- Mock-first evasion: are primary tests using real Markdown, real Pandoc output, and real rendered browser pages?
- Tool output blindness: were failed compile/build/test/browser checks treated as blockers instead of bypassed?

### Anti-Slop Gate

Check explicitly for:

- Generic code names such as `data`, `result`, `item`, `handler`, or `manager` where the domain shape is known.
- Obvious comments and section banners that restate code structure.
- New abstraction layers that only move content coupling under generic names.
- Generic error handling that catches broad exceptions and continues.
- Design slop: card overuse, generic gradients, decorative UI, repeated center alignment, and app-owned marketing-style sections.
- UX slop: ambiguous empty states, generic failure messages, controls without visible feedback, and unstable layout during hydration.

## Stop Rules

- Stop if Pandoc is unavailable or cannot compile the current real content.
- Stop if the generated manifest schema cannot be made explicit without `any`/`unknown` leakage at the app boundary.
- Stop if a page/post migration requires editing `src/` for content reasons; the plan step has failed and must be redesigned.
- Stop if Playwright cannot render the built site; do not substitute unit tests for visual/rendered verification.
- Stop if legacy parity cannot be evaluated because `/home/dzack/website` is unavailable; report the missing source instead of inventing parity claims.
- Stop if any compile path silently skips invalid content.

## Completion Definition

The redesign is complete only when these all hold:

- `content/` is the only required edit surface for content, layout choices, nav/profile/footer data, included pages, and page/post creation.
- `src/` contains a generic static site shell plus optional interactive islands, with no concrete page/post route lists or content database imports.
- Pandoc templates/defaults/filters own document structure and most page design.
- `.generated/site-manifest.json` is the one generated route/content contract used by app, sitemap, and tests.
- `just preview`, `just compile`, `just check`, and `just e2e` exercise the real pipeline.
- Playwright has visually inspected representative rendered pages before any visual completion claim.
