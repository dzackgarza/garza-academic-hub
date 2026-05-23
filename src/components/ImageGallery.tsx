import type { Gallery } from "@/content/galleries";

interface ImageGalleryProps {
  gallery: Gallery;
}

/** Renders a single image gallery section with thumbnails + hover captions. */
const ImageGallery = ({ gallery }: ImageGalleryProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {gallery.images.map((img) => (
      <a
        key={img.src}
        href={img.src}
        target="_blank"
        rel="noopener noreferrer"
        title={img.caption}
        className="group relative aspect-square overflow-hidden rounded-md border bg-muted block"
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
    ))}
  </div>
);

export default ImageGallery;
