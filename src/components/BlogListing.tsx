import { Calendar, Clock, ArrowRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BlogPost {
  title: string;
  date: string;
  tags?: string[];
  excerpt?: string;
  slug: string;
  readMinutes?: number;
  categories?: string[];
}

interface BlogListingProps {
  posts: BlogPost[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BlogListing = ({ posts }: BlogListingProps) => {
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">No blog posts found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <a
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group rounded-lg border bg-card overflow-hidden transition-shadow hover:shadow-md flex flex-col h-full"
        >
          <div className="p-4 flex flex-col gap-2 flex-1">
            <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {post.date && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
              )}
              {post.readMinutes && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readMinutes} min read
                </span>
              )}
            </div>

            {post.excerpt && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto pt-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto pt-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:text-link-hover transition-colors">
                Read more <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default BlogListing;
