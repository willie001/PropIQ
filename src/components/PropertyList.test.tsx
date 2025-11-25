import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyList from './PropertyList';

type Property = {
  id: string;
  name: string;
  suburb: string;
  status: 'occupied' | 'vacant';
};

const sampleProperties: Property[] = [
  { id: '1', name: '36 Chatsworth Drive', suburb: 'Carramar', status: 'occupied' },
  { id: '2', name: '11 Staunton Vale', suburb: 'Carramar', status: 'vacant' },
];

describe('PropertyList', () => {
  it('shows a heading for the properties section', () => {
    render(<PropertyList properties={sampleProperties} />);

    const heading = screen.getByRole('heading', { name: /your properties/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders each property name and suburb', () => {
    render(<PropertyList properties={sampleProperties} />);

    expect(screen.getByText(/36 chatsworth drive/i)).toBeInTheDocument();
    expect(screen.getByText(/11 staunton vale/i)).toBeInTheDocument();

    const suburbs = screen.getAllByText(/carramar/i);
    expect(suburbs).toHaveLength(2);
  });

  it('shows a friendly message when there are no properties', () => {
    render(<PropertyList properties={[]} />);

    expect(
      screen.getByText(/you don’t have any properties yet/i)
    ).toBeInTheDocument();
  });

  it('shows a summary with total, occupied and vacant counts', () => {
    render(<PropertyList properties={sampleProperties} />);

    expect(
      screen.getByText(/2 properties total/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/1 occupied/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/1 vacant/i)
    ).toBeInTheDocument();
  });

  it('allows filtering by occupied and vacant status', async () => {
    const user = userEvent.setup();
    render(<PropertyList properties={sampleProperties} />);

    // default: All – both properties visible
    expect(screen.getByText(/36 chatsworth drive/i)).toBeInTheDocument();
    expect(screen.getByText(/11 staunton vale/i)).toBeInTheDocument();

    // Filter: Occupied
    await user.click(screen.getByRole('button', { name: /occupied/i }));
    expect(screen.getByText(/36 chatsworth drive/i)).toBeInTheDocument();
    expect(screen.queryByText(/11 staunton vale/i)).not.toBeInTheDocument();

    // Filter: Vacant
    await user.click(screen.getByRole('button', { name: /vacant/i }));
    expect(screen.getByText(/11 staunton vale/i)).toBeInTheDocument();
    expect(screen.queryByText(/36 chatsworth drive/i)).not.toBeInTheDocument();

    // Back to All
    await user.click(screen.getByRole('button', { name: /all/i }));
    expect(screen.getByText(/36 chatsworth drive/i)).toBeInTheDocument();
    expect(screen.getByText(/11 staunton vale/i)).toBeInTheDocument();
  });

    it('calls onArchive when archive button is clicked', async () => {
    const user = userEvent.setup();
    const handleArchive = jest.fn();

    render(
      <PropertyList
        properties={sampleProperties}
        onArchive={handleArchive}
      />
    );

    // There will be one archive button per row; click the first one
    const archiveButtons = screen.getAllByRole('button', { name: /archive/i });
    await user.click(archiveButtons[0]);

    expect(handleArchive).toHaveBeenCalledTimes(1);
    expect(handleArchive).toHaveBeenCalledWith('1'); // id of 36 Chatsworth Drive
  });


});
