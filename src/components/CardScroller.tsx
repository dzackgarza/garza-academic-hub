import PaginatedScroller from '@/components/PaginatedScroller';
import AcademicCard from '@/components/AcademicCard';
import type { AcademicCardProps } from '@/components/AcademicCard';

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
    gridClass={`grid grid-cols-${columns} gap-4`}
    renderItem={(item, _i) => <AcademicCard {...item} />}
  />
);

export default CardScroller;
