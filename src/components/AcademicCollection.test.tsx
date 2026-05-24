import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AcademicCollection, {
  type CollectionItem,
} from '@/components/AcademicCollection';
import type { AcademicCardProps } from '@/components/AcademicCard';

describe('AcademicCollection', () => {
  it('renders items in grid layout by default', () => {
    const items: CollectionItem[] = [
      {
        title: 'Test Item',
        type: 'test',
        description: 'A test item',
        icon: 'paper' as AcademicCardProps['icon'],
        links: [{ label: 'View', href: '/test' }],
      },
    ];

    render(<AcademicCollection items={items} />);

    // Default layout is grid (CardGrid renders a div with class "grid")
    const gridContainer = document.querySelector('div.grid');
    expect(gridContainer).not.toBeNull();

    // Items render inside the grid
    expect(gridContainer!.textContent).toContain('Test Item');
    expect(gridContainer!.textContent).toContain('A test item');
  });

  it('renders empty state when no items match filter', () => {
    render(<AcademicCollection items={[]} filterable />);

    expect(
      screen.getByText('No matches. Try clearing some filters.'),
    ).toBeInTheDocument();
  });
});
