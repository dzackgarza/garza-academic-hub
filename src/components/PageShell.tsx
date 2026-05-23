import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import CardGrid from "@/components/CardGrid";
import FilteredGallery from "@/components/FilteredGallery";
import { allItems } from "@/content/items";
import type { ContentItem } from "@/content/items";

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------

/**
 * Parse a filter string like "type=paper" or "type=talk,type=notes" into
 * a list of {key, value} conditions. Items matching ANY condition are kept.
 */
function parseFilter(filter: string): Array<{ key: string; value: string }> {
  return filter
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean)
    .map((f) => {
      const [key, value] = f.split("=");
      return { key: key.trim(), value: value?.trim() ?? "" };
    });
}

function applyFilter(items: ContentItem[], filter: string): ContentItem[] {
  if (!filter) return items;
  const conditions = parseFilter(filter);
  return items.filter((item) =>
    conditions.some(({ key, value }) => (item as Record<string, unknown>)[key] === value)
  );
}

// ---------------------------------------------------------------------------
// Component registry
// Maps data-component value → renderer that receives the placeholder element
// and returns a React node to mount into it.
// ---------------------------------------------------------------------------

type SlotRenderer = (el: HTMLElement) => React.ReactNode;

const REGISTRY: Record<string, SlotRenderer> = {
  "card-grid": (el) => {
    const filter = el.dataset.filter ?? "";
    const columns = (parseInt(el.dataset.columns ?? "2", 10) || 2) as 2 | 3;
    const items = applyFilter(allItems, filter);
    return <CardGrid items={items} columns={columns} />;
  },

  "scroll-gallery": (el) => {
    const filter = el.dataset.filter ?? "";
    const columns = (parseInt(el.dataset.columns ?? "3", 10) || 3) as 2 | 3;
    const rows = (parseInt(el.dataset.rows ?? "3", 10) || 3) as 2 | 3;
    const items = applyFilter(allItems, filter);
    return <FilteredGallery items={items} columns={columns} rows={rows} />;
  },
};

// ---------------------------------------------------------------------------
// PageShell
// Renders compiled Pandoc HTML and mounts React components into every
// [data-component] placeholder the Lua filter emitted.
// ---------------------------------------------------------------------------

interface PageShellProps {
  html: string;
}

const PageShell = ({ html }: PageShellProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slots = Array.from(
      container.querySelectorAll<HTMLElement>("[data-component]")
    );

    const roots = slots.flatMap((el) => {
      const type = el.dataset.component!;
      const renderer = REGISTRY[type];
      if (!renderer) {
        console.warn(`[PageShell] Unknown component type: "${type}"`);
        return [];
      }
      const root = createRoot(el);
      root.render(renderer(el));
      return [root];
    });

    return () => {
      roots.forEach((root) => root.unmount());
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default PageShell;
