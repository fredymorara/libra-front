'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Library, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
        }
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Signup failed');
      }
    } catch {
      setError('An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex font-sans selection:bg-library-200 selection:text-library-900">
      {/* Left side - Visual/Editorial */}
      <div className="hidden lg:flex w-1/2 bg-ink relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/library-archives/1200/1600')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale"></div>
        <div className="absolute inset-0 bg-linear-to-t from-library-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-8 border border-white/20">
            <Library size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Start your smart archive.</h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            Create an isolated workspace. Ingest thousands of books, metadata, and journals, and deploy an AI assistant that actually knows your collection.
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
          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">Create workspace</h2>
          <p className="text-ink-muted mb-8 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-library-800 font-medium hover:text-library-900 transition-colors">
              Sign in
            </Link>
          </p>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-lg shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-library-500 focus:border-library-500 transition-shadow text-ink text-sm"
                placeholder="director@institution.edu"
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-library-800 hover:bg-library-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-library-800 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? 'Creating...' : 'Create account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
