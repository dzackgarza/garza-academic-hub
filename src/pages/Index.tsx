import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import CardGrid from "@/components/CardGrid";
import type { AcademicCardProps } from "@/components/AcademicCard";

const papers: AcademicCardProps[] = [
  {
    title: "Compact moduli of Enriques surfaces with a numerical polarization of degree 2",
    subtitle: "arxiv 2312.03638",
    description: "Joint work with Valery Alexeev, Phil Engel, and Luca Schaffler.",
    icon: "paper",
    tags: ["Algebraic Geometry", "Moduli Spaces"],
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2312.03638" },
      { label: "Slides (PDF)", href: "#" },
    ],
  },
];

const talks: AcademicCardProps[] = [
  {
    title: "A∞-Categories, Toward a Definition of the Fukaya Category",
    subtitle: "UGA Symplectic Reading Seminar, September 2022",
    icon: "talk",
    links: [{ label: "Slides (PDF)", href: "#" }],
  },
  {
    title: "Faltings' proof of the Mordell conjecture",
    subtitle: "UGA Reading Group, July 2022",
    icon: "talk",
    links: [{ label: "Slides (PDF)", href: "#" }],
  },
  {
    title: "Annihilator of the Lefschetz Motive",
    subtitle: "MIT Talbot Workshop, June 2022",
    icon: "talk",
    links: [{ label: "Typeset Notes (PDF)", href: "#" }],
  },
  {
    title: "Why Derived Geometry?",
    subtitle: "UGA GSS, February 2022",
    icon: "talk",
    links: [{ label: "Slides (PDF)", href: "#" }],
  },
];

const notes: AcademicCardProps[] = [
  { title: "K3 Surfaces", subtitle: "Phil Engel, Spring 2023", icon: "notes", tags: ["Algebraic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2023/Spring/k3surfaces/k3surfaces.pdf" }] },
  { title: "Hochschild Homology", subtitle: "Tekin Karadag, Spring 2023", icon: "notes", tags: ["Algebra"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2023/Spring/hochschild/hochschild.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2023/Spring/hochschild/hochschild.html" }] },
  { title: "Lie Algebras", subtitle: "Brian Boe, Fall 2022", icon: "notes", tags: ["Representation Theory"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Fall/LieAlgebras/LieAlgebraF22.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Fall/LieAlgebras/LieAlgebraF22.html" }] },
  { title: "Moduli: GIT", subtitle: "Valery Alexeev, Fall 2022", icon: "notes", tags: ["Algebraic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Fall/Moduli/Moduli.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Fall/Moduli/Moduli.html" }] },
  { title: "Cohomology in Representation Theory", subtitle: "Dan Nakano, Spring 2022", icon: "notes", tags: ["Representation Theory"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Spring/CohomologyRepTheory/CohomologyRepTheory.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Spring/CohomologyRepTheory/CohomologyRepTheory.html" }] },
  { title: "Commutative Algebra", subtitle: "Daniel Litt, Spring 2022", icon: "notes", tags: ["Algebra"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Spring/CommutativeAlgebra/CommutativeAlgebra.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Spring/CommutativeAlgebra/CommutativeAlgebra.html" }] },
  { title: "Sheaf Cohomology", subtitle: "Valery Alexeev, Spring 2022", icon: "notes", tags: ["Algebraic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Spring/SheafCohomology/SheafCohomology.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Spring/SheafCohomology/SheafCohomology.html" }] },
  { title: "Contact Topology", subtitle: "Peter Lambert Colne, Spring 2022", icon: "notes", tags: ["Topology"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Spring/ContactTopology/Contact.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2022/Spring/ContactTopology/Contact.html" }] },
  { title: "Schemes", subtitle: "Phil Engel, Fall 2021", icon: "notes", tags: ["Algebraic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Fall/Schemes/Schemes.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Fall/Schemes/Schemes.html" }] },
  { title: "Rational Points", subtitle: "Daniel Litt, Fall 2021", icon: "notes", tags: ["Arithmetic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Fall/RationalPoints/RationalPoints.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Fall/RationalPoints/RationalPoints.html" }] },
  { title: "Characteristic Classes", subtitle: "Akram Alishahi, Fall 2021", icon: "notes", tags: ["Topology"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Fall/CharacteristicClasses/CharacteristicClasses.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Fall/CharacteristicClasses/CharacteristicClasses.html" }] },
  { title: "Flag Varieties, Equivariant Cohomology, and K-Theory", subtitle: "Scott Larson, Fall 2021", icon: "notes", tags: ["Representation Theory"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Fall/FlagVarieties/FlagVarieties.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Fall/FlagVarieties/FlagVarieties.html" }] },
  { title: "Homological Algebra", subtitle: "Brian Boe, Spring 2021", icon: "notes", tags: ["Algebra"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/HomologicalAlgebra/HomologicalAlgebra.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/HomologicalAlgebra/HomologicalAlgebra.html" }] },
  { title: "Floer Homology", subtitle: "Akram Alishahi, Spring 2021", icon: "notes", tags: ["Topology"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/FloerHomology/FloerHomology.pdf" }] },
  { title: "Algebraic Number Theory", subtitle: "Paul Pollack, Spring 2021", icon: "notes", tags: ["Number Theory"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/NumberTheory/NumberTheory.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/NumberTheory/NumberTheory.html" }] },
  { title: "4-Manifolds and Algebraic Surfaces", subtitle: "Phil Engel, Spring 2021", icon: "notes", tags: ["Topology"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/FourManifolds/FourManifolds.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/FourManifolds/FourManifolds.html" }] },
  { title: "Galois Cohomology and Class Field Theory", subtitle: "Pete Clark, Spring 2021", icon: "notes", tags: ["Number Theory"], links: [{ label: "Read More", href: "https://dzackgarza.com/writing" }] },
  { title: "Algebraic Groups", subtitle: "Dan Nakano, Fall 2020", icon: "notes", tags: ["Representation Theory"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Groups/AlgebraicGroups.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Groups/AlgebraicGroups.html" }] },
  { title: "Varieties", subtitle: "Philip Engel, Fall 2020", icon: "notes", tags: ["Algebraic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Geometry/AlgebraicGeometry.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Geometry/AlgebraicGeometry.html" }] },
  { title: "Algebraic Curves", subtitle: "Pete Clark, Fall 2020", icon: "notes", tags: ["Arithmetic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Curves/AlgebraicCurves.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Curves/AlgebraicCurves.html" }] },
  { title: "Étale Cohomology", subtitle: "Daniel Litt, Fall 2020", icon: "notes", tags: ["Arithmetic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Etale%20Cohomology/EtaleCohomology.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Etale%20Cohomology/EtaleCohomology.html" }] },
  { title: "Categorification", subtitle: "Arik Wilbert, Summer 2020", icon: "notes", tags: ["Representation Theory"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Summer/Categorification/Categorification.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Summer/Categorification/Categorification.html" }] },
  { title: "Category O", subtitle: "Brian Boe, Spring 2020", icon: "notes", tags: ["Representation Theory"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/CategoryO/CategoryO.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/CategoryO/CategoryO.html" }] },
  { title: "Commutative Algebra", subtitle: "Pete Clark, Spring 2020", icon: "notes", tags: ["Algebra"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Commutative%20Algebra/Commutative_Algebra_Notes.pdf" }] },
  { title: "Moduli: Deformations", subtitle: "Ben Bakker, Spring 2020", icon: "notes", tags: ["Algebraic Geometry"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Moduli%20Spaces/ModuliSpaces.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Moduli%20Spaces/ModuliSpaces.html" }] },
  { title: "Morse Theory", subtitle: "Akram Alishahi, Spring 2020", icon: "notes", tags: ["Topology"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Morse%20Theory/FullNotes.pdf" }] },
  { title: "Complex Analysis", subtitle: "Jingzhi Tie, Spring 2020", icon: "notes", tags: ["Analysis"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Complex%20Analysis/ComplexAnalysis.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Complex%20Analysis/ComplexAnalysis.html" }] },
  { title: "Abstract Algebra", subtitle: "Dan Nakano, Fall 2019", icon: "notes", tags: ["Algebra"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2019/Algebra/Algebra.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/2019/Algebra/Algebra.html" }] },
  { title: "Lie Algebras", subtitle: "Chun-Ju Lai, Fall 2019", icon: "notes", tags: ["Representation Theory"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2019/Lie%20Algebras/CourseNotes.pdf" }] },
  { title: "Real Analysis", subtitle: "Neil Lyall, Fall 2019", icon: "notes", tags: ["Analysis"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/2019/Real%20Analysis/CourseNotes.pdf" }] },
  { title: "Algebraic Topology", subtitle: "Justin Roberts, 2017–2018", icon: "notes", tags: ["Topology"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/Independent/Algebraic%20Topology/Algebraic_Topology.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/Independent/Algebraic%20Topology/Algebraic_Topology.html" }] },
  { title: "Smooth Manifolds", subtitle: "Notes on Lee's Smooth Manifolds", icon: "notes", tags: ["Topology"], links: [{ label: "PDF", href: "https://dzackgarza.com/rawnotes/Class_Notes/Independent/LeeManifolds/Manifolds.pdf" }, { label: "HTML", href: "https://dzackgarza.com/rawnotes/Class_Notes/Independent/LeeManifolds/Manifolds.html" }] },
];


const Index = () => {
  return (
    <AcademicLayout>
      <p className="text-base leading-relaxed mb-4">
        As of the 2024-2025 academic year, I am a 6th year graduate student at the University of Georgia working in algebraic geometry with{" "}
        <a href="https://faculty.franklin.uga.edu/valery/" target="_blank" rel="noopener noreferrer">Valery Alexeev</a>.
        {" "}I am currently thinking about KSBA and semitoroidal compactifications of moduli spaces of Enriques and Coble surfaces.
      </p>

      <div className="callout mb-6">
        You can find my CV <a href="#">here</a> and preprints of my papers on <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer">Arxiv</a>.
      </div>

      <SectionHeading id="research">Research</SectionHeading>
      <CardGrid items={papers} columns={2} />

      <SectionHeading id="talks">Talks</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">A selection of recent talks — find more on the talks page.</p>
      <CardGrid items={talks} columns={3} />

      <SectionHeading id="notes">Recent Notes</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">Scroll to browse all {notes.length} notes — or visit the writing page.</p>
      <div className="max-h-[42rem] overflow-y-auto pr-2 rounded-lg border bg-muted/20 p-3">
        <CardGrid items={notes} columns={3} />
      </div>
    </AcademicLayout>
  );
};

export default Index;
