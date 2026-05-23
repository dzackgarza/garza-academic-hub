import { useState, useEffect } from "react";
import AcademicLayout from "@/components/AcademicLayout";
import PageShell from "@/components/PageShell";

const Writing = () => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    import("../content/compiled/pages/writing.html?raw").then((mod) => {
      setHtml(mod.default);
    });
  }, []);

  return (
    <AcademicLayout showSidebar={false}>
      <PageShell html={html} />
    </AcademicLayout>
  );
};

export default Writing;
