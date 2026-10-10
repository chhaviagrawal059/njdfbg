import React from 'react';

const statusStyles = {
  'Submitted': 'bg-slate-100 text-slate-700 border-slate-300',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-300',
  'Validated': 'bg-blue-50 text-blue-700 border-blue-300',
  'Assigned to University': 'bg-indigo-50 text-indigo-700 border-indigo-300',
  'Proposal Submitted': 'bg-purple-50 text-purple-700 border-purple-300',
  'Proposal Approved': 'bg-teal-50 text-teal-700 border-teal-300',
  'In Progress': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Prototype Testing': 'bg-cyan-50 text-cyan-700 border-cyan-300',
  'Pilot/Implementation': 'bg-orange-50 text-orange-700 border-orange-300',
  'Outcome Verification': 'bg-lime-50 text-lime-800 border-lime-300',
  'Completed': 'bg-green-100 text-green-800 border-green-400 font-semibold',
  'Rejected': 'bg-red-50 text-red-700 border-red-300',
  'Clarification Requested': 'bg-amber-100 text-amber-800 border-amber-400',
  'Declined (Pending Reassignment)': 'bg-rose-50 text-rose-700 border-rose-300',
  'Paused': 'bg-slate-100 text-slate-700 border-slate-300'
};

export const StatusBadge = ({ status, className = '' }) => {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-300';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {status}
    </span>
  );
};
