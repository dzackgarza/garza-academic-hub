const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const postsDir = path.join(__dirname, '../src/content/blog/posts');
const compiledDir = path.join(__dirname, '../src/content/blog/compiled');

// Ensure the compiled directory exists
if (!fs.existsSync(compiledDir)) {
  fs.mkdirSync(compiledDir, { recursive: true });
}

console.log('Compiling blog posts...');

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
const postsMetadata = [];

for (const file of files) {
  const slug = path.basename(file, '.md');
  const filePath = path.join(postsDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');

  // Split frontmatter and markdown body
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    console.warn(`Warning: No valid frontmatter found in ${file}. Skipping.`);
    continue;
  }

  const yamlStr = match[1];
  const markdownBody = rawContent.substring(match[0].length);

  // Parse YAML frontmatter
  let metadata;
  try {
    metadata = YAML.parse(yamlStr);
  } catch (err) {
    console.error(`Error: Failed to parse YAML frontmatter in ${file}:`, err);
    process.exit(1);
  }

  // Ensure mandatory metadata attributes
  metadata.slug = slug;
  metadata.title = metadata.title || slug;
  metadata.date = metadata.date || new Date().toLocaleDateString('en-US');
  metadata.tags = metadata.tags || [];
  metadata.categories = metadata.categories || [];
  metadata.readMinutes = metadata.readMinutes || 5;

  postsMetadata.push(metadata);

  // Compile markdown body using pandoc via stdin
  console.log(`- Compiling ${slug} using pandoc...`);
  
  const templatePath = path.join(__dirname, 'post-template.html');
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
    console.error(`Error: Pandoc compilation failed for ${slug}`);
    console.error(pandocProcess.stderr.toString());
    process.exit(1);
  }

  const htmlBody = pandocProcess.stdout.toString('utf8');
  fs.writeFileSync(path.join(compiledDir, `${slug}.html`), htmlBody, 'utf8');
}

// Sort posts by date descending
postsMetadata.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write consolidated index.json
fs.writeFileSync(path.join(compiledDir, 'posts.json'), JSON.stringify(postsMetadata, null, 2), 'utf8');

console.log(`Successfully compiled ${postsMetadata.length} posts to ${compiledDir}/!`);
