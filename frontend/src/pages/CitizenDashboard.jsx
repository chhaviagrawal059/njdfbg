import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { PlusCircle, Clock, CheckCircle2, MessageSquare, AlertCircle, FileText, ArrowRight } from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMySubmissions = async () => {
      try {
        const data = await api.challenges.list({ my_submissions: true });
        setMyChallenges(data);
      } catch (err) {
        console.error("Error loading citizen submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMySubmissions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-teal-100 backdrop-blur-sm">
            Citizen & Community Organization Portal
          </span>
          <h2 className="text-2xl font-black mt-2">Welcome, {user?.full_name}</h2>
          <p className="text-xs text-teal-100 mt-1">
            District: <b>{user?.district || 'Khunti'}</b> • Track your reported community problems and verify engineering outcomes.
          </p>
        </div>

        <Link
          to="/submit"
          className="self-start md:self-auto px-5 py-3 rounded-xl bg-white text-emerald-900 hover:bg-teal-50 font-bold text-xs shadow flex items-center gap-2 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4 text-emerald-800" />
          Report a New Problem
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Submissions</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{myChallenges.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Reported from your panchayat</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">In Active Development</div>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {myChallenges.filter(c => ['Assigned to University', 'In Progress', 'Prototype Testing', 'Pilot/Implementation'].includes(c.status)).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">With universities & CSR teams</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Completed & Verified</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {myChallenges.filter(c => c.status === 'Completed').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Delivering clean water / benefits</div>
        </div>
      </div>

      {/* Submissions Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Your Reported Issues</h3>
          <span className="text-xs text-slate-500">Live Status Tracking</span>
        </div>

        {myChallenges.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-semibold">You haven't reported any community issues yet.</div>
            <Link to="/submit" className="text-xs font-bold text-teal-600 hover:underline">
              Submit your first report now →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myChallenges.map((ch) => (
              <div
                key={ch.id}
                onClick={() => navigate(`/challenges/${ch.id}`)}
                className="py-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {ch.category}
                    </span>
                    <StatusBadge status={ch.status} />
                    <PriorityBadge
                      tier={ch.priority_tier}
                      score={ch.priority_score}
                      isSafetyOverride={ch.is_safety_override}
                    />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 hover:text-blue-700">
                    {ch.title}
                  </h4>
                  <div className="text-xs text-slate-500">
                    {ch.district} • {ch.village || 'Local Village'} • Submitted {new Date(ch.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                    Track Lifecycle <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
