import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock next/navigation for LayoutShell/TopNav/MobileNav inside Home
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}));

describe('Home page', () => {
  it('shows the app shell and dashboard heading', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/high-level snapshot/i)
    ).toBeInTheDocument();
  });
});
