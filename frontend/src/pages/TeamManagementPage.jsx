import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, GraduationCap, PlusCircle, CheckCircle2, UserCheck, Shield } from 'lucide-react';

export const TeamManagementPage = () => {
  const { user } = useAuth();

  const [teams, setTeams] = useState([
    {
      id: 1,
      projectTitle: "Decentralized Fluoride & Arsenic Remediation Unit (Khunti)",
      mentor: "Dr. Ananya Roy (Dept of Environmental Engineering)",
      members: [
        { name: "Aman Kumar Hansda", role: "Embedded IoT Developer", roll: "BTECH/CS/22/014", branch: "Computer Science" },
        { name: "Priyanka Mahto", role: "Water Filtration Lead", roll: "BTECH/CH/22/032", branch: "Chemical Engineering" },
        { name: "Rahul Oraon", role: "Field Testing & CAD Design", roll: "BTECH/ME/22/078", branch: "Mechanical Engineering" },
        { name: "Sneha Kumari", role: "Community Engagement", roll: "IMSC/ENV/23/009", branch: "Environmental Science" }
      ]
    },
    {
      id: 2,
      projectTitle: "Solar Evaporative Micro-Storage for Tribal Lac (Simdega)",
      mentor: "Dr. Onkar Nath Singh (Agronomy & Post-Harvest)",
      members: [
        { name: "Vikas Soren", role: "Refrigeration & Solar Hardware", roll: "BTECH/AG/23/005", branch: "Agricultural Engg" },
        { name: "Ritu Tirkey", role: "Mandi Price Telemetry App", roll: "BTECH/IT/23/041", branch: "Information Tech" }
      ]
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'Hardware Lead', roll: '', branch: 'Electrical Engineering' });

  const handleAddMember = (e) => {
    e.preventDefault();
    const updated = [...teams];
    updated[0].members.push(newMember);
    setTeams(updated);
    setShowAddModal(false);
    setNewMember({ name: '', role: 'Hardware Lead', roll: '', branch: 'Electrical Engineering' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Human Capital</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900">Student & Faculty Team Management</h2>
          <p className="text-xs text-slate-600 mt-1">
            Build multidisciplinary engineering teams, connect faculty mentors, and track student civic portfolio credits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Student Member
        </button>
      </div>

      <div className="space-y-6">
        {teams.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{t.projectTitle}</h3>
                <div className="text-xs text-slate-600 mt-0.5">
                  Lead Faculty Mentor: <span className="font-bold text-blue-900">{t.mentor}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start md:self-auto">
                {t.members.length} Multidisciplinary Members Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.members.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{m.name}</div>
                    <div className="text-xs font-semibold text-teal-700">{m.role}</div>
                    <div className="text-[11px] text-slate-500">{m.branch}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
                      {m.roll}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-bold mt-1">Verified Portfolio</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add Team Member</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Sanjeev Kumar"
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Role</label>
                <input
                  type="text"
                  required
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="e.g. IoT Firmware Lead"
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={newMember.roll}
                    onChange={(e) => setNewMember({ ...newMember, roll: e.target.value })}
                    placeholder="BTECH/EE/22/045"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Branch</label>
                  <input
                    type="text"
                    required
                    value={newMember.branch}
                    onChange={(e) => setNewMember({ ...newMember, branch: e.target.value })}
                    placeholder="Electrical Engg"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-blue-900 text-white rounded-lg">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
