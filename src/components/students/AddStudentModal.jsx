import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export default function AddStudentModal({ isOpen, onClose, onSave, editStudent = null }) {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [subject, setSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!editStudent;

  useEffect(() => {
    if (editStudent) {
      setUid(editStudent.id || '');
      setName(editStudent.name || '');
      setRollNo(editStudent.rollNo || '');
      setSubject(editStudent.subject || '');
    } else {
      setUid('');
      setName('');
      setRollNo('');
      setSubject('');
    }
    setError('');
  }, [editStudent, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!uid.trim() || !name.trim() || !rollNo.trim() || !subject.trim()) {
      setError('All fields are required');
      return;
    }

    setSaving(true);
    const result = await onSave(uid.trim(), {
      name: name.trim(),
      rollNo: rollNo.trim(),
      subject: subject.trim(),
    });

    if (result?.success === false) {
      setError(result.error || 'Failed to save');
    } else {
      onClose();
    }
    setSaving(false);
  };

  const inputClasses = "w-full px-4 py-3 bg-dark-800/60 border border-white/5 rounded-xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all";
  const labelClasses = "block text-[11px] font-semibold text-dark-200 uppercase tracking-wider mb-4";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Student' : 'Add New Student'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={labelClasses}>RFID UID</label>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="e.g., 11223344"
            className={inputClasses}
            disabled={isEdit}
          />
          {isEdit && <p className="text-[10px] text-dark-500 mt-1">UID cannot be changed</p>}
        </div>

        <div>
          <label className={labelClasses}>Student Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Vaibhavi Garg"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Roll Number</label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="e.g., 23131012384"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., IOT"
            className={inputClasses}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/20"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
