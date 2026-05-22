import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import { GraduationCap, ExternalLink } from "lucide-react";

interface Course {
  term: string;
  role: string;
  number: string;
  title: string;
  catalogHref: string;
  siteHref: string;
  sections?: string;
}

const current: Course[] = [
  {
    term: "Fall 2023",
    role: "Instructor of Record",
    number: "MATH 1113",
    title: "Precalculus",
    catalogHref: "https://www.math.uga.edu/1113",
    siteHref: "https://dzackgarza.com/courses/2023/Fall/1113/",
  },
];

const past: Course[] = [
  { term: "Fall 2022", role: "Instructor of Record", number: "MATH 1113", title: "Precalculus", catalogHref: "https://www.math.uga.edu/1113", siteHref: "https://dzackgarza.com/courses/2022/Fall/1113/" },
  { term: "Spring 2022", role: "Instructor of Record", number: "MATH 2250", title: "Calculus I for Science & Engineering", catalogHref: "https://www.math.uga.edu/2250", siteHref: "https://dzackgarza.com/courses/2022/Spring/2250/" },
  { term: "Fall 2021", role: "Instructor of Record", number: "MATH 2250", title: "Calculus I for Science & Engineering", catalogHref: "https://www.math.uga.edu/2250", siteHref: "https://dzackgarza.com/courses/2021/Fall/2250/", sections: "1 section" },
  { term: "Spring 2021", role: "Instructor of Record", number: "MATH 1113", title: "Precalculus", catalogHref: "https://www.math.uga.edu/1113", siteHref: "https://dzackgarza.com/courses/2021/Spring/1113/", sections: "2 sections" },
  { term: "Fall 2020", role: "Instructor of Record", number: "MATH 1113", title: "Precalculus", catalogHref: "https://www.math.uga.edu/1113", siteHref: "https://dzackgarza.com/courses/2020/1113" },
  { term: "Fall 2019", role: "Recitation Leader", number: "MATH 2200", title: "Analytic Geometry & Calculus", catalogHref: "http://www.bulletin.uga.edu/CoursesHome.aspx?cid=861", siteHref: "https://dzackgarza.com/courses/2019/2200" },
];

const CourseRow = ({ c }: { c: Course }) => (
  <li className="rounded-lg border bg-card p-4 flex flex-col sm:flex-row sm:items-start gap-3">
    <div className="mt-0.5 rounded-md bg-accent p-2 shrink-0">
      <GraduationCap className="w-4 h-4 text-primary" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.term}</span>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">{c.role}</span>
        {c.sections && (
          <>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{c.sections}</span>
          </>
        )}
      </div>
      <h3 className="text-sm font-semibold mt-1">
        <a href={c.catalogHref} target="_blank" rel="noopener noreferrer" className="hover:text-link-hover">
          {c.number}: {c.title}
        </a>
      </h3>
      <a
        href={c.siteHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-link-hover"
      >
        <ExternalLink className="w-3 h-3" /> Course website
      </a>
    </div>
  </li>
);

const Teaching = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-2">Teaching</h1>
    <p className="text-muted-foreground mb-6">
      Courses taught at the University of Georgia. Each course site has the syllabus, lecture notes, and worked examples.
    </p>

    <SectionHeading id="current">Current Courses</SectionHeading>
    <ul className="space-y-3 mb-8">
      {current.map((c) => <CourseRow key={c.siteHref} c={c} />)}
    </ul>

    <SectionHeading id="past">Past Courses</SectionHeading>
    <ul className="space-y-3">
      {past.map((c) => <CourseRow key={c.siteHref} c={c} />)}
    </ul>
  </AcademicLayout>
);

export default Teaching;
