'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Leases', href: '/leases' },
  { label: 'Tenants', href: '/tenants' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (href: string) => {
    setOpen(false);
    if (href === pathname) return;
    router.push(href);
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
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className={`block w-full text-left rounded-lg border px-4 py-3 text-base transition ${
                    isActive
                      ? 'border-emerald-500/70 text-emerald-200 bg-emerald-500/10'
                      : 'border-slate-700 bg-slate-900/60 text-slate-100 hover:border-emerald-400 hover:text-emerald-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
