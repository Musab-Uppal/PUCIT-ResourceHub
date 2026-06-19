import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import ResourceCard from '../components/ResourceCard';

export default function MyUploadsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-uploads'],
    queryFn: () => api.get('/resources/mine').then(r => r.data),
  });

  const resources = data?.resources || [];

  const counts = resources.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">My Uploads</h1>
      <p className="text-slate-400 text-sm mb-6">Track the status of everything you've submitted.</p>

      {/* Summary chips */}
      {!isLoading && resources.length > 0 && (
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { label: 'Approved', key: 'approved', style: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30' },
            { label: 'Pending',  key: 'pending',  style: 'bg-yellow-500/15 text-yellow-400 ring-yellow-500/30' },
            { label: 'Rejected', key: 'rejected', style: 'bg-red-500/15 text-red-400 ring-red-500/30' },
          ].map(({ label, key, style }) => (
            <span key={key} className={`px-4 py-1.5 rounded-full text-sm font-medium ring-1 ${style}`}>
              {counts[key] || 0} {label}
            </span>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
          <p className="text-5xl mb-4">📤</p>
          <p className="text-lg">No uploads yet</p>
          <p className="text-sm mt-1">Hit the Upload button in the header to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => <ResourceCard key={r._id} resource={r} />)}
        </div>
      )}
    </main>
  );
}
