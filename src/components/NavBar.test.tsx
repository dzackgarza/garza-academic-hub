import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '@/components/NavBar';

// Mock nav data source — static test data instead of filesystem TOML
vi.mock('@/content/navigation', () => ({
  navItems: [
    { label: 'Research', path: '/research' },
    { label: 'Talks', path: '/talks' },
    { label: 'Notes', path: '/notes' },
  ],
}));

function renderWithRouter(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NavBar />
    </MemoryRouter>,
  );
}

function getNavs() {
  const navs = document.querySelectorAll<HTMLElement>('nav');
  return {
    desktopNav: navs[0], // hidden md:flex — always in DOM
    mobileNav: navs[1], // md:hidden — conditionally rendered
  };
}

describe('NavBar', () => {
  it('renders desktop nav links from navItems data source', () => {
    renderWithRouter();
    const { desktopNav } = getNavs();

    expect(within(desktopNav).getByText('Research')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Talks')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Notes')).toBeInTheDocument();
  });

  it('shows mobile nav when hamburger is toggled open', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    // Before click: mobile nav is NOT in the DOM
    expect(document.querySelector('nav.md\\:hidden')).not.toBeInTheDocument();

    // Click hamburger
    await user.click(screen.getByRole('button'));

    // After click: mobile nav IS in the DOM with all links
    const { mobileNav: mn } = getNavs();
    expect(mn).toBeInTheDocument();
    expect(within(mn).getByText('Research')).toBeInTheDocument();
    expect(within(mn).getByText('Talks')).toBeInTheDocument();
    expect(within(mn).getByText('Notes')).toBeInTheDocument();
  });

  it('marks active link with different class from inactive links', () => {
    // Render at /research — that link should have the active class
    renderWithRouter('/research');
    const { desktopNav } = getNavs();

    const activeLink = within(desktopNav).getByText('Research').closest('a')!;
    const inactiveLink = within(desktopNav).getByText('Talks').closest('a')!;

    // Active link gets the active class
    expect(activeLink.className).toContain('text-foreground');
    expect(activeLink.className).toContain('font-medium');
    // Inactive link gets the muted class
    expect(inactiveLink.className).toContain('text-muted-foreground');
  });

  it('closes mobile nav when a nav link is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter();

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
