import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const repoRoot = path.resolve(__dirname, '../..');
const scriptsDir = path.join(repoRoot, 'src');

describe('align-math filter invariant', () => {
  it('all display math in generated HTML is wrapped in align*', () => {
    const blogDir = path.join(repoRoot, '.generated/blog');
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.html'));

    for (const file of files) {
      const html = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const mathSpans = doc.querySelectorAll('span.math.display');
      const displayMathCount = mathSpans.length;

      const alignWrappedCount = Array.from(mathSpans).filter((span) => {
        const text = span.textContent?.trimStart() ?? '';
        return (
          text.startsWith('\\begin{align*') || text.startsWith('\\[\\begin{align*')
        );
      }).length;

      expect(
        alignWrappedCount,
        `${file}: expected all ${displayMathCount} display math blocks to start with \\begin{align*}, found ${alignWrappedCount}`,
      ).toBe(displayMathCount);
    }
  });
});

