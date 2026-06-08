import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Cpu } from 'lucide-react';

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 animate-pulse">
            <Cpu size={32} className="text-white animate-spin-slow" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-primary-500/20 rounded-2xl animate-ping opacity-75" />
        </div>
        <p className="text-sm font-medium text-dark-300 tracking-wider uppercase animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
