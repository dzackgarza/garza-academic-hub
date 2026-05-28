import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import * as TOML from 'smol-toml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const generatedDir = path.join(repoRoot, '.generated');
const manifestPath = path.join(generatedDir, 'site-manifest.json');
const legacyRoutesPath = path.join(repoRoot, 'content/databases/legacy-routes.toml');

console.log('=== Garza Academic Hub QC: Check Hygiene ===');
let exitCode = 0;
const failures = [];

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
    console.error(`\x1b[31m[FAIL]\x1b[0m ${message}`);
    exitCode = 1;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.html', '.css',
  '.json', '.yaml', '.yml', '.toml', '.md'
]);

function isTextFile(file) {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function walkFiles(dir, filterFn) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walkFiles(filePath, filterFn));
    } else {
      if (!filterFn || filterFn(filePath)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

function contentRoutes() {
  const pageDir = path.join(repoRoot, 'content/pages');
  const blogDir = path.join(repoRoot, 'content/blog');
  
  const pageRoutes = fs.readdirSync(pageDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = path.basename(file, '.md');
      return slug === 'home' ? '/' : `/${slug}`;
    });
    
  const blogRoutes = fs.readdirSync(blogDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => `/blog/${path.basename(file, '.md')}`);
    
  return [...pageRoutes, ...blogRoutes];
}

function productionSourceFiles() {
  return walkFiles(path.join(repoRoot, 'src'), (f) => {
    return (
      (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.css')) &&
      !f.includes('.test.') &&
      !f.includes('/test/')
    );
  });
}

// ─── QC CHECK 1: Markdown Purity ─────────────────────────────────────────────
console.log('Running Check 1: Markdown Purity...');
const rawBlockHtml = /<(div|ul|li|section|article|header|footer|nav|aside|span|p|img|a)\b/i;
const mdViolations = walkFiles(path.join(repoRoot, 'content'), (f) => f.endsWith('.md'))
  .filter((file) => !file.endsWith('grad-recommendations.md'))
  .flatMap((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return rawBlockHtml.test(content) ? [path.relative(repoRoot, file)] : [];
  });
assert(mdViolations.length === 0, `Markdown files contain forbidden block-level HTML tags:\n  ${mdViolations.join('\n  ')}`);

// ─── QC CHECK 2: Absolute Path Portability ────────────────────────────────────
console.log('Running Check 2: Absolute Path Portability...');
const scopedFiles = [
  ...walkFiles(path.join(repoRoot, 'src'), isTextFile),
  ...walkFiles(path.join(repoRoot, 'tests'), isTextFile),
  ...walkFiles(path.join(repoRoot, 'content'), isTextFile),
  path.join(repoRoot, 'justfile'),
  path.join(repoRoot, 'vite.config.ts'),
  path.join(repoRoot, 'playwright.config.ts')
];
const forbiddenLocalRoot = ['', 'home', 'dzack'].join('/');
const pathViolations = scopedFiles.flatMap((file) => {
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, 'utf8');
  return content.includes(forbiddenLocalRoot) ? [path.relative(repoRoot, file)] : [];
});
assert(pathViolations.length === 0, `Files contain hardcoded local absolute paths (${forbiddenLocalRoot}):\n  ${pathViolations.join('\n  ')}`);

// ─── QC CHECK 3: Legacy Post/Page Inventory Mapping ──────────────────────────
console.log('Running Check 3: Legacy Post/Page Inventory Mapping...');
const legacyRoot = path.join(os.homedir(), 'website');
if (fs.existsSync(legacyRoot)) {
  const legacySources = [
    ...fs.readdirSync(path.join(legacyRoot, '_posts')).map((file) => `_posts/${file}`),
    ...fs.readdirSync(path.join(legacyRoot, '_pages'))
      .filter((file) => file.endsWith('.md') || file.endsWith('.html'))
      .map((file) => `_pages/${file}`)
  ].sort();
  
  if (fs.existsSync(legacyRoutesPath)) {
    const inventory = TOML.parse(fs.readFileSync(legacyRoutesPath, 'utf8'));
    const represented = new Set([
      ...(inventory.mapped || []).map((entry) => entry.legacy_source),
      ...(inventory.excluded || []).map((entry) => entry.excluded_source)
    ]);
    const unrepresented = legacySources.filter((source) => !represented.has(source));
    assert(unrepresented.length === 0, `Uninventoried legacy sources found:\n  ${unrepresented.join('\n  ')}`);
  } else {
    assert(false, `legacy-routes.toml does not exist at ${legacyRoutesPath}`);
  }
} else {
  console.log('  -> Skipped: legacy directory ~/website not present on this host.');
}

// ─── QC CHECK 4: Legacy Route Mapping In Manifest & Inventory completeness ────
console.log('Running Check 4: Legacy Manifest and Surface Mapping...');
if (fs.existsSync(legacyRoutesPath)) {
  const inventory = TOML.parse(fs.readFileSync(legacyRoutesPath, 'utf8'));
  const manifestExists = fs.existsSync(manifestPath);
  
  if (manifestExists) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const manifestRoutes = new Set(manifest.routes.map((route) => route.path));
    const missingManifestRoutes = (inventory.mapped || [])
      .filter((entry) => !manifestRoutes.has(entry.new_route))
      .map((entry) => entry.new_route);
    assert(missingManifestRoutes.length === 0, `Mapped new routes missing from site-manifest.json:\n  ${missingManifestRoutes.join('\n  ')}`);
  } else {
    console.log('  -> Manifest not yet built. Skipping manifest route verification.');
  }
  
  const emptyReasons = (inventory.excluded || []).filter((entry) => !entry.reason || entry.reason.trim() === '');
  assert(emptyReasons.length === 0, 'legacy-routes.toml has excluded items without a documented reason.');
  
  const surfaces = inventory.legacy_surface_inventory || {};
  assert(Array.isArray(surfaces.data_files) && surfaces.data_files.includes('_data/navigation.yml'), 'Legacy surface navigation.yml mapping invalid.');
  assert(Array.isArray(surfaces.includes) && surfaces.includes.includes('_includes/footer.html'), 'Legacy surface footer.html include missing.');
  assert(Array.isArray(surfaces.layouts) && surfaces.layouts.includes('_layouts/default.html'), 'Legacy surface layouts default.html missing.');
  assert(Array.isArray(surfaces.asset_roots) && surfaces.asset_roots.includes('assets/images'), 'Legacy surface assets/images missing.');
}

// ─── QC CHECK 5: Legacy Asset Root Completeness ──────────────────────────────
console.log('Running Check 5: Legacy Asset Root Completeness...');
if (fs.existsSync(legacyRoutesPath)) {
  const inventory = TOML.parse(fs.readFileSync(legacyRoutesPath, 'utf8'));
  const assetRoots = inventory.legacy_surface_inventory?.asset_roots || [];
  const publicDir = path.join(repoRoot, 'content/public');
  
  const emptyRoots = assetRoots.filter((root) => {
    const rootPath = path.join(publicDir, root);
    if (!fs.existsSync(rootPath)) return true;
    const files = walkFiles(rootPath);
    return files.length === 0;
  });
  assert(emptyRoots.length === 0, `Legacy asset directories in content/public/ are empty:\n  ${emptyRoots.join('\n  ')}`);
}

// ─── QC CHECK 6: Generic Source Routes ────────────────────────────────────────
console.log('Running Check 6: Generic Source Routes...');
const routes = contentRoutes().filter((route) => route !== '/');
const pageSlugs = routes
  .filter((route) => !route.startsWith('/blog/'))
  .map((route) => route.slice(1));
  
const routeViolations = productionSourceFiles().flatMap((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const hasRouteLiteral = routes.some(
    (route) =>
      content.includes(`'${route}'`) ||
      content.includes(`"${route}"`) ||
      content.includes(`\`${route}\``)
  );
  const hasPageNameLiteral = pageSlugs.some(
    (slug) =>
      content.includes(`'${slug}'`) ||
      content.includes(`"${slug}"`) ||
      content.includes(`\`${slug}\``)
  );
  return (hasRouteLiteral || hasPageNameLiteral) ? [path.relative(repoRoot, file)] : [];
});
assert(routeViolations.length === 0, `App source files hardcode specific route/page name literals:\n  ${routeViolations.join('\n  ')}`);

// ─── QC CHECK 7: vite.config.ts Sitemap Route Hardcoding ──────────────────────
console.log('Running Check 7: vite.config.ts Sitemap Route Hardcoding...');
const pageRoutes = contentRoutes().filter((route) => route !== '/' && !route.startsWith('/blog/'));
const viteConfigPath = path.join(repoRoot, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  const viteViolations = pageRoutes.flatMap((route) =>
    (viteConfig.includes(`'${route}'`) || viteConfig.includes(`"${route}"`) || viteConfig.includes(`\`${route}\``)) ? [route] : []
  );
  assert(viteViolations.length === 0, `vite.config.ts sitemap hardcodes route literals:\n  ${viteViolations.join('\n  ')}`);
}

// ─── QC CHECK 8: content/databases import restrictions ────────────────────────
console.log('Running Check 8: content/databases import restrictions...');
const forbiddenImportPattern = /@content\/databases|content\/databases|from ['"]@\/content\//;
const importViolations = productionSourceFiles().flatMap((file) => {
  const content = fs.readFileSync(file, 'utf8');
  return forbiddenImportPattern.test(content) ? [path.relative(repoRoot, file)] : [];
});
assert(importViolations.length === 0, `Source files import content databases directly:\n  ${importViolations.join('\n  ')}`);

// ─── QC CHECK 9: Image Assets Integrity ──────────────────────────────────────
console.log('Running Check 9: Image Assets Integrity...');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico']);
const imageFiles = walkFiles(path.join(repoRoot, 'content/public'), (f) => imageExtensions.has(path.extname(f).toLowerCase()));
const imageViolations = [];

for (const file of imageFiles) {
  const buf = fs.readFileSync(file);
  const header = buf.subarray(0, Math.min(64, buf.length)).toString('utf8');
  
  if (header.startsWith('version https://git-lfs.github.com')) {
    imageViolations.push(`${path.relative(repoRoot, file)} (Git LFS pointer)`);
    continue;
  }
  
  const isValidImage =
    (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) || // PNG
    (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) || // JPEG
    (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) || // GIF
    (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) || // WebP (RIFF)
    header.trimStart().startsWith('<svg') ||
    header.trimStart().startsWith('<?xml') ||
    (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00); // ICO
    
  if (!isValidImage) {
    imageViolations.push(`${path.relative(repoRoot, file)} (invalid header: ${header.slice(0, 30)})`);
  }
}
assert(imageViolations.length === 0, `Corrupt, LFS-pointer, or non-image format files in assets:\n  ${imageViolations.join('\n  ')}`);

// ─── QC CHECK 10: E2E Tests Dynamic Route Coverage Invariant ──────────────────
console.log('Running Check 10: Playwright Route Hardcoding...');
const e2eRoutes = contentRoutes().filter((route) => route !== '/');
const testFiles = walkFiles(path.join(repoRoot, 'tests'), (f) => f.endsWith('.ts'));
const hardcodedTestViolations = testFiles.flatMap((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const hardcodedRoutes = e2eRoutes.some(
    (route) =>
      content.includes(`'${route}'`) ||
      content.includes(`"${route}"`) ||
      content.includes(`\`${route}\``)
  );
  return hardcodedRoutes ? [path.relative(repoRoot, file)] : [];
});
assert(hardcodedTestViolations.length === 0, `E2E tests hardcode specific content route literals:\n  ${hardcodedTestViolations.join('\n  ')}`);

// ─── QC CHECK 11: Compile Script exists as .cjs (not .js) ─────────────────────
console.log('Running Check 11: Compile Script Extension Invariant...');
const scriptsDir = path.join(repoRoot, 'src');
const hasCjs = fs.existsSync(path.join(scriptsDir, 'compile.cjs'));
const hasJs = fs.existsSync(path.join(scriptsDir, 'compile.js'));
assert(hasCjs, 'src/compile.cjs does not exist');
assert(!hasJs, 'Forbidden file src/compile.js exists');

// ─── QC CHECK 12: Compile script imports use .cjs ────────────────────────────
console.log('Running Check 12: Compile Script Import References...');
const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
const jsRefs = viteConfig.match(/compile\.js/g);
const cjsRefs = viteConfig.match(/compile\.cjs/g);
assert(jsRefs === null, 'vite.config.ts references compile.js instead of compile.cjs');
assert(cjsRefs !== null && cjsRefs.length >= 1, 'vite.config.ts should import compile.cjs');

// ─── Finish QC Execution ─────────────────────────────────────────────────────
console.log('\n=======================================');
if (exitCode === 0) {
  console.log('\x1b[32m[PASS]\x1b[0m All 12 repository hygiene constraints passed successfully!');
} else {
  console.error(`\x1b[31m[FAIL]\x1b[0m Repository hygiene check failed with ${failures.length} violation(s).`);
}
console.log('=======================================');
process.exit(exitCode);
