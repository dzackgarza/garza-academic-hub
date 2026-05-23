import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CompiledPage, { ErrorMessage, LoadingSpinner } from './CompiledPage';

// Mock react-router-dom with all exports used by the component tree
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

describe('CompiledPage', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders a loading indicator while content is loading', () => {
    render(<CompiledPage />);
    expect(screen.getByText(/loading content/i)).toBeInTheDocument();
  });
});

describe('ErrorMessage', () => {
  it('renders the error message text', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});

describe('LoadingSpinner', () => {
  it('renders a loading indicator', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/loading content/i)).toBeInTheDocument();
  });
});
