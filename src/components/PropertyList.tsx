import React from 'react';

export type PropertyStatus = 'occupied' | 'vacant';

export type Property = {
  id: string;
  name: string;
  suburb: string;
  status: PropertyStatus;
};

type PropertyListProps = {
  properties: Property[];
  onSelectProperty?: (id: string) => void;
};

export default function PropertyList({
  properties,
  onSelectProperty,
}: PropertyListProps) {
  if (!properties.length) {
    return (
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-slate-100">
          Properties
        </h2>
        <p className="text-sm text-slate-400">
          You haven&apos;t added any properties yet.
        </p>
      </section>
    );
  }

  const handleSelect = (id: string) => {
    if (onSelectProperty) {
      onSelectProperty(id);
    }
  };

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">
        Your properties
      </h2>

      <ul className="space-y-3">
        {properties.map((property) => (
          <li
            key={property.id}
            className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2 border border-slate-700"
          >
            <button
              type="button"
              onClick={() => handleSelect(property.id)}
              className="text-left flex-1 mr-3"
            >
              <p className="font-medium text-slate-100">
                {property.name}
              </p>
              <p className="text-xs text-slate-400">{property.suburb}</p>
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full border ${
                  property.status === 'occupied'
                    ? 'border-emerald-500/60 text-emerald-300'
                    : 'border-amber-500/60 text-amber-300'
                }`}
              >
                {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
              </span>

              {onSelectProperty && (
                <button
                  type="button"
                  onClick={() => handleSelect(property.id)}
                  className="text-[11px] px-2 py-1 rounded-md border border-slate-600 text-slate-300 hover:border-emerald-400 hover:text-emerald-200 transition"
                >
                  View
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
