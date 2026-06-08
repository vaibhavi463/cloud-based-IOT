import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ImportCSVModal({ isOpen, onClose, onImport }) {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setStatus(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        setStatus({ type: 'error', message: 'CSV must have a header row and at least one data row.' });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['uid', 'name', 'rollno', 'subject'];
      const missing = requiredHeaders.filter(h => !headers.includes(h));

      if (missing.length > 0) {
        setStatus({ type: 'error', message: `Missing columns: ${missing.join(', ')}. Required: uid, name, rollNo, subject` });
        return;
      }

      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || '';
        });
        return obj;
      }).filter(row => row.uid);

      setCsvData(data);
      setStatus({ type: 'success', message: `${data.length} students parsed successfully.` });
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setImporting(true);
    let successCount = 0;

    for (const row of csvData) {
      const result = await onImport(row.uid, {
        name: row.name,
        rollNo: row.rollno,
        subject: row.subject,
      });
      if (result?.success) successCount++;
    }

    setStatus({ type: 'success', message: `${successCount} of ${csvData.length} students imported.` });
    setImporting(false);
    setCsvData([]);

    setTimeout(() => onClose(), 1500);
  };

  const handleClose = () => {
    setCsvData([]);
    setFileName('');
    setStatus(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Students from CSV" maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* Upload area */}
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary-500/30 hover:bg-primary-500/5 transition-all">
          <Upload size={28} className="text-dark-400 mb-2" />
          <p className="text-sm text-dark-200 font-medium">Click to upload CSV file</p>
          <p className="text-xs text-dark-500 mt-1">Required columns: uid, name, rollNo, subject</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* File name */}
        {fileName && (
          <div className="flex items-center gap-2 text-sm text-dark-300">
            <FileText size={14} />
            {fileName}
          </div>
        )}

        {/* Status */}
        {status && (
          <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
            status.type === 'error'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {status.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
            {status.message}
          </div>
        )}

        {/* Preview */}
        {csvData.length > 0 && (
          <div className="max-h-48 overflow-y-auto rounded-xl border border-white/5">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-dark-800/30">
                  <th className="px-3 py-2 text-left text-dark-400">UID</th>
                  <th className="px-3 py-2 text-left text-dark-400">Name</th>
                  <th className="px-3 py-2 text-left text-dark-400">Roll No</th>
                  <th className="px-3 py-2 text-left text-dark-400">Subject</th>
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.03]">
                    <td className="px-3 py-2 text-dark-300">{row.uid}</td>
                    <td className="px-3 py-2 text-dark-200">{row.name}</td>
                    <td className="px-3 py-2 text-dark-300">{row.rollno}</td>
                    <td className="px-3 py-2 text-dark-300">{row.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 10 && (
              <p className="text-center text-[10px] text-dark-500 py-2">... and {csvData.length - 10} more rows</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-dark-300 bg-dark-800/50 hover:bg-dark-700/50 border border-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={csvData.length === 0 || importing}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/20"
          >
            {importing ? 'Importing...' : `Import ${csvData.length} Students`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
