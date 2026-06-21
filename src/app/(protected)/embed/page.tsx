'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Copy, CheckCircle2 } from 'lucide-react';

export default function EmbedWidgetDemo() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || 'YOUR_JWT_TOKEN';
    setToken(storedToken);

    // Inject the actual widget script for preview
    if (storedToken !== 'YOUR_JWT_TOKEN') {
      const script = document.createElement('script');
      script.src = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/public/widget.js?v=${Date.now()}`;
      script.setAttribute('data-token', storedToken);
      script.setAttribute('data-frontend-url', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      script.defer = true;
      script.id = 'preview-widget-script';
      document.body.appendChild(script);

      return () => {
        const existingScript = document.getElementById('preview-widget-script');
        if (existingScript) existingScript.remove();
        // Also clean up any injected iframes or buttons by the widget script if needed
      };
    }
  }, []);

  const snippet = `<script 
  src="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/public/widget.js?v=1" 
  data-token="${token}"
  data-frontend-url="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}"
  defer
></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Link href="/dashboard" className="text-ink-muted hover:text-ink transition-colors flex items-center gap-2 text-sm font-medium mb-8">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-library-50 text-library-800 flex items-center justify-center mb-6 border border-library-100">
          <Code size={24} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink mb-3">Embed the Assistant</h1>
        <p className="text-ink-muted mb-10 max-w-2xl leading-relaxed">
          Copy and paste this snippet into the <code>&lt;head&gt;</code> or just before the closing <code>&lt;/body&gt;</code> tag of your campus intranet or website. <strong>Look at the bottom right of this page for a live preview.</strong>
        </p>

        <div className="relative group">
          <pre className="bg-canvas-muted text-ink p-6 rounded-xl overflow-x-auto text-sm font-mono shadow-inner border border-stone-200">
            <code>{snippet}</code>
          </pre>
          <button 
            onClick={copyToClipboard}
            className="absolute top-4 right-4 p-2 bg-white border border-stone-200 hover:bg-stone-50 text-ink rounded-lg transition-colors shadow-sm flex items-center gap-2 text-xs font-medium"
          >
            {copied ? <><CheckCircle2 size={14} className="text-library-600" /> Copied</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>

        <div className="mt-10 p-4 bg-rust-50 border border-rust-200 rounded-xl text-sm text-rust-800 leading-relaxed">
          <strong>Security Note:</strong> This snippet includes your personal JWT access token. Do not share this token publicly if your API usage is sensitive.
        </div>
      </div>
    </div>
  );
}
