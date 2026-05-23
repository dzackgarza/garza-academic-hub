import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AcademicLayout from "@/components/AcademicLayout";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Calendar, Tag, BookOpen, ChevronRight } from "lucide-react";
import { blogPosts } from "./Blog";

declare global {
  interface Window {
    MathJax?: any;
  }
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find current post
  const post = blogPosts.find((p) => p.slug === slug);

  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!post) return;
    
    setIsLoading(true);
    // Vite dynamic import of raw HTML fragment
    import(`../content/blog/compiled/${slug}.html?raw`)
      .then((mod) => {
        setHtmlContent(mod.default);
        setIsLoading(false);
        
        // Trigger MathJax typesetting if available on window
        setTimeout(() => {
          if (window.MathJax && window.MathJax.Hub) {
            try {
              window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            } catch (e) {
              console.error("MathJax queuing failed:", e);
            }
          }
        }, 100);
      })
      .catch((err) => {
        console.error("Failed to load post content:", err);
        setHtmlContent("<p>Failed to load post content.</p>");
        setIsLoading(false);
      });
  }, [slug, post]);

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
  const isStub = post.slug !== "krantz-mathematicians-survival-guide" && post.slug !== "undergrad-resources";

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

      {/* Dynamic Content and Layout Integration */}
      <main className="space-y-12 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading post content...</p>
          </div>
        ) : isStub ? (
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
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        )}

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
                <div className="relative w-full h-28 bg-muted overflow-hidden border-b border-border/20 shrink-0 flex items-center justify-center">
                  <img
                    src={p.image || "/assets/images/bigo.png"}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

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
