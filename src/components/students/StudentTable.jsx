import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, CreditCard } from 'lucide-react';
import SearchInput from '../ui/SearchInput';
import EmptyState from '../ui/EmptyState';

export default function StudentTable({ students = [], onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Filter
  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.id || '').toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const aVal = (a[sortField] || '').toLowerCase();
    const bVal = (b[sortField] || '').toLowerCase();
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

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

  if (students.length === 0) {
    return <EmptyState title="No students registered" description="Add students to begin tracking RFID attendance." />;
  }

  return (
    <div>
      <SearchInput
        value={search}
        onChange={(val) => { setSearch(val); setCurrentPage(1); }}
        placeholder="Search by name, roll number, or UID..."
        className="mb-4 max-w-md"
      />

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-dark-800/30">
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('id')}>
                RFID UID <SortIndicator field="id" />
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
              <th className="text-right px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((student, i) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/[0.03] table-row-hover transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-primary-400" />
                    <code className="text-xs text-primary-300 bg-primary-500/10 px-2 py-0.5 rounded-md">{student.id}</code>
                  </div>
                </td>
                <td className="px-4 py-3 text-dark-100 font-medium">{student.name}</td>
                <td className="px-4 py-3 text-dark-300">{student.rollNo}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                    {student.subject}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => onEdit(student)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-dark-400 hover:text-blue-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-dark-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
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
    </div>
  );
}
