'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import PropertyList, { Property } from './PropertyList';

type LoadState = 'loading' | 'error' | 'success';

export default function PropertyListContainer() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const router = useRouter();

  async function loadProperties() {
    setState('loading');

    const { data, error } = await supabase
      .from('properties')
      .select('id, name, suburb, status, is_archived')
      .eq('is_archived', false)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error loading properties', error);
      setState('error');
      return;
    }

    const mapped: Property[] =
      (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        suburb: row.suburb,
        status: row.status === 'occupied' ? 'occupied' : 'vacant',
      })) ?? [];

    setProperties(mapped);
    setState('success');
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function handleArchiveProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .update({ is_archived: true })
      .eq('id', id);

    if (error) {
      console.error('Error archiving property', error);
      return;
    }

    await loadProperties();
  }

  function handleUpdateProperty(id: string) {
    router.push(`/properties/${id}/edit`);
  }

  function handleManageTenants(id: string) {
    router.push(`/properties/${id}/tenants-leases`);
  }

  if (state === 'loading') {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Properties
        </h2>
        <p className="text-sm text-slate-400">Loading properties…</p>
      </section>
    );
  }

  if (state === 'error') {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Properties
        </h2>
        <p className="text-sm text-red-400">
          Could not load properties. Please try again.
        </p>
      </section>
    );
  }

  return (
    <PropertyList
      properties={properties}
      onArchive={handleArchiveProperty}
      onUpdateProperty={handleUpdateProperty}
      onManageTenants={handleManageTenants}
    />
  );
}
