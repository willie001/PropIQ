import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';
import LeaseListContainer from '@/components/LeaseListContainer';

export default function LeasesPage() {
  return (
    <AuthGate>
      <LayoutShell>
        <div className="max-w-3xl w-full mx-auto space-y-4">
          <header className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Leases
            </h1>
            <p className="text-sm text-slate-300">
              Overview of leases across your portfolio.
            </p>
          </header>

          <LeaseListContainer />
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
