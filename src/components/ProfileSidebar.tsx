import { MapPin, Mail, Github, Youtube, GraduationCap, Building } from "lucide-react";
import { profile } from "@/content/profile";

// Map icon string keys from profile.toml to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  "building": Building,
  "mail": Mail,
  "github": Github,
  "youtube": Youtube,
};

const ProfileSidebar = () => {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-4">
        <div className="w-36 h-36 rounded-full bg-muted mx-auto lg:mx-0 overflow-hidden flex items-center justify-center">
          <span className="text-4xl text-muted-foreground font-semibold">{profile.avatar_text}</span>
        </div>
        <div className="text-center lg:text-left">
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.pronouns}</p>
          <p className="text-sm text-muted-foreground">{profile.affiliation}</p>
          <p className="text-sm text-muted-foreground">{profile.office}</p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
        <nav className="space-y-1.5">
          {profile.links.map((link) => {
            const Icon = ICON_MAP[link.icon] ?? MapPin;
            const content = (
              <span className="flex items-center gap-2 text-sm py-1">
                <Icon className="w-4 h-4 text-muted-foreground" />
                {link.label}
              </span>
            );
            return link.href ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block">
                {content}
              </a>
            ) : (
              <div key={link.label}>{content}</div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
