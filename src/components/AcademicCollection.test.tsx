import { describe, it, expect, expectTypeOf } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { TypeDef as FCTypeDef } from '@/components/FilterControls';
import AcademicCollection, {
  type TypeDef as ACTypeDef,
  type CollectionItem,
} from '@/components/AcademicCollection';
import type { AcademicCardProps } from '@/components/AcademicCard';

// Used only for type-level assertions — never imported if the duplicate is removed.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TypeDiscriminant = ACTypeDef;

describe('AcademicCollection', () => {
  // -----------------------------------------------------------------------
  // Type stability
  // -----------------------------------------------------------------------

  it('TypeDef is structurally identical to FilterControls.TypeDef', () => {
    // If the two TypeDef definitions ever diverge, this is a compile-time failure.
    // The canonical source is FilterControls.
    expectTypeOf<FCTypeDef>().toEqualTypeOf<ACTypeDef>();
  });

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------

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

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('A test item')).toBeInTheDocument();
  });

  it('renders empty state when no items match filter', () => {
    render(<AcademicCollection items={[]} filterable />);

    expect(
      screen.getByText('No matches. Try clearing some filters.'),
    ).toBeInTheDocument();
  });
});
