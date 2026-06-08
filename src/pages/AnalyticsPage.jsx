import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import { useStats } from '../hooks/useStats';
import TrendChart from '../components/analytics/TrendChart';
import PieChartComponent from '../components/analytics/PieChartComponent';
import BarChartComponent from '../components/analytics/BarChartComponent';
import StatCard from '../components/dashboard/StatCard';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { students } = useStudents();
  const { records } = useAttendance();
  const stats = useStats(students, records);

  // Extended trend data (last 30 days)
  const monthlyTrend = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayLabel = format(day, 'MMM dd');
      const dayRecords = records.filter(r => {
        if (!r.timestamp) return false;
        const date = r.timestamp.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
        return format(date, 'yyyy-MM-dd') === dayStr;
      });
      const uniqueStudents = new Set(dayRecords.map(r => r.uid));
      return {
        date: dayLabel,
        present: uniqueStudents.size,
        absent: Math.max(students.length - uniqueStudents.size, 0),
        scans: dayRecords.length,
      };
    });
  }, [records, students]);

  // RFID usage stats
  const rfidStats = useMemo(() => {
    const uidCounts = {};
    records.forEach(r => {
      uidCounts[r.uid] = (uidCounts[r.uid] || 0) + 1;
    });
    return Object.entries(uidCounts)
      .map(([uid, count]) => {
        const student = students.find(s => s.id === uid);
        return { uid, name: student?.name || 'Unknown', scans: count };
      })
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 10);
  }, [records, students]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-sm text-dark-400 mt-1">Detailed insights into attendance patterns and RFID usage</p>
      </motion.div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Daily Attendance" value={`${stats.attendancePercentage}%`} icon={TrendingUp} color="primary" index={0} />
        <StatCard title="Total Records" value={records.length} icon={BarChart3} color="info" index={1} />
        <StatCard title="Present Today" value={stats.presentToday} icon={PieChart} color="success" index={2} />
        <StatCard title="Active Cards" value={new Set(records.map(r => r.uid)).size} icon={Activity} color="indigo" index={3} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrendChart data={monthlyTrend} title="30-Day Attendance Trend" />
        </div>
        <PieChartComponent
          present={stats.presentToday}
          absent={stats.absentToday}
          title="Today: Present vs Absent"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChartComponent
          data={stats.subjectAttendance}
          title="Subject-wise Attendance (Today)"
        />

        {/* RFID Usage Leaderboard */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">RFID Usage — Top Students</h3>
          <div className="space-y-2">
            {rfidStats.length === 0 ? (
              <p className="text-xs text-dark-500 text-center py-8">No scan data available</p>
            ) : (
              rfidStats.map((item, i) => (
                <motion.div
                  key={item.uid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-dark-700/50 flex items-center justify-center text-[10px] text-dark-400 font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-100 font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-dark-500">UID: {item.uid}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-primary-400">{item.scans}</span>
                    <p className="text-[10px] text-dark-500">scans</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
