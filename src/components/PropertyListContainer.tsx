'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import PropertyList, { Property } from './PropertyList';

type LoadState = 'loading' | 'error' | 'success';

export default function PropertyListContainer() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    async function loadProperties() {
      setState('loading');

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_archived', false);

      if (error) {
        console.error('Error loading properties', error);
        setState('error');
        return;
      }

      const mapped: Property[] =
        (data ?? []).map((row: any) => ({
          id: row.id,
          name: row.name,
          suburb: row.suburb ?? '',
          status: row.status as 'occupied' | 'vacant',
        })) ?? [];

      setProperties(mapped);
      setState('success');
    }

    loadProperties();
  }, []);

  // Loading state – keeps the same visual style as PropertyList
  if (state === 'loading') {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Your properties
        </h2>
        <p className="text-sm text-slate-400">Loading properties…</p>
      </section>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Your properties
        </h2>
        <p className="text-sm text-red-400">
          Could not load properties. Please try again.
        </p>
      </section>
    );
  }

  // Success – delegate to the tested PropertyList component
  return <PropertyList properties={properties} />;
}
