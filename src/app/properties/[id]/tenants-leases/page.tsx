import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';

type Props = {
  params: { id: string };
};

export default function PropertyTenantsLeasesPage({ params }: Props) {
  const { id } = params;

  return (
    <AuthGate>
      <LayoutShell>
        <div className="max-w-3xl w-full mx-auto space-y-4">
          <header className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Tenants &amp; leases
            </h1>
            <p className="text-sm text-slate-300">
              Property ID: <span className="font-mono text-xs">{id}</span>
            </p>
          </header>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
            <p className="text-sm text-slate-300">
              This view will later show tenants and leases for this property,
              and let you manage them.
            </p>
          </section>
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
