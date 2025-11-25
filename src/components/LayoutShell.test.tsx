import { render, screen } from '@testing-library/react';
import LayoutShell from './LayoutShell';

describe('LayoutShell', () => {
  it('shows the PropIQ brand in the header', () => {
    render(
      <LayoutShell>
        <div>Page content</div>
      </LayoutShell>
    );

    expect(screen.getByText(/propiq/i)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
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
      screen.getByRole('button', { name: /settings/i })
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
