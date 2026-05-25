import PaginatedScroller from '@/components/PaginatedScroller';
import YouTubeCard from '@/components/YouTubeCard';

interface GalleryImage {
  src: string;
  caption: string;
  type?: string;
  url?: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  layout?: string;
  columns?: number;
  rows?: number;
}

function isYouTube(item: GalleryImage): boolean {
  return item.type === 'youtube';
}

const ImageCard = ({ src, caption }: { src: string; caption?: string }) => (
  <a
    href={src}
    target="_blank"
    rel="noopener noreferrer"
    title={caption}
    className="group relative aspect-square overflow-hidden rounded-md border bg-muted block w-full"
  >
    <img
      src={src}
      alt={caption ?? ''}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <p className="text-xs text-white leading-tight">{caption}</p>
    </div>
  </a>
);

const GalleryGrid = ({ images, layout = 'grid', columns = 4, rows = 1 }: GalleryGridProps) => {
  if (layout === 'scroller') {
    return (
      <PaginatedScroller
        items={images}
        columns={columns}
        rows={rows}
        pageClass="pr-1"
        gridClass="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        renderItem={(item) =>
          isYouTube(item) ? (
            <YouTubeCard url={item.url!} caption={item.caption} />
          ) : (
            <ImageCard src={item.src} caption={item.caption} />
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((item) =>
        isYouTube(item) ? (
          <YouTubeCard key={item.url} url={item.url!} caption={item.caption} />
        ) : (
          <ImageCard key={item.src} src={item.src} caption={item.caption} />
        ),
      )}
    </div>
  );
};

export default GalleryGrid;
