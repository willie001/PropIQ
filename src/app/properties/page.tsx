import Link from 'next/link';
import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';
import PropertyListContainer from '@/components/PropertyListContainer';

export default function PropertiesPage() {
  return (
    <AuthGate>
      <LayoutShell>
        <div className="max-w-3xl w-full mx-auto space-y-4">
          <header className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Properties
              </h1>
              <p className="text-sm text-slate-300">
                Manage your properties, and drill down to tenants and leases.
              </p>
            </div>

            <Link
              href="/properties/new"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 text-slate-900 font-semibold text-sm px-3 py-2 hover:bg-emerald-400 transition"
            >
              <span className="text-lg leading-none mr-1">+</span>
              <span className="hidden sm:inline">Add property</span>
            </Link>
          </header>

          <PropertyListContainer />
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
