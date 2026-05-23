import PaginatedScroller from '@/components/PaginatedScroller';
import ImageCard from '@/components/ImageCard';
import YouTubeCard from '@/components/YouTubeCard';
import type { Gallery, GalleryItem, GalleryYouTubeItem } from '@/content/galleries';

interface ImageGalleryProps {
  gallery: Gallery;
  layout?: 'grid' | 'scroller';
  columns?: number;
  rows?: number;
}

function isYouTube(item: GalleryItem): item is GalleryYouTubeItem {
  return item.type === 'youtube';
}

const ImageGallery = ({
  gallery,
  layout = 'grid',
  columns = 4,
  rows = 1,
}: ImageGalleryProps) => {
  if (layout === 'scroller') {
    return (
      <PaginatedScroller
        items={gallery.images}
        columns={columns}
        rows={rows}
        pageClass="pr-1"
        gridClass="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        renderItem={(item) =>
          isYouTube(item) ? (
            <YouTubeCard url={item.url} caption={item.caption} />
          ) : (
            <ImageCard src={item.src} caption={item.caption} />
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {gallery.images.map((item) =>
        isYouTube(item) ? (
          <YouTubeCard key={item.url} url={item.url} caption={item.caption} />
        ) : (
          <ImageCard key={item.src} src={item.src} caption={item.caption} />
        ),
      )}
    </div>
  );
};

export default ImageGallery;
