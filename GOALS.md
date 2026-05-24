# GOALS.md

## Goal 1: Durable, Dead Simple Content Directory

A content directory that can be managed by users updating website content with zero
knowledge of internals.
The `content/` subtree is the only place a content editor ever touches — updating the
site should involve **zero changes to `src/`**.

**Requirements:**
- Users should be able to drop in new blog posts as plain markdown files with minimal
  metadata
- New content should automatically be integrated into the site on the next compile
- The integration should be seamless (no manual configuration or code changes required)
- The directory structure should be intuitive and self-documenting
- Content files should follow standard Markdown syntax only (no raw HTML injection)
- The system should handle metadata extraction from standard frontmatter (YAML) in
  markdown files
- **Content and source (`src/`) must be completely separate**: adding or editing content
  must never require changes to files under `src/`, only to files under `content/`

**Evidence of Success:**
- A user can add a new `.md` file to `content/blog/` with basic YAML frontmatter
- Running the build process automatically includes the new post in the generated site
- No code modifications or configuration updates are needed by the user
- The content appears correctly formatted in the final rendered site

## Goal 2: Feature and Content Parity with dzackgarza.com

Feature and content parity with https://dzackgarza.com/, which is also available at
~/website on this machine.

## Goal 3: Simple Single-Page HTML Preview

It should be dead simple to manually compile a single page to SOME kind of HTML to get a
close preview of what it'll look like on the site.
The rendering pipeline should not heavily diverge from a basic pandoc pipeline (with
templates and filters) that can be easily reproduced, standalone, on the CLI.
