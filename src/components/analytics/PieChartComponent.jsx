import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const COLORS = ['#8b5cf6', '#ef4444', '#6b7194'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card p-3 !rounded-xl text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: payload[0].payload.fill }} />
        <span className="text-dark-200 font-medium">{payload[0].name}:</span>
        <span className="text-white font-bold">{payload[0].value}</span>
      </div>
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartComponent({ present = 0, absent = 0, title = 'Present vs Absent' }) {
  const data = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    data.push({ name: 'No Data', value: 1 });
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
