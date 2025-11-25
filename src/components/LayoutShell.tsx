import type { ReactNode } from 'react';
import TopNav from './TopNav';

type LayoutShellProps = {
  children: ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/40 text-xs font-bold text-emerald-300">
              PIQ
            </div>
            <div>
              <div className="font-semibold leading-tight">PropIQ</div>
              <div className="text-xs text-slate-400">
                Personal property management
              </div>
            </div>
          </div>

          {/* Top nav (desktop) */}
          <TopNav />
        </div>
      </header>

      {/* Main layout: sidebar + content */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar (md+ only) */}
        <aside className="hidden md:block md:w-60 shrink-0">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm space-y-3">
            <div className="font-semibold text-slate-100">Overview</div>
            <p className="text-xs text-slate-400">
              This will later show quick stats, upcoming tasks, and shortcuts.
            </p>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>• Next inspection</li>
              <li>• Upcoming lease renewals</li>
              <li>• Maintenance tasks</li>
            </ul>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
