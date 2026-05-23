import { Link, useParams } from "react-router-dom";
import AcademicLayout from "@/components/AcademicLayout";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Calendar, Tag, BookOpen, ChevronRight } from "lucide-react";
import { blogPosts } from "./Blog";
import UndergradResources from "@/content/blog/undergrad-resources";
import KrantzGuide from "@/content/blog/krantz-guide";

const getPostCoverImage = (slug: string) => {
  const themes: Record<string, { gradient: string; overlay: React.ReactNode }> = {
    "krantz-mathematicians-survival-guide": {
      gradient: "from-slate-900 via-indigo-950 to-slate-900",
      overlay: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-krantz" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-krantz)" />
          <circle cx="50%" cy="50%" r="40" fill="none" stroke="rgba(251, 191, 36, 0.5)" strokeWidth="1" />
          <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="0.5" />
          <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="0.5" />
        </svg>
      )
    },
    "undergrad-resources": {
      gradient: "from-teal-950 via-emerald-900 to-slate-950",
      overlay: (
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 Q 30 60, 60 30 T 120 30 T 180 30 T 240 30" fill="none" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1.5" />
          <path d="M0 50 Q 40 20, 80 50 T 160 50 T 240 50" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
          <circle cx="80%" cy="30%" r="15" fill="none" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1" />
        </svg>
      )
    },
    "derived-algebraic-geometry-1": {
      gradient: "from-purple-950 via-fuchsia-900 to-slate-950",
      overlay: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50%" cy="50%" rx="60" ry="35" fill="none" stroke="rgba(244, 63, 94, 0.5)" strokeWidth="1" transform="rotate(-15 120 45)" />
          <ellipse cx="50%" cy="50%" rx="40" ry="20" fill="none" stroke="rgba(244, 63, 94, 0.3)" strokeWidth="0.8" transform="rotate(-15 120 45)" />
          <circle cx="50%" cy="50%" r="4" fill="rgba(244, 63, 94, 0.7)" />
        </svg>
      )
    },
    "introduction-to-infinity-categories": {
      gradient: "from-blue-950 via-indigo-900 to-slate-950",
      overlay: (
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 45 C 55 25, 75 25, 90 45 C 105 65, 125 65, 140 45 C 155 25, 175 25, 190 45 C 205 65, 225 65, 240 45" fill="none" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="1.5" />
          <circle cx="30" cy="30" r="8" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" />
          <circle cx="210" cy="60" r="12" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" />
        </svg>
      )
    },
    "precalculus-tips-and-tricks": {
      gradient: "from-amber-950 via-orange-900 to-slate-950",
      overlay: (
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60 C 50 10, 100 10, 150 60 C 200 110, 250 110, 300 60" fill="none" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="1.5" />
          <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="0.8" />
        </svg>
      )
    },
    "benson-farb-surface-bundles": {
      gradient: "from-rose-950 via-red-900 to-slate-950",
      overlay: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="50" fill="none" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="35" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="0.8" />
          <circle cx="50%" cy="50%" r="20" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="0.6" />
        </svg>
      )
    }
  };

  const getFallbackTheme = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      { grad: "from-blue-950 via-slate-900 to-indigo-950", border: "rgba(59, 130, 246, 0.3)" },
      { grad: "from-purple-950 via-slate-900 to-violet-950", border: "rgba(168, 85, 247, 0.3)" },
      { grad: "from-teal-950 via-slate-900 to-emerald-950", border: "rgba(20, 184, 166, 0.3)" },
      { grad: "from-rose-950 via-slate-900 to-pink-950", border: "rgba(244, 63, 94, 0.3)" }
    ];
    const choice = colors[Math.abs(hash) % colors.length];
    return {
      gradient: choice.grad,
      overlay: (
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <pattern id={`pattern-fallback-${hash}`} width="15" height="15" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill={choice.border} />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#pattern-fallback-${hash})`} />
        </svg>
      )
    };
  };

  const theme = themes[slug] || getFallbackTheme(slug);

  return (
    <div className={`relative w-full h-24 bg-gradient-to-br ${theme.gradient} overflow-hidden border-b border-border/20 shrink-0 flex items-center justify-center`}>
      {theme.overlay}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase z-10 select-none px-2 text-center truncate w-full">
        {slug.replace(/-/g, " ")}
      </span>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find current post
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <AcademicLayout showSidebar={false}>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you are looking for does not exist.</p>
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </AcademicLayout>
    );
  }

  // Calculate previous and next posts
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const nextPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const prevPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  // Calculate 3 related posts based on shared tags/categories or chronological proximity
  const getRelatedPosts = () => {
    const related: typeof blogPosts = [];
    
    // First, find posts with matching tags or categories
    blogPosts.forEach((p) => {
      if (p.slug === post.slug) return;
      const shareTag = p.tags?.some((t) => post.tags?.includes(t));
      const shareCategory = p.categories?.some((c) => post.categories?.includes(c));
      
      if (shareTag || shareCategory) {
        related.push(p);
      }
    });

    // If we have fewer than 3, backfill with other posts
    if (related.length < 3) {
      blogPosts.forEach((p) => {
        if (p.slug === post.slug || related.some((r) => r.slug === p.slug)) return;
        related.push(p);
      });
    }

    return related.slice(0, 3);
  };

  const relatedPosts = getRelatedPosts();
  const isResources = post.slug === "undergrad-resources";
  const isKrantz = post.slug === "krantz-mathematicians-survival-guide";

  // Table of Contents navigation items
  const tocItems = [
    { label: "General Advice", id: "general-advice" },
    { label: "Grad School Prep", id: "grad-prep" },
    { label: "Single Variable Calc", id: "single-variable-calculus" },
    { label: "Multivariable Calc", id: "multivariable-vector-calculus" },
    { label: "Differential Equations", id: "ordinary-differential-equations" },
    { label: "Linear Algebra", id: "linear-algebra" },
    { label: "Discrete Math & Proofs", id: "discrete-math-proofs" },
    { label: "Combinatorics", id: "combinatorics" },
    { label: "Abstract Algebra", id: "abstract-algebra" },
    { label: "Category Theory", id: "category-theory" },
    { label: "Galois Theory", id: "galois-theory" },
    { label: "Real Analysis", id: "real-analysis" },
    { label: "Complex Analysis", id: "complex-analysis" },
    { label: "Numerical Analysis", id: "numerical-analysis" },
    { label: "Point-Set Topology", id: "point-set-topology" },
    { label: "Algebraic Topology", id: "algebraic-topology" },
    { label: "Differential Geometry", id: "differential-geometry-manifolds" },
    { label: "Number Theory", id: "number-theory" },
    { label: "Algebraic Geometry", id: "algebraic-geometry" },
    { label: "Probability & Stats", id: "probability-statistics" },
    { label: "Dynamics & Chaos", id: "dynamics-chaos" },
    { label: "Computer Science", id: "computer-science" },
  ];

  return (
    <AcademicLayout showSidebar={false}>
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:no-underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO BLOG
        </Link>
      </div>

      {/* Hero Header */}
      <header className="border-b pb-6 mb-8 space-y-3">
        {post.categories && post.categories.length > 0 && (
          <div className="flex gap-2">
            {post.categories.map((c) => (
              <span
                key={c}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider"
              >
                {c}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {post.updatedDate ? `Updated: ${post.updatedDate}` : post.date || post.year}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readMinutes} min read</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3.5 h-3.5" />
                <div className="flex gap-1.5">
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      to={`/blog?tag=${encodeURIComponent(t)}`}
                      className="text-primary hover:text-link-hover font-medium hover:underline transition-colors"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
        <main className={`${isResources ? "lg:col-span-9" : "lg:col-span-12"} space-y-12`}>
          <article className={`prose dark:prose-invert ${isResources ? "max-w-none" : "max-w-3xl mx-auto w-full"}`}>
            {isResources ? (
              <UndergradResources />
            ) : isKrantz ? (
              <div className="not-prose">
                <KrantzGuide />
              </div>
            ) : (
              <div className="rounded-lg border bg-accent/25 p-6 border-dashed text-center max-w-xl mx-auto my-12 space-y-4 shadow-sm">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Legacy Post Stub</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This post is currently a stub. The full mathematical content, equations, explanations, and diagrams reside on the legacy academic site.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={post.legacyUrl || `https://dzackgarza.com/${post.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-colors hover:no-underline shadow-sm"
                  >
                    Read the Original Post <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </article>

          {/* Metadata Footer */}
          <footer className="border-t pt-6 text-xs text-muted-foreground flex flex-col sm:flex-row sm:justify-between gap-3">
            <div>
              {post.updatedDate && (
                <span>Last Updated: <span className="font-medium text-foreground">{post.updatedDate}</span></span>
              )}
            </div>
            <div className="flex gap-2">
              {post.tags?.map((t) => (
                <Link
                  key={t}
                  to={`/blog?tag=${encodeURIComponent(t)}`}
                  className="px-2 py-0.5 rounded border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors hover:no-underline"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </footer>

          {/* Adjacent Posts Navigation Panel */}
          <nav className="grid sm:grid-cols-2 gap-4 border-t pt-8">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="group rounded-xl border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all duration-200 text-left hover:no-underline flex flex-col justify-between"
              >
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> PREVIOUS POST
                </div>
                <span className="text-sm font-bold text-foreground group-hover:text-link-hover transition-colors line-clamp-2">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div className="rounded-xl border bg-muted/20 p-4 border-dashed text-muted-foreground/60 text-xs flex items-center justify-center font-medium">
                No older posts
              </div>
            )}

            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="group rounded-xl border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all duration-200 text-right hover:no-underline flex flex-col justify-between items-end"
              >
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  NEXT POST <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-sm font-bold text-foreground group-hover:text-link-hover transition-colors line-clamp-2">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div className="rounded-xl border bg-muted/20 p-4 border-dashed text-muted-foreground/60 text-xs flex items-center justify-center font-medium">
                No newer posts
              </div>
            )}
          </nav>
        </main>

        {/* Sticky Table of Contents (Desktop Only) */}
        {isResources && (
          <aside className="hidden lg:block lg:col-span-3 sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-4">
            <div className="rounded-xl border bg-card p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-primary" /> Table of Contents
              </h4>
              <nav className="space-y-1 text-xs">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-1 text-muted-foreground hover:text-foreground hover:underline transition-colors truncate"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* "You May Also Enjoy" Section */}
      <section className="border-t mt-16 pt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-foreground">You May Also Enjoy</h3>
          <Link to="/blog" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View All Posts <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {relatedPosts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:no-underline overflow-hidden p-0"
            >
              <div className="flex flex-col items-stretch w-full">
                {getPostCoverImage(p.slug)}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>{p.date || p.year}</span>
                    <span>{p.readMinutes}m read</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-link-hover transition-colors line-clamp-2 leading-snug">
                    {p.title}
                  </h4>
                  {p.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mt-1">
                      {p.excerpt}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-[10px] font-bold text-primary flex items-center gap-0.5 px-4 pb-4 mt-2 group-hover:translate-x-0.5 transition-transform">
                READ POST <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AcademicLayout>
  );
};

export default BlogPost;
