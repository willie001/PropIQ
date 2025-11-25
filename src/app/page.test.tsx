import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('shows the PropIQ heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /propiq/i });
    expect(heading).toBeInTheDocument();
  });

  it('shows the subtitle text', () => {
    render(<Home />);
    expect(
      screen.getByText(/personal property management app/i)
    ).toBeInTheDocument();
  });
});
