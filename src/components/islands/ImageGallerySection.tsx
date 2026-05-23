import { galleries } from "@/content/galleries";
import SectionHeading from "@/components/SectionHeading";
import ImageGallery from "@/components/ImageGallery";

/** Self-contained island: renders all gallery sections from galleries.toml. */
const ImageGallerySection = () => (
  <>
    {galleries.map((gallery) => (
      <section key={gallery.id}>
        <SectionHeading id={gallery.id}>{gallery.title}</SectionHeading>
        {gallery.description && (
          <p className="text-sm text-muted-foreground mb-4">{gallery.description}</p>
        )}
        <ImageGallery gallery={gallery} />
      </section>
    ))}
  </>
);

export default ImageGallerySection;
