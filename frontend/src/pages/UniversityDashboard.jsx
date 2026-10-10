import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  GraduationCap, Users, FileText, CheckCircle2, Clock, Sparkles,
  Building, Award, ArrowRight, UploadCloud, ChevronRight
} from 'lucide-react';

export const UniversityDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myAssignments, setMyAssignments] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick accept/decline
  const [declineId, setDeclineId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [asgList, allCh] = await Promise.all([
        api.assignments.getMyAssignments().catch(() => []),
        api.challenges.list().catch(() => [])
      ]);
      setMyAssignments(asgList);
      // Filter challenges associated with university
      setChallenges(allCh.filter(c => c.assigned_institution_id === 1 || ['In Progress', 'Prototype Testing', 'Proposal Submitted', 'Assigned to University'].includes(c.status)));
    } catch (err) {
      console.error("Error loading university data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRespond = async (asgId, status) => {
    try {
      await api.assignments.respond({
        assignment_id: asgId,
        status: status,
        decline_reason: status === 'Declined' ? declineReason : null
      });
      setDeclineId(null);
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Institutional Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-blue-200">
            University Innovation & Research Center
          </span>
          <h2 className="text-2xl font-black mt-2">Birla Institute of Technology (BIT) Mesra</h2>
          <p className="text-xs text-blue-200 mt-1">
            NIRF Rank: <b>#53</b> • Dean R&D: <b>{user?.full_name || 'Dr. Ananya Roy'}</b> • Active Civic Load: <b>3 / 12 Capacity Slots</b>
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/teams"
            className="px-4 py-2.5 rounded-xl bg-white text-blue-950 font-bold text-xs shadow flex items-center gap-1.5 hover:bg-blue-50"
          >
            <Users className="w-4 h-4 text-blue-900" />
            Manage Student Teams
          </Link>
        </div>
      </div>

      {/* Facilities & Capabilities Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Specialized Laboratories</div>
          <div className="text-sm font-bold text-slate-900">4 Certified Facilities</div>
          <p className="text-[11px] text-slate-500">Water Quality Analytical Lab, IoT Telemetry Fab, Environmental Pilot Plant</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Multidisciplinary Teams</div>
          <div className="text-sm font-bold text-slate-900">18 Student Researchers</div>
          <p className="text-[11px] text-slate-500">Chemical, Embedded Systems, Mechanical, and Rural Social Work branches</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Industry CSR Partnerships</div>
          <div className="text-sm font-bold text-slate-900">Tata Steel Foundation</div>
          <p className="text-[11px] text-slate-500">₹15 Lakh testing grant & Jamshedpur materials testing access</p>
        </div>
      </div>

      {/* Assigned Challenges Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Assigned Societal Challenges</h3>
            <p className="text-xs text-slate-500">Government assigned challenges matched to your research capabilities</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {myAssignments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No new assignments pending response.
            </div>
          ) : (
            myAssignments.map((asg) => (
              <div key={asg.assignment_id} className="py-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{asg.challenge?.title}</h4>
                      <StatusBadge status={asg.status} />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{asg.match_explanation}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Matched by State Innovation Council with <b>{asg.match_score}%</b> capability index.
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    {asg.status === 'Assigned' && (
                      <>
                        <button
                          onClick={() => setDeclineId(asg.assignment_id)}
                          className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRespond(asg.assignment_id, 'Accepted')}
                          className="px-4 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm"
                        >
                          Accept Assignment
                        </button>
                      </>
                    )}

                    {asg.status === 'Accepted' && (
                      <Link
                        to={`/proposals/new?challenge_id=${asg.challenge?.id}`}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        AI Proposal Assistant →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active University Research Projects & Prototypes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Active Civic Engineering Projects</h3>
          <span className="text-xs text-slate-500">Track prototyping and field pilot milestones</span>
        </div>

        <div className="divide-y divide-slate-100">
          {challenges.slice(0, 3).map((ch) => (
            <div
              key={ch.id}
              onClick={() => navigate(`/challenges/${ch.id}`)}
              className="py-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-900">#{ch.id}</span>
                  <h4 className="font-bold text-sm text-slate-900">{ch.title}</h4>
                  <StatusBadge status={ch.status} />
                </div>
                <div className="text-xs text-slate-500">
                  {ch.district} • {ch.category} • Priority: {ch.priority_tier}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                  Manage Project & Evidence <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decline Reason Modal */}
      {declineId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-rose-900">Decline Assignment</h3>
            <textarea
              required
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="State institutional reason (e.g. laboratory capacity full)..."
              className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeclineId(null)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button onClick={() => handleRespond(declineId, 'Declined')} className="px-4 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
