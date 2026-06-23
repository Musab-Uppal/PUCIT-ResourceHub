import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const DEGREE_STYLES = {
  CS: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  SE: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  IT: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  DS: 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30',
};

const TYPE_ICONS = {
  pdf:   { icon: '📄', style: 'bg-red-500/15 text-red-400' },
  image: { icon: '🖼️', style: 'bg-teal-500/15 text-teal-400' },
  link:  { icon: '🔗', style: 'bg-sky-500/15 text-sky-400' },
};

export default function ResourceCard({ resource }) {
  const { title, description, type, course, teacher, degree = [], campus, uploadedBy, status, rejectionReason } = resource;
  const typeInfo = TYPE_ICONS[type] || TYPE_ICONS.link;
  
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/resources/${resource._id}`),
    onSuccess: () => {
      toast.success('Resource deleted permanently');
      // Invalidate queries so the feed updates immediately
      qc.invalidateQueries({ queryKey: ['resources'] });
      qc.invalidateQueries({ queryKey: ['my-uploads'] });
    },
    onError: () => toast.error('Could not delete resource'),
  });

  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/resource/${resource._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // prevent card click
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      deleteMut.mutate();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleOpen}
      className="glass rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/5 transition-colors group"
    >
      {/* Type badge + title */}
      <div className="flex items-start gap-3">
        <span className={`shrink-0 text-xl rounded-xl p-2 ${typeInfo.style}`}>
          {typeInfo.icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight truncate group-hover:text-brand-400 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-slate-500 text-xs mt-1 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* Degree + campus badges */}
      {(degree.length > 0 || campus) && (
        <div className="flex flex-wrap gap-1.5">
          {degree.map((d) => (
            <span key={d} className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEGREE_STYLES[d] || 'bg-white/10 text-slate-300'}`}>
              {d}
            </span>
          ))}
          {campus && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
              {campus === 'NC' ? '🏫 NC' : '🏛️ OC'}
            </span>
          )}
        </div>
      )}

      {/* Course / Teacher tags */}
      <div className="flex flex-wrap gap-1.5">
        {course && (
          <span className="text-xs px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20 truncate max-w-full">
            {course}
          </span>
        )}
        {teacher && (
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-500/15 text-slate-400 ring-1 ring-white/10 truncate max-w-full">
            {teacher}
          </span>
        )}
      </div>

      {/* Footer: uploader */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <span className="text-xs text-slate-500">
          {uploadedBy?.name || 'Unknown'}
        </span>
        <div className="flex gap-2">
          {/* Admin delete button */}
          {user?.role === 'admin' && (
            <button
              onClick={handleDelete}
              disabled={deleteMut.isPending}
              className="text-xs px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 ring-1 ring-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              {deleteMut.isPending ? '...' : 'Delete'}
            </button>
          )}

          {/* Status chip (shown on My Uploads page) */}
          {status && status !== 'approved' && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              status === 'pending'  ? 'bg-yellow-500/15 text-yellow-400' :
              status === 'rejected' ? 'bg-red-500/15 text-red-400' : ''
            }`}>
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Rejection reason */}
      {status === 'rejected' && rejectionReason && (
        <p className="text-xs text-red-400/80 bg-red-500/10 rounded-lg px-3 py-2 -mt-1">
          Reason: {rejectionReason}
        </p>
      )}
    </motion.div>
  );
}
