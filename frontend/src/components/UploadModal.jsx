import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axios';

const STEPS = ['type', 'details', 'tags'];

export default function UploadModal({ onClose }) {
  const qc = useQueryClient();
  const fileRef = useRef();

  const [step, setStep] = useState(0);
  const [type, setType] = useState('');
  const [form, setForm] = useState({ title: '', description: '', fileUrl: '' });
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState({ course: '', teacher: '', degree: [], campus: '' });

  // Fetch meta (courses, teachers, degrees) once
  const { data: meta } = useQuery({
    queryKey: ['meta'],
    queryFn: () => api.get('/resources/meta').then(r => r.data),
    staleTime: Infinity,
  });

  const { mutate: submit, isPending } = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('type', type);
      if (type === 'link') fd.append('fileUrl', form.fileUrl);
      else if (file) fd.append('file', file);
      if (tags.course) fd.append('course', tags.course);
      if (tags.teacher) fd.append('teacher', tags.teacher);
      tags.degree.forEach(d => fd.append('degree', d));
      if (tags.campus) fd.append('campus', tags.campus);
      return api.post('/resources', fd);
    },
    onSuccess: () => {
      toast.success('Submitted for review! ✓');
      qc.invalidateQueries({ queryKey: ['resources'] });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Upload failed');
    },
  });

  const toggleDegree = (d) =>
    setTags(t => ({
      ...t,
      degree: t.degree.includes(d) ? t.degree.filter(x => x !== d) : [...t.degree, d],
    }));

  const canProceed = () => {
    if (step === 0) return !!type;
    if (step === 1) {
      if (!form.title.trim()) return false;
      if (type === 'link') return !!form.fileUrl.trim();
      return !!file;
    }
    if (step === 2) return !!(tags.course || tags.teacher);
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Upload Resource</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-4 gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-500' : 'bg-surface-600'}`} />
          ))}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* ── Step 0: Pick type ── */}
          {step === 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-4">What kind of resource is this?</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'pdf',   icon: '📄', label: 'PDF' },
                  { key: 'image', icon: '🖼️', label: 'Image' },
                  { key: 'link',  icon: '🔗', label: 'Link / YouTube' },
                ].map(({ key, icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setType(key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      type === key
                        ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                        : 'border-white/10 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <span className="text-3xl">{icon}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. DSA Past Paper 2023"
                  maxLength={120}
                  className="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  maxLength={500}
                  className="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 placeholder-slate-500 resize-none"
                />
              </div>
              {type === 'link' ? (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">URL *</label>
                  <input
                    value={form.fileUrl}
                    onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 placeholder-slate-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">File * (max 20 MB)</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-brand-500/40 transition-colors"
                  >
                    {file ? (
                      <p className="text-sm text-brand-400 truncate">{file.name}</p>
                    ) : (
                      <p className="text-sm text-slate-500">Click to choose {type === 'pdf' ? 'a PDF' : 'an image'}</p>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept={type === 'pdf' ? 'application/pdf' : 'image/*'}
                    className="hidden"
                    onChange={e => setFile(e.target.files[0] || null)}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Tags ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">At least one of Course or Teacher is required.</p>

              {/* Course */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Course</label>
                <select
                  value={tags.course}
                  onChange={e => setTags(t => ({ ...t, course: e.target.value }))}
                  className="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  <option value="">— None —</option>
                  {meta?.courses?.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Teacher */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Teacher</label>
                <select
                  value={tags.teacher}
                  onChange={e => setTags(t => ({ ...t, teacher: e.target.value }))}
                  className="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  <option value="">— None —</option>
                  {meta?.teachers?.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Degree (multi-select toggle pills) */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Degree Program</label>
                <div className="flex flex-wrap gap-2">
                  {(meta?.degrees || ['CS','IT','SE','DS']).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDegree(d)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        tags.degree.includes(d)
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campus (radio — only 2 options) */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Campus</label>
                <div className="flex gap-3">
                  {(meta?.campuses || ['NC', 'OC']).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTags(t => ({ ...t, campus: t.campus === c ? '' : c }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        tags.campus === c
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {c === 'NC' ? '🏫 New Campus' : '🏛️ Old Campus'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 pb-5">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => submit()}
              disabled={!canProceed() || isPending}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isPending ? <><span className="animate-spin">⟳</span> Uploading…</> : 'Submit for Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
