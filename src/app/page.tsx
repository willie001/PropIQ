import LayoutShell from '@/components/LayoutShell';
import PropertyList, { Property } from '@/components/PropertyList';

const demoProperties: Property[] = [
  {
    id: '1',
    name: '36 Chatsworth Drive',
    suburb: 'Carramar',
    status: 'occupied',
  },
  {
    id: '2',
    name: '11 Staunton Vale',
    suburb: 'Carramar',
    status: 'vacant',
  },
];

export default function Home() {
  return (
    <LayoutShell>
      <div className="max-w-3xl w-full mx-auto space-y-6">
        <header className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            High-level view of your properties, tenants and upcoming tasks.
          </p>
        </header>

        <PropertyList properties={demoProperties} />
      </div>
    </LayoutShell>
  );
}
