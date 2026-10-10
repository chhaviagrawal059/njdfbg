import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  ShieldCheck, Download, AlertTriangle, CheckCircle2, XCircle,
  Sparkles, FileText, BarChart3, RefreshCw, ChevronRight, History
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('triage'); // 'triage', 'assignments', 'duplicates', 'audit'
  const [challenges, setChallenges] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status Action Modal
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalAction, setModalAction] = useState(''); // 'Validate', 'Reject', 'Clarification Requested'
  const [actionReason, setActionReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [chList, logs, stats] = await Promise.all([
        api.challenges.list(),
        api.audit.getLogs(),
        api.analytics.getOverview()
      ]);
      setChallenges(chList);
      setAuditLogs(logs);
      setOverview(stats);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    try {
      await api.challenges.updateStatus(selectedChallenge.id, {
        status: modalAction,
        reason: actionReason
      });
      setSelectedChallenge(null);
      setActionReason('');
      loadData();
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  const triageList = challenges.filter(c => ['Submitted', 'Under Review'].includes(c.status));
  const assignmentList = challenges.filter(c => c.status === 'Validated');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Government Administration & State Innovation Council
          </span>
          <h2 className="text-2xl font-black mt-2">Administrative Oversight Portal</h2>
          <p className="text-xs text-slate-300 mt-1">
            Officer: <b>{user?.full_name || 'Rajesh Kumar Verma, IAS'}</b> • State Level Challenge Triage & Auditing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={api.analytics.exportCsvUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-slate-900" />
            Download Official CSV
          </a>

          <Link
            to="/analytics"
            className="px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs border border-blue-600 flex items-center gap-2 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            24-District Analytics
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-slate-500 font-semibold">Total Reported</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{overview.total_challenges}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-amber-700 font-semibold">Awaiting Validation</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{overview.awaiting_validation}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-blue-700 font-semibold">Validated & Assigned</div>
            <div className="text-2xl font-black text-blue-700 mt-1">{overview.assigned}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-teal-700 font-semibold">In Active Development</div>
            <div className="text-2xl font-black text-teal-700 mt-1">{overview.in_progress}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-emerald-700 font-semibold">Completed Solutions</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{overview.completed}</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-bold">
        {[
          { id: 'triage', label: `Pending Triage Queue (${triageList.length})` },
          { id: 'assignments', label: `Ready for University Assignment (${assignmentList.length})` },
          { id: 'audit', label: `Official Audit Trail (${auditLogs.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === t.id
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'triage' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Submitted Challenges Awaiting Triage</h3>
            <span className="text-xs text-slate-500">Review AI Categorization & Prioritization</span>
          </div>

          {triageList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <div className="font-semibold text-sm">Triage queue is clear! All submissions have been processed.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {triageList.map((ch) => (
                <div key={ch.id} className="py-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-900">#{ch.id}</span>
                        <h4 className="font-bold text-sm text-slate-900 hover:text-blue-700 cursor-pointer" onClick={() => navigate(`/challenges/${ch.id}`)}>
                          {ch.title}
                        </h4>
                        <PriorityBadge
                          tier={ch.priority_tier}
                          score={ch.priority_score}
                          isSafetyOverride={ch.is_safety_override}
                        />
                      </div>
                      <div className="text-xs text-slate-500">
                        {ch.district} • {ch.village || 'Local Village'} • Population: {ch.affected_population?.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        onClick={() => { setSelectedChallenge(ch); setModalAction('Validated'); }}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                      >
                        Validate
                      </button>
                      <button
                        onClick={() => { setSelectedChallenge(ch); setModalAction('Clarification Requested'); }}
                        className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs"
                      >
                        Clarify
                      </button>
                      <button
                        onClick={() => { setSelectedChallenge(ch); setModalAction('Rejected'); }}
                        className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {/* AI Metadata row */}
                  <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-600 flex flex-wrap items-center gap-4">
                    <span>
                      AI Category: <b>{ch.category}</b> ({Math.round((ch.ai_category_confidence || 0.9) * 100)}% confidence)
                    </span>
                    {ch.is_safety_override && (
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Safety Override Rule Triggered
                      </span>
                    )}
                    <Link to={`/challenges/${ch.id}`} className="text-blue-700 hover:underline font-semibold ml-auto">
                      Inspect Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Assignments */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Validated Challenges Ready for Assignment</h3>
            <span className="text-xs text-slate-500">Match with registered Jharkhand Universities</span>
          </div>

          {assignmentList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <div className="font-semibold text-sm">All validated challenges have active university assignments.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {assignmentList.map((ch) => (
                <div key={ch.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-900">#{ch.id}</span>
                      <h4 className="font-bold text-sm text-slate-900">{ch.title}</h4>
                      <StatusBadge status={ch.status} />
                    </div>
                    <div className="text-xs text-slate-500">
                      Domain: <b>{ch.category}</b> • District: {ch.district} • Priority: {ch.priority_tier}
                    </div>
                  </div>

                  <Link
                    to={`/challenges/${ch.id}`}
                    className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Review AI Matches & Assign →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Official System Audit Trail</h3>
            <span className="text-xs text-slate-500">Immutable Log of Administrative & Milestone Transitions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-3 py-2.5 text-left">Timestamp</th>
                  <th className="px-3 py-2.5 text-left">Actor</th>
                  <th className="px-3 py-2.5 text-left">Role</th>
                  <th className="px-3 py-2.5 text-left">Action</th>
                  <th className="px-3 py-2.5 text-left">Entity</th>
                  <th className="px-3 py-2.5 text-left">State Change</th>
                  <th className="px-3 py-2.5 text-left">Official Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-900">{l.actor_name}</td>
                    <td className="px-3 py-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase text-[10px]">
                        {l.role}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-semibold text-blue-700">{l.action}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {l.entity_type} #{l.entity_id}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {l.previous_state ? `${l.previous_state} → ` : ''}<b>{l.new_state}</b>
                    </td>
                    <td className="px-3 py-2 text-slate-600 max-w-xs truncate" title={l.reason}>
                      {l.reason || 'Routine status update'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Action Reason Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {modalAction} Challenge #{selectedChallenge.id}
            </h3>
            <p className="text-xs text-slate-600">
              State the official administrative reasoning for the record and citizen audit log:
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Verified by District Collectorate inspection; priority endorsed."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-900 text-white shadow"
                >
                  Confirm {modalAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
