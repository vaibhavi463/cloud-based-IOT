import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Cloud, Database, Globe, Wifi, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const systemItems = [
  { name: 'ESP32 Module', icon: Cpu, status: 'online', description: 'RFID reader connected' },
  { name: 'Cloud Run API', icon: Cloud, status: 'online', description: 'API responding' },
  { name: 'Firestore DB', icon: Database, status: 'online', description: 'Database active' },
  { name: 'REST API', icon: Globe, status: 'online', description: 'Endpoints healthy' },
  { name: 'WiFi Network', icon: Wifi, status: 'online', description: 'Network stable' },
];

const statusConfig = {
  online: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: 'Online' },
  offline: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle, label: 'Offline' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertCircle, label: 'Warning' },
};

export default function SystemHealth() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">System Health</h3>
      <div className="space-y-2">
        {systemItems.map((item, i) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                <item.icon size={16} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark-100 font-medium">{item.name}</p>
                <p className="text-[10px] text-dark-500">{item.description}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')} ${item.status === 'online' ? 'animate-pulse' : ''}`} />
                <span className={`text-[11px] font-medium ${config.color}`}>{config.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
