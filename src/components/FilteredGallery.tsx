import { useMemo, useState } from "react";
import CardScroller from "@/components/CardScroller";
import type { ContentItem, ItemType } from "@/content/items";
import { cn } from "@/lib/utils";

interface FilterDef {
  key: "all" | ItemType;
  label: string;
}

interface FilteredGalleryProps {
  items: ContentItem[];
  filters?: FilterDef[];
  defaultFilter?: FilterDef["key"];
  columns?: 2 | 3;
  rows?: 2 | 3;
}

const defaultFilters: FilterDef[] = [
  { key: "all", label: "All" },
  { key: "talk", label: "Talks" },
  { key: "notes", label: "Notes" },
];

const FilteredGallery = ({
  items,
  filters = defaultFilters,
  defaultFilter = "all",
  columns = 3,
  rows = 3,
}: FilteredGalleryProps) => {
  const [active, setActive] = useState<FilterDef["key"]>(defaultFilter);

  const visible = useMemo(
    () => (active === "all" ? items : items.filter((it) => it.type === active)),
    [items, active],
  );

  return (
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label="Filter gallery"
        className="mb-4 inline-flex items-center gap-1 rounded-md border bg-muted/40 p-1"
      >
        {filters.map((f) => {
          const count =
            f.key === "all" ? items.length : items.filter((it) => it.type === f.key).length;
          const isActive = f.key === active;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActive(f.key)}
              className={cn(
                "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
              <span className="ml-1.5 text-xs text-muted-foreground">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <CardScroller key={active} items={visible} columns={columns} rows={rows} />
      ) : (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      )}
    </div>
  );
};

export default FilteredGallery;
