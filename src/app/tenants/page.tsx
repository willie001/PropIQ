import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';
import TenantsListContainer from '@/components/TenantsListContainer';

export default function TenantsPage() {
  return (
    <AuthGate>
      <LayoutShell>
        <div className="max-w-3xl w-full mx-auto space-y-4">
          <header className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Tenants
            </h1>
            <p className="text-sm text-slate-300">
              Manage tenant details and see their active leases.
            </p>
          </header>

          <TenantsListContainer />
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
