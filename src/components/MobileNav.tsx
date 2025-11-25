'use client';

import { useState } from 'react';

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

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const handleScroll = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Burger button */}
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-md border border-slate-700 px-2 py-1 text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition"
      >
        {/* simple burger icon */}
        <span className="sr-only">Toggle navigation</span>
        <div className="space-y-[3px]">
          <span className="block h-[2px] w-5 bg-slate-300" />
          <span className="block h-[2px] w-5 bg-slate-300" />
          <span className="block h-[2px] w-5 bg-slate-300" />
        </div>
      </button>

      {/* Overlay menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/90">
          <div className="flex items-start justify-end p-4">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="rounded-md border border-slate-700 px-2 py-1 text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition"
            >
              Close
            </button>
          </div>

          <nav className="mt-4 px-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScroll(item.id)}
                className="block w-full text-left rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-slate-100 hover:border-emerald-400 hover:text-emerald-100 transition"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
