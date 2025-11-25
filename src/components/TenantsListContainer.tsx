'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import TenantsList, { TenantListItem } from './TenantsList';

type LoadState = 'loading' | 'error' | 'success';

export default function TenantsListContainer() {
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  async function loadTenants() {
    setState('loading');

    const { data, error } = await supabase
      .from('tenants')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        lease_tenants (
          leases ( status )
        )
      `);

    if (error) {
      console.error('Error loading tenants', error);
      setState('error');
      return;
    }

    const mapped: TenantListItem[] =
      (data ?? []).map((row: any) => {
        const fullName = `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim();

        const activeLeasesCount = (row.lease_tenants ?? []).filter(
          (lt: any) => lt.leases && lt.leases.status === 'active'
        ).length;

        return {
          id: row.id,
          fullName: fullName || 'Unnamed tenant',
          email: row.email ?? null,
          phone: row.phone ?? null,
          activeLeasesCount,
        } as TenantListItem;
      }) ?? [];

    setTenants(mapped);
    setState('success');
  }

  useEffect(() => {
    loadTenants();
  }, []);

  if (state === 'loading') {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Tenants
        </h2>
        <p className="text-sm text-slate-400">Loading tenants…</p>
      </section>
    );
  }

  if (state === 'error') {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Tenants
        </h2>
        <p className="text-sm text-red-400">
          Could not load tenants. Please try again.
        </p>
      </section>
    );
  }

  return <TenantsList tenants={tenants} />;
}
