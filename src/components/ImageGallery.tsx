import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Gallery } from "@/content/galleries";

interface ImageGalleryProps {
  gallery: Gallery;
  layout?: "grid" | "scroller";
}

/** Renders an image gallery section with support for grid or a paginated scroller. */
const ImageGallery = ({ gallery, layout = "grid" }: ImageGalleryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [page, setPage] = useState(0);

  const images = gallery.images;

  // Page sizing for the horizontal scroller
  const columns = 4;
  const rows = 1;
  const pageSize = columns * rows;
  const pages = Array.from({ length: Math.ceil(images.length / pageSize) }, (_, index) =>
    images.slice(index * pageSize, index * pageSize + pageSize)
  );

  const updateAffordance = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setPage(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
  };

  useEffect(() => {
    if (layout !== "scroller") return;
    updateAffordance();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateAffordance, { passive: true });
    window.addEventListener("resize", updateAffordance);
    return () => {
      el.removeEventListener("scroll", updateAffordance);
      window.removeEventListener("resize", updateAffordance);
    };
  }, [images.length, layout]);

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

  const renderImage = (img: any) => (
    <a
      key={img.src}
      href={img.src}
      target="_blank"
      rel="noopener noreferrer"
      title={img.caption}
      className="group relative aspect-square overflow-hidden rounded-md border bg-muted block w-full"
    >
      <img
        src={img.src}
        alt={img.caption}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-white leading-tight">{img.caption}</p>
      </div>
    </a>
  );

  if (layout === "scroller") {
    return (
      <div className="relative max-w-full min-w-0 overflow-hidden group/scroller">
        <div
          ref={scrollRef}
          className="flex max-w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pages.map((pageItems, pageIndex) => (
            <div key={pageIndex} className="w-full flex-none snap-start pr-1">
              <div className="grid w-full gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {pageItems.map((img) => renderImage(img))}
              </div>
            </div>
          ))}
        </div>

        {/* Edge fades */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent transition-opacity ${canLeft ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent transition-opacity ${canRight ? "opacity-100" : "opacity-0"}`}
        />

        {/* Arrow navigation */}
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
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((img) => renderImage(img))}
    </div>
  );
};

export default ImageGallery;

