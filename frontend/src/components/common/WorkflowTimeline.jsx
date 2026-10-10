import React from 'react';
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';

const STAGES = [
  'Submitted',
  'Under Review',
  'Validated',
  'Assigned to University',
  'Proposal Submitted',
  'In Progress',
  'Prototype Testing',
  'Pilot/Implementation',
  'Outcome Verification',
  'Completed'
];

export const WorkflowTimeline = ({ currentStatus }) => {
  const currentIndex = STAGES.indexOf(currentStatus);

  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="min-w-[800px] flex items-center justify-between relative">
        {STAGES.map((stage, idx) => {
          const isCompleted = currentIndex > idx;
          const isCurrent = currentStatus === stage;
          const isUpcoming = currentIndex < idx;

          return (
            <div key={stage} className="flex flex-col items-center flex-1 relative group">
              {/* Connector line */}
              {idx < STAGES.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 -z-0 transition-colors ${
                    isCompleted ? 'bg-teal-500' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Step circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                  isCompleted
                    ? 'bg-teal-600 text-white shadow-sm ring-4 ring-teal-50'
                    : isCurrent
                    ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100 scale-110'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 text-white animate-pulse" />
                ) : (
                  idx + 1
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-[11px] text-center max-w-[85px] leading-tight font-medium ${
                  isCurrent
                    ? 'text-blue-700 font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
