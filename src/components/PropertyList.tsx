'use client';

import { useState } from 'react';

type PropertyStatus = 'occupied' | 'vacant';
type Filter = 'all' | PropertyStatus;

export type Property = {
  id: string;
  name: string;
  suburb: string;
  status: PropertyStatus;
};

type PropertyListProps = {
  properties: Property[];
};

export default function PropertyList({ properties }: PropertyListProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const hasProperties = properties.length > 0;

  const occupiedCount = properties.filter((p) => p.status === 'occupied').length;
  const vacantCount = properties.filter((p) => p.status === 'vacant').length;

  const filteredProperties =
    filter === 'all'
      ? properties
      : properties.filter((p) => p.status === filter);

  const filters: { value: Filter; label: string }[] = [
    { value: 'all',       label: 'All' },
    { value: 'occupied',  label: 'Occupied' },
    { value: 'vacant',    label: 'Vacant' },
  ];

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2 text-slate-100">
        Your properties
      </h2>

      {!hasProperties ? (
        <p className="text-sm text-slate-400">
          You don’t have any properties yet. Add your first property to get
          started.
        </p>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-3">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} total ·{' '}
            {occupiedCount} {occupiedCount === 1 ? 'occupied' : 'occupied'} ·{' '}
            {vacantCount} {vacantCount === 1 ? 'vacant' : 'vacant'}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={`text-xs px-3 py-1 rounded-full border transition
                  ${
                    filter === f.value
                      ? 'bg-slate-100 text-slate-900 border-slate-100'
                      : 'bg-slate-900/40 text-slate-200 border-slate-600 hover:border-slate-400'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <ul className="space-y-3">
            {filteredProperties.map((property) => (
              <li
                key={property.id}
                className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2 border border-slate-700"
              >
                <div>
                  <p className="font-medium text-slate-100">{property.name}</p>
                  <p className="text-xs text-slate-400">{property.suburb}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    property.status === 'occupied'
                      ? 'border-emerald-500/60 text-emerald-300'
                      : 'border-amber-500/60 text-amber-300'
                  }`}
                >
                  {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
