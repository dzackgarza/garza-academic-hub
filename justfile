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

# ─── Quality Gate ──────────────────────────────────────────────────────────────

# Single canonical gate: generates macros, typechecks, compiles, builds, syncs
# to the Nginx static root, runs unit tests, and verifies MathJax rendering
# against freshly deployed output. Always run this before pushing.
test: generate-macros
    @npx tsc --noEmit
    @BASE_URL="/website" node scripts/compile.cjs
    @npx vite build
    @mkdir -p /var/www/html/website/assets
    @cp dist/assets/index-*.css /var/www/html/website/assets/index.css 2>/dev/null || true
    @cp dist/assets/index-*.js /var/www/html/website/assets/index.js 2>/dev/null || true
    @cp public/assets/mathjax-macros.js /var/www/html/website/assets/mathjax-macros.js
    @rsync -av .generated/pages/ /var/www/html/website/
    @rsync -av --delete .generated/blog/ /var/www/html/website/blog/
    @cp /var/www/html/website/home.html /var/www/html/website/index.html
    @npx vitest --run --pool=threads
    @TEST_URL="http://localhost/website" npx playwright test tests/math-alignment.spec.ts tests/math-macros.spec.ts tests/tikzcd-center.spec.ts

# Full pre-release validation: `test` + all remaining Playwright tests
# (visual regression, hydration, layout, TOC, etc.).
test-release: generate-macros
    @npx tsc --noEmit
    @BASE_URL="/website" node scripts/compile.cjs
    @npx vite build
    @mkdir -p /var/www/html/website/assets
    @cp dist/assets/index-*.css /var/www/html/website/assets/index.css 2>/dev/null || true
    @cp dist/assets/index-*.js /var/www/html/website/assets/index.js 2>/dev/null || true
    @cp public/assets/mathjax-macros.js /var/www/html/website/assets/mathjax-macros.js
    @rsync -av .generated/pages/ /var/www/html/website/
    @rsync -av --delete .generated/blog/ /var/www/html/website/blog/
    @cp /var/www/html/website/home.html /var/www/html/website/index.html
    @npx vitest --run --pool=threads
    @TEST_URL="http://localhost/website" npx playwright test

# Generate MathJax macros from canonical source
generate-macros:
    python3 ~/.pandoc/bin/generate-mathjax-config.py --json /tmp/mathjax-macros.json
    @echo "window.MathJax = window.MathJax || {}; window.MathJax.tex = window.MathJax.tex || {}; window.MathJax.tex.macros = " > public/assets/mathjax-macros.js
    cat /tmp/mathjax-macros.json >> public/assets/mathjax-macros.js
    echo ";" >> public/assets/mathjax-macros.js
    @echo "Generated mathjax-macros.js"

# Build and deploy — `test` already compiles, builds, syncs, and verifies.
build: test
    @echo "Build complete (synced to /var/www/html/website/ by the test gate)."

# Run E2E tests directly against the local Nginx static deployment
test-staging:
    @echo "Running E2E tests against Nginx static deployment (http://localhost/website)..."
    @TEST_URL="http://localhost/website" npx playwright test

# Update golden snapshot baselines for visual regression tests.
# Requires a milestone or version tag — golden images must not be overwritten
# without declaring intent. The pre-commit hook enforces this at commit time.
# Usage:  just update-snapshots MILESTONE=v0.2.0
#         just update-snapshots MILESTONE="redesign: home page layout"
update-snapshots milestone:
    @test -n "{{milestone}}" || { echo 'ERROR: milestone/version required.'; echo 'Usage: just update-snapshots MILESTONE=<version-or-description>'; exit 1; }
    @echo 'Updating golden snapshots for: {{milestone}}'
    @npx playwright test --update-snapshots

# ─── Utilities ─────────────────────────────────────────────────────────────────
# Show available content files

list-posts:
    @echo "Blog posts:"; ls content/blog/*.md; echo ""; echo "Pages:"; ls content/pages/*.md; echo ""; echo "TOML databases:"; ls content/databases/*.toml

# Configure git to use .githooks/ for pre-commit checks
setup-hooks:
    git config core.hooksPath .githooks
    @echo "Git hooks configured from .githooks/"
