import React from 'react';
import { motion } from 'framer-motion';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import ReportGenerator from '../components/reports/ReportGenerator';

export default function ReportsPage() {
  const { students } = useStudents();
  const { records, loading } = useAttendance();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white tracking-tight">Reports</h1>
        <p className="text-sm text-dark-400 mt-1">Generate and export attendance reports for any time period</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : (
        <ReportGenerator records={records} students={students} />
      )}
    </div>
  );
}
