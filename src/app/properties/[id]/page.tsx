'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabaseClient';

type PropertyStatus = 'occupied' | 'vacant';

type PropertyDetails = {
  id: string;
  name: string | null;
  street: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  status: PropertyStatus;
  bedrooms: number | null;
  bathrooms: number | null;
  car_bays: number | null;
  notes: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

type LoadState = 'loading' | 'error' | 'not_found' | 'ready';
type ArchiveState = 'idle' | 'working';

export default function PropertyDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [state, setState] = useState<LoadState>('loading');
  const [archiveState, setArchiveState] =
    useState<ArchiveState>('idle');
  const [property, setProperty] = useState<PropertyDetails | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProperty() {
      if (!id || id === 'undefined') {
        if (isMounted) setState('not_found');
        return;
      }

      setState('loading');

      const { data, error } = await supabase
        .from('properties')
        .select(
          [
            'id',
            'name',
            'street',
            'suburb',
            'state',
            'postcode',
            'country',
            'status',
            'bedrooms',
            'bathrooms',
            'car_bays',
            'notes',
            'is_archived',
            'created_at',
            'updated_at',
          ].join(', ')
        )
        .eq('id', id)
        .single();

      if (!isMounted) return;

      if (error) {
        console.error('Error loading property details', error);
        setState('error');
        return;
      }

      if (!data) {
        setState('not_found');
        return;
      }

      const status: PropertyStatus =
        data.status === 'occupied' ? 'occupied' : 'vacant';

      setProperty({
        id: data.id,
        name: data.name ?? null,
        street: data.street ?? null,
        suburb: data.suburb ?? null,
        state: data.state ?? null,
        postcode: data.postcode ?? null,
        country: data.country ?? 'Australia',
        status,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        car_bays: data.car_bays ?? null,
        notes: data.notes ?? null,
        is_archived: !!data.is_archived,
        created_at: data.created_at,
        updated_at: data.updated_at,
      });

      setState('ready');
    }

    loadProperty();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleEdit = () => {
    if (!property) return;
    router.push(`/properties/${property.id}/edit`);
  };

  const handleTenantsLeases = () => {
    if (!property) return;
    router.push(`/properties/${property.id}/tenants-leases`);
  };

  const handleArchive = async () => {
    if (!property || property.is_archived) return;

    if (
      !window.confirm(
        'Archive this property? It will be hidden from your main list but kept for history.'
      )
    ) {
      return;
    }

    setArchiveState('working');

    const { error } = await supabase
      .from('properties')
      .update({ is_archived: true })
      .eq('id', property.id);

    if (error) {
      console.error('Error archiving property', error);
      setArchiveState('idle');
      return;
    }

    router.push('/properties');
  };

  const formatDate = (value: string | null) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  };

  return (
    <AuthGate>
      <LayoutShell>
        <div className="max-w-3xl w-full mx-auto space-y-4">
          <header className="mb-2 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Property details
              </h1>
              <p className="text-sm text-slate-300">
                View and manage this property.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/properties')}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition"
            >
              Back to properties
            </button>
          </header>

          {state === 'loading' && (
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
              <p className="text-sm text-slate-300">
                Loading property…
              </p>
            </section>
          )}

          {state === 'error' && (
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
              <p className="text-sm text-red-400">
                Could not load this property. Please try again.
              </p>
            </section>
          )}

          {state === 'not_found' && (
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
              <p className="text-sm text-slate-300">
                This property could not be found or you don&apos;t have
                access to it.
              </p>
            </section>
          )}

          {state === 'ready' && property && (
            <>
              {/* Summary card */}
              <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">
                      {property.name}
                    </h2>

                    <p className="text-sm text-slate-300">
                      {[
                        property.street,
                        property.suburb,
                        property.state,
                        property.postcode,
                        property.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        property.status === 'occupied'
                          ? 'border-emerald-500/60 text-emerald-300'
                          : 'border-amber-500/60 text-amber-300'
                      }`}
                    >
                      {property.status === 'occupied'
                        ? 'Occupied'
                        : 'Vacant'}
                    </span>

                    {property.is_archived && (
                      <span className="text-xs px-2 py-1 rounded-full border border-slate-500 text-slate-300">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                {/* Key figures */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-300 mt-2">
                  <div>
                    <span className="font-semibold">Bedrooms:</span>{' '}
                    {property.bedrooms ?? '-'}
                  </div>
                  <div>
                    <span className="font-semibold">Bathrooms:</span>{' '}
                    {property.bathrooms ?? '-'}
                  </div>
                  <div>
                    <span className="font-semibold">Car bays:</span>{' '}
                    {property.car_bays ?? '-'}
                  </div>
                </div>
              </section>

              {/* Actions */}
              <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">
                  Actions
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-xs md:text-sm px-3 py-2 rounded-md bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition"
                  >
                    Update property
                  </button>

                  <button
                    type="button"
                    onClick={handleTenantsLeases}
                    className="text-xs md:text-sm px-3 py-2 rounded-md border border-sky-500/70 text-sky-200 hover:border-sky-400 hover:text-sky-100 transition"
                  >
                    Tenants &amp; leases
                  </button>

                  <button
                    type="button"
                    onClick={handleArchive}
                    disabled={
                      property.is_archived ||
                      archiveState === 'working'
                    }
                    className="text-xs md:text-sm px-3 py-2 rounded-md border border-red-500/70 text-red-300 hover:border-red-400 hover:text-red-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {property.is_archived
                      ? 'Archived'
                      : archiveState === 'working'
                      ? 'Archiving…'
                      : 'Archive property'}
                  </button>
                </div>
              </section>

              {/* Notes + meta */}
              <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:p-6 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">
                    Notes
                  </h3>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">
                    {property.notes?.trim() || 'No notes recorded.'}
                  </p>
                </div>

                <hr className="border-slate-800" />

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>
                    <span className="font-semibold">
                      Created:
                    </span>{' '}
                    {formatDate(property.created_at)}
                  </div>
                  <div>
                    <span className="font-semibold">
                      Last updated:
                    </span>{' '}
                    {formatDate(property.updated_at)}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
