import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import CardGrid from "@/components/CardGrid";
import FilteredGallery from "@/components/FilteredGallery";
import { allItems, itemsByType } from "@/content/items";

const papers = itemsByType("paper");
const talksAndNotes = allItems.filter((it) => it.type === "talk" || it.type === "notes");

const Index = () => {
  return (
    <AcademicLayout>
      <p className="text-base leading-relaxed mb-4">
        As of the 2024-2025 academic year, I am a 6th year graduate student at the University of Georgia working in algebraic geometry with{" "}
        <a href="https://faculty.franklin.uga.edu/valery/" target="_blank" rel="noopener noreferrer">Valery Alexeev</a>.
        {" "}I am currently thinking about KSBA and semitoroidal compactifications of moduli spaces of Enriques and Coble surfaces.
      </p>

      <div className="callout mb-6">
        You can find my CV <a href="#">here</a> and preprints of my papers on <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer">Arxiv</a>.
      </div>

      <SectionHeading id="research">Research</SectionHeading>
      <CardGrid items={papers} columns={2} />

      <SectionHeading id="writing">Talks & Notes</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">
        Browse {talksAndNotes.length} items — filter by type, or visit the writing page for the full archive.
      </p>
      <FilteredGallery items={talksAndNotes} columns={3} rows={3} />
    </AcademicLayout>
  );
};

export default Index;
