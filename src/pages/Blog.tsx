import AcademicLayout from "@/components/AcademicLayout";

const Blog = () => (
  <AcademicLayout showSidebar={false}>
    <h1 className="text-3xl font-semibold mb-6">Blog</h1>
    <p className="text-muted-foreground mb-6">Occasional posts on mathematics, tools, and academic life.</p>
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">No posts yet. Check back soon!</p>
      </div>
    </div>
  </AcademicLayout>
);

export default Blog;
