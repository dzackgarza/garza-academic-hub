import { blogPosts as posts, type Post } from "@/content/posts";

/** Self-contained island: renders the blog post listing with tag filtering. */
const BlogListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag");

  const filtered = activeTag
    ? posts.filter((p) => p.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase()))
    : posts;

  const byYear = filtered.reduce<Record<number, Post[]>>((acc, p) => {
    (acc[p.year] ??= []).push(p);
    return acc;
  }, {});

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <div>
      {activeTag && (
        <div className="mb-6 p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between text-sm animate-fade-in">
          <span className="text-foreground">
            Showing posts tagged with <span className="font-semibold text-primary">#{activeTag}</span>
          </span>
          <button
            onClick={() => setSearchParams({})}
            className="text-xs font-semibold text-primary hover:text-link-hover hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No posts found matching the selected tag.
        </div>
      ) : (
        years.map((year) => (
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
                          <div className="flex gap-1.5 items-center">
                            {p.tags.map((t) => (
                              <button
                                key={t}
                                onClick={() => setSearchParams({ tag: t })}
                                className="hover:text-primary hover:underline transition-colors"
                              >
                                #{t}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {p.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.excerpt}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogListing;
