import { render, screen } from '@testing-library/react';
import LayoutShell from './LayoutShell';

// Mock next/navigation so useRouter/usePathname don't blow up in tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}));

describe('LayoutShell', () => {
  it('shows the PropIQ brand in the header', () => {
    render(
      <LayoutShell>
        <div>Page content</div>
      </LayoutShell>
    );

    expect(screen.getByText(/propiq/i)).toBeInTheDocument();
  });

  it('renders navigation buttons for main sections (desktop nav)', () => {
    render(
      <LayoutShell>
        <div>Page content</div>
      </LayoutShell>
    );

    expect(
      screen.getByRole('button', { name: /dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /properties/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /leases/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /tenants/i })
    ).toBeInTheDocument();
  });

  it('renders a mobile navigation menu button', () => {
    render(
      <LayoutShell>
        <div>Page content</div>
      </LayoutShell>
    );

    expect(
      screen.getByRole('button', { name: /open navigation menu/i })
    ).toBeInTheDocument();
  });

  it('renders children in the main content area', () => {
    render(
      <LayoutShell>
        <div>Page content</div>
      </LayoutShell>
    );

    expect(screen.getByText(/page content/i)).toBeInTheDocument();
  });
});
