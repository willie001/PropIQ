export type TenantListItem = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  activeLeasesCount: number;
};

type TenantsListProps = {
  tenants: TenantListItem[];
};

export default function TenantsList({ tenants }: TenantsListProps) {
  const hasTenants = tenants.length > 0;

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3 text-slate-100">
        Tenants
      </h2>

      {!hasTenants && (
        <p className="text-sm text-slate-400">
          No tenants captured yet. Once you add tenants and link them to leases,
          they will show here.
        </p>
      )}

      {hasTenants && (
        <div className="space-y-2">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg bg-slate-900/60 px-3 py-2 border border-slate-700"
            >
              <div className="space-y-1">
                <p className="font-medium text-slate-100">
                  {tenant.fullName}
                </p>
                <p className="text-xs text-slate-400">
                  {tenant.email || 'No email recorded'}
                </p>
                {tenant.phone && (
                  <p className="text-xs text-slate-500">
                    {tenant.phone}
                  </p>
                )}
              </div>

              <div className="text-xs md:text-[11px] text-slate-300">
                {tenant.activeLeasesCount > 0 ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full border border-emerald-500/60 text-emerald-300">
                    {tenant.activeLeasesCount} active lease
                    {tenant.activeLeasesCount > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full border border-slate-600 text-slate-300">
                    No active leases
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
