'use client';

import { useState, useEffect, FormEvent } from 'react';

export type PropertyStatus = 'occupied' | 'vacant';

export type PropertyFormValues = {
  name: string;
  street?: string;
  suburb: string;
  state?: string;
  postcode?: string;
  country?: string;
  status: PropertyStatus;
  bedrooms?: number | null;
  bathrooms?: number | null;
  car_bays?: number | null;
  notes?: string;
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
  const [street, setStreet] = useState('');
  const [suburb, setSuburb] = useState('');
  const [stateField, setStateField] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('Australia');
  const [status, setStatus] = useState<PropertyStatus>('occupied');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [bathrooms, setBathrooms] = useState<string>('');
  const [carBays, setCarBays] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate state when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name ?? '');
      setStreet(initialValues.street ?? '');
      setSuburb(initialValues.suburb ?? '');
      setStateField(initialValues.state ?? '');
      setPostcode(initialValues.postcode ?? '');
      setCountry(initialValues.country ?? 'Australia');
      setStatus(initialValues.status ?? 'occupied');
      setBedrooms(
        initialValues.bedrooms !== undefined && initialValues.bedrooms !== null
          ? String(initialValues.bedrooms)
          : ''
      );
      setBathrooms(
        initialValues.bathrooms !== undefined && initialValues.bathrooms !== null
          ? String(initialValues.bathrooms)
          : ''
      );
      setCarBays(
        initialValues.car_bays !== undefined && initialValues.car_bays !== null
          ? String(initialValues.car_bays)
          : ''
      );
      setNotes(initialValues.notes ?? '');
    } else {
      // Defaults for create mode
      setName('');
      setStreet('');
      setSuburb('');
      setStateField('WA');
      setPostcode('');
      setCountry('Australia');
      setStatus('occupied');
      setBedrooms('');
      setBathrooms('');
      setCarBays('');
      setNotes('');
    }
  }, [initialValues]);

  function parseOptionalInt(value: string): number | null | undefined {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const num = Number.parseInt(trimmed, 10);
    if (Number.isNaN(num)) return null;
    return num;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !suburb.trim()) {
      setError('Name and suburb are required');
      return;
    }

    const payload: PropertyFormValues = {
      name: name.trim(),
      street: street.trim() || name.trim(),
      suburb: suburb.trim(),
      state: stateField.trim() || undefined,
      postcode: postcode.trim() || undefined,
      country: (country || 'Australia').trim(),
      status,
      bedrooms: parseOptionalInt(bedrooms),
      bathrooms: parseOptionalInt(bathrooms),
      car_bays: parseOptionalInt(carBays),
      notes: notes.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      await onAdd(payload);

      // Only reset the form in "create" mode (no initialValues)
      if (!initialValues) {
        setName('');
        setStreet('');
        setSuburb('');
        setStateField('');
        setPostcode('');
        setCountry('Australia');
        setStatus('occupied');
        setBedrooms('');
        setBathrooms('');
        setCarBays('');
        setNotes('');
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

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Row 1: Name + Street */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="property-name"
              className="text-xs font-medium text-slate-300"
            >
              Property name *
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
              htmlFor="property-street"
              className="text-xs font-medium text-slate-300"
            >
              Street
            </label>
            <input
              id="property-street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Row 2: Suburb + State + Postcode */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="property-suburb"
              className="text-xs font-medium text-slate-300"
            >
              Suburb *
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
              htmlFor="property-state"
              className="text-xs font-medium text-slate-300"
            >
              State
            </label>
            <input
              id="property-state"
              type="text"
              value={stateField}
              onChange={(e) => setStateField(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="property-postcode"
              className="text-xs font-medium text-slate-300"
            >
              Postcode
            </label>
            <input
              id="property-postcode"
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Row 3: Country + Status */}
        <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="property-country"
              className="text-xs font-medium text-slate-300"
            >
              Country
            </label>
            <input
              id="property-country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
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
        </div>

        {/* Row 4: Bedrooms / Bathrooms / Car bays */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="property-bedrooms"
              className="text-xs font-medium text-slate-300"
            >
              Bedrooms
            </label>
            <input
              id="property-bedrooms"
              type="number"
              inputMode="numeric"
              min={0}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="property-bathrooms"
              className="text-xs font-medium text-slate-300"
            >
              Bathrooms
            </label>
            <input
              id="property-bathrooms"
              type="number"
              inputMode="numeric"
              min={0}
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="property-carbays"
              className="text-xs font-medium text-slate-300"
            >
              Car bays
            </label>
            <input
              id="property-carbays"
              type="number"
              inputMode="numeric"
              min={0}
              value={carBays}
              onChange={(e) => setCarBays(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Row 5: Notes + Submit */}
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr),auto] md:items-end">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="property-notes"
              className="text-xs font-medium text-slate-300"
            >
              Notes
            </label>
            <textarea
              id="property-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
            />
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
