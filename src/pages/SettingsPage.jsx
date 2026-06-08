import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Cloud, Database, Globe, Wifi, Shield, CreditCard, Lock,
  AlertTriangle, CheckCircle2, XCircle, AlertCircle, Info
} from 'lucide-react';

const systemStatus = [
  { name: 'ESP32 RFID Module', icon: Cpu, status: 'online', latency: '12ms', uptime: '99.8%', description: 'Wokwi simulation running' },
  { name: 'Google Cloud Run', icon: Cloud, status: 'online', latency: '45ms', uptime: '99.99%', description: 'asia-south1 region' },
  { name: 'Firestore Database', icon: Database, status: 'online', latency: '8ms', uptime: '99.99%', description: 'Real-time sync active' },
  { name: 'REST API Endpoint', icon: Globe, status: 'online', latency: '52ms', uptime: '99.9%', description: 'POST /attendance active' },
  { name: 'WiFi Connection', icon: Wifi, status: 'online', latency: '3ms', uptime: '98.5%', description: 'Wokwi-GUEST network' },
];

const securityItems = [
  { name: 'RFID UID Verification', icon: CreditCard, status: 'active', description: 'Only registered UIDs accepted. Unregistered cards return 404.' },
  { name: 'Firestore Security Rules', icon: Shield, status: 'active', description: 'Read/write restricted to authenticated admin sessions.' },
  { name: 'Cloud Run HTTPS', icon: Lock, status: 'active', description: 'All API traffic encrypted via TLS/SSL.' },
  { name: 'Invalid Card Detection', icon: AlertTriangle, status: 'monitoring', description: 'Unregistered card attempts are logged for review.' },
];

const statusConfig = {
  online: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/10', icon: CheckCircle2, label: 'Online' },
  offline: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/10', icon: XCircle, label: 'Offline' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/10', icon: AlertCircle, label: 'Warning' },
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/10', icon: CheckCircle2, label: 'Active' },
  monitoring: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/10', icon: Info, label: 'Monitoring' },
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-dark-400 mt-1">System health monitoring and security configuration</p>
      </motion.div>

      {/* System Health */}
      <div>
        <h2 className="text-sm font-semibold text-dark-200 mb-3 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-primary-500" />
          System Health
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {systemStatus.map((item, i) => {
            const config = statusConfig[item.status];
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                    <item.icon size={20} className={config.color} />
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${config.bg} border ${config.border}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')} ${item.status === 'online' ? 'animate-pulse' : ''}`} />
                    <span className={`text-[10px] font-medium ${config.color}`}>{config.label}</span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white">{item.name}</h3>
                <p className="text-[11px] text-dark-500 mt-0.5">{item.description}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-dark-500">Latency</p>
                    <p className="text-xs text-dark-200 font-medium">{item.latency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-dark-500">Uptime</p>
                    <p className="text-xs text-dark-200 font-medium">{item.uptime}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Security Panel */}
      <div>
        <h2 className="text-sm font-semibold text-dark-200 mb-3 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-emerald-500" />
          Security
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {securityItems.map((item, i) => {
            const config = statusConfig[item.status];
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="glass-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-medium text-dark-100">{item.name}</h3>
                      <span className={`text-[10px] font-medium ${config.color} ${config.bg} px-1.5 py-0.5 rounded-full`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-dark-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white mb-2">About This System</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-dark-500 mb-0.5">Project</p>
            <p className="text-dark-200 font-medium">Smart IoT RFID Attendance</p>
          </div>
          <div>
            <p className="text-dark-500 mb-0.5">Frontend</p>
            <p className="text-dark-200 font-medium">React + Tailwind CSS</p>
          </div>
          <div>
            <p className="text-dark-500 mb-0.5">Backend</p>
            <p className="text-dark-200 font-medium">Node.js + Cloud Run</p>
          </div>
          <div>
            <p className="text-dark-500 mb-0.5">IoT</p>
            <p className="text-dark-200 font-medium">ESP32 + MFRC522</p>
          </div>
        </div>
      </div>
    </div>
  );
}
