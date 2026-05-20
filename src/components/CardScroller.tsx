import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AcademicCard from "@/components/AcademicCard";
import type { AcademicCardProps } from "@/components/AcademicCard";

interface CardScrollerProps {
  items: AcademicCardProps[];
  columns?: 2 | 3;
  rows?: 2 | 3;
}

const CardScroller = ({ items, columns = 3, rows = 3 }: CardScrollerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [page, setPage] = useState(0);

  const pageSize = columns * rows;
  const pages = Array.from({ length: Math.ceil(items.length / pageSize) }, (_, index) =>
    items.slice(index * pageSize, index * pageSize + pageSize),
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
    el.addEventListener("scroll", updateAffordance, { passive: true });
    window.addEventListener("resize", updateAffordance);
    return () => {
      el.removeEventListener("scroll", updateAffordance);
      window.removeEventListener("resize", updateAffordance);
    };
  }, [items.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const scrollToPage = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative max-w-full min-w-0 overflow-hidden group rounded-lg bg-muted/20 p-3 ring-1 ring-border/70">
      <div
        ref={scrollRef}
        className="flex max-w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pages.map((pageItems, pageIndex) => (
          <div key={pageIndex} className="min-w-full shrink-0 snap-start pr-1">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >

              {pageItems.map((item, i) => (
                <AcademicCard key={`${pageIndex}-${i}`} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* edge fades */}
      <div
        className={`pointer-events-none absolute left-0 top-0 bottom-3 w-10 bg-gradient-to-r from-background to-transparent transition-opacity ${canLeft ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`pointer-events-none absolute right-0 top-0 bottom-3 w-10 bg-gradient-to-l from-background to-transparent transition-opacity ${canRight ? "opacity-100" : "opacity-0"}`}
      />

      {/* arrow buttons */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        disabled={!canLeft}
        className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-card/95 shadow-md p-2 transition-opacity hover:bg-accent disabled:opacity-0 ${canLeft ? "opacity-100" : "opacity-0"}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        disabled={!canRight}
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-card/95 shadow-md p-2 transition-opacity hover:bg-accent disabled:opacity-0 ${canRight ? "opacity-100" : "opacity-0"}`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {pages.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" aria-label="Gallery pages">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to gallery page ${index + 1}`}
              onClick={() => scrollToPage(index)}
              className={`h-1.5 rounded-full transition-all ${page === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardScroller;
