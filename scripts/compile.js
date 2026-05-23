const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const contentDir = path.join(__dirname, '../content');
const blogPostsDir = path.join(contentDir, 'blog');
const staticPagesDir = path.join(contentDir, 'pages');
const templatesDir = path.join(contentDir, 'templates');
const filtersDir = path.join(contentDir, 'filters');

const compiledBlogDir = path.join(__dirname, '../src/content/compiled/blog');
const compiledPagesDir = path.join(__dirname, '../src/content/compiled/pages');

// Ensure compiled target directories exist
if (!fs.existsSync(compiledBlogDir)) {
  fs.mkdirSync(compiledBlogDir, { recursive: true });
}
if (!fs.existsSync(compiledPagesDir)) {
  fs.mkdirSync(compiledPagesDir, { recursive: true });
}

// 1. Compile Blog Posts
console.log('Compiling blog posts...');
const blogFiles = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.md'));
const postsMetadata = [];

for (const file of blogFiles) {
  const slug = path.basename(file, '.md');
  const filePath = path.join(blogPostsDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');

  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    console.warn(`Warning: No valid frontmatter found in blog post ${file}. Skipping.`);
    continue;
  }

  const yamlStr = match[1];
  const markdownBody = rawContent.substring(match[0].length);

  let metadata;
  try {
    metadata = YAML.parse(yamlStr);
  } catch (err) {
    console.error(`Error: Failed to parse YAML frontmatter in blog post ${file}:`, err);
    process.exit(1);
  }

  metadata.slug = slug;
  metadata.title = metadata.title || slug;
  metadata.date = metadata.date || new Date().toLocaleDateString('en-US');
  metadata.tags = metadata.tags || [];
  metadata.categories = metadata.categories || [];
  metadata.readMinutes = metadata.readMinutes || 5;

  postsMetadata.push(metadata);

  console.log(`- Compiling blog post ${slug} using pandoc...`);

  const templatePath = path.join(templatesDir, 'post-template.html');
  const pandocProcess = Bun.spawnSync({
    cmd: [
      'pandoc',
      '--from=markdown',
      '--to=html',
      '--mathjax',
      '--toc',
      '--toc-depth=3',
      `--template=${templatePath}`
    ],
    stdin: Buffer.from(markdownBody, 'utf8')
  });

  if (pandocProcess.exitCode !== 0) {
    console.error(`Error: Pandoc compilation failed for blog post ${slug}`);
    console.error(pandocProcess.stderr.toString());
    process.exit(1);
  }

  fs.writeFileSync(path.join(compiledBlogDir, `${slug}.html`), pandocProcess.stdout.toString('utf8'), 'utf8');
}

postsMetadata.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(path.join(compiledBlogDir, 'posts.json'), JSON.stringify(postsMetadata, null, 2), 'utf8');
console.log(`Successfully compiled ${postsMetadata.length} blog posts to ${compiledBlogDir}/!\n`);


// 2. Compile Static Pages (with component Lua filter)
console.log('Compiling static pages...');
const pageFiles = fs.readdirSync(staticPagesDir).filter(file => file.endsWith('.md'));
const componentsFilter = path.join(filtersDir, 'components.lua');

for (const file of pageFiles) {
  const slug = path.basename(file, '.md');
  const filePath = path.join(staticPagesDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');

  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
  const match = rawContent.match(frontmatterRegex);
  const markdownBody = match ? rawContent.substring(match[0].length) : rawContent;

  console.log(`- Compiling static page ${slug} using pandoc...`);

  const templatePath = path.join(templatesDir, 'page-template.html');
  const pandocProcess = Bun.spawnSync({
    cmd: [
      'pandoc',
      '--from=markdown',
      '--to=html',
      '--mathjax',
      `--lua-filter=${componentsFilter}`,
      `--template=${templatePath}`
    ],
    stdin: Buffer.from(markdownBody, 'utf8')
  });

  if (pandocProcess.exitCode !== 0) {
    console.error(`Error: Pandoc compilation failed for static page ${slug}`);
    console.error(pandocProcess.stderr.toString());
    process.exit(1);
  }

  fs.writeFileSync(path.join(compiledPagesDir, `${slug}.html`), pandocProcess.stdout.toString('utf8'), 'utf8');
}

console.log(`Successfully compiled ${pageFiles.length} static pages to ${compiledPagesDir}/!`);
