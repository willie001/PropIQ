'use client';

import { useState, FormEvent } from 'react';

export type TenantFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AddTenantFormProps = {
  onAdd: (values: TenantFormValues) => Promise<void> | void;
};

export default function AddTenantForm({ onAdd }: AddTenantFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    const payload: TenantFormValues = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      setIsSubmitting(true);
      await onAdd(payload);
      // clear after success
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      console.error('Failed to add tenant', err);
      setError('Could not add tenant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm mb-4">
      <h2 className="text-lg font-semibold mb-3 text-slate-100">
        Add a tenant
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 md:grid-cols-[1.2fr,1.2fr,1.4fr,auto] md:items-end"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="tenant-first-name"
            className="text-xs font-medium text-slate-300"
          >
            First name
          </label>
          <input
            id="tenant-first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="tenant-last-name"
            className="text-xs font-medium text-slate-300"
          >
            Last name
          </label>
          <input
            id="tenant-last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="tenant-email"
            className="text-xs font-medium text-slate-300"
          >
            Email
          </label>
          <input
            id="tenant-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <label
            htmlFor="tenant-phone"
            className="text-xs font-medium text-slate-300 mt-2"
          >
            Phone
          </label>
          <input
            id="tenant-phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="mt-2 md:mt-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full whitespace-nowrap rounded-md bg-emerald-500 text-slate-900 text-sm font-semibold px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-400 transition"
          >
            {isSubmitting ? 'Adding…' : 'Add tenant'}
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
