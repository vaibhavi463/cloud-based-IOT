import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Percent, CreditCard, ScanLine } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import { useStats } from '../hooks/useStats';
import StatCard from '../components/dashboard/StatCard';
import LiveFeed from '../components/dashboard/LiveFeed';
import SystemHealth from '../components/dashboard/SystemHealth';
import TrendChart from '../components/analytics/TrendChart';

export default function DashboardPage() {
  const { students } = useStudents();
  const { records } = useAttendance();
  const stats = useStats(students, records);

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'primary', trend: 'up', trendValue: 12 },
    { title: 'Present Today', value: stats.presentToday, icon: UserCheck, color: 'success', trend: 'up', trendValue: 8 },
    { title: 'Absent Today', value: stats.absentToday, icon: UserX, color: 'danger', trend: 'down', trendValue: 3 },
    { title: 'Attendance %', value: `${stats.attendancePercentage}%`, icon: Percent, color: 'warning', trend: 'up', trendValue: 5 },
    { title: 'Registered RFID', value: students.length, icon: CreditCard, color: 'info' },
    { title: 'Total Scans', value: stats.totalScans, icon: ScanLine, color: 'indigo' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-dark-400 mt-1">Real-time overview of your RFID attendance system</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* Charts + Live Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart - 2 columns */}
        <div className="lg:col-span-2">
          <TrendChart data={stats.dailyAttendance} title="Attendance Trend (Last 7 Days)" />
        </div>

        {/* Live Feed - 1 column */}
        <LiveFeed records={stats.todayRecords} />
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SystemHealth />

        {/* Quick Stats Mini */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Quick Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Active today', value: `${stats.presentToday} students`, pct: stats.attendancePercentage, color: 'bg-primary-500' },
              { label: 'Absent today', value: `${stats.absentToday} students`, pct: stats.totalStudents > 0 ? Math.round((stats.absentToday / stats.totalStudents) * 100) : 0, color: 'bg-red-500' },
              { label: 'Total scans', value: `${stats.totalScans} records`, pct: 100, color: 'bg-indigo-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-dark-300">{item.label}</span>
                  <span className="text-xs text-dark-400">{item.value}</span>
                </div>
                <div className="w-full h-1.5 bg-dark-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.pct, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
