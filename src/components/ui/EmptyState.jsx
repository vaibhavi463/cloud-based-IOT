import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data found', description = 'There are no records to display.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center mb-4">
        <Icon size={28} className="text-dark-400" />
      </div>
      <h3 className="text-lg font-medium text-dark-200 mb-1">{title}</h3>
      <p className="text-sm text-dark-400 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
