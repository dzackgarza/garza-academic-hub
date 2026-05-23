import { useRef, useState, useEffect, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

// Lookup map with literal class strings so Tailwind JIT can scan them at build time.
const GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

interface PaginatedScrollerProps<T> {
  /** All items to paginate into pages of columns × rows. */
  items: T[];
  /** Number of grid columns per page. */
  columns: number;
  /** Number of grid rows per page. */
  rows: number;
  /** Render a single item. Called once per visible slot. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Override grid classes (default: `grid-cols-{columns} gap-4`). */
  gridClass?: string;
  /** Extra class on each page wrapper div. */
  pageClass?: string;
  /** Extra class on the outer wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function PaginatedScroller<T>({
  items,
  columns,
  rows,
  renderItem,
  gridClass,
  pageClass,
  className = '',
}: PaginatedScrollerProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [page, setPage] = useState(0);

  const pageSize = columns * rows;
  const pages = Array.from({ length: Math.ceil(items.length / pageSize) }, (_, i) =>
    items.slice(i * pageSize, i * pageSize + pageSize),
  );

  const updateAffordance = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setPage(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
  };

  useEffect(() => {
    updateAffordance();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateAffordance, { passive: true });
    window.addEventListener('resize', updateAffordance);
    return () => {
      el.removeEventListener('scroll', updateAffordance);
      window.removeEventListener('resize', updateAffordance);
    };
  }, [items.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const scrollToPage = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  };

  const defaultGridClass = `grid ${GRID_COLS[columns] ?? 'grid-cols-3'} gap-4`;
  const wrapperClass = pageClass
    ? `w-full flex-none snap-start ${pageClass}`
    : 'w-full flex-none snap-start';

  return (
    <div
      className={`relative max-w-full min-w-0 overflow-hidden group/scroller ${className}`}
    >
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex max-w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pages.length === 0 ? (
          <div className="w-full flex-none snap-start" />
        ) : (
          pages.map((pageItems, pageIndex) => (
            <div key={pageIndex} className={wrapperClass}>
              <div className={gridClass ?? defaultGridClass}>
                {pageItems.map((item, i) => (
                  <div key={i}>{renderItem(item, pageIndex * pageSize + i)}</div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edge fades */}
      <div
        className={`pointer-events-none absolute left-0 top-0 bottom-5 w-10 bg-gradient-to-r from-background to-transparent transition-opacity ${canLeft ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`pointer-events-none absolute right-0 top-0 bottom-5 w-10 bg-gradient-to-l from-background to-transparent transition-opacity ${canRight ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Arrow navigation */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        disabled={!canLeft}
        className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-card/95 shadow-md p-2 transition-opacity hover:bg-accent disabled:opacity-0 ${canLeft ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        disabled={!canRight}
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-card/95 shadow-md p-2 transition-opacity hover:bg-accent disabled:opacity-0 ${canRight ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Page dots */}
      {pages.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" aria-label="Gallery pages">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to gallery page ${index + 1}`}
              onClick={() => scrollToPage(index)}
              className={`h-1.5 rounded-full transition-all ${page === index ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginatedScroller;
