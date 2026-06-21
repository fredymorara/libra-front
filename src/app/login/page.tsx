'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Library, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex font-sans selection:bg-library-200 selection:text-library-900">
      {/* Left side - Visual/Editorial */}
      <div className="hidden lg:flex w-1/2 bg-library-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/library-architecture/1200/1600')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="absolute inset-0 bg-linear-to-t from-library-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-8 border border-white/20">
            <Library size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome back to the archive.</h1>
          <p className="text-library-100 text-lg leading-relaxed">
            Manage your collections, monitor AI ingestion tasks, and tune the intelligent retrieval engine powering your library.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative px-6 sm:px-12 md:px-24">
        <Link href="/" className="absolute top-8 left-8 lg:left-12 text-sm font-medium text-ink-muted hover:text-ink transition-colors flex items-center gap-2">
          &larr; Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="lg:hidden h-10 w-10 rounded-lg bg-library-800 flex items-center justify-center text-white mb-6">
            <Library size={20} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">Sign in</h2>
          <p className="text-ink-muted mb-8 text-sm">
            Don&apos;t have a workspace yet?{' '}
            <Link href="/signup" className="text-library-800 font-medium hover:text-library-900 transition-colors">
              Create an account
            </Link>
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-lg shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-library-500 focus:border-library-500 transition-shadow text-ink text-sm"
                placeholder="librarian@institution.edu"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-lg shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-library-500 focus:border-library-500 transition-shadow text-ink text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rust-700 text-sm bg-rust-700/10 px-4 py-3 rounded-lg border border-rust-700/20">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-ink hover:bg-library-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
