import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('shows the app shell and dashboard heading', () => {
    render(<Home />);

    // Brand visible in layout
    expect(screen.getByText(/propiq/i)).toBeInTheDocument();

    // Page heading
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();

    // Description
    expect(
      screen.getByText(/high-level view of your properties/i)
    ).toBeInTheDocument();
  });
});
