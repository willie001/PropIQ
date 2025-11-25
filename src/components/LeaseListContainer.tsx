'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LeaseList, { Lease } from './LeaseList';
import AddLeaseForm, {
  LeaseFormValues,
  LeaseFormPropertyOption,
  LeaseFormTenantOption,
} from './AddLeaseForm';

type LoadState = 'loading' | 'error' | 'success';

export default function LeaseListContainer() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [propertyOptions, setPropertyOptions] = useState<LeaseFormPropertyOption[]>([]);
  const [tenantOptions, setTenantOptions] = useState<LeaseFormTenantOption[]>([]);

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

  async function loadOptions() {
    // properties
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('id, name')
      .eq('is_archived', false);

    setPropertyOptions(
      (propertiesData ?? []).map((p: any) => ({
        id: p.id,
        name: p.name as string,
      }))
    );

    // tenants
    const { data: tenantsData } = await supabase
      .from('tenants')
      .select('id, first_name, last_name');

    setTenantOptions(
      (tenantsData ?? []).map((t: any) => ({
        id: t.id,
        fullName: `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim() || 'Unnamed tenant',
      }))
    );
  }

  useEffect(() => {
    // load leases and options in parallel
    loadLeases();
    loadOptions();
  }, []);

  async function handleCreateLease(values: LeaseFormValues) {
    const { data, error } = await supabase
      .from('leases')
      .insert({
        property_id: values.propertyId,
        start_date: values.startDate,
        rent_amount: values.rentAmount,
        rent_frequency: values.rentFrequency,
        bond_amount: values.bondAmount ?? null,
        status: 'active',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting lease', error);
      throw error;
    }

    const leaseId = data.id;

    const { error: ltError } = await supabase
      .from('lease_tenants')
      .insert({
        lease_id: leaseId,
        tenant_id: values.tenantId,
      });

    if (ltError) {
      console.error('Error linking tenant to lease', ltError);
      throw ltError;
    }

    await loadLeases();
  }

  if (state === 'loading') {
    return (
      <div className="space-y-4">
        <AddLeaseForm
          properties={propertyOptions}
          tenants={tenantOptions}
          onCreate={handleCreateLease}
        />
        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">
            Current leases
          </h2>
          <p className="text-sm text-slate-400">Loading leases…</p>
        </section>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="space-y-4">
        <AddLeaseForm
          properties={propertyOptions}
          tenants={tenantOptions}
          onCreate={handleCreateLease}
        />
        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">
            Current leases
          </h2>
          <p className="text-sm text-red-400">
            Could not load leases. Please try again.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AddLeaseForm
        properties={propertyOptions}
        tenants={tenantOptions}
        onCreate={handleCreateLease}
      />
      <LeaseList leases={leases} />
    </div>
  );
}
