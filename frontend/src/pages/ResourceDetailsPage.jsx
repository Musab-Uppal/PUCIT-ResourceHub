import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';

const TYPE_ICONS = {
  pdf:   { icon: '📄', style: 'bg-red-500/15 text-red-400', label: 'PDF Document' },
  image: { icon: '🖼️', style: 'bg-teal-500/15 text-teal-400', label: 'Image File' },
  link:  { icon: '🔗', style: 'bg-sky-500/15 text-sky-400', label: 'External Link' },
};

const DEGREE_STYLES = {
  CS: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  SE: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  IT: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  DS: 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30',
};

export default function ResourceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: resource, isLoading, isError } = useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      const { data } = await api.get(`/resources/${id}`);
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-lg text-slate-300">Resource not found.</p>
        <button onClick={() => navigate('/')} className="text-brand-400 hover:underline mt-4">Go Home</button>
      </div>
    );
  }

  const typeInfo = TYPE_ICONS[resource.type] || TYPE_ICONS.link;
  const isFile = resource.type === 'pdf' || resource.type === 'image';

  const handleAction = () => {
    if (!isFile) {
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Force Cloudinary download by injecting fl_attachment
      const url = resource.fileUrl;
      const safeTitle = resource.title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const attachmentFlag = `fl_attachment:${safeTitle}`;
      
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        const downloadUrl = `${parts[0]}/upload/${attachmentFlag}/${parts[1]}`;
        // Creating an anchor element to trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = safeTitle;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(url, '_blank');
      }
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-12"
    >
      <button onClick={() => navigate(-1)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 flex items-center gap-2">
        ← Back
      </button>

      <div className="glass rounded-3xl p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-2xl p-3 rounded-2xl ${typeInfo.style}`}>
                {typeInfo.icon}
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight break-words">
                  {resource.title}
                </h1>
                <p className="text-sm text-slate-400 mt-1">{typeInfo.label}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {resource.description || <span className="text-slate-500 italic">No description provided.</span>}
              </p>
            </div>

            <button
              onClick={handleAction}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 active:scale-95"
            >
              {isFile ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download File
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  View Link
                </>
              )}
            </button>
          </div>

          {/* Sidebar Area */}
          <div className="w-full md:w-72 shrink-0 bg-white/5 rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Details</h3>
            
            <div className="space-y-4">
              {resource.course && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Course</span>
                  <span className="inline-block px-3 py-1 bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20 rounded-lg text-sm font-medium">
                    {resource.course}
                  </span>
                </div>
              )}
              
              {resource.teacher && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Teacher</span>
                  <span className="inline-block px-3 py-1 bg-slate-500/15 text-slate-300 ring-1 ring-white/10 rounded-lg text-sm font-medium">
                    {resource.teacher}
                  </span>
                </div>
              )}

              {resource.degree?.length > 0 && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Degrees</span>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.degree.map(d => (
                      <span key={d} className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEGREE_STYLES[d] || 'bg-white/10 text-slate-300'}`}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resource.campus && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Campus</span>
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                    {resource.campus === 'NC' ? '🏫 NC' : '🏛️ OC'}
                  </span>
                </div>
              )}

              <hr className="border-white/5 my-4" />

              <div>
                <span className="text-xs text-slate-500 block mb-1">Uploaded By</span>
                <span className="text-sm text-slate-300 font-medium">
                  {resource.uploadedBy?.name || 'Unknown'}
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  {new Date(resource.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.main>
  );
}
