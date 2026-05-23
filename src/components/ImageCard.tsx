import type { GalleryImage } from '@/content/galleries';

const ImageCard = ({ src, caption }: GalleryImage) => (
  <a
    href={src}
    target="_blank"
    rel="noopener noreferrer"
    title={caption}
    className="group relative aspect-square overflow-hidden rounded-md border bg-muted block w-full"
  >
    <img
      src={src}
      alt={caption}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <p className="text-xs text-white leading-tight">{caption}</p>
    </div>
  </a>
);

export default ImageCard;
