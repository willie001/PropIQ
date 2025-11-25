export type LeaseStatus = 'pending' | 'active' | 'ended';
export type RentFrequency = 'weekly' | 'fortnightly' | 'monthly';

export type Lease = {
  id: string;
  propertyName: string;
  startDate: string; // ISO date string
  rentAmount: number;
  rentFrequency: RentFrequency;
  status: LeaseStatus;
  tenantNames: string[];
};

type LeaseListProps = {
  leases: Lease[];
};

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatRent(amount: number, frequency: RentFrequency) {
  return `$${amount.toFixed(2)} / ${frequency}`;
}

function statusClasses(status: LeaseStatus) {
  switch (status) {
    case 'active':
      return 'border-emerald-500/60 text-emerald-300';
    case 'pending':
      return 'border-amber-500/60 text-amber-300';
    case 'ended':
    default:
      return 'border-slate-600 text-slate-300';
  }
}

export default function LeaseList({ leases }: LeaseListProps) {
  const hasLeases = leases.length > 0;

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3 text-slate-100">
        Current leases
      </h2>

      {!hasLeases && (
        <p className="text-sm text-slate-400">
          No leases recorded yet. Once you add tenants and a lease for a
          property, they will show here.
        </p>
      )}

      {hasLeases && (
        <div className="space-y-2">
          {leases.map((lease) => (
            <div
              key={lease.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg bg-slate-900/60 px-3 py-2 border border-slate-700"
            >
              <div className="space-y-1">
                <p className="font-medium text-slate-100">
                  {lease.propertyName}
                </p>
                <p className="text-xs text-slate-400">
                  {lease.tenantNames.length > 0
                    ? lease.tenantNames.join(', ')
                    : 'No tenants linked'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs md:text-[11px] md:justify-end">
                <span className="px-2 py-1 rounded-full border border-slate-600 text-slate-300">
                  Start: {formatDate(lease.startDate)}
                </span>
                <span className="px-2 py-1 rounded-full border border-slate-600 text-slate-300">
                  {formatRent(lease.rentAmount, lease.rentFrequency)}
                </span>
                <span
                  className={`px-2 py-1 rounded-full border ${statusClasses(
                    lease.status
                  )}`}
                >
                  {lease.status === 'active'
                    ? 'Active'
                    : lease.status === 'pending'
                    ? 'Pending'
                    : 'Ended'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
