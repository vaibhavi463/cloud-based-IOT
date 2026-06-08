import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export default function MiniChart({ data = [], dataKey = 'present', color = '#8b5cf6', height = 60 }) {
  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`miniGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              background: 'rgba(15,17,23,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#e8eaf0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
            cursor={false}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#miniGrad-${color})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#0f1117', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
