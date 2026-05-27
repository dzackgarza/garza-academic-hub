import { describe, it, expect, afterAll } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { JSDOM } from 'jsdom';

const repoRoot = path.resolve(__dirname, '../..');
const blogDir = path.join(repoRoot, 'content/blog');
const compileScript = path.join(repoRoot, 'scripts/compile.cjs');
const tempFile = path.join(blogDir, '_obsidian-test.md');

function compileSnippet(markdownBody: string): string {
  const frontmatter = `---
title: Test Post
date: 2024-01-01
tags: [test]
categories: [test]
---\n`;
  const fullContent = frontmatter + markdownBody;
  fs.writeFileSync(tempFile, fullContent, 'utf8');
  const html = execSync(
    `node "${compileScript}" --preview "content/blog/_obsidian-test.md"`,
    {
      encoding: 'utf8',
      timeout: 15000,
      cwd: repoRoot,
    },
  );
  // Extract the <article> element — the blog post content container
  const dom = new JSDOM(html);
  const article = dom.window.document.querySelector('article');
  return article ? article.innerHTML : '';
}

afterAll(() => {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
});

describe('obsidian.lua filter — wikilink handling', () => {
  it('strips simple [[wikilink]] to plain text', () => {
    const html = compileSnippet('before [[groupoid]] after');
    expect(html).toContain('before groupoid after');
    expect(html).not.toContain('[[');
    expect(html).not.toContain(']]');
  });

  it('strips [[page|display]] to display text only (pipe syntax)', () => {
    const html = compileSnippet('before [[algebraic space|Algebraic spaces]] after');
    expect(html).toContain('Algebraic spaces');
    expect(html).not.toContain('algebraic space|');
    expect(html).not.toContain('|');
  });

  it('strips multi-word [[wikilink target|display name]] correctly', () => {
    const html = compileSnippet(
      'before [[simplicial commutative rings|simplicial rings]] after',
    );
    expect(html).toContain('simplicial rings');
    expect(html).not.toContain('simplicial commutative');
    expect(html).not.toContain('|');
  });

  it('strips wikilinks inside blockquotes', () => {
    const html = compileSnippet('> Based on [[some note|a reference]] here');
    expect(html).toContain('a reference');
    expect(html).not.toContain('|');
    expect(html).not.toContain('some note');
  });

  it('removes %% comment markers', () => {
    const html = compileSnippet('before %%this is a comment%% after');
    expect(html).toContain('before after');
    expect(html).not.toContain('%%');
  });

  it('removes leading #tags on their own', () => {
    const html = compileSnippet('#subject/tag');
    // The #tag line is removed entirely — no heading or text should appear
    expect(html).not.toContain('subject/tag');
    expect(html).not.toContain('#subject');
  });

  it('does not strip [[wikilinks]] with trailing punctuation', () => {
    const html = compileSnippet('check [[groupoid]].');
    expect(html).toContain('check groupoid.');
    expect(html).not.toContain('[[');
  });

  it('strips [text](page-name) markdown links to Obsidian pages', () => {
    const html = compileSnippet(
      'replace with [simplicial commutative rings](simplicial commutative rings) which',
    );
    expect(html).toContain('simplicial commutative rings');
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('href');
  });

  it('preserves [text](url) links to real URLs', () => {
    const html = compileSnippet('see [example](https://example.com/page) for more');
    expect(html).toContain('<a ');
    expect(html).toContain('href="https://example.com/page"');
  });

  it('strips markdown links with Obsidian-style relative targets', () => {
    const html = compileSnippet('see [Picard stack](Picard stack) for');
    expect(html).toContain('Picard stack');
    expect(html).not.toContain('<a ');
  });

  it('strips markdown links inside blockquotes', () => {
    const html = compileSnippet('> Based on [some video](some video) here');
    expect(html).not.toContain('href');
    expect(html).toContain('some video');
  });
});
