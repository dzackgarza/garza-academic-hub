import { FileText, Presentation, ExternalLink } from "lucide-react";

export interface AcademicCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  links?: { label: string; href: string }[];
  icon?: "paper" | "talk" | "notes";
}

const iconMap = {
  paper: FileText,
  talk: Presentation,
  notes: FileText,
};

const AcademicCard = ({ title, subtitle, description, tags, links, icon = "paper" }: AcademicCardProps) => {
  const Icon = iconMap[icon];
  return (
    <div className="group rounded-lg border bg-card p-4 transition-shadow hover:shadow-md flex flex-col gap-2 h-full">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-md bg-accent p-2 shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {tags.map((tag) => (
            <span key={tag} className="inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-auto pt-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-link-hover"
            >
              <ExternalLink className="w-3 h-3" />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicCard;
