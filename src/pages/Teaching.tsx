import { useState, useEffect } from "react";
import AcademicLayout from "@/components/AcademicLayout";

const Teaching = () => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    import("../content/compiled/pages/teaching.html?raw").then((mod) => {
      setHtml(mod.default);
    });
  }, []);

  return (
    <AcademicLayout showSidebar={false}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </AcademicLayout>
  );
};

export default Teaching;
