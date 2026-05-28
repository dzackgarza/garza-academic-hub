import { useState, useEffect, useMemo } from 'react';
import { FileText, Clock, Tag, Folder, Search, X, SlidersHorizontal } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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

const formatName = (str: string) => {
  if (str === 'AdviceandResources') return 'Advice & Resources';
  return str.replace(/([A-Z])/g, ' $1').trim();
};

const BlogListing = ({ posts, basePath }: BlogListingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('tag'),
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('category'),
  );
  const [activeYear, setActiveYear] = useState<number | null>(() => {
    const y = new URLSearchParams(window.location.search).get('year');
    return y ? Number(y) : null;
  });

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTag(params.get('tag'));
      setActiveCategory(params.get('category'));
      const y = params.get('year');
      setActiveYear(y ? Number(y) : null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      p.categories?.forEach((c) => cats.add(c));
    });
    return Array.from(cats).sort();
  }, [posts]);

  const allTags = useMemo(() => {
    const ts = new Set<string>();
    posts.forEach((p) => {
      p.tags?.forEach((t) => ts.add(t));
    });
    return Array.from(ts).sort();
  }, [posts]);

  const allYears = useMemo(() => {
    const yrs = new Set<number>();
    posts.forEach((p) => {
      const y = new Date(p.date).getFullYear();
      if (!isNaN(y)) yrs.add(y);
    });
    return Array.from(yrs).sort((a, b) => b - a);
  }, [posts]);

  const updateFiltersInUrl = (
    tag: string | null,
    category: string | null,
    year: number | null,
  ) => {
    const params = new URLSearchParams(window.location.search);
    if (tag) params.set('tag', tag);
    else params.delete('tag');

    if (category) params.set('category', category);
    else params.delete('category');

    if (year) params.set('year', year.toString());
    else params.delete('year');

    const qs = params.toString();
    window.history.pushState(null, '', qs ? `${basePath}?${qs}` : basePath);
  };

  const handleTagChange = (tag: string | null) => {
    setActiveTag(tag);
    updateFiltersInUrl(tag, activeCategory, activeYear);
  };

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    updateFiltersInUrl(activeTag, category, activeYear);
  };

  const handleYearChange = (year: number | null) => {
    setActiveYear(year);
    updateFiltersInUrl(activeTag, activeCategory, year);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTag(null);
    setActiveCategory(null);
    setActiveYear(null);
    window.history.pushState(null, '', basePath);
  };

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchExcerpt = p.excerpt?.toLowerCase().includes(q) || false;
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        const matchCategories = p.categories?.some((c) => c.toLowerCase().includes(q)) || false;
        if (!matchTitle && !matchExcerpt && !matchTags && !matchCategories) {
          return false;
        }
      }

      if (activeCategory) {
        const hasCat = p.categories?.some((c) => c.toLowerCase() === activeCategory.toLowerCase());
        if (!hasCat) return false;
      }

      if (activeTag) {
        const hasTag = p.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase());
        if (!hasTag) return false;
      }

      if (activeYear) {
        const year = new Date(p.date).getFullYear();
        if (year !== activeYear) return false;
      }

      return true;
    });
  }, [posts, searchQuery, activeCategory, activeTag, activeYear]);

  const byYear = useMemo(() => {
    return filtered.reduce<Record<number, Post[]>>((acc, p) => {
      const year = new Date(p.date).getFullYear();
      (acc[year] ??= []).push(p);
      return acc;
    }, {});
  }, [filtered]);

  const years = useMemo(() => {
    return Object.keys(byYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [byYear]);

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
        {/* Row 1: Search Input (Full Width) */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts by title, tag, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-9 bg-background border border-input rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Row 2: Selectors Toolbar (Flex Wrap) */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <Select value={activeCategory || "all"} onValueChange={(val) => handleCategoryChange(val === "all" ? null : val)}>
            <SelectTrigger className="w-full sm:w-[170px] h-10 text-left">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {formatName(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 w-full sm:w-[150px] justify-between text-left font-normal border-input">
                <span className="truncate">
                  {activeTag ? `#${activeTag}` : "All Tags"}
                </span>
                <Tag className="w-3.5 h-3.5 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-0">
              <div className="p-2 border-b text-xs font-semibold text-muted-foreground flex justify-between items-center">
                <span>Filter by tag</span>
                {activeTag && (
                  <Button variant="ghost" size="sm" onClick={() => handleTagChange(null)} className="h-auto p-1 text-[10px] hover:bg-accent">
                    Clear
                  </Button>
                )}
              </div>
              <ScrollArea className="max-h-64 p-1">
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleTagChange(null)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors hover:bg-accent",
                      !activeTag ? "bg-accent font-semibold" : ""
                    )}
                  >
                    All Tags
                  </button>
                  {allTags.map((tag) => {
                    const count = posts.filter(p => p.tags?.some(t => t.toLowerCase() === tag.toLowerCase())).length;
                    const isSelected = activeTag?.toLowerCase() === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagChange(isSelected ? null : tag)}
                        className={cn(
                          "w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors hover:bg-accent flex justify-between items-center",
                          isSelected ? "bg-accent font-semibold text-primary" : ""
                        )}
                      >
                        <span>#{tag}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Select value={activeYear ? activeYear.toString() : "all"} onValueChange={(val) => handleYearChange(val === "all" ? null : Number(val))}>
            <SelectTrigger className="w-full sm:w-[120px] h-10 text-left">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {allYears.map((yr) => (
                <SelectItem key={yr} value={yr.toString()}>
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center text-xs text-muted-foreground border-t pt-3">
            <span className="flex items-center gap-1 shrink-0"><Tag className="w-3.5 h-3.5 text-muted-foreground/60" /> Popular tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {allTags.slice(0, 8).map((tag) => {
                const isSelected = activeTag?.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagChange(isSelected ? null : tag)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full border transition-all text-xs font-medium",
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground font-semibold shadow-sm"
                        : "bg-background hover:bg-accent hover:text-foreground text-muted-foreground border-input"
                    )}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {(activeTag || activeCategory || activeYear || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/40 rounded-lg border text-sm animate-fade-in">
          <span className="text-xs text-muted-foreground mr-1">Active filters:</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-background border">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-destructive transition-colors ml-1" aria-label="Clear search filter">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {activeCategory && (
            <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-background border">
              Category: {formatName(activeCategory)}
              <button onClick={() => handleCategoryChange(null)} className="hover:text-destructive transition-colors ml-1" aria-label="Clear category filter">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {activeTag && (
            <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-background border">
              Tag: #{activeTag}
              <button onClick={() => handleTagChange(null)} className="hover:text-destructive transition-colors ml-1" aria-label="Clear tag filter">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {activeYear && (
            <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-background border">
              Year: {activeYear}
              <button onClick={() => handleYearChange(null)} className="hover:text-destructive transition-colors ml-1" aria-label="Clear year filter">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs font-semibold text-primary hover:text-link-hover p-1 h-auto ml-auto hover:bg-transparent"
          >
            Clear All
          </Button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground animate-fade-in flex flex-col items-center justify-center gap-3 bg-card">
          <div className="rounded-full bg-muted p-3">
            <SlidersHorizontal className="w-6 h-6 text-muted-foreground/60" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No posts found</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Try adjusting your search terms or clearing your selected filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2 h-9">
            Reset Filters
          </Button>
        </div>
      ) : (
        years.map((year) => (
          <div key={year} className="mb-8">
            <SectionHeading id={`y-${year}`}>{year}</SectionHeading>
            <ul className="space-y-3 animate-fade-in">
              {byYear[year].map((p) => (
                <li key={p.slug} className="rounded-lg border bg-card p-4 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mt-0.5 rounded-md bg-accent p-2 shrink-0 h-8 w-8 flex items-center justify-center">
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
                        <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                        <span>{p.readMinutes} min read</span>
                      </div>

                      {p.categories && p.categories.length > 0 && (
                        <>
                          <span>&bull;</span>
                          <div className="flex gap-1.5 items-center">
                            <Folder className="w-3.5 h-3.5 text-muted-foreground/60" />
                            {p.categories.map((c) => (
                              <button
                                key={c}
                                onClick={() => handleCategoryChange(c)}
                                className="hover:text-primary hover:underline transition-colors font-medium"
                              >
                                {formatName(c)}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {p.tags && p.tags.length > 0 && (
                        <>
                          <span>&bull;</span>
                          <div className="flex gap-1.5 items-center">
                            <Tag className="w-3.5 h-3.5 text-muted-foreground/60" />
                            {p.tags.map((t) => (
                              <button
                                key={t}
                                onClick={() => handleTagChange(t)}
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
