import { Link as LinkIcon } from "lucide-react";

interface SectionHeadingProps {
  id: string;
  children: React.ReactNode;
}

const SectionHeading = ({ id, children }: SectionHeadingProps) => (
  <>
    <div className="section-divider" />
    <h2 id={id} className="text-2xl font-semibold mb-4 group flex items-center gap-2">
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-50 transition-opacity">
        <LinkIcon className="w-4 h-4" />
      </a>
    </h2>
  </>
);

export default SectionHeading;
