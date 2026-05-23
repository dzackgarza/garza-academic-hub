import { describe, it, expect, vi } from 'vitest';

describe('PageShell registry', () => {
  it('reports error for unrecognized component types instead of silent fallback', async () => {
    // Import after extraction — this will fail to compile initially (RED phase)
    const { getRenderer } = await import('./PageShell');

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = getRenderer('completely-made-up-type');

    // Must log an error mentioning the unknown type
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('completely-made-up-type'),
    );
    // Must return null instead of silently falling back
    expect(result).toBeNull();

    spy.mockRestore();
  });
});
