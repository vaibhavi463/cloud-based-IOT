import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Wifi, Menu, Sun, Moon, User, Settings, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Close dropdowns on outside click
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = currentUser?.email
    ? currentUser.email.charAt(0).toUpperCase()
    : 'A';
    
  const userName = currentUser?.email ? currentUser.email.split('@')[0] : 'Administrator';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b border-white/5 bg-dark-950/60 backdrop-blur-xl">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-dark-400"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden sm:block w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, records..."
            className="w-full input-icon-left pr-4 py-2 bg-dark-800/40 border border-white/5 rounded-xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500/30 focus:ring-1 focus:ring-primary-500/10 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-dark-500 bg-dark-700/50 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Right: Status + Time + Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-4 relative">
        {/* Live Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
          <span className="text-xs font-medium text-emerald-400">Live</span>
        </div>

        {/* WiFi */}
        <div className="hidden sm:flex items-center gap-1.5 text-dark-400">
          <Wifi size={14} />
        </div>

        {/* Current Time */}
        <div className="hidden md:block text-right">
          <p className="text-xs font-medium text-dark-200">{format(currentTime, 'hh:mm:ss a')}</p>
          <p className="text-[10px] text-dark-500">{format(currentTime, 'EEE, MMM dd')}</p>
        </div>

        {/* Day/Night Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 text-dark-400 hover:text-dark-200 transition-colors"
          title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-white/5 text-dark-400 hover:text-dark-200 transition-colors focus:outline-none"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-dark-900 border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-dark-800/50">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <button className="text-[10px] text-primary-400 hover:text-primary-300">Mark all read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                  <div className="flex gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center shrink-0">
                      <Bell size={14} />
                    </div>
                    <div>
                      <p className="text-sm text-dark-100">System update complete</p>
                      <p className="text-xs text-dark-400 mt-0.5">Your IoT device was updated successfully.</p>
                      <p className="text-[10px] text-dark-500 mt-1">2 mins ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-dark-800 hover:ring-primary-500/50 transition-all" 
            title={currentUser?.email || 'Admin'}
          >
            {userInitial}
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-dark-900 border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/5 bg-dark-800/50">
                  <p className="text-sm font-semibold text-white capitalize">{userName}</p>
                  <p className="text-xs text-dark-400 mt-0.5 truncate">{currentUser?.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => { setShowProfile(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <User size={16} /> My Profile
                  </button>
                  <button 
                    onClick={() => { setShowProfile(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <div className="h-px bg-white/5 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
