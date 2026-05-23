import { useState, useEffect } from "react";
import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import CardGrid from "@/components/CardGrid";
import FilteredGallery from "@/components/FilteredGallery";
import { allItems, itemsByType } from "@/content/items";

const papers = itemsByType("paper");
const talksAndNotes = allItems.filter((it) => it.type === "talk" || it.type === "notes");

const Index = () => {
  const [bioHtml, setBioHtml] = useState("");

  useEffect(() => {
    import("../content/compiled/pages/home.html?raw").then((mod) => {
      setBioHtml(mod.default);
    });
  }, []);

  return (
    <AcademicLayout>
      <div dangerouslySetInnerHTML={{ __html: bioHtml }} />

      <SectionHeading id="research">Research</SectionHeading>
      <CardGrid items={papers} columns={2} />

      <SectionHeading id="writing">Talks &amp; Notes</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">
        Browse {talksAndNotes.length} items — filter by type, or visit the writing page for the full archive.
      </p>
      <FilteredGallery items={talksAndNotes} columns={3} rows={3} />
    </AcademicLayout>
  );
};

export default Index;
