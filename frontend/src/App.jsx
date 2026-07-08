import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyUploadsPage from './pages/MyUploadsPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import GpaCalculatorPage from './pages/GpaCalculatorPage';
import MeritCalculatorPage from './pages/MeritCalculatorPage';
import ResourceDetailsPage from './pages/ResourceDetailsPage';
import useAuthStore from './store/authStore';

export default function App() {
  const { restoreSession, clearAuth } = useAuthStore();

  useEffect(() => {
    // Try to restore session from httpOnly cookie on every page load
    restoreSession();

    // Listen for the forced logout event dispatched by the Axios interceptor
    const handler = () => { clearAuth(); };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e2535',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/about"       element={<AboutPage />} />
        <Route path="/gpa-calculator" element={<GpaCalculatorPage />} />
        <Route path="/merit-calculator" element={<MeritCalculatorPage />} />
        <Route path="/resource/:id" element={<ResourceDetailsPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/my-uploads"  element={<ProtectedRoute><MyUploadsPage /></ProtectedRoute>} />
        <Route path="/admin"       element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
