import { useMemo, useState } from "react";
import { X, Filter } from "lucide-react";
import CardScroller from "@/components/CardScroller";
import CardGrid from "@/components/CardGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { AcademicCardProps } from "@/components/AcademicCard";

export interface TypeDef {
  key: string;
  label: string;
  icon?: AcademicCardProps["icon"];
}

export interface CollectionItem extends AcademicCardProps {
  type: string;
}

interface AcademicCollectionProps {
  items: CollectionItem[];
  types?: TypeDef[];
  layout?: "grid" | "scroller";
  filterable?: boolean;
  defaultType?: string;
  columns?: 2 | 3;
  rows?: 1 | 2 | 3;
}

type MatchMode = "any" | "all";

const AcademicCollection = ({
  items,
  types,
  layout = "grid",
  filterable = false,
  defaultType = "all",
  columns = 3,
  rows = 1,
}: AcademicCollectionProps) => {
  const [activeType, setActiveType] = useState<string>(defaultType);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [matchMode, setMatchMode] = useState<MatchMode>("any");

  // Derive types list if not explicitly provided
  const derivedTypes = useMemo(() => {
    if (types && types.length > 0) return types;
    const uniqueTypes = Array.from(new Set(items.map((i) => i.type).filter(Boolean)));
    return uniqueTypes.map((t) => ({
      key: t,
      label: t.charAt(0).toUpperCase() + t.slice(1) + "s",
    }));
  }, [items, types]);

  // Filter based on presence in current items
  const presentTypes = useMemo(() => {
    const present = new Set(items.map((i) => i.type));
    return derivedTypes.filter((t) => present.has(t.key));
  }, [items, derivedTypes]);

  // Type filter step
  const typeFiltered = useMemo(
    () => {
      if (!filterable || activeType === "all") return items;
      return items.filter((i) => i.type === activeType);
    },
    [items, activeType, filterable]
  );

  // Available tags in current selection
  const availableTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of typeFiltered) {
      for (const tag of it.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [typeFiltered]);

  // Final visible list after tag filtering
  const visible = useMemo(() => {
    if (!filterable || selectedTags.length === 0) return typeFiltered;
    return typeFiltered.filter((it) => {
      const tags = it.tags ?? [];
      return matchMode === "any"
        ? selectedTags.some((t) => tags.includes(t))
        : selectedTags.every((t) => tags.includes(t));
    });
  }, [typeFiltered, selectedTags, matchMode, filterable]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const clearTags = () => setSelectedTags([]);

  const handleTypeChange = (key: string) => {
    setActiveType(key);
    if (key !== "all") {
      const validTags = new Set(
        items.filter((i) => i.type === key).flatMap((i) => i.tags ?? [])
      );
      setSelectedTags((prev) => prev.filter((t) => validTags.has(t)));
    }
  };

  const tabs = [{ key: "all", label: "All" }, ...presentTypes.map((t) => ({ key: t.key, label: t.label }))];

  return (
    <div className="min-w-0 w-full">
      {/* Filtering Header */}
      {filterable && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {/* Type tabs */}
          <div
            role="tablist"
            aria-label="Filter by type"
            className="inline-flex items-center gap-1 rounded-md border bg-muted/40 p-1"
          >
            {tabs.map((f) => {
              const count =
                f.key === "all" ? items.length : items.filter((i) => i.type === f.key).length;
              const isActive = f.key === activeType;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handleTypeChange(f.key)}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.label}
                  <span className="ml-1.5 text-xs text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Tag filter popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Filter className="h-3.5 w-3.5" />
                Tags
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-0">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Filter by tag
                </div>
                <div className="flex items-center gap-1 rounded-md border bg-muted/40 p-0.5">
                  {(["any", "all"] as MatchMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMatchMode(m)}
                      className={cn(
                        "rounded-sm px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide transition-colors",
                        matchMode === m
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <ScrollArea className="max-h-72">
                <div className="p-2">
                  {availableTags.length === 0 ? (
                    <div className="p-2 text-xs text-muted-foreground">No tags available.</div>
                  ) : (
                    availableTags.map(({ tag, count }) => {
                      const checked = selectedTags.includes(tag);
                      return (
                        <label
                          key={tag}
                          className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleTag(tag)}
                            aria-label={`Filter by ${tag}`}
                          />
                          <span className="flex-1 truncate">{tag}</span>
                          <span className="text-xs text-muted-foreground">{count}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
              {selectedTags.length > 0 && (
                <div className="border-t p-2">
                  <Button variant="ghost" size="sm" className="w-full" onClick={clearTags}>
                    Clear {selectedTags.length} tag{selectedTags.length === 1 ? "" : "s"}
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Active tag chips */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="group inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground hover:bg-accent/80"
                  aria-label={`Remove ${tag} filter`}
                >
                  {tag}
                  <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}

          <div className="ml-auto text-xs text-muted-foreground">
            {visible.length} of {items.length}
          </div>
        </div>
      )}

      {/* Rendering Layout */}
      {visible.length > 0 ? (
        layout === "scroller" ? (
          <CardScroller
            key={`${activeType}-${selectedTags.join(",")}-${matchMode}`}
            items={visible}
            columns={columns}
            rows={rows as 2 | 3}
          />
        ) : (
          <CardGrid items={visible} columns={columns} />
        )
      ) : (
        <p className="text-sm text-muted-foreground">No matches. Try clearing some filters.</p>
      )}
    </div>
  );
};

export default AcademicCollection;
