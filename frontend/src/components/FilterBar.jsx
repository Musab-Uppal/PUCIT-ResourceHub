import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function FilterBar({ filters, onChange }) {
  const { data: meta } = useQuery({
    queryKey: ['meta'],
    queryFn: () => api.get('/resources/meta').then(r => r.data),
    staleTime: Infinity,
  });

  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 });

  const selectClass = "bg-surface-700 text-slate-300 rounded-lg px-3 py-2 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer";

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Type */}
      <select value={filters.type || ''} onChange={e => set('type', e.target.value || undefined)} className={selectClass}>
        <option value="">All Types</option>
        <option value="pdf">📄 PDF</option>
        <option value="image">🖼️ Image</option>
        <option value="link">🔗 Link</option>
      </select>

      {/* Degree */}
      <select value={filters.degree || ''} onChange={e => set('degree', e.target.value || undefined)} className={selectClass}>
        <option value="">All Degrees</option>
        {(meta?.degrees || ['CS','IT','SE','DS']).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Campus */}
      <select value={filters.campus || ''} onChange={e => set('campus', e.target.value || undefined)} className={selectClass}>
        <option value="">All Campuses</option>
        {(meta?.campuses || ['NC','OC']).map(c => (
          <option key={c} value={c}>{c === 'NC' ? '🏫 NC' : '🏛️ OC'}</option>
        ))}
      </select>

      {/* Course */}
      <select value={filters.course || ''} onChange={e => set('course', e.target.value || undefined)} className={selectClass}>
        <option value="">All Courses</option>
        {meta?.courses?.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Teacher */}
      <select value={filters.teacher || ''} onChange={e => set('teacher', e.target.value || undefined)} className={selectClass}>
        <option value="">All Teachers</option>
        {meta?.teachers?.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      {/* Clear */}
      {Object.values(filters).some(v => v && v !== 1) && (
        <button
          onClick={() => onChange({ page: 1 })}
          className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          Clear filters ✕
        </button>
      )}
    </div>
  );
}
