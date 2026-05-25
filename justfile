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

deploy:
    @echo "Deploying to /var/www/html/website/..."
    @BASE_URL="/website" node scripts/compile.cjs
    @npx vite build
    @mkdir -p /var/www/html/website/
    @rsync -av --delete dist/ /var/www/html/website/
    @echo "Deployment complete."

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

# Typecheck only (no emit)
typecheck:
    npx tsc --noEmit

# Full check: unit tests + typecheck + visual regression + build
check: test typecheck

# ─── Utilities ─────────────────────────────────────────────────────────────────
# Show available content files

list-posts:
    @echo "Blog posts:"; ls content/blog/*.md; echo ""; echo "Pages:"; ls content/pages/*.md; echo ""; echo "TOML databases:"; ls content/databases/*.toml

# Configure git to use .githooks/ for pre-commit checks
setup-hooks:
    git config core.hooksPath .githooks
    @echo "Git hooks configured from .githooks/"
