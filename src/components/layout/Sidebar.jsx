import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  FileText,
  Settings,
  Cpu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/attendance', label: 'Attendance', icon: ClipboardList },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const userInitial = currentUser?.email
    ? currentUser.email.charAt(0).toUpperCase()
    : 'A';
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-dark-900/80 backdrop-blur-xl border-r border-white/5`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0 mr-2">
              <Cpu size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white tracking-tight truncate">RFID Attend</h1>
              <p className="text-[10px] text-dark-400 font-medium truncate">IoT Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-dark-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-3.5 overflow-y-auto scrollbar-thin">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 border
                ${isActive
                  ? 'text-white bg-gradient-to-r from-primary-500/15 to-primary-600/5 border-primary-500/20 shadow-md shadow-primary-500/5'
                  : 'text-dark-400 hover:text-dark-100 hover:bg-white/[0.02] hover:translate-x-1 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon size={18} className={`shrink-0 ${isActive ? 'text-primary-400' : 'text-dark-500 group-hover:text-dark-300'}`} />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-dark-100 truncate capitalize">{currentUser?.email?.split('@')[0] || 'Administrator'}</p>
                <p className="text-[10px] text-dark-400 truncate">{currentUser?.email || 'admin@rfid.io'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white/5 text-dark-450 hover:text-red-400 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
