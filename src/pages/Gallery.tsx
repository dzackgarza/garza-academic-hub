import AcademicLayout from "@/components/AcademicLayout";

const Gallery = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-6">Gallery</h1>
    <p className="text-muted-foreground mb-6">Photos and visualizations from conferences, talks, and mathematical explorations.</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-square rounded-lg bg-accent flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Photo {i}</span>
        </div>
      ))}
    </div>
  </AcademicLayout>
);

export default Gallery;
