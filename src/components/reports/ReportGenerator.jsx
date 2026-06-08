import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, Calendar } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay, subDays, subWeeks, subMonths } from 'date-fns';
import { formatTimestamp } from '../../utils/formatters';
import { exportPDF } from '../../utils/exportPDF';
import { exportExcel } from '../../utils/exportExcel';
import Badge from '../ui/Badge';

const reportTypes = [
  { id: 'daily', label: 'Daily Report', icon: Calendar, range: () => ({ start: startOfDay(new Date()), end: endOfDay(new Date()) }) },
  { id: 'weekly', label: 'Weekly Report', icon: Calendar, range: () => ({ start: startOfDay(subWeeks(new Date(), 1)), end: endOfDay(new Date()) }) },
  { id: 'monthly', label: 'Monthly Report', icon: Calendar, range: () => ({ start: startOfDay(subMonths(new Date(), 1)), end: endOfDay(new Date()) }) },
];

export default function ReportGenerator({ records = [], students = [] }) {
  const [selectedType, setSelectedType] = useState('daily');

  const reportConfig = reportTypes.find(r => r.id === selectedType);
  const dateRange = reportConfig.range();

  // Filter records within range
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (!r.timestamp) return false;
      const date = r.timestamp.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
      return isWithinInterval(date, { start: dateRange.start, end: dateRange.end });
    });
  }, [records, selectedType]);

  // Unique present students
  const uniquePresent = new Set(filteredRecords.map(r => r.uid));
  const presentCount = uniquePresent.size;
  const absentCount = Math.max(students.length - presentCount, 0);

  const handleExportPDF = () => {
    const columns = ['UID', 'Name', 'Roll Number', 'Subject', 'Status', 'Timestamp'];
    const rows = filteredRecords.map(r => [r.uid, r.name, r.rollNo, r.subject, r.status, formatTimestamp(r.timestamp)]);
    const title = `${reportConfig.label} — ${format(dateRange.start, 'MMM dd, yyyy')} to ${format(dateRange.end, 'MMM dd, yyyy')}`;
    exportPDF(title, columns, rows, `attendance_${selectedType}_report.pdf`);
  };

  const handleExportExcel = () => {
    const headers = ['UID', 'Name', 'Roll Number', 'Subject', 'Status', 'Timestamp'];
    const rows = filteredRecords.map(r => [r.uid, r.name, r.rollNo, r.subject, r.status, formatTimestamp(r.timestamp)]);
    exportExcel('Attendance Report', headers, rows, `attendance_${selectedType}_report.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {reportTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedType(type.id)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              selectedType === type.id
                ? 'border-primary-500/30 bg-primary-500/10 text-white'
                : 'border-white/5 bg-dark-800/30 text-dark-400 hover:text-dark-200 hover:border-white/10'
            }`}
          >
            <type.icon size={18} className={selectedType === type.id ? 'text-primary-400' : ''} />
            <span className="text-sm font-medium">{type.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-white">{filteredRecords.length}</p>
          <p className="text-xs text-dark-400 mt-1">Total Scans</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{presentCount}</p>
          <p className="text-xs text-dark-400 mt-1">Present</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{absentCount}</p>
          <p className="text-xs text-dark-400 mt-1">Absent</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-primary-400">
            {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
          </p>
          <p className="text-xs text-dark-400 mt-1">Attendance Rate</p>
        </div>
      </div>

      {/* Date range info */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-dark-400">
          <span className="text-dark-200 font-medium">{reportConfig.label}</span>
          {' · '}
          {format(dateRange.start, 'MMM dd, yyyy')} — {format(dateRange.end, 'MMM dd, yyyy')}
          {' · '}
          {filteredRecords.length} records
        </div>

        {/* Export actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 rounded-xl transition-colors"
          >
            <Download size={13} /> PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 rounded-xl transition-colors"
          >
            <Download size={13} /> Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 rounded-xl transition-colors"
          >
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      {/* Report Table Preview */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm" id="report-table">
          <thead>
            <tr className="border-b border-white/5 bg-dark-800/30">
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase">#</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase">UID</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase">Roll Number</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.slice(0, 50).map((record, i) => (
              <tr key={record.id} className="border-b border-white/[0.03] table-row-hover">
                <td className="px-4 py-3 text-dark-500 text-xs">{i + 1}</td>
                <td className="px-4 py-3">
                  <code className="text-xs text-primary-300 bg-primary-500/10 px-2 py-0.5 rounded-md">{record.uid}</code>
                </td>
                <td className="px-4 py-3 text-dark-100 font-medium">{record.name}</td>
                <td className="px-4 py-3 text-dark-300">{record.rollNo}</td>
                <td className="px-4 py-3 text-dark-300">{record.subject}</td>
                <td className="px-4 py-3"><Badge variant="success">{record.status}</Badge></td>
                <td className="px-4 py-3 text-xs text-dark-400">{formatTimestamp(record.timestamp)}</td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-dark-500">
                  No records found for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredRecords.length > 50 && (
        <p className="text-center text-xs text-dark-500">Showing first 50 of {filteredRecords.length} records. Export to see all.</p>
      )}
    </div>
  );
}
