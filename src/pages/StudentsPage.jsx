import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Download } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import StudentTable from '../components/students/StudentTable';
import AddStudentModal from '../components/students/AddStudentModal';
import ImportCSVModal from '../components/students/ImportCSVModal';
import { exportCSV } from '../utils/exportCSV';

export default function StudentsPage() {
  const { students, loading, addStudent, updateStudent, removeStudent } = useStudents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const handleEdit = (student) => {
    setEditStudent(student);
    setShowAddModal(true);
  };

  const handleDelete = async (uid) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      await removeStudent(uid);
    }
  };

  const handleSave = async (uid, data) => {
    if (editStudent) {
      return await updateStudent(uid, data);
    }
    return await addStudent(uid, data);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditStudent(null);
  };

  const handleExportCSV = () => {
    const headers = ['RFID UID', 'Name', 'Roll Number', 'Subject'];
    const rows = students.map(s => [s.id, s.name, s.rollNo, s.subject]);
    exportCSV(headers, rows, 'students_list.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white tracking-tight">Students</h1>
          <p className="text-sm text-dark-400 mt-1">Manage registered students and RFID cards</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 rounded-xl transition-colors"
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 rounded-xl transition-colors"
          >
            <Upload size={14} /> Import CSV
          </button>
          <button
            onClick={() => { setEditStudent(null); setShowAddModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-colors shadow-lg shadow-primary-500/20"
          >
            <Plus size={16} /> Add Student
          </button>
        </motion.div>
      </div>

      {/* Student Count */}
      <div className="glass-card px-5 py-3 inline-flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary-400" />
        <span className="text-xs text-dark-300">{students.length} registered students</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : (
        <StudentTable students={students} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Modals */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        onSave={handleSave}
        editStudent={editStudent}
      />
      <ImportCSVModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={addStudent}
      />
    </div>
  );
}
