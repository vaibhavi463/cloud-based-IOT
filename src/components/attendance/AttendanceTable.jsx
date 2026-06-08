import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter } from 'lucide-react';
import SearchInput from '../ui/SearchInput';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { formatTimestamp } from '../../utils/formatters';
import { exportCSV } from '../../utils/exportCSV';
import { exportExcel } from '../../utils/exportExcel';

export default function AttendanceTable({ records = [] }) {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Unique subjects for filter dropdown
  const subjects = useMemo(() => {
    const set = new Set(records.map(r => r.subject).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [records]);

  // Filter
  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch =
        (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.uid || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.rollNo || '').toLowerCase().includes(search.toLowerCase());
      const matchSubject = subjectFilter === 'all' || r.subject === subjectFilter;
      return matchSearch && matchSubject;
    });
  }, [records, search, subjectFilter]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortField === 'timestamp') {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
        return sortDir === 'desc' ? bTime - aTime : aTime - bTime;
      }
      const aVal = (a[sortField] || '').toLowerCase();
      const bVal = (b[sortField] || '').toLowerCase();
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [filtered, sortField, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIndicator = ({ field }) => (
    <span className="ml-1 text-dark-500">
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </span>
  );

  const handleExportCSV = () => {
    const headers = ['UID', 'Name', 'Roll Number', 'Subject', 'Status', 'Timestamp'];
    const rows = sorted.map(r => [r.uid, r.name, r.rollNo, r.subject, r.status, formatTimestamp(r.timestamp)]);
    exportCSV(headers, rows, 'attendance_records.csv');
  };

  const handleExportExcel = () => {
    const headers = ['UID', 'Name', 'Roll Number', 'Subject', 'Status', 'Timestamp'];
    const rows = sorted.map(r => [r.uid, r.name, r.rollNo, r.subject, r.status, formatTimestamp(r.timestamp)]);
    exportExcel('Attendance', headers, rows, 'attendance_records.xlsx');
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={(val) => { setSearch(val); setCurrentPage(1); }}
          placeholder="Search by name, UID, roll number..."
          className="w-full sm:max-w-xs"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Subject filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <select
              value={subjectFilter}
              onChange={(e) => { setSubjectFilter(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-4 py-2.5 bg-dark-800/60 border border-white/5 rounded-xl text-xs text-dark-200 focus:outline-none focus:border-primary-500/30 appearance-none cursor-pointer"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>
              ))}
            </select>
          </div>

          {/* Rows per page */}
          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-3 py-2.5 bg-dark-800/60 border border-white/5 rounded-xl text-xs text-dark-200 focus:outline-none focus:border-primary-500/30 appearance-none cursor-pointer"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
          </select>

          {/* Export buttons */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 rounded-xl transition-colors"
          >
            <Download size={13} /> CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 rounded-xl transition-colors"
          >
            <Download size={13} /> Excel
          </button>
        </div>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <EmptyState title="No attendance records" description="Attendance records will appear here when students scan their RFID cards." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-dark-800/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('uid')}>
                    UID <SortIndicator field="uid" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('name')}>
                    Name <SortIndicator field="name" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('rollNo')}>
                    Roll Number <SortIndicator field="rollNo" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('subject')}>
                    Subject <SortIndicator field="subject" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('timestamp')}>
                    Timestamp <SortIndicator field="timestamp" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((record, i) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] table-row-hover transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs text-primary-300 bg-primary-500/10 px-2 py-0.5 rounded-md">{record.uid}</code>
                    </td>
                    <td className="px-4 py-3 text-dark-100 font-medium">{record.name}</td>
                    <td className="px-4 py-3 text-dark-300">{record.rollNo}</td>
                    <td className="px-4 py-3 text-dark-300">{record.subject}</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">{record.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-dark-400">{formatTimestamp(record.timestamp)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-xs text-dark-400">
              <p>
                Showing {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, sorted.length)} of {sorted.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      page === currentPage
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'bg-dark-800/50 hover:bg-dark-700/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
