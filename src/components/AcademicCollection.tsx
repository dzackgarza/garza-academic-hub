import FilterControls, { type TypeDef } from '@/components/FilterControls';
import CardScroller from '@/components/CardScroller';
import CardGrid from '@/components/CardGrid';
import type { AcademicCardProps } from '@/components/AcademicCard';

export type { TypeDef };

export interface CollectionItem extends AcademicCardProps {
  type: string;
}

interface AcademicCollectionProps {
  items: CollectionItem[];
  types?: TypeDef[];
  layout?: 'grid' | 'scroller';
  filterable?: boolean;
  defaultType?: string;
  columns?: 2 | 3;
  rows?: 1 | 2 | 3;
}

const AcademicCollection = ({
  items,
  types,
  layout = 'grid',
  filterable = false,
  defaultType = 'all',
  columns = 3,
  rows = 1,
}: AcademicCollectionProps) => (
  <FilterControls
    items={items}
    types={types}
    filterable={filterable}
    defaultType={defaultType}
  >
    {(filtered, filterKey) =>
      filtered.length > 0 ? (
        layout === 'scroller' ? (
          <CardScroller
            key={filterKey}
            items={filtered}
            columns={columns}
            rows={rows as 2 | 3}
          />
        ) : (
          <CardGrid items={filtered} columns={columns} />
        )
      ) : (
        <p className="text-sm text-muted-foreground">
          No matches. Try clearing some filters.
        </p>
      )
    }
  </FilterControls>
);

export default AcademicCollection;
