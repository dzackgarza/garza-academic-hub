import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompiledPage from './CompiledPage';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
}));

describe('CompiledPage', () => {
  it('renders real compiled content for the current manifest route', () => {
    render(<CompiledPage />);
    expect(screen.getByText(/2024-2025 academic year/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading content/i)).not.toBeInTheDocument();
  });
});
