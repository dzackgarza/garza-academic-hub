import { useState, useEffect } from "react";
import AcademicLayout from "@/components/AcademicLayout";

const Activities = () => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    import("../content/compiled/pages/activities.html?raw").then((mod) => {
      setHtml(mod.default);
    });
  }, []);

  return (
    <AcademicLayout showSidebar={false}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </AcademicLayout>
  );
};

export default Activities;
