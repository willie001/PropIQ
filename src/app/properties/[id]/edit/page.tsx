'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';
import AddPropertyForm, {
  PropertyFormValues,
  PropertyStatus,
} from '@/components/AddPropertyForm';
import { supabase } from '@/lib/supabaseClient';

type LoadState = 'loading' | 'error' | 'not_found' | 'ready';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [state, setState] = useState<LoadState>('loading');
  const [initialValues, setInitialValues] =
    useState<PropertyFormValues | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProperty() {
      if (!id || id === 'undefined') {
        console.error('Invalid property id in route params:', id);
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
          ].join(', ')
        )
        .eq('id', id)
        .single();

      if (!isMounted) return;

      if (error) {
        console.error('Error loading property for edit', error);
        setState('error');
        return;
      }

      if (!data) {
        setState('not_found');
        return;
      }

      const status: PropertyStatus =
        data.status === 'occupied' ? 'occupied' : 'vacant';

      setInitialValues({
        name: data.name ?? '',
        street: data.street ?? '',
        suburb: data.suburb ?? '',
        state: data.state ?? '',
        postcode: data.postcode ?? '',
        country: data.country ?? 'Australia',
        status,
        bedrooms:
          data.bedrooms !== null && data.bedrooms !== undefined
            ? data.bedrooms
            : null,
        bathrooms:
          data.bathrooms !== null && data.bathrooms !== undefined
            ? data.bathrooms
            : null,
        car_bays:
          data.car_bays !== null && data.car_bays !== undefined
            ? data.car_bays
            : null,
        notes: data.notes ?? '',
      });

      setState('ready');
    }

    loadProperty();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleUpdateProperty(values: PropertyFormValues) {
    if (!id || id === 'undefined') {
      console.error('Invalid property id when saving:', id);
      throw new Error('Invalid property id');
    }

    const { error } = await supabase
      .from('properties')
      .update({
        name: values.name,
        street: values.street ?? null,
        suburb: values.suburb,
        state: values.state ?? null,
        postcode: values.postcode ?? null,
        country: values.country || 'Australia',
        status: values.status,
        bedrooms: values.bedrooms ?? null,
        bathrooms: values.bathrooms ?? null,
        car_bays: values.car_bays ?? null,
        notes: values.notes ?? null,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating property', error);
      throw error;
    }

    router.push(`/properties/${id}`);
  }

  return (
    <AuthGate>
      <LayoutShell>
        <div className="max-w-3xl w-full mx-auto space-y-4">
          <header className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Update property
            </h1>
            <p className="text-sm text-slate-300">
              Edit the details of this property.
            </p>
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

          {state === 'ready' && initialValues && (
            <AddPropertyForm
              onAdd={handleUpdateProperty}
              initialValues={initialValues}
              title="Property details"
              submitLabel="Save changes"
            />
          )}
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
