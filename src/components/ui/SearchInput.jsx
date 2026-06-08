import React from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full input-icon-left pr-4 py-2.5 bg-dark-800/60 border border-white/5 rounded-xl text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
      />
    </div>
  );
}
