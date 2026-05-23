import PaginatedScroller from '@/components/PaginatedScroller';
import AcademicCard from '@/components/AcademicCard';
import type { AcademicCardProps } from '@/components/AcademicCard';

// Lookup map with literal class strings so Tailwind JIT can scan them at build time.
const GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

interface CardScrollerProps {
  items: AcademicCardProps[];
  columns?: 2 | 3;
  rows?: 2 | 3;
}

const CardScroller = ({ items, columns = 3, rows = 3 }: CardScrollerProps) => (
  <PaginatedScroller
    items={items}
    columns={columns}
    rows={rows}
    gridClass={`grid ${GRID_COLS[columns] ?? 'grid-cols-3'} gap-4`}
    renderItem={(item, _i) => <AcademicCard {...item} />}
  />
);

export default CardScroller;
