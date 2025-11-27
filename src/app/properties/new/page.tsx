'use client';

import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';
import AddPropertyForm, {
  PropertyFormValues,
} from '@/components/AddPropertyForm';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const router = useRouter();

  async function handleAddProperty(values: PropertyFormValues) {
    const { error } = await supabase.from('properties').insert({
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
      is_archived: false,
      // owner_id and account_id are handled by triggers
    });

    if (error) {
      console.error('Error inserting property', error);
      throw error;
    }

    router.push('/properties');
  }

  return (
    <AuthGate>
      <LayoutShell>
        <div className="max-w-3xl w-full mx-auto space-y-4">
          <header className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Add property
            </h1>
            <p className="text-sm text-slate-300">
              Capture the key details for a new property in your
              portfolio.
            </p>
          </header>

          <AddPropertyForm onAdd={handleAddProperty} />
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
