'use client';
import { app } from '@/lib/firebaseClient';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import Link from 'next/link';

export default function DevAuth() {
  const [busy, setBusy] = useState(false);
  const auth = getAuth(app);

  const login = async () => {
    setBusy(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await auth.currentUser!.getIdToken(true);
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      window.location.assign('/pathway/ikigai/day/1');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Dev Sign-in</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Google popup → set <code>__session</code> → return to Pathway.
      </p>
      <button
        onClick={login}
        disabled={busy}
        className="mt-6 px-4 py-2 rounded-xl bg-white text-black disabled:opacity-60"
      >
        {busy ? 'Signing in…' : 'Sign in with Google'}
      </button>
      <div className="mt-6">
        <Link href="/pathway/ikigai/day/1" className="underline">
          Back to Ikigai Day 1
        </Link>
      </div>
    </main>
  );
}
