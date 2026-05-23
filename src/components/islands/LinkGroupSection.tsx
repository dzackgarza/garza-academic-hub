import { linkGroups } from "@/content/links";
import LinkGroup from "@/components/LinkGroup";

/** Self-contained island: renders all link groups from links.toml in a 2-column grid. */
const LinkGroupSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {linkGroups.map((group) => (
      <LinkGroup key={group.id} group={group} />
    ))}
  </div>
);

export default LinkGroupSection;
