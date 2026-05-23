import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navItems, type NavItem } from '@/content/navigation';

/** Render a single nav link, given its item data and an optional className override.
 *  Without a className override, the default desktop styling with active-path
 *  highlighting is used. */
function NavLink({
  item,
  pathname,
  className,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={
        className ??
        `text-sm transition-colors hover:no-underline ${
          pathname === item.path
            ? 'text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground'
        }`
      }
    >
      {item.label}
    </Link>
  );
}

const NavBar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight hover:no-underline"
        >
          D. Zack Garza
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} pathname={location.pathname} />
          ))}
        </nav>
        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t px-4 py-3 space-y-2 bg-background">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              pathname={location.pathname}
              onClick={() => setOpen(false)}
              className="block text-sm py-1.5 text-muted-foreground hover:text-foreground hover:no-underline"
            />
          ))}
        </nav>
      )}
    </header>
  );
};

export default NavBar;
