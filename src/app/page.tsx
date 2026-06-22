'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Library, Database, Search, MessageSquare, Mail, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-library-200 selection:text-library-900 overflow-x-hidden">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between p-6 lg:px-12" aria-label="Global">
          <div className="flex lg:flex-1 items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-library-800 flex items-center justify-center text-white">
              <Library size={16} />
            </div>
            <span className="font-semibold tracking-tight text-ink">Libra</span>
          </div>
          <div className="flex gap-x-8 items-center">
            <Link href="/docs" className="text-sm font-medium leading-6 text-ink-muted hover:text-ink transition-colors">
              Documentation
            </Link>
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-library-800 px-5 py-2 text-sm font-medium text-white hover:bg-library-900 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium leading-6 text-ink-muted hover:text-ink transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:bg-library-800 transition-colors"
                >
                  Start workspace
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* Hero section */}
        <div className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl lg:text-7xl font-bold tracking-tighter text-ink leading-[1.1]"
              >
                The intelligence layer for your library.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-lg leading-relaxed text-ink-muted max-w-xl"
              >
                Upload your collection. Our AI reads the abstracts, enriches the metadata, and provides a secure, embeddable chat interface for your users to explore the catalog naturally.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex items-center gap-4"
              >
                <Link
                  href={isLoggedIn ? "/dashboard" : "/signup"}
                  className="rounded-full bg-library-800 px-8 py-4 text-sm font-medium text-white hover:bg-library-900 transition-colors shadow-sm"
                >
                  {isLoggedIn ? "Open Dashboard" : "Create your workspace"}
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-4/3 bg-canvas-muted rounded-2xl border border-stone-200 shadow-xl overflow-hidden flex"
            >
              {/* Mockup split screen */}
              <div className="w-1/2 h-full border-r border-stone-200 bg-white p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
                  <Database size={16} className="text-stone-400" />
                  <span className="text-sm font-medium text-ink">Catalog Queue</span>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-canvas-muted p-3 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-8 bg-stone-300 rounded shrink-0"></div>
                        <div className="w-24 h-2 bg-stone-300 rounded"></div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-library-400"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/2 h-full bg-canvas p-6 flex flex-col justify-end">
                <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden flex flex-col h-[280px]">
                  <div className="bg-library-800 p-3 text-white text-xs font-medium flex items-center gap-2">
                    <Library size={14} /> AI Assistant
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-end gap-3 bg-canvas-muted">
                    <div className="bg-library-800 text-white p-2.5 rounded-xl rounded-tr-sm text-xs self-end max-w-[85%]">
                      Any books on quantum mechanics?
                    </div>
                    <div className="bg-white border border-stone-200 text-ink p-2.5 rounded-xl rounded-tl-sm text-xs self-start max-w-[90%] shadow-sm leading-relaxed">
                      Yes. &quot;Quantum Computation&quot; by Nielsen &amp; Chuang is available.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>



        {/* Feature section - 3 Col Bento */}
        <div className="bg-canvas-muted border-t border-stone-200 py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                A complete library AI assistant
              </h2>
              <p className="mt-4 text-lg text-ink-muted">
                Ditch the legacy systems. Libra brings agentic search and modern interfaces to your existing collection.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col bg-white p-8 rounded-2xl border border-stone-200 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-library-50 flex items-center justify-center text-library-800 mb-6 border border-library-100">
                  <Database size={24} />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">Bulk Ingestion</h3>
                <p className="text-ink-muted leading-relaxed">
                  Upload legacy MARC 21 files or simple CSVs. Our fault-tolerant background queue handles thousands of items automatically while respecting API rate limits.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col bg-white p-8 rounded-2xl border border-stone-200 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-library-50 flex items-center justify-center text-library-800 mb-6 border border-library-100">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">Hybrid Search</h3>
                <p className="text-ink-muted leading-relaxed">
                  We don&apos;t just do basic vector lookups. We combine Dense PgVector search with Sparse full-text matching for incredible accuracy via Reciprocal Rank Fusion.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col bg-white p-8 rounded-2xl border border-stone-200 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-library-50 flex items-center justify-center text-library-800 mb-6 border border-library-100">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">Drop-in Widget</h3>
                <p className="text-ink-muted leading-relaxed">
                  Copy a single <code>&lt;script&gt;</code> tag and paste it on your website. No complex API integration required. A floating AI assistant ready instantly.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Detailed Zig-Zag Section */}
        <div className="bg-white py-24 sm:py-32 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
              <div className="flex-1 w-full order-2 lg:order-1">
                <div className="bg-canvas rounded-2xl border border-stone-200 aspect-video flex items-center justify-center p-8 shadow-sm">
                  <div className="w-full h-full bg-white rounded-lg border border-stone-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-10 border-b border-stone-100 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-rust-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="p-4 flex-1 font-mono text-xs text-ink-muted bg-stone-50">
                      &gt; processing batch 1 of 50<br/>
                      &gt; fetching google books metadata for 9780131103627... [OK]<br/>
                      &gt; extracting abstract from semantic scholar... [OK]<br/>
                      &gt; generating gemini summary... [OK]<br/>
                      &gt; creating embeddings... [OK]<br/>
                      &gt; saved to pgvector.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full order-1 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl mb-4">Autonomous Cataloging</h2>
                <p className="text-lg text-ink-muted leading-relaxed">
                  You provide an ISBN, our agents do the rest. The system automatically reaches out to Google Books and Semantic Scholar to build a rich metadata profile, writes a summary using LLMs, and embeds the entire context into PgVector.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 w-full">
                <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl mb-4">Embed anywhere in seconds</h2>
                <p className="text-lg text-ink-muted leading-relaxed">
                  Transform your static library website into an interactive reference desk. Our lightweight JavaScript widget injects an isolated iframe, ensuring perfect security and compatibility across any CMS or custom build.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="bg-canvas rounded-2xl border border-stone-200 aspect-video flex items-center justify-center p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-white rounded-3xl border border-stone-200 shadow-2xl p-4 flex flex-col">
                    <div className="bg-library-800 text-white p-3 rounded-xl rounded-tr-sm text-sm self-end max-w-[85%]">
                      Where can I find maps of the 1800s?
                    </div>
                    <div className="bg-canvas-muted text-ink p-3 rounded-xl rounded-tl-sm text-sm self-start max-w-[85%] mt-3 border border-stone-100">
                      The Historical Archives in section B contain cartography from 1820-1890.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-ink py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/library-cta/1600/600')] bg-cover bg-center mix-blend-overlay opacity-20 grayscale"></div>
          <div className="mx-auto max-w-4xl px-6 lg:px-12 text-center relative z-10">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              Ready to modernize your archive?
            </h2>
            <p className="text-lg text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the academic institutions and independent libraries using Libra to bring AI-powered discovery to their patrons.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={isLoggedIn ? "/dashboard" : "/signup"}
                className="rounded-lg bg-library-800 px-8 py-4 text-sm font-medium text-white hover:bg-library-700 transition-colors shadow-lg active:scale-95"
              >
                {isLoggedIn ? "Open Dashboard" : "Create workspace"}
              </Link>
              <Link
                href="/docs"
                className="rounded-lg bg-white/10 px-8 py-4 text-sm font-medium text-white hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-canvas-muted border-t border-stone-200 pt-20 pb-12 mt-auto">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
            <div>
              <div className="flex items-center gap-3 text-ink mb-4">
                <div className="h-8 w-8 rounded-md bg-library-800 flex items-center justify-center text-white shadow-sm">
                  <Library size={16} />
                </div>
                <span className="font-semibold tracking-tight text-lg">Libra</span>
              </div>
              <p className="text-ink-muted leading-relaxed max-w-sm">
                A modern AI assistant for academic, independent, and personal archives.
              </p>
            </div>
            
            <div className="flex gap-4">
              <a href="/" className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-300 hover:text-ink transition-colors cursor-pointer">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-300 hover:text-ink transition-colors cursor-pointer">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-300 hover:text-ink transition-colors cursor-pointer">
                <span className="sr-only">Email</span>
                <Mail size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-300 hover:text-ink transition-colors cursor-pointer">
                <span className="sr-only">Portfolio</span>
                <Briefcase size={18} />
              </a>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-ink-muted">
              &copy; {new Date().getFullYear()} Libra. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
