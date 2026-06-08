import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card p-3 !rounded-xl text-xs">
      <p className="text-dark-200 font-medium mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary-500" />
        <span className="text-dark-400">Count:</span>
        <span className="text-white font-medium">{payload[0].value}</span>
      </div>
    </div>
  );
};

export default function BarChartComponent({ data = [], title = 'Subject-wise Attendance' }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="subject"
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
          <Bar
            dataKey="count"
            fill="url(#barGrad)"
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
