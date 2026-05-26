import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const repoRoot = path.resolve(__dirname, '../..');
const filterPath = path.join(repoRoot, 'content/filters/obsidian.lua');

function pandocWithFilter(markdownInput: string): string {
  const result = execSync(
    `pandoc --lua-filter="${filterPath}" -t html --from markdown`,
    {
      input: markdownInput,
      encoding: 'utf8',
      timeout: 10000,
    },
  );
  return result;
}

describe('obsidian.lua filter — wikilink handling', () => {
  it('strips simple [[wikilink]] to plain text', () => {
    const html = pandocWithFilter('before [[groupoid]] after');
    expect(html).toContain('before groupoid after');
    expect(html).not.toContain('[[');
    expect(html).not.toContain(']]');
  });

  it('strips [[page|display]] to display text only (pipe syntax)', () => {
    const html = pandocWithFilter('before [[algebraic space|Algebraic spaces]] after');
    // Must show only the display text, never the source page name
    expect(html).toContain('Algebraic spaces');
    expect(html).not.toContain('algebraic space|');
    expect(html).not.toContain('|');
  });

  it('strips multi-word [[wikilink target|display name]] correctly', () => {
    const html = pandocWithFilter(
      'before [[simplicial commutative rings|simplicial rings]] after',
    );
    expect(html).toContain('simplicial rings');
    expect(html).not.toContain('simplicial commutative');
    expect(html).not.toContain('|');
  });

  it('strips wikilinks inside blockquotes', () => {
    const html = pandocWithFilter('> Based on [[some note|a reference]] here');
    expect(html).toContain('a reference');
    expect(html).not.toContain('|');
    expect(html).not.toContain('some note');
  });

  it('removes %% comment markers', () => {
    const html = pandocWithFilter('before %%this is a comment%% after');
    // HTML collapses multiple spaces, so "before  after" renders as "before after"
    expect(html).toContain('before after');
    expect(html).not.toContain('%%');
  });

  it('removes leading #tags on their own', () => {
    const html = pandocWithFilter('#subject/tag');
    expect(html.trim()).toBe('');
  });

  it('does not strip [[wikilinks]] with trailing punctuation', () => {
    const html = pandocWithFilter('check [[groupoid]].');
    expect(html).toContain('check groupoid.');
    expect(html).not.toContain('[[');
  });

  it('strips [text](page-name) markdown links to Obsidian pages', () => {
    const html = pandocWithFilter(
      'replace with [simplicial commutative rings](simplicial commutative rings) which',
    );
    expect(html).toContain('simplicial commutative rings');
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('href');
  });

  it('preserves [text](url) links to real URLs', () => {
    const html = pandocWithFilter('see [example](https://example.com/page) for more');
    expect(html).toContain('<a ');
    expect(html).toContain('href="https://example.com/page"');
  });

  it('strips markdown links with Obsidian-style relative targets', () => {
    const html = pandocWithFilter('see [Picard stack](Picard stack) for');
    expect(html).toContain('Picard stack');
    expect(html).not.toContain('<a ');
  });

  it('strips markdown links inside blockquotes', () => {
    const html = pandocWithFilter('> Based on [some video](some video) here');
    expect(html).not.toContain('href');
    expect(html).toContain('some video');
  });
});
