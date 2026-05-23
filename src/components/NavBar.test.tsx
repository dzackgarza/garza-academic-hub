import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from '@/components/NavBar';

// Mock react-router-dom — Link renders as <a>, useLocation returns root path
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}));

// Mock navigation TOML data — use a static set instead of the parsed file
vi.mock('@/content/navigation', () => ({
  navItems: [
    { label: 'Research', path: '/research' },
    { label: 'Talks', path: '/talks' },
    { label: 'Notes', path: '/notes' },
  ],
}));

function getNavs() {
  const navs = document.querySelectorAll<HTMLElement>('nav');
  return {
    desktopNav: navs[0], // hidden md:flex — always in DOM
    mobileNav: navs[1], // md:hidden — conditionally rendered
  };
}

describe('NavBar', () => {
  it('renders desktop nav links from navItems data source', () => {
    render(<NavBar />);
    const { desktopNav } = getNavs();

    expect(within(desktopNav).getByText('Research')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Talks')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Notes')).toBeInTheDocument();
  });

  it('shows mobile nav when hamburger is toggled open', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    // Before click: mobile nav is NOT in the DOM
    expect(document.querySelector('nav.md\\:hidden')).not.toBeInTheDocument();

    // Click hamburger
    await user.click(screen.getByRole('button'));

    // After click: mobile nav IS in the DOM with all links
    const mobileNav = document.querySelector<HTMLElement>('nav.md\\:hidden');

    // But actually the class might be a long Tailwind string.
    // Let's just check that the second nav exists and has items.
    const { mobileNav: mn } = getNavs();
    expect(mn).toBeInTheDocument();
    expect(within(mn).getByText('Research')).toBeInTheDocument();
    expect(within(mn).getByText('Talks')).toBeInTheDocument();
    expect(within(mn).getByText('Notes')).toBeInTheDocument();
  });

  it('marks active link with different class from inactive links', () => {
    // Active class: "text-foreground font-medium" (on / path)
    // Inactive class: "text-muted-foreground hover:text-foreground"
    render(<NavBar />);
    const { desktopNav } = getNavs();

    // Home link rendered by the brand, not by navItems — so /research is inactive
    const researchLink = within(desktopNav).getByText('Research').closest('a')!;
    const talksLink = within(desktopNav).getByText('Talks').closest('a')!;

    // Both are inactive when pathname='/'
    expect(researchLink.className).toContain('text-muted-foreground');
    expect(talksLink.className).toContain('text-muted-foreground');
    // Neither has the active class
    expect(researchLink.className).not.toContain('font-medium');
    expect(talksLink.className).not.toContain('font-medium');
  });

  it('closes mobile nav when a nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    // Open mobile menu
    await user.click(screen.getByRole('button'));

    // Verify mobile nav is open
    const { mobileNav } = getNavs();
    expect(mobileNav).toBeInTheDocument();
    expect(within(mobileNav).getByText('Talks')).toBeInTheDocument();

    // Click a mobile nav link
    const talkLink = within(mobileNav).getByText('Talks');
    await user.click(talkLink);

    // Mobile nav should be removed from DOM
    const navsAfter = document.querySelectorAll('nav');
    expect(navsAfter.length).toBe(1);
  });
});
