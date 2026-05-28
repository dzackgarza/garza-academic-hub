import { useState, useEffect } from 'react';
import { FileText, Clock, Tag, Folder } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

interface Post {
  title: string;
  slug: string;
  date: string;
  tags?: string[];
  categories?: string[];
  excerpt?: string;
  readMinutes?: number;
}

interface BlogListingProps {
  posts: Post[];
  basePath: string;
}

const BlogListing = ({ posts, basePath }: BlogListingProps) => {
  const [activeTag, setActiveTag] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('tag'),
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('category'),
  );

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTag(params.get('tag'));
      setActiveCategory(params.get('category'));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setTag = (tag: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    params.delete('category'); // Clear category filter if tag is selected
    const qs = params.toString();
    window.history.pushState(null, '', qs ? `${basePath}?${qs}` : basePath);
    setActiveTag(tag);
    setActiveCategory(null);
  };

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.delete('tag'); // Clear tag filter if category is selected
    const qs = params.toString();
    window.history.pushState(null, '', qs ? `${basePath}?${qs}` : basePath);
    setActiveCategory(category);
    setActiveTag(null);
  };

  const clearFilters = () => {
    window.history.pushState(null, '', basePath);
    setActiveTag(null);
    setActiveCategory(null);
  };

  const filtered = posts.filter((p) => {
    if (activeTag) {
      return p.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase());
    }
    if (activeCategory) {
      return p.categories?.some((c) => c.toLowerCase() === activeCategory.toLowerCase());
    }
    return true;
  });

  const byYear = filtered.reduce<Record<number, Post[]>>((acc, p) => {
    const year = new Date(p.date).getFullYear();
    (acc[year] ??= []).push(p);
    return acc;
  }, {});

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div>
      {(activeTag || activeCategory) && (
        <div className="mb-6 p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between text-sm animate-fade-in">
          <span className="text-foreground flex items-center gap-1.5">
            {activeTag ? (
              <>
                <Tag className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Showing posts tagged with{' '}
                  <span className="font-semibold text-primary">#{activeTag}</span>
                </span>
              </>
            ) : (
              <>
                <Folder className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Showing posts in category{' '}
                  <span className="font-semibold text-primary">{activeCategory}</span>
                </span>
              </>
            )}
          </span>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-primary hover:text-link-hover hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground animate-fade-in">
          No posts found matching the selected filter.
        </div>
      ) : (
        years.map((year) => (
          <div key={year} className="mb-8">
            <SectionHeading id={`y-${year}`}>{year}</SectionHeading>
            <ul className="space-y-3 animate-fade-in">
              {byYear[year].map((p) => (
                <li key={p.slug} className="rounded-lg border bg-card p-4 flex gap-3">
                  <div className="mt-0.5 rounded-md bg-accent p-2 shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={`${basePath}/${p.slug}`}
                      className="text-sm font-semibold hover:text-link-hover"
                    >
                      {p.title}
                    </a>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{p.readMinutes} min read</span>
                      </div>
                      
                      {p.categories && p.categories.length > 0 && (
                        <>
                          <span>&bull;</span>
                          <div className="flex gap-1.5 items-center">
                            <Folder className="w-3 h-3 text-muted-foreground/60" />
                            {p.categories.map((c) => (
                              <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className="hover:text-primary hover:underline transition-colors font-medium"
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {p.tags && p.tags.length > 0 && (
                        <>
                          <span>&bull;</span>
                          <div className="flex gap-1.5 items-center">
                            <Tag className="w-3 h-3 text-muted-foreground/60" />
                            {p.tags.map((t) => (
                              <button
                                key={t}
                                onClick={() => setTag(t)}
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
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {p.excerpt}
                      </p>
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
