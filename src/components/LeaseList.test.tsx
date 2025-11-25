import { render, screen } from '@testing-library/react';
import LeaseList, { Lease } from './LeaseList';

const sampleLeases: Lease[] = [
  {
    id: '1',
    propertyName: '36 Chatsworth Drive',
    startDate: '2025-01-01',
    rentAmount: 850,
    rentFrequency: 'weekly',
    status: 'active',
    tenantNames: ['Shannon Tenant', 'Angus Tenant'],
  },
  {
    id: '2',
    propertyName: '11 Staunton Vale',
    startDate: '2024-06-01',
    rentAmount: 750,
    rentFrequency: 'weekly',
    status: 'ended',
    tenantNames: ['Regardt Tenant'],
  },
];

describe('LeaseList', () => {
  it('shows a heading for the leases section', () => {
    render(<LeaseList leases={sampleLeases} />);

    expect(
      screen.getByRole('heading', { name: /current leases/i })
    ).toBeInTheDocument();
  });

  it('renders lease rows with property name, tenants and rent', () => {
    render(<LeaseList leases={sampleLeases} />);

    // Property names
    expect(
      screen.getByText(/36 chatsworth drive/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/11 staunton vale/i)
    ).toBeInTheDocument();

    // Tenant names
    expect(
      screen.getByText(/shannon tenant, angus tenant/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/regardt tenant/i)
    ).toBeInTheDocument();

    // Rent strings
    expect(
      screen.getByText(/\$850\.00 \/ weekly/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/\$750\.00 \/ weekly/i)
    ).toBeInTheDocument();
  });

  it('shows a friendly message when there are no leases', () => {
    render(<LeaseList leases={[]} />);

    expect(
      screen.getByText(/no leases recorded yet/i)
    ).toBeInTheDocument();
  });
});
