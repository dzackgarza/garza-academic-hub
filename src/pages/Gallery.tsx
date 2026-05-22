import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";

interface Img {
  src: string;
  caption: string;
}

const BASE = "https://dzackgarza.com/assets/images";

const handDrawn: Img[] = [
  { src: `${BASE}/sphere-v-ball-correct.png`, caption: "Low-dimensional variants of the sphere and ball." },
  { src: `${BASE}/mobius-band.png`, caption: "The classic Möbius band." },
  { src: `${BASE}/klein-bottle.png`, caption: "The classic Klein bottle." },
  { src: `${BASE}/foliation-diagram.png`, caption: "Fibers of a fiber bundle foliating the total space." },
  { src: `${BASE}/group-swarm.png`, caption: "Group swarm." },
  { src: `${BASE}/drawings/J_Holo_Curve.png`, caption: "Embedded J-holomorphic curve." },
  { src: `${BASE}/drawings/Embedded_Blowup.png`, caption: "Intersecting curves on a hyperplane." },
  { src: `${BASE}/drawings/Embedded_J_holo_curve.png`, caption: "An embedded curve with marked points." },
  { src: `${BASE}/drawings/cell_complex_gluing.png`, caption: "Building a cell complex." },
  { src: `${BASE}/drawings/tangent_space_lie_group.png`, caption: "Tangent space at the identity." },
  { src: `${BASE}/drawings/derived_yoga.png`, caption: "Embedding a category into a graded category." },
  { src: `${BASE}/drawings/moduli_of_curves.png`, caption: "Moduli of curves." },
  { src: `${BASE}/drawings/handle_slide.png`, caption: "Handle slides." },
  { src: `${BASE}/drawings/finger_moves.png`, caption: "Finger moves." },
  { src: `${BASE}/drawings/QuadricChart.png`, caption: "Quadric surfaces." },
  { src: `${BASE}/drawings/sphere_bundle.png`, caption: "A family of spheres over a sphere." },
  { src: `${BASE}/sseq_colors.jpeg`, caption: "Spectral sequence." },
];

const digital: Img[] = [
  { src: `${BASE}/manifold_charts.png`, caption: "Manifold charts." },
  { src: `${BASE}/lattice.png`, caption: "Lattice." },
  { src: `${BASE}/double_complex.png`, caption: "Double complex." },
  { src: `${BASE}/korbi.png`, caption: "Korbi." },
  { src: `${BASE}/bundle_over_pn.png`, caption: "A bundle over projective space." },
  { src: `${BASE}/tangent_identity.jpeg`, caption: "Tangent at the identity." },
  { src: `${BASE}/morse_decompose.png`, caption: "Morse decomposition." },
  { src: `${BASE}/blowup_one.png`, caption: "Blowups." },
  { src: `${BASE}/tikz-twisted-sequence.jpg`, caption: "A 'twisted' long exact sequence." },
  { src: `${BASE}/tikz-lift.jpg`, caption: "Fibers of the exponential map — universal cover of S¹." },
  { src: `${BASE}/tikz-projection.jpg`, caption: "Stereographic projection from the sphere onto the plane." },
  { src: `${BASE}/SSDoubleComplexDifferentialPatternOutOfNode.jpg`, caption: "Differentials in a spectral sequence." },
  { src: `${BASE}/section_point.png`, caption: "Conic section: degenerate case of a point." },
  { src: `${BASE}/section_lines.png`, caption: "Conic section: degenerate case of two lines." },
  { src: `${BASE}/section_circle.png`, caption: "Conic section: a circle." },
  { src: `${BASE}/section_ellipse.png`, caption: "Conic section: an ellipse." },
  { src: `${BASE}/section_hyperbola.png`, caption: "Conic section: a hyperbola." },
  { src: `${BASE}/section_parabola.png`, caption: "Conic section: a parabola." },
  { src: `${BASE}/intersect-cylinder-sphere.jpg`, caption: "Intersection of a cylinder and a sphere." },
  { src: `${BASE}/cv-3dfaceplot.jpg`, caption: "3D plot of a 2D image, using pixel intensity as height." },
  { src: `${BASE}/cv-face-normals.jpg`, caption: "Dynamically generating face normals from pixel intensity." },
  { src: `${BASE}/cv-eigenfaces.jpg`, caption: "'Eigenface' SVD decomposition, sorted by singular value." },
  { src: `${BASE}/cv-segmentation.jpg`, caption: "Image segmentation for classification." },
  { src: `${BASE}/cv-matching.jpg`, caption: "Matching points via projective and epipolar geometry." },
];

const Grid = ({ images }: { images: Img[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {images.map((img) => (
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

const Gallery = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-2">Gallery</h1>
    <p className="text-muted-foreground mb-6">
      Diagrams and images I've drawn or generated for notes, papers, and talks. Click any image to open the full-resolution version.
    </p>

    <SectionHeading id="hand-drawn">Hand-Drawn</SectionHeading>
    <p className="text-sm text-muted-foreground mb-4">
      Sketches used in lecture notes and seminar talks.
    </p>
    <Grid images={handDrawn} />

    <SectionHeading id="digital">Digital</SectionHeading>
    <p className="text-sm text-muted-foreground mb-4">
      Computer-generated diagrams and figures (Sage, TikZ, and friends).
    </p>
    <Grid images={digital} />
  </AcademicLayout>
);

export default Gallery;
