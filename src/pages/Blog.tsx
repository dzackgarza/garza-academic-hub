import { useState, useEffect } from "react";
import AcademicLayout from "@/components/AcademicLayout";
import PageShell from "@/components/PageShell";

const Blog = () => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    import("../content/compiled/pages/blog.html?raw").then((mod) => {
      setHtml(mod.default);
    });
  }, []);

  return (
    <AcademicLayout showSidebar={false}>
      <PageShell html={html} />
    </AcademicLayout>
  );
};

export default Blog;
