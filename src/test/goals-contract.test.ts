import { spawnSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import * as TOML from 'smol-toml';
import { afterEach, describe, expect, it } from 'vitest';

const repoRoot = path.resolve(__dirname, '../..');
const generatedDir = path.join(repoRoot, '.generated');
const manifestPath = path.join(generatedDir, 'site-manifest.json');
const legacyRoutesPath = path.join(repoRoot, 'content/databases/legacy-routes.toml');
const pandocContractTimeout = 60000;
let cleanCompileResult: ReturnType<typeof spawnSync> | undefined;

const proofPage = {
  slug: 'goals-proof-resource',
  path: path.join(repoRoot, 'content/pages/goals-proof-resource.md'),
  route: '/goals-proof-resource',
  title: 'GOALS Proof Resource',
};

const proofPost = {
  slug: 'goals-proof-post',
  path: path.join(repoRoot, 'content/blog/goals-proof-post.md'),
  route: '/blog/goals-proof-post',
  title: 'GOALS Proof Post',
};

const malformedPost = {
  slug: 'goals-proof-malformed',
  path: path.join(repoRoot, 'content/blog/goals-proof-malformed.md'),
};

const duplicateRoutePage = {
  slug: 'goals-proof-duplicate',
  path: path.join(repoRoot, 'content/pages/goals-proof-duplicate.md'),
};

const unknownTemplatePage = {
  slug: 'goals-proof-unknown-template',
  path: path.join(repoRoot, 'content/pages/goals-proof-unknown-template.md'),
};

const invalidComponentPage = {
  slug: 'goals-proof-invalid-component',
  path: path.join(repoRoot, 'content/pages/goals-proof-invalid-component.md'),
};

function runCompile() {
  return spawnSync('node', ['src/compile.cjs'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function runCleanCompile() {
  cleanCompileResult ??= runCompile();
  return cleanCompileResult;
}

function runPreview(filePath: string) {
  return spawnSync('just', ['preview', path.relative(repoRoot, filePath)], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function removeGeneratedProofArtifacts() {
  rmSync(path.join(generatedDir, 'pages', `${proofPage.slug}.html`), {
    force: true,
  });
  rmSync(path.join(generatedDir, 'blog', `${proofPost.slug}.html`), {
    force: true,
  });
}

function removeProofContent() {
  rmSync(proofPage.path, { force: true });
  rmSync(proofPost.path, { force: true });
  rmSync(malformedPost.path, { force: true });
  rmSync(duplicateRoutePage.path, { force: true });
  rmSync(unknownTemplatePage.path, { force: true });
  rmSync(invalidComponentPage.path, { force: true });
}

function walkFiles(dir: string): string[] {
  return readdirSync(dir)
    .flatMap((entry) => {
      const entryPath = path.join(dir, entry);
      const stats = statSync(entryPath);
      if (stats.isDirectory()) {
        return walkFiles(entryPath);
      }
      return entryPath;
    })
    .sort();
}

function contentRoutes(): string[] {
  const pageRoutes = readdirSync(path.join(repoRoot, 'content/pages'))
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = path.basename(file, '.md');
      return slug === 'home' ? '/' : `/${slug}`;
    });
  const blogRoutes = readdirSync(path.join(repoRoot, 'content/blog'))
    .filter((file) => file.endsWith('.md'))
    .map((file) => `/blog/${path.basename(file, '.md')}`);
  return [...pageRoutes, ...blogRoutes].sort();
}

function productionSourceFiles(): string[] {
  return walkFiles(path.join(repoRoot, 'src')).filter(
    (file) =>
      /\.(ts|tsx)$/.test(file) &&
      !file.includes(`${path.sep}src${path.sep}test${path.sep}`) &&
      !/\.(test|spec)\.(ts|tsx)$/.test(file),
  );
}

afterEach(() => {
  removeProofContent();
  removeGeneratedProofArtifacts();
});

describe.sequential('GOALS contract: content boundary and generated manifest', () => {
  it(
    'discovers new content files and emits a route manifest consumed by the site',
    () => {
      writeFileSync(
        proofPage.path,
        `---
title: "${proofPage.title}"
template: "page"
---

# ${proofPage.title}

This page proves that content pages become routes without editing src.
`,
      );
      writeFileSync(
        proofPost.path,
        `---
title: "${proofPost.title}"
date: "May 24, 2026"
tags: ["GOALS"]
categories: ["Proof"]
template: "post"
---

# ${proofPost.title}

This post proves that blog posts become routes without editing src.
`,
      );

      const compile = runCompile();

      expect(compile.status, compile.stderr || compile.stdout).toBe(0);
      expect(existsSync(manifestPath)).toBe(true);

      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
        routes: Array<{
          path: string;
          source: string;
          output: string;
          type: string;
          title: string;
        }>;
      };

      expect(manifest.routes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: proofPage.route,
            source: 'content/pages/goals-proof-resource.md',
            output: '.generated/pages/goals-proof-resource.html',
            type: 'page',
            title: proofPage.title,
          }),
          expect.objectContaining({
            path: proofPost.route,
            source: 'content/blog/goals-proof-post.md',
            output: '.generated/blog/goals-proof-post.html',
            type: 'post',
            title: proofPost.title,
          }),
        ]),
      );
    },
    pandocContractTimeout,
  );

  it(
    'fails fast instead of silently skipping malformed blog content',
    () => {
      writeFileSync(
        malformedPost.path,
        `# Missing Frontmatter

This post is invalid because GOALS.md requires explicit metadata.
`,
      );

      const compile = runCompile();

      expect(compile.status).not.toBe(0);
      expect(`${compile.stdout}\n${compile.stderr}`).toContain(
        'content/blog/goals-proof-malformed.md',
      );
    },
    pandocContractTimeout,
  );

  it(
    'fails fast on duplicate explicit routes',
    () => {
      writeFileSync(
        duplicateRoutePage.path,
        `---
title: "Duplicate Route"
template: "page"
route: "/teaching"
---

# Duplicate Route
`,
      );

      const compile = runCompile();

      expect(compile.status).not.toBe(0);
      expect(`${compile.stdout}\n${compile.stderr}`).toContain(
        'content/pages/goals-proof-duplicate.md',
      );
      expect(`${compile.stdout}\n${compile.stderr}`).toContain('duplicate route');
    },
    pandocContractTimeout,
  );

  it(
    'fails fast on unknown template names',
    () => {
      writeFileSync(
        unknownTemplatePage.path,
        `---
title: "Unknown Template"
template: "experimental"
---

# Unknown Template
`,
      );

      const compile = runCompile();

      expect(compile.status).not.toBe(0);
      expect(`${compile.stdout}\n${compile.stderr}`).toContain(
        'content/pages/goals-proof-unknown-template.md',
      );
      expect(`${compile.stdout}\n${compile.stderr}`).toContain('template');
    },
    pandocContractTimeout,
  );

  it(
    'fails fast on invalid Pandoc component declarations',
    () => {
      writeFileSync(
        invalidComponentPage.path,
        `---
title: "Invalid Component"
template: "page"
---

# Invalid Component

:::{.component type="unknown-widget"}
:::
`,
      );

      const compile = runCompile();

      expect(compile.status).not.toBe(0);
      expect(`${compile.stdout}\n${compile.stderr}`).toContain(
        'content/pages/goals-proof-invalid-component.md',
      );
      expect(`${compile.stdout}\n${compile.stderr}`).toContain(
        'unknown component type',
      );
    },
    pandocContractTimeout,
  );

  it(
    'renders content-declared component slots into generated HTML without app-side interpretation',
    () => {
      const compile = runCleanCompile();

      expect(compile.status, compile.stderr || compile.stdout).toBe(0);

      const homeHtml = readFileSync(
        path.join(generatedDir, 'pages', 'home.html'),
        'utf8',
      );
      const blogHtml = readFileSync(
        path.join(generatedDir, 'pages', 'blog.html'),
        'utf8',
      );
      const writingHtml = readFileSync(
        path.join(generatedDir, 'pages', 'writing.html'),
        'utf8',
      );
      const galleryHtml = readFileSync(
        path.join(generatedDir, 'pages', 'gallery.html'),
        'utf8',
      );
      const normalizedBlogHtml = blogHtml.replace(/\s+/g, ' ');

      expect(`${homeHtml}${blogHtml}${writingHtml}${galleryHtml}`).toContain(
        'data-component',
      );
      expect(homeHtml).toContain(
        'Compact moduli of Enriques surfaces with a numerical polarization of degree 2',
      );
      expect(normalizedBlogHtml).toContain('Recommendations: Undergraduate Resources');
      expect(writingHtml).toContain('Notes by Others');
      expect(galleryHtml).toContain('Hand-Drawn');
    },
    pandocContractTimeout,
  );
});

describe.sequential('GOALS contract: Pandoc defaults, preview, and sitemap', () => {
  it(
    'uses the same Pandoc component/data path for single-page preview',
    () => {
      const compile = runCleanCompile();
      expect(compile.status, compile.stderr || compile.stdout).toBe(0);

      const preview = runPreview(path.join(repoRoot, 'content/pages/home.md'));

      expect(preview.status, preview.stderr || preview.stdout).toBe(0);
      expect(preview.stdout).toContain('academic-site-nav');
      expect(preview.stdout).toContain('Compact moduli of Enriques surfaces');
      expect(preview.stdout).toContain('data-component');
    },
    pandocContractTimeout,
  );

  it(
    'generates sitemap routes from the same manifest consumed by the app and tests',
    () => {
      const compile = runCleanCompile();
      expect(compile.status, compile.stderr || compile.stdout).toBe(0);

      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
        routes: Array<{ path: string; sitemap: boolean }>;
      };
      const sitemap = readFileSync(path.join(generatedDir, 'sitemap.xml'), 'utf8');

      const sitemapRoutes = manifest.routes
        .filter((route) => route.sitemap)
        .map((route) => route.path);

      for (const route of sitemapRoutes) {
        expect(sitemap).toContain(`<loc>${route}</loc>`);
      }
    },
    pandocContractTimeout,
  );
});

describe('GOALS contract: automated source and content hygiene', () => {
  it('keeps compiled content markdown free of raw block-level HTML', () => {
    const rawBlockHtml =
      /<(div|ul|li|section|article|header|footer|nav|aside|span|p|img|a)\b/i;
    const violations = walkFiles(path.join(repoRoot, 'content'))
      .filter((file) => file.endsWith('.md'))
      .filter((file) => !file.endsWith('grad-recommendations.md'))
      .flatMap((file) =>
        rawBlockHtml.test(readFileSync(file, 'utf8'))
          ? [path.relative(repoRoot, file)]
          : [],
      );

    expect(violations).toEqual([]);
  });

  it('does not hardcode local environment paths in source, scripts, tests, or content', () => {
    const scopedRoots = ['src', 'scripts', 'tests', 'content'];
    const scopedFiles = scopedRoots.flatMap((root) =>
      walkFiles(path.join(repoRoot, root)),
    );
    const additionalFiles = ['justfile', 'vite.config.ts', 'playwright.config.ts'].map(
      (file) => path.join(repoRoot, file),
    );
    const forbiddenLocalRoot = ['/', 'home', 'dzack'].join('/');
    const violations = [...scopedFiles, ...additionalFiles].flatMap((file) =>
      readFileSync(file, 'utf8').includes(forbiddenLocalRoot)
        ? [path.relative(repoRoot, file)]
        : [],
    );

    expect(violations).toEqual([]);
  });
});

describe('GOALS contract: legacy parity inventory', () => {
  it('maps or explicitly excludes every legacy post and top-level page source', () => {
    const legacyRoot = path.join(homedir(), 'website');
    const legacySources = [
      ...readdirSync(path.join(legacyRoot, '_posts')).map((file) => `_posts/${file}`),
      ...readdirSync(path.join(legacyRoot, '_pages'))
        .filter((file) => file.endsWith('.md') || file.endsWith('.html'))
        .map((file) => `_pages/${file}`),
    ].sort();
    const inventory = TOML.parse(readFileSync(legacyRoutesPath, 'utf8')) as {
      mapped: Array<{ legacy_source: string; new_route: string }>;
      excluded: Array<{ excluded_source: string; reason: string }>;
    };
    const represented = new Set([
      ...inventory.mapped.map((entry) => entry.legacy_source),
      ...inventory.excluded.map((entry) => entry.excluded_source),
    ]);

    expect(legacySources.filter((source) => !represented.has(source))).toEqual([]);
  });

  it('maps each migrated legacy source to a generated route and inventories non-route legacy surfaces', () => {
    const inventory = TOML.parse(readFileSync(legacyRoutesPath, 'utf8')) as {
      mapped: Array<{ legacy_source: string; new_route: string }>;
      excluded: Array<{ excluded_source: string; reason: string }>;
      legacy_surface_inventory: {
        data_files: string[];
        includes: string[];
        layouts: string[];
        asset_roots: string[];
      };
    };
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      routes: Array<{ path: string }>;
    };
    const manifestRoutes = new Set(manifest.routes.map((route) => route.path));

    expect(
      inventory.mapped
        .filter((entry) => !manifestRoutes.has(entry.new_route))
        .map((entry) => entry.new_route),
    ).toEqual([]);
    expect(inventory.excluded.filter((entry) => entry.reason.trim() === '')).toEqual(
      [],
    );
    expect(inventory.legacy_surface_inventory.data_files).toEqual([
      '_data/navigation.yml',
    ]);
    expect(inventory.legacy_surface_inventory.includes).toEqual(
      expect.arrayContaining(['_includes/footer.html', '_includes/social-share.html']),
    );
    expect(inventory.legacy_surface_inventory.layouts).toEqual(
      expect.arrayContaining([
        '_layouts/default.html',
        '_layouts/single.html',
        '_layouts/single_condensed_toc.html',
      ]),
    );
    expect(inventory.legacy_surface_inventory.asset_roots).toEqual(
      expect.arrayContaining([
        'assets/images',
        'assets/pdfs',
        'assets/talks',
        'courses',
      ]),
    );
  });

  it('populates every legacy asset root in public/ with migrated files', () => {
    const inventory = TOML.parse(readFileSync(legacyRoutesPath, 'utf8')) as {
      legacy_surface_inventory: { asset_roots: string[] };
    };
    const publicDir = path.join(repoRoot, 'content/public');
    const walkDir = (dir: string): string[] =>
      existsSync(dir)
        ? readdirSync(dir, { recursive: true, withFileTypes: true })
            .filter((entry) => entry.isFile())
            .map((entry) =>
              path.relative(dir, path.join(entry.parentPath ?? dir, entry.name)),
            )
        : [];
    const emptyRoots = inventory.legacy_surface_inventory.asset_roots.filter(
      (root) => walkDir(path.join(publicDir, root)).length === 0,
    );
    expect(emptyRoots).toEqual([]);
  });
});

describe('GOALS contract: app source is generic', () => {
  it('does not hardcode content routes, page names, or blog-specific routing in src', () => {
    const routes = contentRoutes().filter((route) => route !== '/');
    const pageSlugs = routes
      .filter((route) => !route.startsWith('/blog/'))
      .map((route) => route.slice(1));
    const violations = productionSourceFiles().flatMap((file) => {
      const content = readFileSync(file, 'utf8');
      const hasRouteLiteral = routes.some(
        (route) =>
          content.includes(`'${route}'`) ||
          content.includes(`"${route}"`) ||
          content.includes(`\`${route}\``),
      );
      const hasPageNameLiteral = pageSlugs.some(
        (slug) =>
          content.includes(`'${slug}'`) ||
          content.includes(`"${slug}"`) ||
          content.includes(`\`${slug}\``),
      );
      if (hasRouteLiteral || hasPageNameLiteral) {
        return [path.relative(repoRoot, file)];
      }
      return [];
    });

    expect(violations).toEqual([]);
  });

  it('does not hardcode page route literals in vite.config.ts sitemap configuration', () => {
    const pageRoutes = contentRoutes().filter(
      (route) => route !== '/' && !route.startsWith('/blog/'),
    );
    const viteConfig = readFileSync(path.join(repoRoot, 'vite.config.ts'), 'utf8');
    const violations = pageRoutes.flatMap((route) =>
      viteConfig.includes("'" + route + "'") ||
      viteConfig.includes('"' + route + '"') ||
      viteConfig.includes('`' + route + '`')
        ? [route]
        : [],
    );
    expect(violations).toEqual([]);
  });

  it('does not import content databases or app-side content interpretation modules from src', () => {
    const forbiddenPattern =
      /@content\/databases|content\/databases|from ['"]@\/content\//;
    const violations = productionSourceFiles().flatMap((file) => {
      const content = readFileSync(file, 'utf8');
      return forbiddenPattern.test(content) ? [path.relative(repoRoot, file)] : [];
    });

    expect(violations).toEqual([]);
  });

  it('renders identical nav and footer across compiled page and post templates', () => {
    const navPattern = /(<nav class="academic-site-nav"[^>]*>.*?<\/nav>)/s;
    const footerPattern = /(<footer class="academic-site-footer"[^>]*>.*?<\/footer>)/s;
    const pageFiles = readdirSync(path.join(generatedDir, 'pages'))
      .filter((f) => f.endsWith('.html') && f !== 'posts.json')
      .map((f) => path.join(generatedDir, 'pages', f));
    const postFiles = readdirSync(path.join(generatedDir, 'blog'))
      .filter((f) => f.endsWith('.html') && f !== 'posts.json')
      .map((f) => path.join(generatedDir, 'blog', f));
    const extract = (html: string) => ({
      nav: html.match(navPattern)?.[1] ?? '',
      footer: html.match(footerPattern)?.[1] ?? '',
    });
    if (pageFiles.length === 0 || postFiles.length === 0) {
      return; // compile not yet run
    }
    const pageRef = extract(readFileSync(pageFiles[0], 'utf8'));
    for (const file of pageFiles) {
      const { nav, footer } = extract(readFileSync(file, 'utf8'));
      expect(nav, `${path.relative(generatedDir, file)}: nav mismatch`).toBe(
        pageRef.nav,
      );
      expect(footer, `${path.relative(generatedDir, file)}: footer mismatch`).toBe(
        pageRef.footer,
      );
    }
    for (const file of postFiles) {
      const { nav, footer } = extract(readFileSync(file, 'utf8'));
      expect(nav, `${path.relative(generatedDir, file)}: nav mismatch`).toBe(
        pageRef.nav,
      );
      expect(footer, `${path.relative(generatedDir, file)}: footer mismatch`).toBe(
        pageRef.footer,
      );
    }
  });
});

describe('GOALS contract: asset integrity', () => {
  it('validates all static asset images have valid image headers (not LFS pointers, not corrupt)', () => {
    const publicDir = path.join(repoRoot, 'content/public');
    const imageExtensions = new Set([
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.webp',
      '.svg',
      '.ico',
    ]);
    const imageFiles = walkFiles(publicDir).filter((f) =>
      imageExtensions.has(path.extname(f).toLowerCase()),
    );
    const violations: Array<{ file: string; detected: string; header: string }> = [];

    for (const file of imageFiles) {
      const buf = readFileSync(file);
      const header = buf.subarray(0, Math.min(64, buf.length)).toString('utf8');

      // LFS pointer check: starts with "version https://git-lfs.github.com"
      if (header.startsWith('version https://git-lfs.github.com')) {
        violations.push({
          file: path.relative(repoRoot, file),
          detected: 'Git LFS pointer (not actual image content)',
          header: header.slice(0, 80),
        });
        continue;
      }

      // Validate known image magic bytes
      const magic = buf.subarray(0, 8);
      const isValidImage =
        (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) || // PNG
        (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) || // JPEG
        (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) || // GIF
        (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) || // WebP (RIFF)
        header.trimStart().startsWith('<svg') || // SVG
        header.trimStart().startsWith('<?xml') || // XML-based SVG
        (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00); // ICO

      if (!isValidImage) {
        violations.push({
          file: path.relative(repoRoot, file),
          detected: 'unrecognized file format (no valid image magic bytes)',
          header: header.slice(0, 80),
        });
      }
    }

    expect(
      violations,
      violations.length > 0
        ? `Found ${violations.length} invalid image file(s) in content/public/assets/:\n` +
            violations
              .map((v) => `  ${v.file}: ${v.detected} (header: ${v.header})`)
              .join('\n')
        : undefined,
    ).toEqual([]);
  });
});

describe('GOALS contract: post navigation content', () => {
  it('renders teaser images in the related posts section of compiled blog output', () => {
    const postFiles = readdirSync(path.join(generatedDir, 'blog'))
      .filter((f) => f.endsWith('.html') && f !== 'posts.json')
      .map((f) => path.join(generatedDir, 'blog', f));
    if (postFiles.length === 0) return;
    const violations = [];
    const teaserPattern = /<div class="archive__item-teaser">\s*<img[^>]*>\s*<\/div>/;
    for (const file of postFiles) {
      const html = readFileSync(file, 'utf8');
      if (!html.includes('class="page__related"')) continue;
      const relatedStart = html.indexOf('<div class="page__related">');
      const sectionEnd = html.indexOf(
        '<div class="post-nav-wrapper">',
        relatedStart + 50,
      );
      const section =
        sectionEnd === -1
          ? html.slice(relatedStart)
          : html.slice(relatedStart, sectionEnd);
      if (!teaserPattern.test(section)) {
        violations.push(path.relative(generatedDir, file));
      }
    }
    expect(violations).toEqual([]);
  });
});

describe('GOALS contract: post compilation metadata', () => {
  it('compiles a Table of Contents into blog posts with headings', () => {
    const blogDir = path.join(repoRoot, 'content/blog');
    const postFiles = readdirSync(path.join(generatedDir, 'blog'))
      .filter((f) => f.endsWith('.html') && f !== 'posts.json')
      .map((f) => path.join(generatedDir, 'blog', f));
    if (postFiles.length === 0) return;
    const violations = [];
    const tocPattern = /Table of Contents|<div class="nav__title">/;
    for (const file of postFiles) {
      const html = readFileSync(file, 'utf8');
      // Derive the source .md path from the compiled file name
      const basename = path.basename(file, '.html');
      const sourceFile = path.join(blogDir, `${basename}.md`);
      if (!existsSync(sourceFile)) continue;
      // Count markdown headings (## and ###) in source — not compiled HTML,
      // which includes headings from post-navigation related sections
      const source = readFileSync(sourceFile, 'utf8');
      const mdHeadingCount = (source.match(/^#{2,3}\s/gm) || []).length;
      if (mdHeadingCount < 4) continue;
      if (!tocPattern.test(html)) {
        violations.push(path.relative(generatedDir, file));
      }
    }
    expect(
      violations,
      violations.length > 0
        ? `Blog posts missing Table of Contents:\n` +
            violations.map((v) => `  ${v}`).join('\n')
        : undefined,
    ).toEqual([]);
  });
});

describe('GOALS contract: tests derive route coverage from generated artifacts', () => {
  it('does not maintain hardcoded Playwright route inventories', () => {
    const routes = contentRoutes().filter((route) => route !== '/');
    const testFiles = walkFiles(path.join(repoRoot, 'tests')).filter((file) =>
      /\.ts$/.test(file),
    );
    const violations = testFiles.flatMap((file) => {
      const content = readFileSync(file, 'utf8');
      const hardcodedRoutes = routes.some(
        (route) =>
          content.includes(`'${route}'`) ||
          content.includes(`"${route}"`) ||
          content.includes(`\`${route}\``),
      );
      return hardcodedRoutes ? [path.relative(repoRoot, file)] : [];
    });

    expect(violations).toEqual([]);
  });
});
