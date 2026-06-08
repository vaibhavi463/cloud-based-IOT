import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, User, Clock } from 'lucide-react';
import { formatTimeOnly } from '../../utils/formatters';

export default function LiveFeed({ records = [] }) {
  // Show latest 8 records
  const recentRecords = records.slice(0, 8);

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <h3 className="text-sm font-semibold text-white">Live Activity Feed</h3>
        <span className="text-[10px] text-dark-400 ml-auto">{records.length} scans</span>
      </div>

      <div className="space-y-1 overflow-y-auto max-h-80 scrollbar-thin pr-1">
        <AnimatePresence initial={false}>
          {recentRecords.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-dark-500 text-xs">
              <Activity size={16} className="mr-2" />
              Waiting for RFID scans...
            </div>
          ) : (
            recentRecords.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/20 to-indigo-500/20 border border-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-primary-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-100 font-medium truncate">
                    {record.name || 'Unknown'}
                  </p>
                  <p className="text-[11px] text-dark-500 truncate">
                    UID {record.uid} • {record.subject}
                  </p>
                </div>

                {/* Status + Time */}
                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                    Present
                  </span>
                  <p className="text-[10px] text-dark-500 mt-0.5 flex items-center justify-end gap-1">
                    <Clock size={10} />
                    {formatTimeOnly(record.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
