'use client';

type NavItem = {
  id: string;
  label: string;
};

const navItems: NavItem[] = [
  { id: 'dashboard-section', label: 'Dashboard' },
  { id: 'properties-section', label: 'Properties' },
  { id: 'leases-section', label: 'Leases' },
  { id: 'tenants-section', label: 'Tenants' },
];

export default function TopNav() {
  const handleClick = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="hidden md:flex gap-2 text-sm">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleClick(item.id)}
          className="px-3 py-1 rounded-full border border-slate-600 text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
