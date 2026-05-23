import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import ImageGallery from "@/components/ImageGallery";
import { galleries } from "@/content/galleries";

const Gallery = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-2">Gallery</h1>
    <p className="text-muted-foreground mb-6">
      Diagrams and images drawn or generated for notes, papers, and talks. Click any image to open the full-resolution version.
    </p>

    {galleries.map((gallery) => (
      <section key={gallery.id}>
        <SectionHeading id={gallery.id}>{gallery.title}</SectionHeading>
        {gallery.description && (
          <p className="text-sm text-muted-foreground mb-4">{gallery.description}</p>
        )}
        <ImageGallery gallery={gallery} />
      </section>
    ))}
  </AcademicLayout>
);

export default Gallery;
