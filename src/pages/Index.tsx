import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import CardGrid from "@/components/CardGrid";
import CardScroller from "@/components/CardScroller";
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
  {
    title: "Exercises from Hartshorne",
    subtitle: "Compiled into a single document",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }],
  },
  {
    title: "K3 Surfaces",
    subtitle: "Phil Engel, Spring 2023",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }, { label: "HTML", href: "#" }],
  },
  {
    title: "Hochschild Homology",
    subtitle: "Tekin Karadag, Spring 2023",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }, { label: "HTML", href: "#" }],
  },
  {
    title: "Lie Algebras",
    subtitle: "Brian Boe, Fall 2022",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }, { label: "HTML", href: "#" }],
  },
  {
    title: "Moduli Spaces",
    subtitle: "Valery Alexeev, Fall 2022",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }, { label: "HTML", href: "#" }],
  },
  {
    title: "Scissors Congruence and Algebraic K-Theory",
    subtitle: "Talbot 2022 Proceedings (w/ Maxine Calle)",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }],
  },
  {
    title: "Mathematical Physics: Algebraic Cycles, Strings and Amplitudes",
    subtitle: "INI Workshop, July 2022",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }, { label: "HTML", href: "#" }],
  },
  {
    title: "ADDING Conference at UGA",
    subtitle: "May 2022",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }, { label: "HTML", href: "#" }],
  },
  {
    title: "Automorphic Forms Beyond GL₂",
    subtitle: "Arizona Winter School 2022",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }, { label: "HTML", href: "#" }],
  },
  {
    title: "Chern-Simons and Other Topological Field Theories",
    subtitle: "MSRI Workshop, November 2021",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }],
  },
  {
    title: "Motivic Homotopy",
    subtitle: "IAS/PCMI Graduate Summer School",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }, { label: "HTML", href: "#" }],
  },
  {
    title: "Methods and Mysteries in the Construction of Ring Spectra",
    subtitle: "Jeremy Hahn — MIT Talbot Workshop",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }],
  },
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
      <p className="text-sm text-muted-foreground mb-3">Scroll to browse — find more on the talks page.</p>
      <CardScroller items={talks} />

      <SectionHeading id="notes">Recent Notes</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">Scroll to browse — find many more on the writing page.</p>
      <CardScroller items={notes} />
    </AcademicLayout>
  );
};

export default Index;
