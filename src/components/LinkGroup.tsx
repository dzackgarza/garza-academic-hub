import { ExternalLink } from "lucide-react";
import type { LinkGroup as LinkGroupType } from "@/content/links";

interface LinkGroupProps {
  group: LinkGroupType;
}

/** Renders a titled group of external links with optional notes. */
const LinkGroup = ({ group }: LinkGroupProps) => (
  <div className="rounded-lg border bg-card p-5">
    <h3 className="text-base font-semibold">{group.title}</h3>
    {group.description && (
      <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
    )}
    <ul className="mt-3 space-y-1.5">
      {group.links.map((link) => (
        <li key={link.href} className="text-sm leading-snug">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:text-link-hover"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            {link.label}
          </a>
          {link.note && (
            <span className="text-muted-foreground"> — {link.note}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default LinkGroup;
