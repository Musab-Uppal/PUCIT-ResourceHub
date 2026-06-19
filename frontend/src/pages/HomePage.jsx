import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ResourceCard from '../components/ResourceCard';
import FilterBar from '../components/FilterBar';

export default function HomePage() {
  const [filters, setFilters] = useState({ page: 1 });
  const [serverAwake, setServerAwake] = useState(true);

  // Ping the health endpoint once — shows a toast if server is cold-starting
  useEffect(() => {
    const ping = async () => {
      try {
        await api.get('/health');
        setServerAwake(true);
      } catch {
        const id = toast.loading('Waking up the server (Render free tier)…', { duration: 15000 });
        // Retry after 8s
        setTimeout(async () => {
          try { await api.get('/health'); toast.dismiss(id); setServerAwake(true); } catch {}
        }, 8000);
      }
    };
    ping();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['resources', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
      return api.get(`/resources?${params}`).then(r => r.data);
    },
    placeholderData: prev => prev, // keep old data visible while fetching
  });

  const resources = data?.resources || [];
  const pagination = data?.pagination;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
          Study smarter,{' '}
          <span className="gradient-text">together</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Notes, past papers, and resources from PUCIT students — organised by course, teacher, and degree.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Grid */}
      {isLoading && resources.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">⚠️</p>
          <p>Could not load resources. Try refreshing.</p>
        </div>
      ) : resources.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 text-slate-500"
        >
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg">No resources found</p>
          <p className="text-sm mt-1">Try clearing your filters or be the first to upload!</p>
        </motion.div>
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {resources.map(r => <ResourceCard key={r._id} resource={r} />)}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                className="px-4 py-2 rounded-lg bg-surface-700 text-slate-300 text-sm disabled:opacity-30 hover:bg-surface-600 transition-colors"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-slate-400">
                {filters.page} / {pagination.pages}
              </span>
              <button
                disabled={filters.page >= pagination.pages}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                className="px-4 py-2 rounded-lg bg-surface-700 text-slate-300 text-sm disabled:opacity-30 hover:bg-surface-600 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
