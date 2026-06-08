import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card p-3 !rounded-xl text-xs">
      <p className="text-dark-200 font-medium mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-dark-400 capitalize">{entry.dataKey}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart({ data = [], title = 'Attendance Trend' }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7194', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7194', fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="present"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#presentGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#0f1117', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="absent"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#absentGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#ef4444', stroke: '#0f1117', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
