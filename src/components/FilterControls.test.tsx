import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterControls from '@/components/FilterControls';

describe('FilterControls', () => {
  describe('when filterable=false', () => {
    it('passes all items through unchanged with key "all-"', () => {
      const items = [
        { type: 'a', tags: ['x'] },
        { type: 'b', tags: ['y'] },
      ];

      const renderFn = vi.fn((filtered: typeof items, filterKey: string) => (
        <div>{filtered.length} items</div>
      ));

      render(
        <FilterControls items={items} filterable={false}>
          {renderFn}
        </FilterControls>,
      );

      // All items must pass through
      expect(renderFn).toHaveBeenCalledWith(items, expect.any(String));

      // The filter key when unfiltered is "all-" (no filtering applied)
      const callArgs = renderFn.mock.calls[0];
      expect(callArgs[1]).toBe('all-');

      // No filter UI should be rendered
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('renders children even with empty items', () => {
      const renderFn = vi.fn(() => <div>empty</div>);

      render(
        <FilterControls items={[]} filterable={false}>
          {renderFn}
        </FilterControls>,
      );

      expect(screen.getByText('empty')).toBeInTheDocument();
    });
  });

  describe('when filterable=true', () => {
    it('renders filter tabs', () => {
      const items = [
        { type: 'a', tags: ['x'] },
        { type: 'b', tags: ['y'] },
      ];

      render(
        <FilterControls items={items} filterable>
          {() => <div>content</div>}
        </FilterControls>,
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });
});
