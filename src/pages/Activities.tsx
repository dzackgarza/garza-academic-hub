import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import { ExternalLink } from "lucide-react";

interface Entry {
  date: string;
  role?: string;
  title: string;
  href?: string;
  venue?: string;
  links?: { label: string; href: string }[];
}

const conferences: Entry[] = [
  { date: "11/2021", role: "Invited Participant", title: "MSRI Chern–Simons and Other Topological Field Theories", href: "https://www.msri.org/workshops/1026", links: [{ label: "Notes (PDF)", href: "https://dzackgarza.com/assets/pdfs/transcribed_notes/MSRI_2021_ChernSimons.pdf" }] },
  { date: "07/2021", role: "Participant", title: "IAS/PCMI Graduate Summer School on Motivic Homotopy", href: "https://www.ias.edu/pcmi/2021-graduate-summer-school-course-descriptions", links: [
    { label: "Notes (PDF)", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Summer/PCMI/6_Combined/Combined_Talks.pdf" },
    { label: "Notes (HTML)", href: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Summer/PCMI/6_Combined/Combined_Talks.html" },
  ] },
  { date: "06/2021", role: "Participant / Note-Taker", title: "MIT Talbot Workshop: Viva Talbot!", href: "https://math.mit.edu/events/talbot/", links: [
    { label: "Hahn — Ring Spectra (PDF)", href: "https://dzackgarza.com/assets/pdfs/transcribed_notes/Talbot_2021__Methods_and_mysteries_in_the_construction_of_ring_spectra.pdf" },
    { label: "Moulinos — Nonabelian Hodge (PDF)", href: "https://dzackgarza.com/assets/pdfs/transcribed_notes/Talbot_2021__Perspectives_on_non_abelian_Hodge_theory.pdf" },
  ] },
  { date: "09/2019", role: "Participant", title: "Mid-Atlantic Topology Seminar", href: "https://math.virginia.edu/2019/09/mid-atlantic-topology-seminar-2019/", links: [{ label: "Twitter thread overview", href: "https://threadreaderapp.com/thread/1188848212767137793.html" }] },
  { date: "05/2019", role: "Participant", title: "Georgia Topology Conference", href: "https://research.franklin.uga.edu/topology/2019GTC" },
  { date: "05/2019", role: "Participant", title: "Graduate Student Conference in Algebra, Geometry, and Topology", venue: "Temple University", href: "https://math.temple.edu/events/conferences/gscagt/" },
  { date: "04/2019", role: "Participant", title: "Redbud Topology Conference", venue: "University of Oklahoma", href: "https://www.math.ou.edu/conferences/redbud/spring-2019/" },
  { date: "04/2019", role: "Participant", title: "Geometry Festival", venue: "University of Maryland", href: "https://www-math.umd.edu/geomfest2019.html", links: [{ label: "Notes (PDF)", href: "https://dzackgarza.com/assets/pdfs/conferences/UMD%20Geometry%20Festival%20Summary.pdf" }] },
  { date: "03/2019", role: "Participant", title: "Arizona Winter School: Topology and Arithmetic", venue: "University of Arizona", href: "http://swc.math.arizona.edu/", links: [{ label: "Notes (PDF, WIP)", href: "https://dzackgarza.com/assets/pdfs/AWS2019_Notes.pdf" }] },
  { date: "01/2019", role: "Participant", title: "Complex Algebraic Geometry Conference", venue: "UC San Diego", href: "https://sites.google.com/site/complexalgebraicgeometry2019/", links: [{ label: "Notes (PDF)", href: "https://dzackgarza.com/_pages/UCSD-Algebraic-Geometry-Conference-2019.html" }] },
  { date: "06/2018", role: "Participant", title: "Witt Vectors, Deformations, and Absolute Geometry", venue: "University of Vermont", href: "https://www.uvm.edu/~tdupuy/witt2018.html" },
  { date: "03/2018", role: "Participant", title: "Latinx in the Mathematical Sciences Conference", venue: "IPAM", href: "https://www.ipam.ucla.edu/programs/special-events-and-conferences/latinx-in-the-mathematical-sciences-conference-2018/?tab=overview" },
];

interface ServiceGroup {
  heading: string;
  items: { term: string; description: string; href?: string; sub?: { label: string; href: string }[] }[];
}

const service: ServiceGroup[] = [
  {
    heading: "Mentoring — Directed Reading Program (UGA)",
    items: [
      { term: "Fall 2021", description: "Mentor — Diophantine geometry, introductory algebraic number theory." },
      { term: "Summer 2021", description: "Mentor — L-functions, complex analysis, the prime number theorem." },
    ],
  },
  {
    heading: "Conference & Seminar Organization",
    items: [
      { term: "Fall 2021", description: "Co-Organizer, UGA Graduate Student Seminar." },
      { term: "Summer 2021", description: "Organizer, GOSS (Graduate Online Seminar Series).", href: "https://dzackgarza.com/GOSS/2021/" },
      { term: "Summer 2021", description: "Co-Organizer, Mock AMS (UGA).", href: "https://dzackgarza.com/UGA_MockAMS/2021/" },
      { term: "Summer 2020", description: "Co-Organizer, Graduate Online Anything Topology and Geometry Series (GOATS), with Sarah Blackwell.", href: "https://dzackgarza.com/GOATS_2020", sub: [
        { label: "GOATS 3", href: "https://dzackgarza.com/GOATS/2020/July/" },
        { label: "GOATS 2", href: "https://dzackgarza.com/GOATS/2020/June/" },
        { label: "GOATS 1", href: "https://dzackgarza.com/GOATS/2020/April/" },
      ] },
    ],
  },
  {
    heading: "Qualifying Exam Review",
    items: [
      { term: "Summer 2021", description: "Organizer — Algebra, Real Analysis, Complex Analysis, Algebraic Topology (UGA).", href: "https://dzackgarza.com/quals" },
      { term: "Spring 2021", description: "Organizer — Algebra and Real Analysis (UGA)." },
    ],
  },
  {
    heading: "Undergraduate",
    items: [
      { term: "2017–2018", description: "President, The Society of Undergraduate Mathematics Students (UCSD).", href: "http://sums.ucsd.edu/" },
    ],
  },
];

interface Coursework {
  year: string;
  terms: { season: string; courses: { title: string; instructor?: string; notesHref?: string }[] }[];
}

const coursework: Coursework[] = [
  {
    year: "2021",
    terms: [
      { season: "Fall", courses: [
        { title: "Characteristic Classes", instructor: "Akram Alishahi" },
        { title: "Schemes", instructor: "Phil Engel" },
        { title: "Rational Points", instructor: "Daniel Litt" },
        { title: "Flag Varieties, Equivariant Cohomology, and K-Theory", instructor: "Scott Larson" },
        { title: "Additive Combinatorics", instructor: "Akos Magyar" },
        { title: "Stochastic Processes" },
      ] },
      { season: "Summer", courses: [{ title: "Modular Forms (minicourse)", instructor: "Akos Magyar" }] },
      { season: "Spring", courses: [
        { title: "Homological Algebra", instructor: "Brian Boe", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/HomologicalAlgebra/HomologicalAlgebra.pdf" },
        { title: "4-Manifolds", instructor: "Philip Engel", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/FourManifolds/FourManifolds.pdf" },
        { title: "Floer Homology", instructor: "Akram Alishahi", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/FloerHomology/FloerHomology.pdf" },
        { title: "Algebraic Number Theory", instructor: "Paul Pollack", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2021/Spring/NumberTheory/NumberTheory.pdf" },
      ] },
    ],
  },
  {
    year: "2020",
    terms: [
      { season: "Fall", courses: [
        { title: "Algebraic Curves", instructor: "Pete Clark", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Curves/AlgebraicCurves.pdf" },
        { title: "Algebraic Geometry", instructor: "Philip Engel", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Geometry/AlgebraicGeometry.pdf" },
        { title: "Algebraic Groups", instructor: "Dan Nakano", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Fall/Algebraic%20Groups/AlgebraicGroups.pdf" },
        { title: "Smooth Manifolds", instructor: "David Gay" },
      ] },
      { season: "Summer", courses: [
        { title: "Link Invariants, Categorification and Algebraic Geometry", instructor: "Arik Wilbert", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Summer/Categorification/Categorification.pdf" },
        { title: "Lee's Introduction to Smooth Manifolds (reading)", instructor: "Mike Usher", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Summer/LeeManifolds/Manifolds.pdf" },
        { title: "Fourier Analysis and Number Theory", instructor: "Brandon Hanson" },
      ] },
      { season: "Spring", courses: [
        { title: "Commutative Algebra", instructor: "Pete Clark", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Commutative%20Algebra/Commutative_Algebra_Notes.pdf" },
        { title: "Category O", instructor: "Brian Boe", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/CategoryO/CategoryO.pdf" },
        { title: "Complex Analysis", instructor: "Jingzhi Tie", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Complex%20Analysis/ComplexAnalysis.pdf" },
        { title: "Moduli Spaces", instructor: "Ben Bakker", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Moduli%20Spaces/ModuliSpaces.pdf" },
        { title: "Elliptic Curves", instructor: "Pete Clark", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/EllipticCurves/FullNotes.pdf" },
        { title: "Morse Theory (partial)", instructor: "Akram Alishahi", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2020/Spring/Morse%20Theory/FullNotes.pdf" },
      ] },
    ],
  },
  {
    year: "2019",
    terms: [
      { season: "Fall", courses: [
        { title: "Abstract Algebra", instructor: "Daniel Nakano", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2019/Algebra/Algebra.pdf" },
        { title: "Real Analysis", instructor: "Neil Lyall", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2019/Real%20Analysis/CourseNotes.pdf" },
        { title: "Lie Algebras", instructor: "Chun-Ju Lai", notesHref: "https://dzackgarza.com/rawnotes/Class_Notes/2019/Lie%20Algebras/CourseNotes.pdf" },
        { title: "Differential Topology", instructor: "Weiwei Wu" },
      ] },
    ],
  },
];

const EntryRow = ({ e }: { e: Entry }) => (
  <li className="border-l-2 border-border pl-4 py-2">
    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {e.date}
      {e.role ? ` • ${e.role}` : ""}
      {e.venue ? ` • ${e.venue}` : ""}
    </div>
    <div className="text-sm font-medium mt-0.5">
      {e.href ? (
        <a href={e.href} target="_blank" rel="noopener noreferrer" className="hover:text-link-hover">{e.title}</a>
      ) : (
        e.title
      )}
    </div>
    {e.links && e.links.length > 0 && (
      <div className="flex flex-wrap gap-3 mt-1">
        {e.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-link-hover">
            <ExternalLink className="w-3 h-3" /> {l.label}
          </a>
        ))}
      </div>
    )}
  </li>
);

const Activities = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-2">Activities</h1>
    <p className="text-muted-foreground mb-6">
      Conferences, workshops, service, and graduate coursework.
    </p>

    <SectionHeading id="conferences">Conferences & Workshops</SectionHeading>
    <ul className="space-y-1 mb-8">{conferences.map((e, i) => <EntryRow key={i} e={e} />)}</ul>

    <SectionHeading id="service">Service</SectionHeading>
    <div className="space-y-6 mb-8">
      {service.map((g) => (
        <div key={g.heading}>
          <h3 className="text-sm font-semibold mb-2">{g.heading}</h3>
          <ul className="space-y-1">
            {g.items.map((it, idx) => (
              <li key={idx} className="border-l-2 border-border pl-4 py-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{it.term}</div>
                <div className="text-sm mt-0.5">
                  {it.href ? <a href={it.href} target="_blank" rel="noopener noreferrer" className="hover:text-link-hover">{it.description}</a> : it.description}
                </div>
                {it.sub && (
                  <div className="flex flex-wrap gap-3 mt-1">
                    {it.sub.map((s) => (
                      <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-link-hover">
                        <ExternalLink className="w-3 h-3" /> {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <SectionHeading id="coursework">Graduate Coursework</SectionHeading>
    <div className="space-y-6">
      {coursework.map((y) => (
        <div key={y.year}>
          <h3 className="text-sm font-semibold mb-2">{y.year}</h3>
          <div className="space-y-3">
            {y.terms.map((t) => (
              <div key={t.season} className="rounded-lg border bg-card p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">{t.season}</div>
                <ul className="space-y-1.5">
                  {t.courses.map((c, ci) => (
                    <li key={ci} className="text-sm">
                      <span className="font-medium">{c.title}</span>
                      {c.instructor && <span className="text-muted-foreground"> — {c.instructor}</span>}
                      {c.notesHref && (
                        <>
                          {" "}
                          <a href={c.notesHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-link-hover ml-1">
                            <ExternalLink className="w-3 h-3" /> notes
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </AcademicLayout>
);

export default Activities;
