'use client';
import { useState } from 'react';
import { signIn } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #C8D4BC 0%, #A4B792 50%, #8A9A78 100%)',
      color: 'white',
      fontFamily: 'system-ui',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        padding: '2rem', 
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 300 }}>Sign In</h1>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '0 0 1rem 0',
              border: 'none',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#333'
            }}
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '0 0 1rem 0',
              border: 'none',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#333'
            }}
          />

          {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? 'rgba(255, 255, 255, 0.3)' : '#fff',
              color: loading ? 'rgba(255, 255, 255, 0.7)' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <a href="/auth/signup" style={{ color: 'white' }}>Don't have an account? Sign up</a><br />
          <a href="/" style={{ color: 'white', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block' }}>← Back to Home</a><br />
          <a href="/emergency" style={{ color: 'white', fontSize: '0.9rem' }}>Crisis Support: 988</a>
        </div>
      </div>
    </div>
  );
}
