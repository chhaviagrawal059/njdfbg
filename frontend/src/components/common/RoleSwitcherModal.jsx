import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, GraduationCap, Building2, ShieldCheck, X, Check } from 'lucide-react';

export const RoleSwitcherModal = ({ isOpen, onClose }) => {
  const { user, switchDemoRole } = useAuth();

  if (!isOpen) return null;

  const roles = [
    {
      id: 'citizen',
      name: 'Citizen & Community Leader',
      userLabel: 'Soma Munda (Khunti District)',
      org: 'Gram Vikas Samiti, Torpa',
      icon: Users,
      color: 'bg-emerald-500 text-white',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Report local water/agro challenges, geotag photos, track solution progress, and give 5-star verified outcome feedback.'
    },
    {
      id: 'university',
      name: 'University Faculty & Students',
      userLabel: 'Dr. Ananya Roy (Dean R&D)',
      org: 'Birla Institute of Technology (BIT) Mesra',
      icon: GraduationCap,
      color: 'bg-blue-600 text-white',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Review assigned societal challenges, form multidisciplinary student teams, draft proposals with AI Assistant, test prototypes.'
    },
    {
      id: 'industry',
      name: 'Industry Partner & CSR',
      userLabel: 'Sanjay Singhal (Head CSR)',
      org: 'Tata Steel Rural Development Society',
      icon: Building2,
      color: 'bg-indigo-600 text-white',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: 'Browse validated university projects, offer CSR grants, lab equipment access, student internships, and pilot support.'
    },
    {
      id: 'admin',
      name: 'Government Administrator',
      userLabel: 'Rajesh Kumar Verma, IAS',
      org: 'Jharkhand State Innovation Council',
      icon: ShieldCheck,
      color: 'bg-rose-600 text-white',
      badgeColor: 'bg-rose-100 text-rose-800',
      description: 'Triage submissions, inspect AI categorizations & duplicate flags, approve university assignments, monitor 24-district KPIs.'
    }
  ];

  const handleSelect = async (roleId) => {
    try {
      await switchDemoRole(roleId);
      onClose();
    } catch (err) {
      console.error("Role switch error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <span>Role Demo Access Tool</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            One-Click Persona Switcher
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Instantly switch between the 4 primary stakeholders with simulated Jharkhand credentials to evaluate role-specific dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isCurrent = user?.role === r.id;

            return (
              <div
                key={r.id}
                onClick={() => handleSelect(r.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md relative flex flex-col justify-between ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-900">{r.name}</span>
                    </div>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-800">{r.userLabel}</div>
                  <div className="text-[11px] text-slate-500 mb-2">{r.org}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCurrent ? 'Currently Acting As' : 'Switch to Persona →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
