import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axios';

const TYPE_ICONS = { pdf: '📄', image: '🖼️', link: '🔗' };

function RejectModal({ resource, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h3 className="font-semibold text-white mb-1">Reject resource</h3>
        <p className="text-slate-400 text-sm mb-4">"{resource.title}"</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Reason (optional)"
          rows={3}
          className="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-red-500/40 placeholder-slate-500 resize-none mb-4"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
          <button
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 text-sm bg-red-500/20 text-red-400 ring-1 ring-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const qc = useQueryClient();
  const [rejectTarget, setRejectTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['pending'],
    queryFn: () => api.get('/resources/pending').then(r => r.data),
    refetchInterval: 30000, // auto-refresh every 30s
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.patch(`/resources/${id}/approve`),
    onSuccess: () => { toast.success('Resource approved ✓'); qc.invalidateQueries({ queryKey: ['pending'] }); },
    onError: () => toast.error('Could not approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => api.patch(`/resources/${id}/reject`, { reason }),
    onSuccess: () => { toast.success('Resource rejected'); qc.invalidateQueries({ queryKey: ['pending'] }); setRejectTarget(null); },
    onError: () => toast.error('Could not reject'),
  });

  const resources = data?.resources || [];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Review pending submissions</p>
        </div>
        <span className="px-4 py-1.5 bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30 rounded-full text-sm font-medium">
          {resources.length} pending
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-lg">All caught up!</p>
          <p className="text-sm mt-1">No pending submissions right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map(r => (
            <div key={r._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{TYPE_ICONS[r.type]}</span>
                  <h3 className="font-semibold text-white truncate">{r.title}</h3>
                </div>
                {r.description && <p className="text-slate-400 text-sm mb-2 line-clamp-2">{r.description}</p>}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {r.course   && <span className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">{r.course}</span>}
                  {r.teacher  && <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400 ring-1 ring-white/10">{r.teacher}</span>}
                  {r.degree?.map(d => <span key={d} className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">{d}</span>)}
                  {r.campus   && <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">{r.campus === 'NC' ? '🏫 NC' : '🏛️ OC'}</span>}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  By {r.uploadedBy?.name} ({r.uploadedBy?.email}) · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Right: actions */}
              <div className="flex sm:flex-col gap-2 shrink-0 justify-end sm:justify-start">
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center"
                >
                  Preview ↗
                </a>
                <button
                  onClick={() => approveMutation.mutate(r._id)}
                  disabled={approveMutation.isPending}
                  className="px-4 py-2 text-sm bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => setRejectTarget(r)}
                  className="px-4 py-2 text-sm bg-red-500/20 text-red-400 ring-1 ring-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          resource={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={(reason) => rejectMutation.mutate({ id: rejectTarget._id, reason })}
        />
      )}
    </main>
  );
}
