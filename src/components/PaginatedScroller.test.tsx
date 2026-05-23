import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaginatedScroller from '@/components/PaginatedScroller';

describe('PaginatedScroller', () => {
  it('renders grid with literal column class for 2 columns', () => {
    const items = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
    ];

    render(
      <PaginatedScroller
        items={items}
        columns={2}
        rows={2}
        renderItem={(item) => <div>{item.id}</div>}
      />,
    );

    const grid = document.querySelector('.grid');
    expect(grid).not.toBeNull();
    expect(grid!.className).toContain('grid-cols-2');
    expect(grid!.className).not.toContain('grid-cols-${columns}');
  });

  it('renders grid with literal column class for 3 columns', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];

    render(
      <PaginatedScroller
        items={items}
        columns={3}
        rows={2}
        renderItem={(item) => <div>{item.id}</div>}
      />,
    );

    const grid = document.querySelector('.grid');
    expect(grid).not.toBeNull();
    expect(grid!.className).toContain('grid-cols-3');
    expect(grid!.className).not.toContain('grid-cols-${columns}');
  });

  it('renders no placeholder children in the scroll container when items are empty (RED: empty div exists)', () => {
    render(
      <PaginatedScroller items={[]} columns={2} rows={2} renderItem={() => <div />} />,
    );

    const scrollContainer = document.querySelector('.overflow-x-auto');
    // Before the fix, an empty <div class="w-full flex-none snap-start" />
    // is rendered as a child. After the fix, the scroll container has 0 children.
    expect(scrollContainer?.children.length).toBe(0);
  });

  it('renders each item', () => {
    const items = [{ id: 1 }, { id: 2 }];

    render(
      <PaginatedScroller
        items={items}
        columns={2}
        rows={1}
        renderItem={(item) => <div>{item.id}</div>}
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
