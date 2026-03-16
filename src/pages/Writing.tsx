import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import CardGrid from "@/components/CardGrid";
import type { AcademicCardProps } from "@/components/AcademicCard";

const courseNotes: AcademicCardProps[] = [
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
];

const workshopNotes: AcademicCardProps[] = [
  {
    title: "Scissors Congruence and Algebraic K-Theory",
    subtitle: "Talbot 2022 Proceedings",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }],
  },
  {
    title: "Algebraic Cycles, Strings and Amplitudes",
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
    title: "Chern-Simons and Other TFTs",
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
];

const exercises: AcademicCardProps[] = [
  {
    title: "Exercises from Hartshorne",
    subtitle: "All exercises compiled into a single document",
    icon: "notes",
    links: [{ label: "PDF", href: "#" }],
  },
];

const Writing = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-6">Writing</h1>
    <p className="text-muted-foreground mb-6">Course notes, workshop proceedings, and exercise solutions.</p>

    <SectionHeading id="course-notes">Course Notes</SectionHeading>
    <CardGrid items={courseNotes} columns={2} />

    <SectionHeading id="workshop-notes">Workshop & Conference Notes</SectionHeading>
    <CardGrid items={workshopNotes} columns={3} />

    <SectionHeading id="exercises">Exercises</SectionHeading>
    <CardGrid items={exercises} columns={2} />
  </AcademicLayout>
);

export default Writing;
