import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';
import PropertyListContainer from '@/components/PropertyListContainer';
import LeaseListContainer from '@/components/LeaseListContainer';
import TenantsListContainer from '@/components/TenantsListContainer';

export default function Home() {
  return (
    <AuthGate>
      <LayoutShell>
        <div className="max-w-3xl w-full mx-auto space-y-6">
          <header className="mb-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              High-level view of your properties, tenants and upcoming tasks.
            </p>
          </header>

          <PropertyListContainer />

          <LeaseListContainer />

          <TenantsListContainer />
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
