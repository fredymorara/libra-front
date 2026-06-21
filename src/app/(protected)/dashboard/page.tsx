'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Database, Search, Code, CheckCircle2, AlertCircle, BookOpen, Trash2, Library, Upload, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function LibraryDashboard() {
  const [ingesting, setIngesting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isbnInput, setIsbnInput] = useState('');
  const [books, setBooks] = useState<Array<{id: string, title: string, author: string, isbn: string}>>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [queueStatus, setQueueStatus] = useState({ PENDING: 0, PROCESSING: 0, COMPLETED: 0, FAILED: 0 });
  const [retrying, setRetrying] = useState(false);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalog`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch {
      // Handle error silently
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchQueueStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalog/queue/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setQueueStatus(await res.json());
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchQueueStatus();
    const interval = setInterval(() => {
      fetchQueueStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const runIngestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isbnInput.trim()) return;

    setIngesting(true);
    setIngestStatus('idle');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalog/ingest`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isbn: isbnInput.trim() })
      });
      if (res.ok) {
        setIngestStatus('success');
        setIsbnInput('');
        fetchBooks();
      } else {
        setIngestStatus('error');
      }
    } catch {
      setIngestStatus('error');
    } finally {
      setIngesting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploading(true);
    setUploadStatus('idle');
    const formData = new FormData();
    formData.append('file', file);

    const isMarc = file.name.endsWith('.mrc');
    const endpoint = isMarc ? '/catalog/upload/marc' : '/catalog/upload/csv';

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setUploadStatus('success');
        fetchQueueStatus();
      } else {
        setUploadStatus('error');
      }
    } catch {
      setUploadStatus('error');
    } finally {
      setFileUploading(false);
    }
  };

  const handleRetryJobs = async () => {
    setRetrying(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalog/queue/retry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchQueueStatus();
      }
    } catch {
      // Ignore
    } finally {
      setRetrying(false);
    }
  };

  const deleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchBooks();
      }
    } catch {
      // Handle silently
    }
  };

  return (
    <div className="space-y-16">
      <section>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight text-ink mb-3"
        >
          Archive Management
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-ink-muted max-w-2xl leading-relaxed"
        >
          Curate your collection. Ingest metadata, monitor the AI indexing queue, and tune the intelligent retrieval engine powering your library.
        </motion.p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Single Item Ingestion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 flex flex-col justify-between"
        >
          <div>
            <div className="h-10 w-10 rounded-lg bg-canvas-muted flex items-center justify-center text-ink mb-6 border border-stone-100">
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">Add Single Entry</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              Enter an ISBN to fetch metadata from Google Books and vectorize it instantly.
            </p>
          </div>
          
          <div className="mt-8">
            <form onSubmit={runIngestion} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="e.g. 9780131103627"
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-library-500 focus:border-library-500 bg-canvas transition-colors"
                value={isbnInput}
                onChange={(e) => setIsbnInput(e.target.value)}
                disabled={ingesting}
              />
              <button 
                type="submit"
                disabled={ingesting || !isbnInput.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-library-800 focus:outline-none focus:ring-2 focus:ring-library-500 disabled:opacity-50 active:scale-[0.98]"
              >
                {ingesting ? 'Indexing...' : 'Index Book'}
              </button>
            </form>

            {ingestStatus === 'success' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-sm text-library-700 bg-library-50 px-3 py-2 rounded-md border border-library-100">
                <CheckCircle2 size={16} />
                <span>Successfully indexed in PgVector.</span>
              </motion.div>
            )}
            {ingestStatus === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-sm text-rust-700 bg-rust-700/10 px-3 py-2 rounded-md border border-rust-700/20">
                <AlertCircle size={16} />
                <span>Failed to ingest. Check API key or ISBN.</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bulk Ingestion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 flex flex-col justify-between lg:col-span-2"
        >
          <div>
            <div className="h-10 w-10 rounded-lg bg-canvas-muted flex items-center justify-center text-ink mb-6 border border-stone-100">
              <Upload size={20} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">Bulk Queue Upload</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              Upload a CSV (with an <code>isbn</code> column) or a binary <code>.mrc</code> file. Items are queued to respect API limits.
            </p>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <label className="shrink-0 flex items-center justify-center px-6 py-2.5 bg-canvas-muted text-ink border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-200 cursor-pointer transition-colors active:scale-[0.98]">
              {fileUploading ? 'Uploading...' : 'Select File'}
              <input type="file" accept=".csv,.mrc" className="hidden" onChange={handleFileUpload} disabled={fileUploading} />
            </label>

            {/* Queue UI */}
            <div className="flex-1 flex gap-3 text-xs flex-wrap items-center">
              <div className="bg-stone-100 text-stone-600 px-2.5 py-1.5 rounded-md font-medium">Pending: {queueStatus.PENDING}</div>
              <div className="bg-library-50 text-library-700 px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 border border-library-100">
                {queueStatus.PROCESSING > 0 && <div className="h-2 w-2 bg-library-500 rounded-full animate-pulse" />}
                Processing: {queueStatus.PROCESSING}
              </div>
              <div className="bg-canvas-muted text-stone-600 px-2.5 py-1.5 rounded-md font-medium">Done: {queueStatus.COMPLETED}</div>
              {queueStatus.FAILED > 0 && (
                <div className="flex items-center gap-2">
                  <div className="bg-rust-700/10 text-rust-700 px-2.5 py-1.5 rounded-md font-medium">Failed: {queueStatus.FAILED}</div>
                  <button 
                    onClick={handleRetryJobs}
                    disabled={retrying}
                    className="px-2.5 py-1.5 bg-ink text-white rounded-md font-medium hover:bg-library-800 transition-colors disabled:opacity-50"
                  >
                    {retrying ? '...' : 'Retry'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 flex flex-col justify-between"
      >
        <div>
          <div className="h-10 w-10 rounded-lg bg-canvas-muted flex items-center justify-center text-ink mb-6 border border-stone-100">
            <Code size={20} />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">Intranet Integration</h2>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">
            Copy the embed code snippet to place the floating chat widget on any campus website.
          </p>
        </div>
        
        <div className="mt-8">
          <Link
            href="/embed"
            className="w-full py-2.5 px-4 rounded-lg bg-canvas-muted text-ink hover:bg-stone-200 text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-[0.98] border border-stone-200"
          >
            View Widget Demo
          </Link>
        </div>
      </motion.div>

      {/* Catalog List */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-8"
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Active Collection</h2>
          <div className="px-3 py-1 bg-stone-100 text-ink-muted text-xs font-semibold rounded-full border border-stone-200">
            {books.length} Books
          </div>
        </div>

        {loadingBooks ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-white border border-stone-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <ul className="divide-y divide-stone-100">
              {books.map((book, index) => (
                <motion.li 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  key={book.id} 
                  className="p-4 sm:p-5 flex items-center gap-4 hover:bg-stone-50 transition-colors group"
                >
                  <div className="h-10 w-8 shrink-0 bg-canvas border border-stone-200 rounded flex items-center justify-center text-stone-400 group-hover:border-library-300 group-hover:text-library-700 transition-colors">
                    <BookOpen size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-ink text-sm truncate">{book.title}</h3>
                    <p className="text-xs text-ink-muted mt-0.5 truncate">{book.author}</p>
                  </div>
                  <div className="hidden sm:block px-2.5 py-1 bg-stone-100 text-stone-500 text-[10px] font-medium rounded uppercase tracking-wider">
                    ISBN: {book.isbn}
                  </div>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="p-2 text-stone-400 hover:text-rust-700 hover:bg-rust-700/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove from archive"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-canvas-muted border border-stone-200 flex items-center justify-center text-stone-400 mb-5 shadow-inner">
              <Database size={24} />
            </div>
            <p className="text-base font-semibold text-ink mb-2">Archive is empty</p>
            <p className="text-sm text-ink-muted max-w-sm leading-relaxed">Begin by uploading a bulk file or indexing a single ISBN above.</p>
          </div>
        )}
      </motion.section>
    </div>
  );
}
