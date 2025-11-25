'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LeaseList, { Lease } from './LeaseList';

type LoadState = 'loading' | 'error' | 'success';

export default function LeaseListContainer() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  async function loadLeases() {
    setState('loading');

    const { data, error } = await supabase
      .from('leases')
      .select(`
        id,
        start_date,
        rent_amount,
        rent_frequency,
        status,
        properties (
          name
        ),
        lease_tenants (
          tenants (
            first_name,
            last_name
          )
        )
      `);

    if (error) {
      console.error('Error loading leases', error);
      setState('error');
      return;
    }

    const mapped: Lease[] =
      (data ?? []).map((row: any) => {
        const propertyName = row.properties?.name ?? 'Unknown property';

        const tenantNames: string[] = (row.lease_tenants ?? [])
          .map((lt: any) =>
            lt.tenants
              ? `${lt.tenants.first_name ?? ''} ${lt.tenants.last_name ?? ''}`.trim()
              : null
          )
          .filter((name: string | null) => !!name) as string[];

        return {
          id: row.id,
          propertyName,
          startDate: row.start_date,
          rentAmount: Number(row.rent_amount ?? 0),
          rentFrequency: row.rent_frequency ?? 'weekly',
          status: row.status ?? 'pending',
          tenantNames,
        } as Lease;
      }) ?? [];

    setLeases(mapped);
    setState('success');
  }

  useEffect(() => {
    loadLeases();
  }, []);

  if (state === 'loading') {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Current leases
        </h2>
        <p className="text-sm text-slate-400">Loading leases…</p>
      </section>
    );
  }

  if (state === 'error') {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Current leases
        </h2>
        <p className="text-sm text-red-400">
          Could not load leases. Please try again.
        </p>
      </section>
    );
  }

  return <LeaseList leases={leases} />;
}
