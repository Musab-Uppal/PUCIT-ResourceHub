import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

/* ── Searchable dropdown (combobox) ─────────────────────────────────── */
function SearchableSelect({ value, onChange, options = [], placeholder }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef           = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  const select = (opt) => {
    onChange(opt || undefined);
    setOpen(false);
    setQuery('');
  };

  const displayLabel = value || placeholder;

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen(v => !v); setQuery(''); }}
        className="flex items-center gap-1.5 bg-surface-700 text-slate-300 rounded-lg px-3 py-2 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer min-w-[130px] justify-between"
      >
        <span className={value ? 'text-slate-200' : 'text-slate-400'}>
          {displayLabel}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 left-0 w-60 bg-surface-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-white/5">
            <div className="flex items-center gap-2 bg-surface-700 rounded-lg px-2 py-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search ${placeholder.toLowerCase()}…`}
                className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none w-full"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <ul className="max-h-52 overflow-y-auto py-1 custom-scroll">
            {/* "All" option */}
            <li>
              <button
                type="button"
                onClick={() => select('')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  !value
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {placeholder}
              </button>
            </li>

            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-sm text-slate-500 text-center">No results found</li>
            ) : (
              filtered.map(opt => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => select(opt)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      value === opt
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── FilterBar ───────────────────────────────────────────────────────── */
export default function FilterBar({ filters, onChange }) {
  const { data: meta } = useQuery({
    queryKey: ['meta'],
    queryFn: () => api.get('/resources/meta').then(r => r.data),
    staleTime: Infinity,
  });

  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 });

  const selectClass =
    'bg-surface-700 text-slate-300 rounded-lg px-3 py-2 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer';

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Type */}
      <select
        value={filters.type || ''}
        onChange={e => set('type', e.target.value || undefined)}
        className={selectClass}
      >
        <option value="">All Types</option>
        <option value="pdf">📄 PDF</option>
        <option value="image">🖼️ Image</option>
        <option value="link">🔗 Link</option>
      </select>

      {/* Degree */}
      <select
        value={filters.degree || ''}
        onChange={e => set('degree', e.target.value || undefined)}
        className={selectClass}
      >
        <option value="">All Degrees</option>
        {(meta?.degrees || ['CS', 'IT', 'SE', 'DS']).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Campus */}
      <select
        value={filters.campus || ''}
        onChange={e => set('campus', e.target.value || undefined)}
        className={selectClass}
      >
        <option value="">All Campuses</option>
        {(meta?.campuses || ['NC', 'OC']).map(c => (
          <option key={c} value={c}>{c === 'NC' ? '🏫 NC' : '🏛️ OC'}</option>
        ))}
      </select>

      {/* Course — searchable */}
      <SearchableSelect
        value={filters.course || ''}
        onChange={val => set('course', val)}
        options={meta?.courses || []}
        placeholder="All Courses"
      />

      {/* Teacher — searchable */}
      <SearchableSelect
        value={filters.teacher || ''}
        onChange={val => set('teacher', val)}
        options={meta?.teachers || []}
        placeholder="All Teachers"
      />

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
