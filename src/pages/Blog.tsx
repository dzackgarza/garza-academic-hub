import { Link, useSearchParams } from "react-router-dom";
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
  image?: string;
}

import rawPosts from "@/content/blog/compiled/posts.json";

const posts: Post[] = (rawPosts as any[]).map((p) => ({
  ...p,
  year: p.date ? new Date(p.date).getFullYear() : 2020,
}));

const byYear = posts.reduce<Record<number, Post[]>>((acc, p) => {
  (acc[p.year] ??= []).push(p);
  return acc;
}, {});

const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag");

  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase()))
    : posts;

  const byYear = filteredPosts.reduce<Record<number, Post[]>>((acc, p) => {
    (acc[p.year] ??= []).push(p);
    return acc;
  }, {});

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <AcademicLayout showSidebar={false}>
      <h1 className="text-3xl font-semibold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-6">
        Posts on mathematics, advice, tools, and the occasional rant. Older entries are imported from{" "}
        <a href="https://dzackgarza.com/year-archive/" target="_blank" rel="noopener noreferrer">the archive</a>{" "}
        and may link out to the original site.
      </p>

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

      {filteredPosts.length === 0 ? (
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
                          <div className="flex gap-1.5 inline-flex items-center">
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
                    {p.excerpt && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.excerpt}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </AcademicLayout>
  );
};

export { posts as blogPosts };
export type { Post as BlogPost };
export default Blog;
