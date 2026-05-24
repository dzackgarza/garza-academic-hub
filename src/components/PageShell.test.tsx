import { describe, it, expect, vi } from 'vitest';

describe('PageShell registry', () => {
  it('resolves known component types to renderer functions', async () => {
    const { getRenderer } = await import('./PageShell');
    const knownTypes = [
      'collection',
      'card-grid',
      'scroll-gallery',
      'blog-listing',
      'gallery-grid',
      'link-group',
    ];

    for (const type of knownTypes) {
      const renderer = getRenderer(type);
      expect(
        renderer,
        `getRenderer("${type}") should return a function, not null`,
      ).toBeInstanceOf(Function);
    }
  });

  it('reports error for unrecognized component types instead of silent fallback', async () => {
    const { getRenderer } = await import('./PageShell');

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = getRenderer('completely-made-up-type');

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('completely-made-up-type'),
    );
    expect(result).toBeNull();

    spy.mockRestore();
  });
});
