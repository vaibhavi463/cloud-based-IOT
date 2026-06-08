import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Cpu, ShieldAlert, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Try again later.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[460px] bg-dark-900/60 backdrop-blur-xl border border-white/5 p-10 rounded-3xl shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-primary-500/25 mb-5">
            <Cpu size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-dark-400 mt-2">Smart IoT RFID Attendance Console</p>
        </div>

        {/* Warning/Info Alert for first setup */}
        <div className="mb-8 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 flex gap-3 items-start">
          <ShieldAlert size={16} className="text-primary-400 shrink-0 mt-0.5" />
          <p className="text-xs text-dark-300 leading-relaxed">
            Ensure you have added your admin user email and password in the <strong>Firebase Console</strong> authentication tab.
          </p>
        </div>

        {/* Error panel */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex gap-3 items-center"
          >
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-dark-200 uppercase tracking-wider mb-4">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rfid.io"
                disabled={isSubmitting}
                className="w-full input-icon-left pr-4 py-3 bg-dark-800/40 border border-white/5 rounded-2xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500/30 focus:ring-1 focus:ring-primary-500/10 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-200 uppercase tracking-wider mb-4">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full input-icon-left input-icon-right py-3 bg-dark-800/40 border border-white/5 rounded-2xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500/30 focus:ring-1 focus:ring-primary-500/10 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-650 hover:to-indigo-750 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Access Console'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
