import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import CardGrid from "@/components/CardGrid";
import FilteredGallery from "@/components/FilteredGallery";
import AcademicCollection from "@/components/AcademicCollection";
import BlogListing from "@/components/islands/BlogListing";
import ImageGallerySection from "@/components/islands/ImageGallerySection";
import LinkGroupSection from "@/components/islands/LinkGroupSection";
import { parseToml } from "@/content/_toml";
import { cn } from "@/lib/utils";


// ---------------------------------------------------------------------------
// Dynamic module matching
// ---------------------------------------------------------------------------

const tomlModules = import.meta.glob("../../content/databases/*.toml", {
  query: "raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

function findModuleKey(source: string): string | null {
  const normalized = source.replace(/^(content\/|databases\/)/, ""); // e.g. "items.toml"
  for (const key of Object.keys(tomlModules)) {
    if (key.endsWith("/" + normalized)) {
      return key;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------

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

function applyFilter(items: any[], filter: string): any[] {
  if (!filter) return items;
  const conditions = parseFilter(filter);
  return items.filter((item) =>
    conditions.some(({ key, value }) => {
      const itemVal = (item as Record<string, unknown>)[key];
      if (Array.isArray(itemVal)) {
        return itemVal.includes(value);
      }
      return itemVal === value;
    })
  );
}

// ---------------------------------------------------------------------------
// Component registry
// Maps data-component value → renderer that receives the placeholder element,
// parsed items, and types, then returns a React node.
// ---------------------------------------------------------------------------

type SlotRenderer = (el: HTMLElement, items: any[], types?: any[]) => React.ReactNode;

const REGISTRY: Record<string, SlotRenderer> = {
  "collection": (el, items, types) => {
    const filter = el.dataset.filter ?? "";
    const layout = (el.dataset.layout ?? "grid") as "grid" | "scroller";
    const filterable = el.dataset.filterable === "true";
    const columns = (parseInt(el.dataset.columns ?? "3", 10) || 3) as 2 | 3;
    const rows = (parseInt(el.dataset.rows ?? "1", 10) || 1) as 1 | 2 | 3;

    const typeMap = new Map((types ?? []).map((t) => [t.key, t]));
    const mappedItems = items.map((item) => ({
      ...item,
      icon: item.icon ?? (typeMap.get(item.type)?.icon as any) ?? "paper",
    }));

    const filteredItems = applyFilter(mappedItems, filter);

    return (
      <AcademicCollection
        items={filteredItems}
        types={types}
        layout={layout}
        filterable={filterable}
        columns={columns}
        rows={rows}
      />
    );
  },

  // Backward compatibility delegates
  "card-grid": (el, items, types) => {
    const filter = el.dataset.filter ?? "";
    const columns = (parseInt(el.dataset.columns ?? "2", 10) || 2) as 2 | 3;

    const typeMap = new Map((types ?? []).map((t) => [t.key, t]));
    const mappedItems = items.map((item) => ({
      ...item,
      icon: item.icon ?? (typeMap.get(item.type)?.icon as any) ?? "paper",
    }));

    const filteredItems = applyFilter(mappedItems, filter);

    return <CardGrid items={filteredItems} columns={columns} />;
  },

  "scroll-gallery": (el, items, types) => {
    const filter = el.dataset.filter ?? "";
    const columns = (parseInt(el.dataset.columns ?? "3", 10) || 3) as 2 | 3;
    const rows = (parseInt(el.dataset.rows ?? "3", 10) || 3) as 2 | 3;

    const typeMap = new Map((types ?? []).map((t) => [t.key, t]));
    const mappedItems = items.map((item) => ({
      ...item,
      icon: item.icon ?? (typeMap.get(item.type)?.icon as any) ?? "paper",
    }));

    const filteredItems = applyFilter(mappedItems, filter);

    return (
      <FilteredGallery
        items={filteredItems}
        types={types}
        columns={columns}
        rows={rows}
      />
    );
  },

  // Self-contained islands — data-source not required, items arg ignored
  "blog-listing": () => <BlogListing />,
  "image-gallery": () => <ImageGallerySection />,
  "link-groups": () => <LinkGroupSection />,
};

// ---------------------------------------------------------------------------
// PageShell
// Renders compiled Pandoc HTML, asynchronously loads required TOML
// data sources dynamically, then mounts React collection components.
// ---------------------------------------------------------------------------

interface PageShellProps {
  html: string;
}

const PageShell = ({ html }: PageShellProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<any[]>([]);
  const [data, setData] = useState<Record<string, { items: any[]; types?: any[] }>>({});
  const [loading, setLoading] = useState(true);

  // 1. Identify and fetch all required TOML sources (only for slots with explicit data-source)
  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const slots = Array.from(tempDiv.querySelectorAll<HTMLElement>("[data-component]"));
    const sources = Array.from(
      new Set(
        slots
          .map((el) => el.dataset.source)
          .filter((s): s is string => Boolean(s))
      )
    );

    let isMounted = true;
    setLoading(true);

    Promise.all(
      sources.map(async (source) => {
        const modKey = findModuleKey(source);
        if (!modKey) {
          console.warn(`[PageShell] TOML source not found: "${source}"`);
          return { source, data: { items: [] } };
        }
        try {
          const rawText = await tomlModules[modKey]();
          const parsed = parseToml<{ items: any[]; types?: any[] }>(rawText);
          return { source, data: parsed };
        } catch (err) {
          console.error(`[PageShell] Failed to load/parse TOML source "${source}":`, err);
          return { source, data: { items: [] } };
        }
      })
    ).then((results) => {
      if (!isMounted) return;
      const dataMap: Record<string, { items: any[]; types?: any[] }> = {};
      results.forEach(({ source, data }) => {
        dataMap[source] = data;
      });
      setData(dataMap);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [html]);

  // 2. Safe cleanup of dynamic roots when PageShell itself unmounts
  useEffect(() => {
    return () => {
      const activeRoots = rootsRef.current;
      rootsRef.current = [];
      setTimeout(() => {
        activeRoots.forEach((root) => {
          try {
            root.unmount();
          } catch (err) {
            // Already unmounted
          }
        });
      }, 0);
    };
  }, []);

  // 3. Mount/update roots once loading finishes
  useEffect(() => {
    if (loading) return;

    const container = containerRef.current;
    if (!container) return;

    const slots = Array.from(
      container.querySelectorAll<HTMLElement>("[data-component]")
    );

    slots.forEach((el) => {
      const type = el.dataset.component!;
      const source = el.dataset.source;
      const sourceData = source ? (data[source] || { items: [] }) : { items: [] };

      // Default to "collection" if the specified type isn't card-grid or scroll-gallery
      const renderer = REGISTRY[type] || REGISTRY["collection"];
      if (!renderer) return;

      let root = (el as any)._reactRoot;
      if (!root) {
        root = createRoot(el);
        (el as any)._reactRoot = root;
        rootsRef.current.push(root);
      }
      root.render(renderer(el, sourceData.items, sourceData.types));
    });
  }, [loading, html, data]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }}
      className={cn("w-full", loading && "opacity-60 transition-opacity duration-200")}
    />
  );
};

export default PageShell;
