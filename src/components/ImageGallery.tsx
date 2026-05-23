import PaginatedScroller from '@/components/PaginatedScroller';
import ImageCard from '@/components/ImageCard';
import type { Gallery } from '@/content/galleries';

interface ImageGalleryProps {
  gallery: Gallery;
  layout?: 'grid' | 'scroller';
}

const ImageGallery = ({ gallery, layout = 'grid' }: ImageGalleryProps) => {
  if (layout === 'scroller') {
    return (
      <PaginatedScroller
        items={gallery.images}
        columns={4}
        rows={1}
        pageClass="pr-1"
        gridClass="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        renderItem={(img) => <ImageCard src={img.src} caption={img.caption} />}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {gallery.images.map((img) => (
        <ImageCard key={img.src} src={img.src} caption={img.caption} />
      ))}
    </div>
  );
};

export default ImageGallery;
