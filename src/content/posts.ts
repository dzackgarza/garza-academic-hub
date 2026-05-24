import rawPosts from '../../content/compiled/blog/posts.json';

export interface Post {
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

export const blogPosts: Post[] = (rawPosts as any[]).map((p) => ({
  ...p,
  year: p.date ? new Date(p.date).getFullYear() : 2020,
}));
