import { useState, useEffect } from "react";
import AcademicLayout from "@/components/AcademicLayout";
import PageShell from "@/components/PageShell";

const Index = () => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    import("../content/compiled/pages/home.html?raw").then((mod) => {
      setHtml(mod.default);
    });
  }, []);

  return (
    <AcademicLayout>
      <PageShell html={html} />
    </AcademicLayout>
  );
};

export default Index;
