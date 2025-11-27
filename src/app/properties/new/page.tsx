'use client';

import { useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import LayoutShell from '@/components/LayoutShell';
import AddPropertyForm, {
  PropertyFormValues,
} from '@/components/AddPropertyForm';
import { supabase } from '@/lib/supabaseClient';

export default function NewPropertyPage() {
  const router = useRouter();

  async function handleAddProperty(values: PropertyFormValues) {
    const { error } = await supabase.from('properties').insert({
      name: values.name,
      suburb: values.suburb,
      status: values.status,
      is_archived: false,
    });

    if (error) {
      // 👇 more detailed logging
      console.error('Error inserting property:', {
        message: (error as any).message,
        code: (error as any).code,
        details: (error as any).details,
        hint: (error as any).hint,
      });
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
              Capture a new property in your portfolio.
            </p>
          </header>

          <AddPropertyForm onAdd={handleAddProperty} />
        </div>
      </LayoutShell>
    </AuthGate>
  );
}
