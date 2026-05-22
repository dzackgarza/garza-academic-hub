import { Link, useParams } from "react-router-dom";
import AcademicLayout from "@/components/AcademicLayout";
import { ArrowLeft, Clock } from "lucide-react";
import { blogPosts } from "./Blog";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  return (
    <AcademicLayout showSidebar={false}>
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
      </Link>

      {post ? (
        <article>
          <h1 className="text-3xl font-semibold mb-2">{post.title}</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <span>{post.year}</span>
            <span>•</span>
            <Clock className="w-3 h-3" />
            <span>{post.readMinutes} min read</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <span>{post.tags.join(", ")}</span>
              </>
            )}
          </div>

          {post.excerpt && (
            <p className="text-base text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
          )}

          <div className="callout">
            This post is a stub. The full content lives on the legacy site —{" "}
            <a
              href={`https://dzackgarza.com/${post.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              read the original
            </a>
            . It will be migrated here soon.
          </div>
        </article>
      ) : (
        <div>
          <h1 className="text-3xl font-semibold mb-2">Post not found</h1>
          <p className="text-muted-foreground">No blog post matches this URL.</p>
        </div>
      )}
    </AcademicLayout>
  );
};

export default BlogPost;
