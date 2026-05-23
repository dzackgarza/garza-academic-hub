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

// Return valid HTML content
vi.mock('../content/compiled/pages/home.html?raw', () => ({
  default: '<p data-testid="content">Hello from compiled content</p>',
}));

describe('CompiledPage with loaded content', () => {
  it('renders compiled HTML content after loading', async () => {
    render(<CompiledPage />);

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
    expect(screen.getByText('Hello from compiled content')).toBeInTheDocument();
    expect(screen.queryByText(/loading content/i)).not.toBeInTheDocument();
  });
});
