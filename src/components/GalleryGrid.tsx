import PaginatedScroller from '@/components/PaginatedScroller';
import YouTubeCard from '@/components/YouTubeCard';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GalleryImage {
  src: string;
  caption: string;
  type?: string;
  url?: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  layout?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const GalleryGrid = ({ images, layout = 'grid' }: GalleryGridProps) => {
  if (layout === 'scroller') {
    return (
      <PaginatedScroller
        items={images}
        columns={3}
        rows={3}
        gridClass="grid grid-cols-3 gap-4"
        renderItem={(img, _i) =>
          img.type === 'youtube' ? (
            <YouTubeCard url={img.url ?? ''} caption={img.caption} />
          ) : (
            <a
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
          )
        }
      />
    );
  }

  // Grid layout
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((img, i) =>
        img.type === 'youtube' ? (
          <YouTubeCard key={i} url={img.url ?? ''} caption={img.caption} />
        ) : (
          <a
            key={i}
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
        ),
      )}
    </div>
  );
};

export default GalleryGrid;
