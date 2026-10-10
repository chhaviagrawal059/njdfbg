import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const PriorityBadge = ({ tier = 'Medium', score, isSafetyOverride = false, showDetails = false }) => {
  const isOverride = isSafetyOverride || (tier && tier.includes('Safety Override'));

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-300';
  if (isOverride) {
    bgClass = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
  } else if (tier === 'Critical') {
    bgClass = 'bg-red-50 text-red-700 border-red-300 font-semibold';
  } else if (tier === 'High') {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-300 font-medium';
  } else if (tier === 'Medium') {
    bgClass = 'bg-blue-50 text-blue-700 border-blue-300';
  } else {
    bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${bgClass}`}>
        {isOverride ? (
          <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600 animate-pulse" />
        ) : tier === 'Critical' ? (
          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-600" />
        ) : null}
        {isOverride ? 'Critical (Safety Override)' : tier}
        {score !== undefined && score !== null && (
          <span className="ml-1 opacity-75 font-mono text-[10px]">({score})</span>
        )}
      </span>
    </div>
  );
};
