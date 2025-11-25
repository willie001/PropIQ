'use client';

import { useState, FormEvent } from 'react';

export type LeaseFormPropertyOption = {
  id: string;
  name: string;
};

export type LeaseFormTenantOption = {
  id: string;
  fullName: string;
};

export type LeaseFormValues = {
  propertyId: string;
  tenantId: string;
  startDate: string; // yyyy-mm-dd
  rentAmount: number;
  rentFrequency: 'weekly' | 'fortnightly' | 'monthly';
  bondAmount?: number;
};

type AddLeaseFormProps = {
  properties: LeaseFormPropertyOption[];
  tenants: LeaseFormTenantOption[];
  onCreate: (values: LeaseFormValues) => Promise<void> | void;
};

export default function AddLeaseForm({
  properties,
  tenants,
  onCreate,
}: AddLeaseFormProps) {
  const [propertyId, setPropertyId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [rentAmount, setRentAmount] = useState<number | undefined>(undefined);
  const [rentFrequency, setRentFrequency] =
    useState<LeaseFormValues['rentFrequency']>('weekly');
  const [bondAmount, setBondAmount] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function parseNumber(value: string): number | undefined {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const num = Number(trimmed);
    return Number.isNaN(num) ? undefined : num;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!propertyId || !tenantId || !startDate) {
      setError('Property, tenant and start date are required');
      return;
    }

    const rent = rentAmount ?? 0;

    const payload: LeaseFormValues = {
      propertyId,
      tenantId,
      startDate,
      rentAmount: rent,
      rentFrequency,
      bondAmount,
    };

    try {
      setIsSubmitting(true);
      await onCreate(payload);
      // clear
      setPropertyId('');
      setTenantId('');
      setStartDate('');
      setRentAmount(undefined);
      setBondAmount(undefined);
      setRentFrequency('weekly');
    } catch (err) {
      console.error('Failed to create lease', err);
      setError('Could not create lease. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm mb-4">
      <h2 className="text-lg font-semibold mb-3 text-slate-100">
        Add a lease
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 md:grid-cols-[1.5fr,1.5fr,1.2fr,1.2fr,1.2fr,auto] md:items-end"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="lease-property"
            className="text-xs font-medium text-slate-300"
          >
            Property
          </label>
          <select
            id="lease-property"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Select property…</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="lease-tenant"
            className="text-xs font-medium text-slate-300"
          >
            Tenant
          </label>
          <select
            id="lease-tenant"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Select tenant…</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="lease-start-date"
            className="text-xs font-medium text-slate-300"
          >
            Start date
          </label>
          <input
            id="lease-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="lease-rent-amount"
            className="text-xs font-medium text-slate-300"
          >
            Rent amount
          </label>
          <input
            id="lease-rent-amount"
            type="number"
            inputMode="decimal"
            value={rentAmount ?? ''}
            onChange={(e) => setRentAmount(parseNumber(e.target.value))}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="lease-frequency"
            className="text-xs font-medium text-slate-300"
          >
            Frequency
          </label>
          <select
            id="lease-frequency"
            value={rentFrequency}
            onChange={(e) =>
              setRentFrequency(e.target.value as LeaseFormValues['rentFrequency'])
            }
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
          </select>

          <label
            htmlFor="lease-bond"
            className="text-xs font-medium text-slate-300 mt-2"
          >
            Bond
          </label>
          <input
            id="lease-bond"
            type="number"
            inputMode="decimal"
            value={bondAmount ?? ''}
            onChange={(e) => setBondAmount(parseNumber(e.target.value))}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="mt-2 md:mt-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full whitespace-nowrap rounded-md bg-emerald-500 text-slate-900 text-sm font-semibold px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-400 transition"
          >
            {isSubmitting ? 'Adding…' : 'Add lease'}
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
