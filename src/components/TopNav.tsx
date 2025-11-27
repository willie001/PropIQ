'use client';

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

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (href: string) => {
    if (href === pathname) return;
    router.push(href);
  };

  return (
    <nav className="hidden md:flex gap-2 text-sm">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <button
            key={item.href}
            type="button"
            onClick={() => handleClick(item.href)}
            className={`px-3 py-1 rounded-full border transition ${
              isActive
                ? 'border-emerald-500/70 text-emerald-200 bg-emerald-500/10'
                : 'border-slate-600 text-slate-200 hover:border-emerald-400 hover:text-emerald-200'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
