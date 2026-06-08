import React from 'react';
import { motion } from 'framer-motion';
import { useAttendance } from '../hooks/useAttendance';
import AttendanceTable from '../components/attendance/AttendanceTable';

export default function AttendancePage() {
  const { records, loading } = useAttendance();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white tracking-tight">Attendance Records</h1>
        <p className="text-sm text-dark-400 mt-1">View and export all RFID attendance records in real-time</p>
      </motion.div>

      {/* Live indicator */}
      <div className="glass-card px-5 py-3 inline-flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-dark-300">Real-time updates • {records.length} records</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : (
        <AttendanceTable records={records} />
      )}
    </div>
  );
}
