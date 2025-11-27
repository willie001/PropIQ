import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyList, { Property } from './PropertyList';

const sampleProperties: Property[] = [
  {
    id: '1',
    name: '36 Chatsworth Drive',
    suburb: 'Carramar',
    status: 'occupied',
  },
  {
    id: '2',
    name: '11 Staunton Vale',
    suburb: 'Carramar',
    status: 'vacant',
  },
];

describe('PropertyList', () => {
  it('renders each property name and suburb', () => {
    render(<PropertyList properties={sampleProperties} />);

    expect(
      screen.getByText(/36 chatsworth drive/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/carramar/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/11 staunton vale/i)
    ).toBeInTheDocument();
  });

  it('shows a friendly message when there are no properties', () => {
  render(<PropertyList properties={[]} />);

  // Assert the heading using role so we don't clash with the paragraph text
  expect(
    screen.getByRole('heading', { name: /properties/i })
  ).toBeInTheDocument();

  expect(
    screen.getByText(/you haven\'t added any properties yet/i)
  ).toBeInTheDocument();
});


  it('calls onSelectProperty when a property row is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(
      <PropertyList
        properties={sampleProperties}
        onSelectProperty={handleSelect}
      />
    );

    // The button’s accessible name is the concatenation of its text:
    // "36 Chatsworth Drive Carramar"
    const firstRowButton = screen.getByRole('button', {
      name: /36 chatsworth drive carramar/i,
    });

    await user.click(firstRowButton);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('1');
  });
});
