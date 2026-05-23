import React, { useState } from "react";
import { BookOpen, Video, Globe, Star, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";

interface Resource {
  title: string;
  author?: string;
  type: "book" | "video" | "website";
  url?: string;
  recommended?: boolean;
  notes?: string;
}

interface Subject {
  name: string;
  id: string;
  division: "lower" | "upper" | "general" | "grad_prep";
  description?: string;
  resources: Resource[];
}

const subjects: Subject[] = [
  {
    name: "General Advice",
    id: "general-advice",
    division: "general",
    description: "What to focus on as an undergraduate math major.",
    resources: [
      {
        title: "UC Irvine: Mathematics Graduate School Resources",
        author: "UCI Math Dept",
        type: "website",
        url: "https://www.math.uci.edu/math-majors/math-grad-school-resources",
        recommended: true,
        notes: "An excellent guide to structuring your undergraduate math degree, preparing for research, and successfully applying to graduate programs."
      },
      {
        title: "Khan Academy",
        author: "Salman Khan",
        type: "website",
        url: "https://www.khanacademy.org",
        notes: "Perfect for anything lower-division. Just be sure to actually work the problems! Active participation is key."
      },
      {
        title: "MIT OpenCourseWare (OCW)",
        author: "MIT",
        type: "website",
        url: "https://ocw.mit.edu",
        recommended: true,
        notes: "The video lectures, practice problems, and exams are generally of exceptionally high quality. A foundational goldmine."
      },
      {
        title: "Math StackExchange (MSE) - Reference Requests",
        author: "Community",
        type: "website",
        url: "https://math.stackexchange.com/questions/tagged/reference-request",
        notes: "An incredible repository of textbook recommendations. Don't be afraid to consult multiple books on the same topic to see different perspectives."
      }
    ]
  },
  {
    name: "Preparing for Graduate School",
    id: "grad-prep",
    division: "grad_prep",
    description: "Resources for bridging the gap to advanced research.",
    resources: [
      {
        title: "Introduction to Higher Mathematics (Playlist)",
        author: "Bill Shillito",
        type: "video",
        url: "https://www.youtube.com/playlist?list=PLZzHxk_TPOStgPtqRZ6KzmkUQBQ8TSWVX",
        notes: "A great survey series that highlights many different areas of advanced mathematics and proof concepts."
      },
      {
        title: "All the Mathematics You Missed: But Need to Know for Graduate School",
        author: "Thomas A. Garrity",
        type: "book",
        url: "https://www.amazon.com/gp/product/0521797071",
        recommended: true,
        notes: "If you're thinking about grad school at all, read this! It provides a comprehensive roadmap of major theorems, concepts, and terminologies across mathematical subfields."
      }
    ]
  },
  {
    name: "Single Variable Calculus",
    id: "single-variable-calculus",
    division: "lower",
    resources: [
      {
        title: "Calculus: Early Transcendentals",
        author: "James Stewart",
        type: "book",
        notes: "The standard textbook covering the traditional curriculum. Good choice because of plentiful solution manuals and clear graphics."
      },
      {
        title: "Calculus",
        author: "Michael Spivak",
        type: "book",
        recommended: true,
        notes: "Exposition is more advanced, leaning closer to introductory real analysis. Excellent for an honors-level course or rigorous foundation."
      },
      {
        title: "Calculus, Vol. 1: One-Variable Calculus, with an Introduction to Linear Algebra",
        author: "Tom M. Apostol",
        type: "book",
        notes: "A highly rigorous, classic alternative to Spivak, introducing topics from a historical and linear-algebraic standpoint."
      },
      {
        title: "patrickJMT",
        author: "Patrick Jones",
        type: "video",
        url: "https://www.youtube.com/user/patrickJMT/videos",
        notes: "Superb, bite-sized video tutorials walking through how to solve specific calculus and engineering computational problems."
      },
      {
        title: "Paul's Online Notes (Calculus I & II)",
        author: "Paul Dawkins",
        type: "website",
        url: "http://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx",
        recommended: true,
        notes: "Follows the standard curriculum very closely, offering clear, comprehensive explanations with many step-by-step examples."
      }
    ]
  },
  {
    name: "Multivariable & Vector Calculus",
    id: "multivariable-vector-calculus",
    division: "lower",
    resources: [
      {
        title: "Div, Grad, Curl, and All That: An Informal Text on Vector Calculus",
        author: "H. M. Schey",
        type: "book",
        recommended: true,
        notes: "An absolute classic. While most textbooks introduce vector fields and operators in a highly formal way, this book focuses on physical intuition and geometric understanding."
      },
      {
        title: "MIT OCW: Multivariable Calculus",
        author: "Denis Auroux",
        type: "video",
        url: "https://ocw.mit.edu/courses/mathematics/18-02sc-multivariable-calculus-fall-2010/",
        recommended: true,
        notes: "Excellent recorded lectures featuring a highly geometric approach, great diagrams, and clear, visual breakdowns of vector mechanics."
      },
      {
        title: "Paul's Online Notes (Calculus III)",
        author: "Paul Dawkins",
        type: "website",
        url: "http://tutorial.math.lamar.edu/Classes/CalcIII/CalcIII.aspx",
        notes: "More fantastic, reliable reference notes from Paul focusing on 3D coordinates, vectors, and triple integration."
      }
    ]
  },
  {
    name: "Ordinary Differential Equations",
    id: "ordinary-differential-equations",
    division: "lower",
    resources: [
      {
        title: "Differential Equations and Linear Algebra",
        author: "Stephen W. Goode and Scott A. Annin",
        type: "book",
        recommended: true,
        notes: "Brilliant because it integrates linear algebra first, which makes understanding systems of linear differential equations and operators (e.g. eigenvalues/functions) immensely cleaner."
      },
      {
        title: "MIT OCW: Differential Equations",
        author: "Haynes Miller / Arthur Mattuck",
        type: "video",
        url: "https://ocw.mit.edu/courses/mathematics/18-03-differential-equations-spring-2010/index.htm",
        notes: "A physics-motivated approach to differential equations, focusing heavily on Fourier series, mechanical systems, and linear operations."
      }
    ]
  },
  {
    name: "Linear Algebra",
    id: "linear-algebra",
    division: "lower",
    resources: [
      {
        title: "Linear Algebra Done Right",
        author: "Sheldon Axler",
        type: "book",
        recommended: true,
        notes: "Pure mathematical gold. Axler avoids using determinants until the absolute end, showing the beauty of linear transformations, eigenvalues, and inner product spaces directly."
      },
      {
        title: "Differential Equations and Linear Algebra",
        author: "Stephen W. Goode and Scott A. Annin",
        type: "book",
        notes: "A highly concise reference that strikes a great balance between theory and computation. Excellent summaries of the invertible matrix theorem."
      },
      {
        title: "Elementary Linear Algebra",
        author: "Howard Anton",
        type: "book",
        notes: "Contains fantastic historical blurbs and an entire chapter devoted to real-world applications (computer graphics, PageRank, etc.)."
      },
      {
        title: "Introduction to Linear Algebra",
        author: "Gilbert Strang",
        type: "book",
        notes: "Strang's classic. Focuses heavily on the fundamental subspaces of a matrix and matrix factorizations (LU, QR, SVD)."
      },
      {
        title: "MIT OCW: Linear Algebra",
        author: "Gilbert Strang",
        type: "video",
        url: "https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/",
        notes: "A legendary lecture series. Strang's teaching style and unique intuition are a must-watch."
      },
      {
        title: "JJ's Nullspace Trick",
        author: "JJ",
        type: "video",
        url: "https://www.youtube.com/watch?v=bqBacABVCeQ",
        recommended: true,
        notes: "An exceptionally useful shortcut for finding the nullspace basis directly from a matrix's reduced row-echelon form without solving systems by hand."
      }
    ]
  },
  {
    name: "Discrete Mathematics & Proofs",
    id: "discrete-math-proofs",
    division: "lower",
    resources: [
      {
        title: "Discrete Mathematics and Its Applications",
        author: "Kenneth H. Rosen",
        type: "book",
        notes: "An encyclopedic survey covering logic, sets, relations, counting, graph theory, and basic number theory."
      },
      {
        title: "Discrete and Combinatorial Mathematics: An Applied Introduction",
        author: "Ralph P. Grimaldi",
        type: "book",
        recommended: true,
        notes: "Excellent presentation of recurrence relations, discrete math, and quantifiers."
      },
      {
        title: "An Introduction to Mathematical Reasoning: Numbers, Sets and Functions",
        author: "Peter J. Eccles",
        type: "book",
        notes: "Perfect for students transitioning from calculus to abstract math. Great emphasis on constructing proofs."
      },
      {
        title: "UC Berkeley: EECS 70 (Discrete Mathematics and Probability)",
        author: "Berkeley Faculty",
        type: "website",
        url: "http://www.eecs70.org/",
        recommended: true,
        notes: "Incredibly high-quality lecture notes and exercises covering proofs, induction, modular arithmetic, RSA, polynomials, and probability."
      },
      {
        title: "Advanced Mathematical Methods for Scientists and Engineers",
        author: "Carl M. Bender and Steven A. Orszag",
        type: "book",
        notes: "A brilliant, advanced reference for asymptotic analysis, perturbation theory, and mathematical approximations."
      },
      {
        title: "Concrete Mathematics: A Foundation for Computer Science",
        author: "Ronald L. Graham, Donald E. Knuth, and Oren Patashnik",
        type: "book",
        recommended: true,
        notes: "Covers logic, binomial coefficients, generating functions, asymptotics, and discrete structures in beautiful Knuthian detail."
      }
    ]
  },
  {
    name: "Combinatorics",
    id: "combinatorics",
    division: "upper",
    resources: [
      {
        title: "Generatingfunctionology",
        author: "Herbert S. Wilf",
        type: "book",
        url: "https://www.math.upenn.edu/~wilf/DownldGF.html",
        recommended: true,
        notes: "Freely hosted by the author. A masterclass in how to use power series to solve recurrence relations and count structures."
      },
      {
        title: "A Walk Through Combinatorics",
        author: "Miklós Bóna",
        type: "book",
        notes: "A highly readable, engaging, and comprehensive introduction to counting, graph theory, and algorithms."
      }
    ]
  },
  {
    name: "Abstract Algebra",
    id: "abstract-algebra",
    division: "upper",
    resources: [
      {
        title: "Abstract Algebra",
        author: "David S. Dummit and Richard M. Foote",
        type: "book",
        recommended: true,
        notes: "The de-facto graduate standard but highly accessible to advanced undergraduates. Serves as an invaluable encyclopedic reference."
      },
      {
        title: "Abstract Algebra",
        author: "John A. Beachy and William D. Blair",
        type: "book",
        notes: "A fantastic, gentle introductory undergraduate reference focusing on integers, modular arithmetic, groups, and rings."
      },
      {
        title: "Abstract Algebra Lecture Series",
        author: "Matthew Salomone",
        type: "video",
        url: "https://www.youtube.com/playlist?list=PLL0ATV5XYF8DTGAPKRPtYa4E8rOLcw88y",
        recommended: true,
        notes: "Incredibly well-motivated lectures. Explains structural symmetries, quotient groups, and ring theory in a highly engaging style."
      },
      {
        title: "Abstract Algebra: Harvard Lectures",
        author: "Benedict Gross",
        type: "video",
        url: "https://www.youtube.com/watch?v=VdLhQs_y_E8&list=PLelIK3uylPMGzHBuR3hLMHrYfMqWWsmx5",
        notes: "Rigorous and crystal clear lectures from Harvard's classic abstract algebra course."
      }
    ]
  },
  {
    name: "Category Theory",
    id: "category-theory",
    division: "upper",
    resources: [
      {
        title: "What is Category Theory?",
        author: "Tom LaGatta",
        type: "video",
        url: "https://www.youtube.com/watch?v=o6L6XeNdd_k",
        notes: "A wonderful introductory talk explaining universal properties, functors, and natural transformations. Look up Steve Awodey or Bartosz Milewski's playlists for deep-dives."
      }
    ]
  },
  {
    name: "Galois Theory",
    id: "galois-theory",
    division: "upper",
    resources: [
      {
        title: "Galois Theory Lectures",
        author: "Matthew Salomone",
        type: "video",
        url: "https://www.youtube.com/playlist?list=PLL0ATV5XYF8DTGAPKRPtYa4E8rOLcw88y",
        recommended: true,
        notes: "A modular portion of his algebra lectures. Brilliant pacing, showing the deep link between field extensions and group theory, leading up to the insolvability of the quintic."
      }
    ]
  },
  {
    name: "Real Analysis",
    id: "real-analysis",
    division: "upper",
    resources: [
      {
        title: "Principles of Mathematical Analysis (Baby Rudin)",
        author: "Walter Rudin",
        type: "book",
        notes: "The universal undergrad benchmark. Extremely terse and elegant. Combine with George Bergman's online commentary to make it more digestible."
      },
      {
        title: "Rudin Study Commentary & Exercises",
        author: "George Bergman",
        type: "website",
        url: "https://math.berkeley.edu/~gbergman/ug.hndts/m104_Rudin_exs.pdf",
        recommended: true,
        notes: "Invaluable reading companions that smooth over Rudin's gaps, add intuition, and correct typos."
      },
      {
        title: "Real Analysis Lectures",
        author: "Francis Su",
        type: "video",
        url: "https://www.youtube.com/playlist?list=PL0E754696F72137EC",
        recommended: true,
        notes: "Su's recorded lectures from Harvey Mudd are legendary. Incredibly clear, warm, and highly motivated geometric insights."
      }
    ]
  },
  {
    name: "Complex Analysis",
    id: "complex-analysis",
    division: "upper",
    resources: [
      {
        title: "Complex Variables and Applications",
        author: "James Ward Brown and Ruel V. Churchill",
        type: "book",
        notes: "Great undergraduate overview of residue computations, contour integrals, and conformal mapping techniques."
      },
      {
        title: "Visual Complex Analysis",
        author: "Tristan Needham",
        type: "book",
        recommended: true,
        notes: "A work of absolute genius. Needham replaces dry calculations with breathtaking geometric explanations using Möbius transformations and vector fields."
      }
    ]
  },
  {
    name: "Numerical Analysis",
    id: "numerical-analysis",
    division: "upper",
    resources: [
      {
        title: "Numerical Analysis",
        author: "Richard L. Burden and J. Douglas Faires",
        type: "book",
        notes: "Excellent coverage of root-finding, fixed point theory, spline interpolation, and numerical differentiation/integration."
      }
    ]
  },
  {
    name: "Point-Set Topology",
    id: "point-set-topology",
    division: "upper",
    resources: [
      {
        title: "Topology",
        author: "James R. Munkres",
        type: "book",
        recommended: true,
        notes: "The absolute gold standard. Extremely clear, logical, and beautifully structured. The first half is point-set topology; the second is a nice introduction to algebraic topology."
      },
      {
        title: "Introduction to Smooth Manifolds (Appendix)",
        author: "John M. Lee",
        type: "book",
        notes: "Has a magnificent, highly-compressed appendix that reviews all the necessary point-set topology definitions and properties."
      }
    ]
  },
  {
    name: "Algebraic Topology",
    id: "algebraic-topology",
    division: "upper",
    resources: [
      {
        title: "Algebraic Topology",
        author: "Allen Hatcher",
        type: "book",
        recommended: true,
        notes: "The de-facto standard. Extremely geometric, rich in illustrations, and freely hosted online by Hatcher."
      },
      {
        title: "Introduction to Algebraic Topology",
        author: "N. J. Wildberger",
        type: "video",
        url: "https://www.youtube.com/watch?v=Ap2c1dPyIVo&list=PL6763F57A61FE6FE8",
        notes: "A wonderful undergraduate introduction to homology, triangulation, and fundamental groups."
      }
    ]
  },
  {
    name: "Differential Geometry & Manifolds",
    id: "differential-geometry-manifolds",
    division: "upper",
    resources: [
      {
        title: "Calculus on Manifolds",
        author: "Michael Spivak",
        type: "book",
        notes: "An elegant, rigorous treatment of multivariable integration, differential forms, and Stokes' theorem from a modern perspective."
      },
      {
        title: "Lectures on Geometric Anatomy of Theoretical Physics",
        author: "Frederic Schuller",
        type: "video",
        url: "https://www.youtube.com/watch?v=7G4SqIboeig",
        recommended: true,
        notes: "An absolute masterpiece. Schuller delivers the most rigorous, clean, and beautifully explained lectures on differential geometry and topology available online."
      }
    ]
  },
  {
    name: "Number Theory",
    id: "number-theory",
    division: "upper",
    resources: [
      {
        title: "Fundamentals of Number Theory",
        author: "William J. LeVeque",
        type: "book",
        notes: "Very concise, classic introduction covering prime distributions, quadratic reciprocity, and Diophantine equations."
      }
    ]
  },
  {
    name: "Algebraic Geometry",
    id: "algebraic-geometry",
    division: "upper",
    resources: [
      {
        title: "Undergraduate Algebraic Geometry",
        author: "Miles Reid",
        type: "book",
        recommended: true,
        notes: "Brilliant, witty, and deeply intuitive. Weaves in rich historical context and focuses on geometric examples rather than heavy algebra."
      },
      {
        title: "Ideals, Varieties, and Algorithms",
        author: "David A. Cox, John Little, and Donal O'Shea",
        type: "book",
        recommended: true,
        notes: "An incredible introduction using computational tools. Focuses on Gröbner bases, elimination theory, and algebraic curves."
      },
      {
        title: "Using Algebraic Geometry",
        author: "David A. Cox, John Little, and Donal O'Shea",
        type: "book",
        notes: "A slightly more advanced follow-up focusing on algorithms, local rings, and projective geometries."
      }
    ]
  },
  {
    name: "Probability and Statistics",
    id: "probability-statistics",
    division: "upper",
    resources: [
      {
        title: "A First Course in Probability",
        author: "Sheldon Ross",
        type: "book",
        notes: "Excellent, problem-rich introduction to combinatorics, probability axioms, conditional probability, and distributions."
      },
      {
        title: "All of Statistics: A Concise Course in Statistical Inference",
        author: "Larry Wasserman",
        type: "book",
        recommended: true,
        notes: "Perfect for mathematically mature students. Covers a huge amount of modern statistics and machine learning concepts concisely."
      }
    ]
  },
  {
    name: "Dynamics & Chaos",
    id: "dynamics-chaos",
    division: "upper",
    resources: [
      {
        title: "Dynamics in One Complex Variable",
        author: "John Milnor",
        type: "book",
        notes: "A beautiful introduction to complex dynamical systems, Julia sets, and Mandelbrot structures."
      },
      {
        title: "Mathematical Methods of Classical Mechanics",
        author: "V. I. Arnol'd",
        type: "book",
        notes: "A mathematically advanced, deeply geometric treatment of mechanics, symplectic manifolds, and dynamics."
      },
      {
        title: "Nonlinear Dynamics and Chaos",
        author: "Steven H. Strogatz",
        type: "book",
        recommended: true,
        notes: "The best book on dynamical systems. Engagingly explains bifurcations, phase portraits, limit cycles, and strange attractors."
      },
      {
        title: "Dynamics and Bifurcations",
        author: "Jack K. Hale and Hüseyin Koçak",
        type: "book",
        notes: "A very thorough, highly geometric and computational approach to differential equations and bifurcations."
      }
    ]
  },
  {
    name: "Computer Science",
    id: "computer-science",
    division: "upper",
    resources: [
      {
        title: "Introduction to Algorithms (CLRS)",
        author: "Cormen, Leiserson, Rivest, and Stein",
        type: "book",
        notes: "The bible of algorithms. Incredibly rigorous, standard reference."
      },
      {
        title: "Introduction to the Theory of Computation",
        author: "Michael Sipser",
        type: "book",
        recommended: true,
        notes: "An absolute masterpiece of clear writing. Explains formal languages, automata, Turing machines, computability, and complexity theory in a highly readable format."
      },
      {
        title: "Cracking the Coding Interview",
        author: "Gayle Laakmann McDowell",
        type: "book",
        notes: "The standard resource for coding interview prep, data structures, and algorithmic puzzle-solving."
      }
    ]
  }
];

const ResourceIcon = ({ type }: { type: Resource["type"] }) => {
  switch (type) {
    case "book":
      return <BookOpen className="w-4 h-4 text-emerald-500" />;
    case "video":
      return <Video className="w-4 h-4 text-sky-500" />;
    case "website":
      return <Globe className="w-4 h-4 text-purple-500" />;
  }
};

const UndergradResources = () => {
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState<"all" | "lower" | "upper" | "general" | "grad_prep">("all");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const toggleNotes = (key: string) => {
    setExpandedNotes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredSubjects = subjects
    .map((sub) => {
      // Filter resources by search query
      const resources = sub.resources.filter((res) => {
        const matchesSearch =
          res.title.toLowerCase().includes(search.toLowerCase()) ||
          (res.author && res.author.toLowerCase().includes(search.toLowerCase())) ||
          (res.notes && res.notes.toLowerCase().includes(search.toLowerCase()));
        return matchesSearch;
      });

      return { ...sub, resources };
    })
    // Filter out subjects with no matching resources or wrong division
    .filter((sub) => {
      const matchesDivision = division === "all" || sub.division === division;
      return matchesDivision && sub.resources.length > 0;
    });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm space-y-4">
        <p>
          This is a curated catalog of recommendations for undergraduate mathematics. It contains textbooks, 
          video lectures, websites, and reference materials that have proven particularly valuable.
        </p>

        {/* Legend Panel */}
        <div className="rounded-lg border bg-card p-4 text-foreground/80 dark:text-foreground/90 space-y-2.5">
          <div className="font-semibold text-sm flex items-center gap-1.5 border-b pb-1.5">
            <span>Icon Legend</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>📖 Textbook</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-sky-500" />
              <span>🎥 Video / Lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-500" />
              <span>🌐 Website / Notes</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>⭐ Highly Recommended</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources by title, author, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          <button
            onClick={() => setDivision("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              division === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDivision("general")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              division === "general"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            General Advice
          </button>
          <button
            onClick={() => setDivision("grad_prep")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              division === "grad_prep"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            Grad School Prep
          </button>
          <button
            onClick={() => setDivision("lower")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              division === "lower"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            Lower Division
          </button>
          <button
            onClick={() => setDivision("upper")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              division === "upper"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            Upper Division
          </button>
        </div>
      </div>

      {/* Resources Catalog */}
      <div className="space-y-8 pt-4">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((sub) => (
            <div key={sub.id} id={sub.id} className="scroll-mt-20 space-y-4">
              <div className="border-l-4 border-primary pl-3 py-0.5">
                <h3 className="text-xl font-bold tracking-tight">{sub.name}</h3>
                {sub.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{sub.description}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {sub.resources.map((res, index) => {
                  const uniqueKey = `${sub.id}-${index}-${res.title}`;
                  const isExpanded = expandedNotes[uniqueKey] ?? false;

                  return (
                    <div
                      key={index}
                      className={`relative rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                        res.recommended
                          ? "border-amber-400/40 dark:border-amber-400/20 bg-amber-50/5 dark:bg-amber-950/5"
                          : "border-border"
                      }`}
                    >
                      {res.recommended && (
                        <div className="absolute top-2 right-2 p-1 text-amber-500 fill-amber-500" title="Highly Recommended">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {/* Title & Author */}
                        <div>
                          <div className="flex items-start gap-2 pr-6">
                            <div className="mt-1 shrink-0">
                              <ResourceIcon type={res.type} />
                            </div>
                            <div className="min-w-0">
                              {res.url ? (
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-semibold hover:text-link-hover hover:underline break-words"
                                >
                                  {res.title}
                                </a>
                              ) : (
                                <span className="text-sm font-semibold text-foreground break-words">{res.title}</span>
                              )}
                              {res.author && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  by {res.author}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {res.notes && (
                          <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                            <button
                              onClick={() => toggleNotes(uniqueKey)}
                              className="flex items-center gap-1 text-foreground/80 hover:text-foreground font-semibold text-xs mb-1.5 focus:outline-none"
                            >
                              <span>Details</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                            {isExpanded && (
                              <p className="leading-relaxed bg-accent/40 rounded p-2 text-foreground/80 dark:text-foreground/90 whitespace-pre-line border border-accent">
                                {res.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-lg border border-dashed bg-card">
            <Filter className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold text-foreground">No resources found</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search query or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UndergradResources;
