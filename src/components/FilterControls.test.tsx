import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterControls from '@/components/FilterControls';

// This file deliberately does NOT import AcademicCard — FilterControls
// should not be coupled to a specific card component's icon type.

describe('FilterControls', () => {
  // -----------------------------------------------------------------------
  // Type contract: TypeDef.icon should accept any string, not just the
  // AcademicCardProps icon union ("paper" | "talk" | "notes").
  // This test asserts that a non-standard icon string compiles and renders.
  // -----------------------------------------------------------------------

  it('renders with a TypeDef using a non-standard icon string', () => {
    const items = [{ type: 'a' }];
    const customTypes = [{ key: 'a', label: 'Custom', icon: 'custom-icon' }];

    render(
      <FilterControls items={items} types={customTypes} filterable>
        {() => <div>rendered</div>}
      </FilterControls>,
    );

    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

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

      expect(renderFn).toHaveBeenCalledWith(items, expect.any(String));
      const callArgs = renderFn.mock.calls[0];
      expect(callArgs[1]).toBe('all-');
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
