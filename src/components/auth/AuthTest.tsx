'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { signInWithEmail, signInAsGuest, signOutUser } from '@/lib/auth/domain-aware-auth';

export default function AuthTest() {
  const { user, loading, authInitialized } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [authState, setAuthState] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (authInitialized) {
      if (user) {
        setAuthState(`✅ Authenticated: ${user.email || 'Anonymous'} (${user.uid})`);
      } else {
        setAuthState('❌ Not authenticated');
      }
    } else {
      setAuthState('🔄 Initializing Firebase Auth...');
    }
  }, [user, authInitialized]);

  const handleEmailSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setAuthState(`❌ Sign-in failed: ${result.error}`);
      } else {
        setAuthState('✅ Sign-in successful!');
      }
    } catch (error) {
      setAuthState(`❌ Sign-in error: ${error}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInAsGuest();
      if (result.error) {
        setAuthState(`❌ Guest sign-in failed: ${result.error}`);
      } else {
        setAuthState('✅ Guest sign-in successful!');
      }
    } catch (error) {
      setAuthState(`❌ Guest sign-in error: ${error}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        setAuthState('✅ Signed out successfully');
      } else {
        setAuthState(`❌ Sign-out failed: ${result.error}`);
      }
    } catch (error) {
      setAuthState(`❌ Sign-out error: ${error}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md">
      <h2 className="text-xl font-bold mb-4">🔐 Authentication Test</h2>
      
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h3 className="font-semibold">Status:</h3>
        <p className="text-sm">{loading ? '🔄 Loading...' : authState}</p>
      </div>

      {!user && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Email Sign-In Test</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleEmailSignIn}
              disabled={isSigningIn}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSigningIn ? 'Signing In...' : 'Sign In with Email'}
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Guest Sign-In Test</h3>
            <button
              onClick={handleGuestSignIn}
              disabled={isSigningIn}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isSigningIn ? 'Signing In...' : 'Sign In as Guest'}
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className="space-y-4">
          <div className="p-3 bg-green-100 rounded">
            <h3 className="font-semibold">User Info:</h3>
            <p className="text-sm">UID: {user.uid}</p>
            <p className="text-sm">Email: {user.email || 'None (Anonymous)'}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}