import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary', index = 0 }) {
  const colorMap = {
    primary: {
      icon: 'from-primary-500 to-primary-700',
      shadow: 'shadow-primary-500/15',
      text: 'text-primary-400',
    },
    success: {
      icon: 'from-emerald-500 to-emerald-700',
      shadow: 'shadow-emerald-500/15',
      text: 'text-emerald-400',
    },
    danger: {
      icon: 'from-red-500 to-red-700',
      shadow: 'shadow-red-500/15',
      text: 'text-red-400',
    },
    warning: {
      icon: 'from-amber-500 to-amber-700',
      shadow: 'shadow-amber-500/15',
      text: 'text-amber-400',
    },
    info: {
      icon: 'from-blue-500 to-blue-700',
      shadow: 'shadow-blue-500/15',
      text: 'text-blue-400',
    },
    indigo: {
      icon: 'from-indigo-500 to-indigo-700',
      shadow: 'shadow-indigo-500/15',
      text: 'text-indigo-400',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-dark-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.icon} ${colors.shadow} shadow-lg flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        {trendValue !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{trendValue}%</span>
          </div>
        )}
      </div>

      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-dark-400 mt-1 font-medium">{title}</p>
    </motion.div>
  );
}
