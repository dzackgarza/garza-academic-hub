import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import AcademicCollection from '@/components/AcademicCollection';
import GalleryGrid from '@/components/GalleryGrid';
import BlogListing from '@/components/BlogListing';
import type { CollectionItem } from '@/components/AcademicCollection';
import type { TypeDef } from '@/components/FilterControls';

// ---------------------------------------------------------------------------
// Registry — maps data-component names to React render functions
// ---------------------------------------------------------------------------

interface ComponentData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type ComponentRenderer = (data: ComponentData) => JSX.Element;

const registry: Record<string, ComponentRenderer> = {
  AcademicCollection: (data) => (
    <AcademicCollection
      items={data.items as CollectionItem[]}
      types={data.types as TypeDef[]}
      columns={data.columns as 2 | 3}
      rows={data.rows as 2 | 3}
      layout={data.layout as 'grid' | 'scroller'}
      filterable={data.filterable as boolean}
    />
  ),
  GalleryGrid: (data) => (
    <GalleryGrid
      images={data.images ?? []}
      layout={data.layout as string | undefined}
    />
  ),
  BlogListing: (data) => {
    const blogBase: string = data.basePath;
    return <BlogListing posts={data.posts ?? []} basePath={blogBase} />;
  },
};

// ---------------------------------------------------------------------------
// Mount / unmount all data-component placeholders inside a container
// ---------------------------------------------------------------------------

export function mountComponents(container: HTMLElement): () => void {
  const roots: Root[] = [];

  container.querySelectorAll<HTMLElement>('[data-component]').forEach((el) => {
    const componentName = el.getAttribute('data-component');
    if (!componentName || !registry[componentName]) return;

    const jsonStr = el.getAttribute('data-json');
    if (!jsonStr) return;

    try {
      const data = JSON.parse(jsonStr) as ComponentData;
      const root = createRoot(el);
      root.render(registry[componentName](data));
      roots.push(root);
    } catch (e) {
      console.error(`[ComponentMount] Failed to mount ${componentName}:`, e);
    }
  });

  return () => {
    for (const root of roots) {
      root.unmount();
    }
  };
}

// ---------------------------------------------------------------------------
// Hook — call in a component that renders dangerouslySetInnerHTML
// ---------------------------------------------------------------------------

export function useComponentMount(): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cleanup = mountComponents(el);
    return cleanup;
  }, []);

  return containerRef;
}
