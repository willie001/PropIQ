'use client';

import { useState, useEffect, FormEvent } from 'react';

export type PropertyStatus = 'occupied' | 'vacant';

export type PropertyFormValues = {
  name: string;
  suburb: string;
  status: PropertyStatus;
};

type AddPropertyFormProps = {
  onAdd: (values: PropertyFormValues) => Promise<void> | void;
  /** When provided, form will start with these values and NOT reset after submit */
  initialValues?: PropertyFormValues | null;
  /** Optional section title (defaults to "Add a property") */
  title?: string;
  /** Optional submit button label (defaults to "Add property") */
  submitLabel?: string;
};

export default function AddPropertyForm({
  onAdd,
  initialValues = null,
  title = 'Add a property',
  submitLabel = 'Add property',
}: AddPropertyFormProps) {
  const [name, setName] = useState('');
  const [suburb, setSuburb] = useState('');
  const [status, setStatus] = useState<PropertyStatus>('occupied');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate state when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name ?? '');
      setSuburb(initialValues.suburb ?? '');
      setStatus(initialValues.status ?? 'occupied');
    }
  }, [initialValues]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !suburb.trim()) {
      setError('Name and suburb are required');
      return;
    }

    const payload: PropertyFormValues = {
      name: name.trim(),
      suburb: suburb.trim(),
      status,
    };

    try {
      setIsSubmitting(true);
      await onAdd(payload);

      // Only reset the form in "create" mode (no initialValues)
      if (!initialValues) {
        setName('');
        setSuburb('');
        setStatus('occupied');
      }
    } catch (err) {
      console.error('Failed to add property', err);
      setError('Could not save property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-slate-100">
        {title}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 md:grid-cols-[1.4fr,1.4fr,auto] md:items-end"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="property-name"
            className="text-xs font-medium text-slate-300"
          >
            Property name
          </label>
          <input
            id="property-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="property-suburb"
            className="text-xs font-medium text-slate-300"
          >
            Suburb
          </label>
          <input
            id="property-suburb"
            type="text"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="property-status"
            className="text-xs font-medium text-slate-300"
          >
            Status
          </label>
          <select
            id="property-status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as PropertyStatus)
            }
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="occupied">Occupied</option>
            <option value="vacant">Vacant</option>
          </select>
        </div>

        <div className="mt-2 md:mt-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full whitespace-nowrap rounded-md bg-emerald-500 text-slate-900 text-sm font-semibold px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-400 transition"
          >
            {isSubmitting
              ? submitLabel === 'Add property'
                ? 'Adding…'
                : 'Saving…'
              : submitLabel}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </section>
  );
}
