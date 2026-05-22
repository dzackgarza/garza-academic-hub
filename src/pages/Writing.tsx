import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import FilteredGallery from "@/components/FilteredGallery";
import { allItems } from "@/content/items";

const Writing = () => {
  const writing = allItems.filter((i) => i.type === "notes" || i.type === "talk");

  return (
    <AcademicLayout showSidebar={false}>
      <h1 className="text-3xl font-semibold mb-2">Writing</h1>
      <p className="text-muted-foreground mb-4">
        Lecture notes, course notes, and talk transcripts. Filter by type or tag below.
      </p>

      <div className="callout mb-6">
        For informal, in-progress writing, see my{" "}
        <a href="http://notes.dzackgarza.com/" target="_blank" rel="noopener noreferrer">notes wiki</a>{" "}
        and my{" "}
        <a href="https://notes.dzackgarza.com/Notes/Quick_Notes.html" target="_blank" rel="noopener noreferrer">math journal</a>.
      </div>

      <SectionHeading id="archive">Archive</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">{writing.length} items across courses, seminars, and talks.</p>
      <FilteredGallery items={writing} columns={3} rows={3} />
    </AcademicLayout>
  );
};

export default Writing;
