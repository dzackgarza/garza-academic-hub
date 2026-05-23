import { Link } from "react-router-dom";
import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import { Clock, FileText } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  year: number;
  date?: string;
  updatedDate?: string;
  readMinutes: number;
  excerpt?: string;
  tags?: string[];
  categories?: string[];
  legacyUrl?: string;
}

const posts: Post[] = [
  {
    slug: "krantz-mathematicians-survival-guide",
    title: "Some notes on Krantz's \"A Mathematician's Survival Guide\"",
    year: 2022,
    date: "December 31, 2022",
    updatedDate: "December 31, 2022",
    readMinutes: 16,
    excerpt: "Highlights and reflections on Krantz's guide to navigating life as a working mathematician.",
    tags: ["Advice", "Math", "Reference"],
    categories: ["Advice"],
    legacyUrl: "https://dzackgarza.com/some-notes-on-krantz-s-a-mathematician-s-survival-guide/",
  },
  {
    slug: "undergrad-resources",
    title: "Recommendations: Undergraduate Resources",
    year: 2021,
    date: "April 11, 2021",
    updatedDate: "April 11, 2021",
    readMinutes: 9,
    excerpt: "What to do as an undergraduate — books, courses, and habits that pay off.",
    tags: ["Advice", "Math", "Reference"],
    categories: ["Advice", "Resources"],
  },
  {
    slug: "derived-algebraic-geometry-1",
    title: "Intro to Derived Algebraic Geometry 1: The Cotangent Complex and Derived de Rham Cohomology",
    year: 2020,
    date: "April 5, 2020",
    readMinutes: 20,
    excerpt: "Introductory notes from an MSRI workshop series.",
    tags: ["Algebraic Geometry", "Research Notes"],
    categories: ["Mathematics", "Research"],
    legacyUrl: "https://dzackgarza.com/intro-to-derived-algebraic-geometry-1-the-cotangent-complex-and-derived-de-rham-cohomology/",
  },
  {
    slug: "introduction-to-infinity-categories",
    title: "Introduction to Infinity Categories",
    year: 2020,
    date: "March 20, 2020",
    readMinutes: 12,
    excerpt: "Notes on a short introductory video covering foundational aspects of ∞-categories.",
    tags: ["Category Theory"],
    categories: ["Mathematics"],
    legacyUrl: "https://dzackgarza.com/introductory%20notes/mathematics%20research/introduction-to-infinity-categories/",
  },
  {
    slug: "precalculus-tips-and-tricks",
    title: "How to do well in (my) Precalculus class",
    year: 2020,
    date: "February 15, 2020",
    readMinutes: 9,
    excerpt: "General student tips for getting the most out of precalc.",
    tags: ["Teaching", "Advice"],
    categories: ["Teaching", "Advice"],
    legacyUrl: "https://dzackgarza.com/advice%20and%20resources/precalculus-tips-and-tricks/",
  },
  {
    slug: "topics-for-grad-school",
    title: "Some topics to learn for graduate school in Mathematics",
    year: 2020,
    date: "January 10, 2020",
    readMinutes: 5,
    excerpt: "A short list of topics to learn before starting a math PhD.",
    tags: ["Advice"],
    categories: ["Advice"],
  },
  {
    slug: "benson-farb-surface-bundles",
    title: "Some notes on Benson Farb's talk on surface bundles, mapping class groups, moduli spaces, and cohomology",
    year: 2020,
    date: "January 5, 2020",
    readMinutes: 15,
    excerpt: "Partial transcription and accompanying notes from Farb's lecture.",
    tags: ["Topology", "Research Notes"],
    categories: ["Mathematics", "Research"],
  },
  {
    slug: "undergrad-advice",
    title: "Advice for Undergraduates in Mathematics",
    year: 2020,
    date: "January 3, 2020",
    readMinutes: 8,
    excerpt: "Pointers to other pages with great advice for undergraduate math majors.",
    tags: ["Advice"],
    categories: ["Advice"],
  },
  {
    slug: "grad-recommendations",
    title: "Recommendations: Graduate Level Texts and Notes",
    year: 2020,
    date: "January 2, 2020",
    readMinutes: 5,
    excerpt: "Texts and lecture notes I've found useful in graduate school.",
    tags: ["Resources"],
    categories: ["Resources"],
  },
  {
    slug: "latex-handwriting-worksheets",
    title: "LaTeX Handwriting Practice Worksheets",
    year: 2020,
    date: "January 1, 2020",
    readMinutes: 1,
    excerpt: "Ever had trouble writing ξ? Practice worksheets for forming mathematical symbols by hand.",
    tags: ["LaTeX", "Resources"],
    categories: ["Resources"],
  },
  {
    slug: "moments-and-center-of-mass",
    title: "Moments and Center of Mass",
    year: 2019,
    date: "November 15, 2019",
    readMinutes: 1,
    excerpt: "A short writeup from UGA's teaching training course covering a multivariable calculus topic.",
    tags: ["Teaching"],
    categories: ["Teaching"],
  },
  {
    slug: "research-workflow",
    title: "Research Workflow",
    year: 2019,
    date: "October 12, 2019",
    readMinutes: 12,
    excerpt: "Notes from two quarters of undergraduate research — tools and habits I'd carry forward.",
    tags: ["Workflow"],
    categories: ["Workflow"],
  },
  {
    slug: "brief-intro-to-category-theory",
    title: "A Brief Introduction to Category Theory",
    year: 2017,
    date: "July 24, 2017",
    readMinutes: 28,
    excerpt: "A short introduction to category theory with concrete examples.",
    tags: ["Category Theory"],
    categories: ["Mathematics"],
  },
  {
    slug: "haskell-dev-environment",
    title: "Setting Up a Haskell Dev Environment",
    year: 2015,
    date: "May 10, 2015",
    readMinutes: 7,
    excerpt: "Notes on packages and tools for getting started with Haskell.",
    tags: ["Tools"],
    categories: ["Tools"],
  },
];

const byYear = posts.reduce<Record<number, Post[]>>((acc, p) => {
  (acc[p.year] ??= []).push(p);
  return acc;
}, {});

const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

const Blog = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-2">Blog</h1>
    <p className="text-muted-foreground mb-6">
      Posts on mathematics, advice, tools, and the occasional rant. Older entries are imported from{" "}
      <a href="https://dzackgarza.com/year-archive/" target="_blank" rel="noopener noreferrer">the archive</a>{" "}
      and may link out to the original site.
    </p>

    {years.map((year) => (
      <div key={year} className="mb-8">
        <SectionHeading id={`y-${year}`}>{year}</SectionHeading>
        <ul className="space-y-3">
          {byYear[year].map((p) => (
            <li key={p.slug} className="rounded-lg border bg-card p-4 flex gap-3">
              <div className="mt-0.5 rounded-md bg-accent p-2 shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/blog/${p.slug}`} className="text-sm font-semibold hover:text-link-hover">
                  {p.title}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{p.readMinutes} min read</span>
                  {p.tags && p.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{p.tags.join(", ")}</span>
                    </>
                  )}
                </div>
                {p.excerpt && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.excerpt}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </AcademicLayout>
);

export { posts as blogPosts };
export type { Post as BlogPost };
export default Blog;
