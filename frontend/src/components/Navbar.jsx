import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import UploadModal from './UploadModal';

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const [showUpload, setShowUpload] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
      toast.success('Logged out');
      window.location.href = '/';
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="PUCIT Hub Logo" className="w-8 h-8 object-cover rounded-xl shadow-sm" />
            <span className="font-bold text-white hidden sm:block">PUCIT ResourceHub</span>
          </Link>

          {/* Centre: search (placeholder for now) */}
          <div className="flex-1 max-w-md hidden md:block">
            <input
              type="text"
              placeholder="Search resources…"
              className="w-full bg-surface-700 text-slate-300 placeholder-slate-500 rounded-lg px-4 py-2 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <Link to="/about" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
              About
            </Link>
            <Link to="/gpa-calculator" className="text-sm text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-1">
              🎓 GPA Calc
            </Link>

            <button
              onClick={() => user ? setShowUpload(true) : (window.location.href = '/login')}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="text-base leading-none">↑</span>
              <span>Upload</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full bg-brand-700 text-white text-sm font-semibold flex items-center justify-center hover:ring-2 hover:ring-brand-400 transition-all"
                >
                  {user.name[0].toUpperCase()}
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl py-1 text-sm z-50 origin-top-right"
                    >
                      <div className="px-4 py-2 text-slate-400 border-b border-white/5 truncate">{user.email}</div>
                      <Link to="/my-uploads" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-white/5 text-slate-300">My Uploads</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-white/5 text-amber-400">Admin Panel</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-white/5 text-red-400">Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-2">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  );
}
