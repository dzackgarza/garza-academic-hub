import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CompiledPage from './CompiledPage';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useParams: () => ({}),
  BrowserRouter: ({ children }: any) => <>{children}</>,
  Routes: ({ children }: any) => <>{children}</>,
  Route: ({ element }: any) => <>{element}</>,
}));

// Mock the content module so that accessing `default` throws
vi.mock('../content/compiled/pages/home.html?raw', () => {
  const mod: Record<string, unknown> = {};
  Object.defineProperty(mod, 'default', {
    get: () => {
      throw new Error('Simulated content load failure');
    },
    enumerable: true,
    configurable: true,
  });
  return mod;
});

describe('CompiledPage error state', () => {
  it('renders error message when content fails to load', async () => {
    render(<CompiledPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load page content/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/loading content/i)).not.toBeInTheDocument();
  });
});
