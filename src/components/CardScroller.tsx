import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AcademicCard from "@/components/AcademicCard";
import type { AcademicCardProps } from "@/components/AcademicCard";

interface CardScrollerProps {
  items: AcademicCardProps[];
  cardWidth?: string;
}

const CardScroller = ({ items, cardWidth = "w-72" }: CardScrollerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateAffordance = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
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
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin]"
      >
        {items.map((item, i) => (
          <div key={i} className={`${cardWidth} shrink-0 snap-start`}>
            <AcademicCard {...item} />
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
        className={`absolute left-1 top-1/2 -translate-y-1/2 rounded-full border bg-card shadow-md p-1.5 transition-opacity hover:bg-accent disabled:opacity-0 ${canLeft ? "opacity-100" : "opacity-0"}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        disabled={!canRight}
        className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full border bg-card shadow-md p-1.5 transition-opacity hover:bg-accent disabled:opacity-0 ${canRight ? "opacity-100" : "opacity-0"}`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CardScroller;
