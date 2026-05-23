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
