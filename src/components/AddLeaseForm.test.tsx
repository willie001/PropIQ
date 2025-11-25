import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddLeaseForm, {
  LeaseFormValues,
  LeaseFormPropertyOption,
  LeaseFormTenantOption,
} from './AddLeaseForm';

const propertyOptions: LeaseFormPropertyOption[] = [
  { id: 'p1', name: '36 Chatsworth Drive' },
  { id: 'p2', name: '11 Staunton Vale' },
];

const tenantOptions: LeaseFormTenantOption[] = [
  { id: 't1', fullName: 'Shannon Tenant' },
  { id: 't2', fullName: 'Regardt Tenant' },
];

describe('AddLeaseForm', () => {
  it('renders selects for property and tenant plus basic fields', () => {
    const noop = () => {};
    render(
      <AddLeaseForm
        properties={propertyOptions}
        tenants={tenantOptions}
        onCreate={noop}
      />
    );

    expect(screen.getByLabelText(/property/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tenant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rent amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add lease/i })
    ).toBeInTheDocument();
  });

  it('validates property, tenant and start date are required', async () => {
    const onCreate = jest.fn();
    const user = userEvent.setup();

    render(
      <AddLeaseForm
        properties={propertyOptions}
        tenants={tenantOptions}
        onCreate={onCreate}
      />
    );

    await user.click(screen.getByRole('button', { name: /add lease/i }));

    expect(
      screen.getByText(/property, tenant and start date are required/i)
    ).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('calls onCreate with form values and clears simple inputs after submit', async () => {
    const onCreate = jest.fn<Promise<void>, [LeaseFormValues]>(() =>
      Promise.resolve()
    );
    const user = userEvent.setup();

    render(
      <AddLeaseForm
        properties={propertyOptions}
        tenants={tenantOptions}
        onCreate={onCreate}
      />
    );

    await user.selectOptions(
      screen.getByLabelText(/property/i),
      'p1'
    );
    await user.selectOptions(
      screen.getByLabelText(/tenant/i),
      't1'
    );

    const startDateInput = screen.getByLabelText(/start date/i);
    const rentInput = screen.getByLabelText(/rent amount/i);
    const bondInput = screen.getByLabelText(/bond/i);

    await user.type(startDateInput, '2025-01-01');
    await user.clear(rentInput);
    await user.type(rentInput, '850');
    await user.clear(bondInput);
    await user.type(bondInput, '3400');

    await user.click(screen.getByRole('button', { name: /add lease/i }));

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith({
      propertyId: 'p1',
      tenantId: 't1',
      startDate: '2025-01-01',
      rentAmount: 850,
      rentFrequency: 'weekly',
      bondAmount: 3400,
    });

    // Inputs cleared (selects back to empty, fields cleared)
    expect(startDateInput).toHaveValue('');
    expect(rentInput).toHaveValue(null);
  });
});
