'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Upload, Cpu, Code } from 'lucide-react';

export default function DocsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setTimeout(() => setIsLoggedIn(true), 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-library-200 selection:text-library-900">
      <header className="bg-canvas-muted border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-ink-muted hover:text-ink transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <BookOpen size={16} className="text-library-800" />
            Quick Start Guide
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-20 pb-32">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink">How to setup your archive</h1>
          <p className="text-lg text-ink-muted leading-relaxed max-w-2xl">
            Welcome to Smart Library OS. This guide will take you from a list of books to a fully functioning, AI-powered reference assistant embedded on your own campus intranet.
          </p>
        </div>

        {/* Step 1 */}
        <section className="relative">
          <div className="absolute top-0 left-6 w-px h-full bg-stone-200 -z-10 hidden md:block"></div>
          
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 rounded-xl bg-library-800 text-white flex items-center justify-center font-bold text-lg shrink-0 z-0 shadow-sm border border-library-900">
              1
            </div>
            <div className="space-y-4 pt-1 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <Upload className="text-library-800" size={24} />
                <h2 className="text-2xl font-semibold text-ink tracking-tight">Upload your records</h2>
              </div>
              <p className="text-ink-muted leading-relaxed">
                Start by creating a workspace. From the Dashboard, you can populate your catalog in three ways:
              </p>
              <ul className="space-y-4 mt-6 text-ink bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
                <li className="flex items-start gap-3">
                  <div className="min-w-2 mt-2 h-2 rounded-full bg-library-400"></div>
                  <span className="leading-relaxed"><strong>Single ISBN:</strong> Just type in an ISBN. Best for quick additions or testing the system.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-2 mt-2 h-2 rounded-full bg-library-400"></div>
                  <span className="leading-relaxed"><strong>CSV Upload:</strong> Upload a spreadsheet where one of the columns is named <code>isbn</code>. We extract all ISBNs and queue them safely.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-2 mt-2 h-2 rounded-full bg-library-400"></div>
                  <span className="leading-relaxed"><strong>MARC 21 File:</strong> Have a legacy catalog export? Upload your raw <code>.mrc</code> file directly, and we parse the ISBNs automatically.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="relative">
          <div className="absolute top-0 left-6 w-px h-full bg-stone-200 -z-10 hidden md:block"></div>
          
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 rounded-xl bg-library-800 text-white flex items-center justify-center font-bold text-lg shrink-0 z-0 shadow-sm border border-library-900">
              2
            </div>
            <div className="space-y-4 pt-1 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <Cpu className="text-library-800" size={24} />
                <h2 className="text-2xl font-semibold text-ink tracking-tight">Wait for the AI ingestion</h2>
              </div>
              <p className="text-ink-muted leading-relaxed">
                Once uploaded, items are placed in a background queue. This allows us to fetch rich metadata and use AI to deeply analyze each book without hitting external API rate limits.
              </p>
              <div className="bg-ink p-8 rounded-2xl border border-stone-800 shadow-inner mt-6">
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  <strong className="text-white text-base block mb-2">What happens behind the scenes?</strong>
                  {' '}For every ISBN, we fetch the title, author, and description from Google Books. We also attempt to pull academic abstracts and citation counts from Semantic Scholar. Then, Gemini AI reads all this metadata, writes a comprehensive summary, chunks it, and creates vector embeddings which are stored securely in PgVector.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-stone-400 font-mono">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-stone-500"></span> Pending</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-library-500 animate-pulse"></span> Processing</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-library-200"></span> Completed</div>
                </div>
              </div>
              <p className="text-sm text-ink-muted italic pt-2">
                Note: Depending on how many books you upload, this may take a few minutes. Monitor progress directly from your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="relative">
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 rounded-xl bg-library-800 text-white flex items-center justify-center font-bold text-lg shrink-0 z-0 shadow-sm border border-library-900">
              3
            </div>
            <div className="space-y-4 pt-1 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <Code className="text-library-800" size={24} />
                <h2 className="text-2xl font-semibold text-ink tracking-tight">Embed the reference desk</h2>
              </div>
              <p className="text-ink-muted leading-relaxed">
                Once your queue is processed, your AI is ready to answer questions about your catalog. You can test it out in the <strong>Sandbox</strong>, or embed it on your own website.
              </p>
              
              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm mt-6">
                <h3 className="font-semibold text-ink mb-3 text-lg">Adding the widget to your website</h3>
                <p className="text-ink-muted leading-relaxed mb-6">
                  Navigate to the <strong>Intranet Integration</strong> section from your dashboard. You will be provided with a small snippet of HTML code:
                </p>
                <div className="bg-ink rounded-xl overflow-hidden border border-stone-800 shadow-xl mb-6">
                  <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rust-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <span className="text-xs font-mono text-stone-500">HTML</span>
                  </div>
                  <pre className="p-5 text-sm font-mono text-stone-300 overflow-x-auto leading-relaxed custom-scrollbar">
{`<script 
  src="https://api.your-library.com/public/widget.js" 
  data-token="YOUR_ACCESS_TOKEN"
  data-frontend-url="https://your-library.com"
  defer
></script>`}
                  </pre>
                </div>
                <p className="text-ink-muted mt-6 leading-relaxed">
                  Copy this snippet and paste it right before the closing <code>&lt;/body&gt;</code> tag on your website. 
                  A floating chat bubble will appear in the bottom right corner of your site, allowing your users to ask questions and instantly get AI-generated answers grounded strictly in your uploaded catalog.
                </p>
              </div>
              
              <div className="mt-12 flex justify-center pt-8 border-t border-stone-200">
                <Link 
                  href={isLoggedIn ? "/dashboard" : "/signup"} 
                  className="bg-ink hover:bg-library-800 text-white font-medium py-3.5 px-8 rounded-lg transition-colors shadow-sm active:scale-[0.98]"
                >
                  {isLoggedIn ? "Open Dashboard" : "Create your workspace"}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
