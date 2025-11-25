type PropertyStatus = 'occupied' | 'vacant';

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
  const hasProperties = properties.length > 0;

  const occupiedCount = properties.filter((p) => p.status === 'occupied').length;
  const vacantCount = properties.filter((p) => p.status === 'vacant').length;

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2 text-slate-100">
        Your properties
      </h2>

      {hasProperties && (
        <p className="text-sm text-slate-400 mb-4">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} total ·{' '}
          {occupiedCount} {occupiedCount === 1 ? 'occupied' : 'occupied'} ·{' '}
          {vacantCount} {vacantCount === 1 ? 'vacant' : 'vacant'}
        </p>
      )}

      {!hasProperties && (
        <p className="text-sm text-slate-400">
          You don’t have any properties yet. Add your first property to get
          started.
        </p>
      )}

      {hasProperties && (
        <ul className="space-y-3">
          {properties.map((property) => (
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
      )}
    </section>
  );
}
