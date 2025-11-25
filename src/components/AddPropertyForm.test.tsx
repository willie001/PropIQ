import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddPropertyForm, { PropertyFormValues } from './AddPropertyForm';

describe('AddPropertyForm', () => {
  it('renders inputs for name, suburb, status and a submit button', () => {
    const noop = () => {};
    render(<AddPropertyForm onAdd={noop} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/suburb/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add property/i })
    ).toBeInTheDocument();
  });

  it('validates that name is required', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();

    render(<AddPropertyForm onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: /add property/i }));

    expect(
      screen.getByText(/name is required/i)
    ).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('calls onAdd with form values and clears inputs after submit', async () => {
    const onAdd = jest.fn<Promise<void>, [PropertyFormValues]>(() =>
      Promise.resolve()
    );
    const user = userEvent.setup();

    render(<AddPropertyForm onAdd={onAdd} />);

    const nameInput = screen.getByLabelText(/name/i);
    const suburbInput = screen.getByLabelText(/suburb/i);
    const statusSelect = screen.getByLabelText(/status/i);

    await user.type(nameInput, '99 Test Street');
    await user.type(suburbInput, 'Testville');
    await user.selectOptions(statusSelect, 'occupied');

    await user.click(screen.getByRole('button', { name: /add property/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith({
      name: '99 Test Street',
      suburb: 'Testville',
      status: 'occupied',
    });

    // Inputs should be cleared after a successful submit
    expect(nameInput).toHaveValue('');
    expect(suburbInput).toHaveValue('');
  });
});
