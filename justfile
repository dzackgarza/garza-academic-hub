default:
    @just --list

# ─── Content Preview ───────────────────────────────────────────────────────────
# Compile a single page or blog post to HTML and print to stdout.
# Usage:
#   just preview content/pages/gallery.md
#   just preview content/blog/undergrad-resources.md

preview file:
    @node scripts/compile.cjs --preview "{{file}}"

# Preview a page and write to a temp file, then open in browser
preview-open file:
    @tmpfile="/tmp/garza-preview-$(basename "{{file}}" .md).html" && \
    node scripts/compile.cjs --preview "{{file}}" > "$$tmpfile" && \
    echo "Preview: $$tmpfile" && \
    $${BROWSER:-xdg-open} "$$tmpfile" 2>/dev/null || true

# ─── Build ─────────────────────────────────────────────────────────────────────
# Run the full compile pipeline (blog posts + pages)

compile:
    @node scripts/compile.cjs

build: compile
    npx vite build

run:
    fuser -k 8080/tcp 2>/dev/null || true; sleep 0.3; npx vite preview --host :: --port 8080 --strictPort

# ─── Tests ─────────────────────────────────────────────────────────────────────

# Standard test suite: unit tests + visual regression (requires build)
test: compile build
    npx vitest --run --pool=threads && npx playwright test

# End-to-end visual regression tests (Playwright)
# Generates golden screenshots first, then asserts against them on subsequent runs
test-e2e:
    npx playwright test

# Update golden snapshot baselines for visual regression tests
# Run this AFTER verifying the site renders correctly
update-snapshots:
    npx playwright test --update-snapshots

# Typecheck only (no emit)
typecheck:
    npx tsc --noEmit

# Full check: unit tests + typecheck + visual regression + build
check: test typecheck

# ─── Utilities ─────────────────────────────────────────────────────────────────
# Show available content files

list-posts:
    @echo "Blog posts:"; ls content/blog/*.md; echo ""; echo "Pages:"; ls content/pages/*.md; echo ""; echo "TOML databases:"; ls content/databases/*.toml
