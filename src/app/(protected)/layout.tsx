'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Library, AlertTriangle, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setTimeout(() => setAuthorized(true), 0);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!authorized) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-canvas-muted text-ink font-sans selection:bg-library-200 selection:text-library-900">
      <header className="bg-canvas border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-md bg-library-800 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Library size={16} />
            </div>
            <span className="font-semibold text-ink tracking-tight group-hover:text-library-800 transition-colors">Libra</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/dashboard" 
              className={`transition-colors ${pathname === '/dashboard' ? 'text-library-800' : 'text-ink-muted hover:text-ink'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/chat" 
              className={`transition-colors ${pathname === '/chat' ? 'text-library-800' : 'text-ink-muted hover:text-ink'}`}
            >
              Sandbox
            </Link>
            <Link 
              href="/docs" 
              className="text-ink-muted hover:text-ink transition-colors"
            >
              Documentation
            </Link>
            <div className="hidden lg:block w-px bg-stone-200"></div>
            <button 
              onClick={handleLogout} 
              className="text-ink-muted hover:text-rust-700 transition-colors flex items-center gap-1.5"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Global Rate Limit Warning */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        className="bg-amber-50/50 border-b border-amber-200/60 overflow-hidden backdrop-blur-sm"
      >
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-start sm:items-center gap-3 text-sm text-amber-900 leading-relaxed">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 sm:mt-0 shrink-0" />
          <p>
            <strong className="font-semibold">Rate Limit Notice:</strong> We are running on a free-tier API. If you encounter ingestion delays, wait a few minutes. For production, deploy your own instance with premium API keys.
          </p>
        </div>
      </motion.div>

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
