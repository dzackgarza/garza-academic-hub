const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { z } = require('zod');
const TOML = require('smol-toml');

const contentDir = path.join(__dirname, '../content');
const blogPostsDir = path.join(contentDir, 'blog');
const staticPagesDir = path.join(contentDir, 'pages');
const templatesDir = path.join(contentDir, 'templates');
const filtersDir = path.join(contentDir, 'filters');
const defaultsDir = path.join(contentDir, 'defaults');
const repoRoot = path.join(__dirname, '..');

const compiledBlogDir = path.join(__dirname, '../.generated/blog');
const compiledPagesDir = path.join(__dirname, '../.generated/pages');
const manifestPath = path.join(__dirname, '../.generated/site-manifest.json');
const sitemapPath = path.join(__dirname, '../.generated/sitemap.xml');
const dataDir = path.join(__dirname, '../.generated/pandoc-data');
const siteMetadataPath = path.join(dataDir, 'site.yaml');

const pageTemplates = new Map([['page', 'page.yaml']]);
const postTemplates = new Map([['post', 'post.yaml']]);

const routeSchema = z
  .string()
  .min(1)
  .refine((route) => route.startsWith('/'), 'route must start with /')
  .refine((route) => !route.includes(' '), 'route must not contain spaces');

const blogMetadataSchema = z.object({
  title: z.string().min(1),
  date: z.string().min(1),
  tags: z.array(z.string()),
  categories: z.array(z.string()),
  updatedDate: z.string().optional(),
  readMinutes: z.coerce.number().optional(),
  excerpt: z.string().optional(),
  legacyUrl: z.string().optional(),
  image: z.string().optional(),
  template: z.enum(['post']).optional(),
});

const pageMetadataSchema = z.object({
  title: z.string().min(1),
  route: routeSchema.optional(),
  template: z.enum(['page']).optional(),
});

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function validateMetadata(schema, filePath, metadata) {
  const parsed = schema.safeParse(metadata);
  if (!parsed.success) {
    const issueList = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new Error(`${toRepoPath(filePath)}: invalid metadata: ${issueList}`);
  }
  return parsed.data;
}

function runPandoc(filePath, args, input, options = {}) {
  const pandocProcess = spawnSync('pandoc', args, {
    input: Buffer.from(input, 'utf8'),
    env: { ...process.env, ...(options.env ?? {}) },
  });

  if (pandocProcess.status !== 0) {
    throw new Error(
      `${toRepoPath(filePath)}: Pandoc compilation failed\n${pandocProcess.stderr.toString()}`,
    );
  }

  return pandocProcess.stdout.toString('utf8');
}

function readPandocDocument(filePath, rawContent) {
  return JSON.parse(runPandoc(filePath, ['--from=markdown', '--to=json'], rawContent));
}

function stringifyInlines(inlines) {
  return inlines
    .map((inline) => {
      switch (inline.t) {
        case 'Str':
          return inline.c;
        case 'Space':
        case 'SoftBreak':
        case 'LineBreak':
          return ' ';
        case 'Code':
          return inline.c[1];
        case 'Emph':
        case 'Strong':
        case 'Span':
          return stringifyInlines(inline.c);
        case 'Link':
        case 'Image':
          return stringifyInlines(inline.c[1]);
        case 'Quoted': {
          const quoteType = inline.c[0].t;
          const text = stringifyInlines(inline.c[1]);
          return quoteType === 'SingleQuote' ? `‘${text}’` : `“${text}”`;
        }
        default:
          return '';
      }
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function stringifyBlocks(blocks) {
  return blocks
    .map((block) => {
      switch (block.t) {
        case 'Plain':
        case 'Para':
          return stringifyInlines(block.c);
        case 'Header':
          return stringifyInlines(block.c[2]);
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n');
}

function pandocMetaToValue(metaValue) {
  switch (metaValue.t) {
    case 'MetaMap':
      return Object.fromEntries(
        Object.entries(metaValue.c).map(([key, value]) => [
          key,
          pandocMetaToValue(value),
        ]),
      );
    case 'MetaList':
      return metaValue.c.map(pandocMetaToValue);
    case 'MetaBool':
    case 'MetaString':
      return metaValue.c;
    case 'MetaInlines':
      return stringifyInlines(metaValue.c);
    case 'MetaBlocks':
      return stringifyBlocks(metaValue.c);
    default:
      throw new Error(`unsupported Pandoc metadata value ${metaValue.t}`);
  }
}

function metadataFromPandocDocument(filePath, document, required) {
  const metadata = Object.fromEntries(
    Object.entries(document.meta).map(([key, value]) => [
      key,
      pandocMetaToValue(value),
    ]),
  );
  if (required && Object.keys(metadata).length === 0) {
    throw new Error(`${toRepoPath(filePath)}: missing required YAML frontmatter`);
  }
  return metadata;
}

function firstHeadingFromPandocDocument(document) {
  const heading = document.blocks.find((block) => block.t === 'Header');
  return heading ? stringifyInlines(heading.c[2]) : undefined;
}

function yamlScalar(value) {
  return JSON.stringify(value ?? '');
}

function writeYamlList(lines, indentation, values, writer) {
  values.forEach((value) => {
    lines.push(`${indentation}-`);
    writer(value, `${indentation}  `);
  });
}

function writeSiteMetadata() {
  const navigation = TOML.parse(
    fs.readFileSync(path.join(contentDir, 'databases/navigation.toml'), 'utf8'),
  );
  const profile = TOML.parse(
    fs.readFileSync(path.join(contentDir, 'databases/profile.toml'), 'utf8'),
  );

  const base = process.env.BASE_URL ?? '';
  const lines = ['site:'];
  lines.push(`  base: ${yamlScalar(base)}`);
  lines.push('  nav:');
  writeYamlList(lines, '    ', navigation.items ?? [], (item, indentation) => {
    lines.push(`${indentation}label: ${yamlScalar(item.label)}`);
    const pathValue = item.path.startsWith('/') && !item.path.startsWith('//')
      ? `${base}${item.path}`
      : item.path;
    lines.push(`${indentation}path: ${yamlScalar(pathValue)}`);
  });
  lines.push('  profile:');
  for (const key of ['name', 'pronouns', 'affiliation', 'office', 'email', 'avatar_text']) {
    lines.push(`    ${key}: ${yamlScalar(profile[key])}`);
  }
  lines.push('    links:');
  writeYamlList(lines, '      ', profile.links ?? [], (link, indentation) => {
    lines.push(`${indentation}label: ${yamlScalar(link.label)}`);
    if (link.href) {
      lines.push(`${indentation}href: ${yamlScalar(link.href)}`);
    }
  });
  fs.writeFileSync(siteMetadataPath, `${lines.join('\n')}\n`, 'utf8');
}

function writeDatabaseData() {
  const databaseOutputDir = path.join(dataDir, 'databases');
  fs.mkdirSync(databaseOutputDir, { recursive: true });
  for (const file of fs
    .readdirSync(path.join(contentDir, 'databases'))
    .filter((entry) => entry.endsWith('.toml'))) {
    const source = path.join(contentDir, 'databases', file);
    const output = path.join(databaseOutputDir, `${path.basename(file, '.toml')}.json`);
    fs.writeFileSync(
      output,
      JSON.stringify(TOML.parse(fs.readFileSync(source, 'utf8')), null, 2),
      'utf8',
    );
  }
}

function writePostsData() {
  fs.writeFileSync(
    path.join(dataDir, 'posts.json'),
    JSON.stringify(postsMetadata, null, 2),
    'utf8',
  );
}

const manifest = { routes: [] };

function assertNoComponentPlaceholders(filePath, html) {
  // Check for unfiltered .component divs that the Pandoc filter missed.
  // Filtered components are replaced with data-component placeholders for
  // React to mount into — those are intentional.
  if (/<div[^>]*\bclass="[^"]*\bcomponent\b[^"]*"/.test(html)) {
    throw new Error(
      `${toRepoPath(filePath)}: component slot survived Pandoc filter rendering`,
    );
  }
}

function assertUniqueRoute(filePath, route) {
  const duplicate = manifest.routes.find((entry) => entry.path === route);
  if (duplicate) {
    throw new Error(
      `${toRepoPath(filePath)}: duplicate route ${route} already used by ${duplicate.source}`,
    );
  }
}

function routeEntry(filePath, route, output, type, title, template) {
  assertUniqueRoute(filePath, route);
  const entry = {
    path: route,
    source: toRepoPath(filePath),
    output: toRepoPath(output),
    type,
    title,
    template,
    sitemap: true,
    islands: [],
  };
  manifest.routes.push(entry);
  return entry;
}

function defaultsPathFor(filePath, template, templates) {
  const defaultsFile = templates.get(template);
  if (!defaultsFile) {
    throw new Error(`${toRepoPath(filePath)}: unknown template ${template}`);
  }
  return path.join(defaultsDir, defaultsFile);
}

function compileWithDefaults(filePath, template, templates, rawContent) {
  return runPandoc(
    filePath,
    [`--defaults=${defaultsPathFor(filePath, template, templates)}`],
    rawContent,
    { env: { PANDOC_SITE_DATA_DIR: dataDir, BASE_URL: process.env.BASE_URL ?? '' } },
  );
}

const componentTypes = new Set([
  'collection',
  'link-group',
  'gallery-grid',
  'blog-listing',
]);

function attrsToObject(attrs) {
  return Object.fromEntries((attrs ?? []).map(([key, value]) => [key, value]));
}

function validateComponentBlock(filePath, block) {
  if (block.t !== 'Div') {
    return;
  }
  const [attr] = block.c;
  const classes = attr[1] ?? [];
  if (!classes.includes('component')) {
    return;
  }
  const attributes = attrsToObject(attr[2]);
  const componentType = attributes.type;
  if (!componentType) {
    throw new Error(`${toRepoPath(filePath)}: .component div missing type attribute`);
  }
  if (!componentTypes.has(componentType)) {
    throw new Error(`${toRepoPath(filePath)}: unknown component type: ${componentType}`);
  }
}

function walkPandocBlocks(blocks, visitor) {
  for (const block of blocks) {
    visitor(block);
    if (block.t === 'Div' || block.t === 'BlockQuote') {
      walkPandocBlocks(block.t === 'Div' ? block.c[1] : block.c, visitor);
    } else if (block.t === 'BulletList' || block.t === 'OrderedList') {
      for (const item of block.t === 'BulletList' ? block.c : block.c[1]) {
        walkPandocBlocks(item, visitor);
      }
    }
  }
}

function validateComponentDeclarations(filePath, document) {
  walkPandocBlocks(document.blocks, (block) => validateComponentBlock(filePath, block));
}

function generateSitemap() {
  const locations = manifest.routes
    .filter((route) => route.sitemap)
    .map((route) => `  <url><loc>${route.path}</loc></url>`)
    .join('\n');
  fs.writeFileSync(
    sitemapPath,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations}\n</urlset>\n`,
    'utf8',
  );
}

function previewContent(fileArg) {
  if (!fileArg) {
    throw new Error('preview requires a content file');
  }
  const filePath = path.resolve(repoRoot, fileArg);
  const rawContent = fs.readFileSync(filePath, 'utf8');
  writeDatabaseData();
  writeSiteMetadata();
  if (filePath.startsWith(blogPostsDir)) {
    process.stdout.write(compileWithDefaults(filePath, 'post', postTemplates, rawContent));
    return;
  }
  const document = readPandocDocument(filePath, rawContent);
  const metadata = validateMetadata(
    pageMetadataSchema,
    filePath,
    metadataFromPandocDocument(filePath, document, true),
  );
  process.stdout.write(
    compileWithDefaults(filePath, metadata.template ?? 'page', pageTemplates, rawContent),
  );
}

if (process.argv[2] === '--preview') {
  try {
    previewContent(process.argv[3]);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  process.exit(0);
}

const blogFiles = fs.readdirSync(blogPostsDir).filter((file) => file.endsWith('.md'));
const postsMetadata = [];
const pageFiles = fs.readdirSync(staticPagesDir).filter((file) => file.endsWith('.md'));

function prepareBlogEntry(file) {
  const slug = path.basename(file, '.md');
  const filePath = path.join(blogPostsDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const document = readPandocDocument(filePath, rawContent);
  const metadata = validateMetadata(
    blogMetadataSchema,
    filePath,
    metadataFromPandocDocument(filePath, document, true),
  );
  const template = metadata.template ?? 'post';
  const output = path.join(compiledBlogDir, `${slug}.html`);
  const entry = routeEntry(
    filePath,
    `/blog/${slug}`,
    output,
    'post',
    metadata.title,
    template,
  );
  postsMetadata.push({ ...metadata, slug });
  return { slug, filePath, rawContent, output, template, entry };
}

function preparePageEntry(file) {
  const slug = path.basename(file, '.md');
  const filePath = path.join(staticPagesDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const document = readPandocDocument(filePath, rawContent);
  const metadata = validateMetadata(
    pageMetadataSchema,
    filePath,
    metadataFromPandocDocument(filePath, document, true),
  );
  validateComponentDeclarations(filePath, document);
  const route = metadata.route ?? (slug === 'home' ? '/' : `/${slug}`);
  const template = metadata.template ?? 'page';
  const output = path.join(compiledPagesDir, `${slug}.html`);
  const entry = routeEntry(filePath, route, output, 'page', metadata.title, template);
  return { slug, filePath, rawContent, output, template, entry };
}

function failWithPath(err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

let blogEntries;
let pageEntries;
try {
  blogEntries = blogFiles.map(prepareBlogEntry);
  pageEntries = pageFiles.map(preparePageEntry);
} catch (err) {
  failWithPath(err);
}

// Ensure compiled target directories exist
if (!fs.existsSync(compiledBlogDir)) {
  fs.mkdirSync(compiledBlogDir, { recursive: true });
}
if (!fs.existsSync(compiledPagesDir)) {
  fs.mkdirSync(compiledPagesDir, { recursive: true });
}
fs.mkdirSync(dataDir, { recursive: true });
writeDatabaseData();
writeSiteMetadata();

// 1. Compile Blog Posts
console.log('Compiling blog posts...');
for (const file of blogFiles) {
  const blogEntry = blogEntries.find((entry) => entry.slug === path.basename(file, '.md'));

  try {
    console.log(`- Compiling blog post ${blogEntry.slug} using pandoc...`);
    const html = runPandoc(
      blogEntry.filePath,
      [
        `--defaults=${defaultsPathFor(blogEntry.filePath, blogEntry.template, postTemplates)}`,
        `--metadata=toc:true`,
        `--metadata=pg_slug:${blogEntry.slug}`,
        `--metadata=pg_title:${blogEntry.entry.title.replace(/"/g, '\\"')}`,
      ],
      blogEntry.rawContent,
      { env: { PANDOC_SITE_DATA_DIR: dataDir, BASE_URL: process.env.BASE_URL ?? '' } },
    );
    fs.writeFileSync(blogEntry.output, html, 'utf8');
  } catch (err) {
    failWithPath(err);
  }
}

postsMetadata.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(
  path.join(compiledBlogDir, 'posts.json'),
  JSON.stringify(postsMetadata, null, 2),
  'utf8',
);
console.log(
  `Successfully compiled ${postsMetadata.length} blog posts to ${compiledBlogDir}/!\n`,
);

writePostsData();

// 2. Compile Static Pages (with component Lua filter)
console.log('Compiling static pages...');
for (const file of pageFiles) {
  const pageEntry = pageEntries.find((entry) => entry.slug === path.basename(file, '.md'));

  try {
    console.log(`- Compiling static page ${pageEntry.slug} using pandoc...`);
    const html = compileWithDefaults(
      pageEntry.filePath,
      pageEntry.template,
      pageTemplates,
      pageEntry.rawContent,
    );
    assertNoComponentPlaceholders(pageEntry.filePath, html);
    fs.writeFileSync(pageEntry.output, html, 'utf8');
  } catch (err) {
    failWithPath(err);
  }
}

console.log(
  `Successfully compiled ${pageFiles.length} static pages to ${compiledPagesDir}/!`,
);

manifest.routes.sort((a, b) => a.path.localeCompare(b.path));
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
generateSitemap();
console.log(`Wrote site manifest to ${manifestPath}`);
