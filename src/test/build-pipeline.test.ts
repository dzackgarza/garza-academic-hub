import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(__dirname, '../..');
const scriptsDir = path.join(repoRoot, 'scripts');

describe('build pipeline', () => {
  it('compile script exists as .cjs (not .js)', () => {
    const hasCjs = fs.existsSync(path.join(scriptsDir, 'compile.cjs'));
    const hasJs = fs.existsSync(path.join(scriptsDir, 'compile.js'));
    expect(hasCjs).toBe(true);
    expect(hasJs).toBe(false);
  });

  it('all references to the compile script in .ts/.tsx files use compile.cjs', () => {
    const tsFiles = [path.join(repoRoot, 'vite.config.ts')];
    for (const file of tsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      // Must reference compile.cjs, not compile.js
      const jsRefs = content.match(/compile\.js/g);
      const cjsRefs = content.match(/compile\.cjs/g);
      expect(
        jsRefs,
        `${path.basename(file)} references compile.js but should use compile.cjs`,
      ).toBeNull();
      expect(
        cjsRefs?.length,
        `${path.basename(file)} should reference compile.cjs`,
      ).toBeGreaterThanOrEqual(1);
    }
  });
});
