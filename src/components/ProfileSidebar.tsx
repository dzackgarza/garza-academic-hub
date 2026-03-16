import { MapPin, Mail, Github, Youtube, GraduationCap, Building } from "lucide-react";

const links = [
  { icon: MapPin, label: "Athens, GA", href: undefined },
  { icon: GraduationCap, label: "Google Scholar", href: "https://scholar.google.com" },
  { icon: Building, label: "UGA Profile", href: "https://www.math.uga.edu" },
  { icon: Mail, label: "Email", href: "mailto:zack@uga.edu" },
  { icon: Github, label: "GitHub", href: "https://github.com/dzackgarza" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

const ProfileSidebar = () => {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-4">
        <div className="w-36 h-36 rounded-full bg-muted mx-auto lg:mx-0 overflow-hidden flex items-center justify-center">
          <span className="text-4xl text-muted-foreground font-semibold">DZG</span>
        </div>
        <div className="text-center lg:text-left">
          <h2 className="text-xl font-semibold">D. Zack Garza</h2>
          <p className="text-sm text-muted-foreground">He/Him/His</p>
          <p className="text-sm text-muted-foreground">Mathematics, University of Georgia</p>
          <p className="text-sm text-muted-foreground">Office: 438 Boyd</p>
          <p className="text-sm text-muted-foreground">zack@uga.edu</p>
        </div>
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
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
