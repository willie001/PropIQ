import { render, screen } from '@testing-library/react';
import TenantsList, { TenantListItem } from './TenantsList';

const sampleTenants: TenantListItem[] = [
  {
    id: '1',
    fullName: 'Shannon Tenant',
    email: 'shannon@example.com',
    phone: '0400 000 001',
    activeLeasesCount: 1,
  },
  {
    id: '2',
    fullName: 'Regardt Tenant',
    email: 'regardt@example.com',
    phone: '0400 000 002',
    activeLeasesCount: 0,
  },
];

describe('TenantsList', () => {
  it('shows a heading for the tenants section', () => {
    render(<TenantsList tenants={sampleTenants} />);

    expect(
      screen.getByRole('heading', { name: /tenants/i })
    ).toBeInTheDocument();
  });

  it('renders tenant rows with name, email and phone', () => {
    render(<TenantsList tenants={sampleTenants} />);

    expect(
      screen.getByText(/shannon tenant/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/shannon@example\.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/0400 000 001/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/regardt tenant/i)
    ).toBeInTheDocument();
  });

  it('shows active lease count per tenant', () => {
    render(<TenantsList tenants={sampleTenants} />);

    expect(
      screen.getByText(/1 active lease/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no active leases/i)
    ).toBeInTheDocument();
  });

  it('shows a friendly message when there are no tenants', () => {
    render(<TenantsList tenants={[]} />);

    expect(
      screen.getByText(/no tenants captured yet/i)
    ).toBeInTheDocument();
  });
});
