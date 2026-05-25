# GOALS.md

This repository exists to maintain an academic website as an almost entirely
Pandoc-driven content system. The app is not the website's design layer. The app is a
lightweight compilation, ingestion, rendering, and serving pipeline for content that
lives under `content/`.

The app should own minimal logic. When a goal needs substantial behavior, prefer
composing external tools, standard libraries, Pandoc filters, utilities, vendored or
external code, dependencies, and plugins over writing large in-app implementations.
Minimize owned LOC across all goals.

The goals below are ordered by dependency. Higher tiers are prerequisites for lower
tiers. Do not spend design, migration, feature-parity, or polish work on a lower tier
until every acceptance criterion in the higher tiers is met. If a lower-tier task exposes
a higher-tier violation, stop the lower-tier work and repair the higher-tier defect
first.

## Tier: Content Boundary

The `content/` subtree is the only place a content editor touches. Updating site
content, page inclusion, page order, navigation, page layout choices, page type,
visuals controlled by templates, and structured content data must require zero changes
under `src/`.

**Requirements:**
- Users can add pages and blog posts as plain Markdown files with minimal YAML
  frontmatter.
- New content is integrated automatically on the next compile.
- Content files use standard Markdown syntax only. Raw block-level HTML is prohibited.
- Metadata comes from standard frontmatter and content-owned data files.
- The directory structure is intuitive and self-documenting.
- Content and source stay completely separate: adding or editing content never requires
  changes under `src/`.

**Evidence of Success:**
- A user can add `content/blog/new.md` with basic YAML frontmatter and get
  `/blog/new`.
- A user can add a content page and get the corresponding slugged route.
- The build process includes new content with no code or configuration edits.
- The rendered site shows the new content with the correct template and layout.

## Tier: Pandoc-Owned Site Structure

Pandoc templates, filters, defaults files, Markdown metadata, and content-owned data
files control site structure and most visual presentation. This repository should feel
like a small Jekyll, Hugo, or Pelican-style static site system, but with Pandoc as the
document engine.

**Requirements:**
- Templates own document structure: navbars, footers, profile/sidebar blocks, post
  headers, table of contents, archive pages, fixed page types, and repeated layout
  chrome.
- Lua filters own Pandoc-flavored extensions such as transclusion, validated component
  declarations, galleries, collection placeholders, and other AST-level transformations.
- Defaults files define the reproducible Pandoc command surface for each page type.
- React components are islands only when runtime interactivity is actually needed.
- The app must not encode page-specific headings, route lists, metadata arrays, table of
  contents data, navbar labels, profile content, gallery membership, or blog post chrome.

**Evidence of Success:**
- `just preview <content-file>` uses the same Pandoc templates, filters, and defaults as
  the full compile path.
- Generated HTML already contains document chrome before React hydrates any island.
- Search over `src/` finds no concrete page list, content-specific metadata table,
  navbar content, profile content, or blog chrome.

## Tier: Generic Compilation and Serving Pipeline

The app side exists to discover content, validate explicit schemas, invoke Pandoc, emit
generated artifacts, ingest a generated manifest, hydrate declared islands, and serve
the resulting static site. It owns as little logic as possible.

**Requirements:**
- A generated manifest is the single contract for routes, output paths, page types,
  template choices, sitemap entries, and island payloads.
- The app, sitemap generation, and tests all consume the same manifest.
- The compiler fails fast on malformed frontmatter, duplicate routes, unknown templates,
  invalid island declarations, missing data records, and schema violations.
- The pipeline does not invent defaults for missing required content and does not skip
  invalid content.
- Standard libraries and existing tools handle parsing, validation, routing inputs, and
  browser verification wherever practical.
- High-LOC necessities are outsourced to existing tools, libraries, filters, utilities,
  external dependencies, plugins, or vendored code before new app logic is considered.
- New in-app code is accepted only when the required behavior cannot be cleanly composed
  from existing tools.

**Evidence of Success:**
- Adding content changes the generated manifest and automatically changes app routes,
  sitemap routes, and rendered-route test coverage.
- `src/` contains a generic shell plus optional interactive islands, not site-specific
  content interpretation.
- Invalid content fails during compile with a concrete file path and error.
- The implementation reduces owned app LOC for content compilation and site structure
  rather than moving the same logic to new local wrappers.

## Tier: Real Rendered Verification

Tests prove the actual authoring and rendering workflow. They do not merely prove that
objects exist or that mocks match mocked behavior.

**Requirements:**
- Tests use real Markdown fixtures, real Pandoc output, real generated manifests, and
  real browser-rendered pages.
- Route coverage is derived from the generated manifest.
- Playwright checks visible content, navigation, island hydration, and stable page
  structure.
- Visual checks require a running server and browser inspection before any visual
  completion claim.
- Markdown purity, source/content separation, and hardcoded path checks are automated.

**Evidence of Success:**
- A test fails if a new content file does not become routable.
- A test fails if app code reintroduces hardcoded content route lists.
- A test fails if malformed content compiles silently.
- Browser tests inspect the rendered pages that users will actually see.

## Tier: Simple Single-Page HTML Preview

Manual preview remains simple because it is just the normal Pandoc path aimed at one
file.

**Requirements:**
- A content editor can compile one page or post to HTML from the CLI.
- Preview output uses the same templates, filters, defaults, metadata handling, and math
  settings as the full site compile.
- Preview does not require starting the full app unless the page uses runtime islands.

**Evidence of Success:**
- `just preview content/pages/example.md` produces a close standalone HTML preview.
- `just preview content/blog/example.md` produces the same post structure used in the
  generated site.

## Tier: Feature and Content Parity

Feature and content parity with `https://dzackgarza.com/`, also available at
`~/website`, comes after the foundational content, Pandoc, pipeline, and verification
tiers are satisfied.

**Requirements:**
- Legacy pages, posts, navigation, assets, layouts, includes, and data files are
  inventoried before migration.
- Each legacy route maps to a content source, generated route, redirect, or documented
  exclusion.
- Migration preserves content semantics while moving ownership into `content/`,
  templates, filters, and generated artifacts.

**Evidence of Success:**
- Every relevant legacy post and page has a mapped new route or explicit exclusion.
- Representative migrated pages render correctly through the real pipeline.
- No parity work requires adding site-specific content logic under `src/`.
