import React from 'react';

const variants = {
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  primary: 'bg-violet-500/15 text-violet-400 border border-violet-500/20',
  neutral: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
