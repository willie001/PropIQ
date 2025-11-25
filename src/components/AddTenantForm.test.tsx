import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTenantForm, { TenantFormValues } from './AddTenantForm';

describe('AddTenantForm', () => {
  it('renders inputs for first name, last name, email, phone and a submit button', () => {
    const noop = () => {};
    render(<AddTenantForm onAdd={noop} />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add tenant/i })
    ).toBeInTheDocument();
  });

  it('validates that first and last name are required', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();

    render(<AddTenantForm onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: /add tenant/i }));

    expect(
      screen.getByText(/first name and last name are required/i)
    ).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('calls onAdd with form values and clears inputs after submit', async () => {
    const onAdd = jest.fn<Promise<void>, [TenantFormValues]>(() =>
      Promise.resolve()
    );
    const user = userEvent.setup();

    render(<AddTenantForm onAdd={onAdd} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);

    await user.type(firstNameInput, 'Shannon');
    await user.type(lastNameInput, 'Tenant');
    await user.type(emailInput, 'shannon@example.com');
    await user.type(phoneInput, '0400 000 001');

    await user.click(screen.getByRole('button', { name: /add tenant/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith({
      firstName: 'Shannon',
      lastName: 'Tenant',
      email: 'shannon@example.com',
      phone: '0400 000 001',
    });

    expect(firstNameInput).toHaveValue('');
    expect(lastNameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(phoneInput).toHaveValue('');
  });
});
