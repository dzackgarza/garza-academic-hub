# ─── Content Preview ───────────────────────────────────────────────────────────
# Compile a single page or blog post to HTML and print to stdout.
# Usage:
#   just preview content/pages/gallery.md
#   just preview content/blog/undergrad-resources.md

_preview_template file:
    @case "{{file}}" in \
      content/blog/*) \
        echo "content/templates/post-template.html" ;; \
      *) \
        echo "content/templates/page-template.html" ;; \
    esac

preview file:
    @pandoc --from=markdown --to=html --mathjax --lua-filter=content/filters/components.lua --template="$(just _preview_template "{{file}}")" "{{file}}"

# Preview a page and write to a temp file, then open in browser
preview-open file:
    @tmpfile="/tmp/garza-preview-$(basename "{{file}}" .md).html" && \
    pandoc --from=markdown --to=html --mathjax --lua-filter=content/filters/components.lua --template="$(just _preview_template "{{file}}")" -o "$$tmpfile" "{{file}}" && \
    echo "Preview: $$tmpfile" && \
    $${BROWSER:-xdg-open} "$$tmpfile" 2>/dev/null || true

# ─── Build ─────────────────────────────────────────────────────────────────────
# Run the full compile pipeline (blog posts + pages)

compile:
    @node scripts/compile.cjs

# ─── Tests ─────────────────────────────────────────────────────────────────────

# Unit tests (vitest)
test:
    npx vitest --run

# End-to-end visual regression tests (Playwright)
# Generates golden screenshots first, then asserts against them on subsequent runs
test:e2e:
    npx playwright test

# Update golden snapshot baselines for visual regression tests
# Run this AFTER verifying the site renders correctly
update-snapshots:
    npx playwright test --update-snapshots

# Typecheck only (no emit)
typecheck:
    npx tsc --noEmit

# Full check: unit tests + typecheck + production build
check: test typecheck
    npx vite build

# ─── Utilities ─────────────────────────────────────────────────────────────────
# Show available content files

list-posts:
    @echo "Blog posts:"; ls content/blog/*.md; echo ""; echo "Pages:"; ls content/pages/*.md; echo ""; echo "TOML databases:"; ls content/databases/*.toml
