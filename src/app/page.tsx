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
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="max-w-3xl w-full px-4 py-8 space-y-6">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            PropIQ
          </h1>
          <p className="text-lg text-slate-300">
            Personal property management app – starting small and growing
            feature by feature.
          </p>
        </header>

        <PropertyList properties={demoProperties} />
      </div>
    </main>
  );
}
