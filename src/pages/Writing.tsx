import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";
import FilteredGallery from "@/components/FilteredGallery";
import LinkGroup from "@/components/LinkGroup";
import { allItems } from "@/content/items";
import { linkGroups } from "@/content/links";

/** The Writing page composes three concerns, each driven by static config:
 *   1. Lecture / course / talk archive (items.toml → FilteredGallery)
 *   2. Expository writing (items.toml, type="expository")
 *   3. External link groups: notes by others, tools, configs, resources (links.toml)
 */
const Writing = () => {
  const archive = allItems.filter((i) => i.type === "notes" || i.type === "talk");
  const expository = allItems.filter((i) => i.type === "expository");

  return (
    <AcademicLayout showSidebar={false}>
      <div className="academic-page-content">
        <h1 className="text-3xl font-semibold mb-2">Writing</h1>
        <p className="text-muted-foreground mb-4">
          Lecture notes, course notes, talk transcripts, and expository writing. Filter by type or tag.
        </p>

        <div className="callout mb-6">
          For informal, in-progress writing, see my{" "}
          <a href="http://notes.dzackgarza.com/" target="_blank" rel="noopener noreferrer">notes wiki</a>{" "}
          and my{" "}
          <a href="https://notes.dzackgarza.com/Notes/Quick_Notes.html" target="_blank" rel="noopener noreferrer">math journal</a>.
        </div>

        <SectionHeading id="archive">Archive</SectionHeading>
        <p className="text-sm text-muted-foreground mb-3">
          {archive.length} items across courses, seminars, and talks.
        </p>
        <FilteredGallery items={archive} columns={3} rows={3} />

        {expository.length > 0 && (
          <>
            <SectionHeading id="expository">Expository</SectionHeading>
            <p className="text-sm text-muted-foreground mb-3">
              Short pieces written for workshops, study groups, and curiosity.
            </p>
            <FilteredGallery items={expository} columns={3} rows={2} />
          </>
        )}

        <SectionHeading id="external">External Notes &amp; Tools</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {linkGroups.map((group) => (
            <LinkGroup key={group.id} group={group} />
          ))}
        </div>
      </div>
    </AcademicLayout>
  );
};

export default Writing;
