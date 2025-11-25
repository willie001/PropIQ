'use client';

import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';

type AuthStatus = 'checking' | 'signedOut' | 'signedIn';

type AuthGateProps = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  // In tests, bypass auth completely so Jest doesn’t hit Supabase
  if (process.env.NODE_ENV === 'test') {
    return <>{children}</>;
  }

  const [status, setStatus] = useState<AuthStatus>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setStatus('signedOut');
        return;
      }

      setUserEmail(data.user.email ?? null);
      setStatus('signedIn');
    }

    checkUser();
  }, []);

  async function handleAuth(e: FormEvent, mode: 'signin' | 'signup') {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError('Email and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setAuthError(error.message);
          return;
        }

        setUserEmail(data.user?.email ?? null);
        setStatus('signedIn');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setAuthError(error.message);
          return;
        }

        // If email confirmation is disabled, we’ll have a session immediately
        if (data.user) {
          setUserEmail(data.user.email ?? null);
          setStatus('signedIn');
        } else {
          setAuthError('Check your email to confirm your account.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Checking session…</p>
      </div>
    );
  }

  if (status === 'signedOut') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow">
          <h1 className="text-xl font-semibold mb-4">Sign in to PropIQ</h1>
          <p className="text-xs text-slate-400 mb-4">
            Use your email and password. For local dev, you can sign up directly here.
          </p>

          <form className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="auth-email" className="text-xs font-medium text-slate-300">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="auth-password" className="text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400">{authError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={(e) => handleAuth(e, 'signin')}
                className="flex-1 rounded-md bg-emerald-500 text-slate-900 text-sm font-semibold px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-400 transition"
              >
                {isSubmitting ? 'Working…' : 'Sign in'}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => handleAuth(e as any, 'signup')}
                className="flex-1 rounded-md border border-slate-600 text-slate-100 text-sm font-semibold px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:border-emerald-400 transition"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // signedIn
  return (
    <>
      {/* Small “signed in as …” badge could be added later if you want */}
      {children}
    </>
  );
}
