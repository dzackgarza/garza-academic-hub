import FilterControls from '@/components/FilterControls';
import CardScroller from '@/components/CardScroller';
import type { ContentItem, TypeDef } from '@/content/items';
import { types as defaultTypes } from '@/content/items';

interface FilteredGalleryProps {
  items: ContentItem[];
  types?: TypeDef[];
  defaultType?: string;
  columns?: 2 | 3;
  rows?: 2 | 3;
}

const FilteredGallery = ({
  items,
  types,
  defaultType = 'all',
  columns = 3,
  rows = 3,
}: FilteredGalleryProps) => (
  <div className="min-w-0">
    <FilterControls
      items={items}
      types={types ?? defaultTypes}
      filterable
      defaultType={defaultType}
    >
      {(filtered, filterKey) =>
        filtered.length > 0 ? (
          <CardScroller
            key={filterKey}
            items={filtered}
            columns={columns}
            rows={rows}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No matches. Try clearing some filters.
          </p>
        )
      }
    </FilterControls>
  </div>
);

export default FilteredGallery;
