import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { WorkflowTimeline } from '../components/common/WorkflowTimeline';
import {
  MapPin, Users, Calendar, AlertTriangle, ShieldAlert, Sparkles,
  Building2, GraduationCap, CheckCircle2, FileText, ExternalLink,
  ChevronRight, Star, Send, ArrowLeft
} from 'lucide-react';

export const ChallengeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiMatches, setAiMatches] = useState([]);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Modals / forms
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [solutionWorking, setSolutionWorking] = useState(true);

  // University decline modal
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const loadDetail = async () => {
    try {
      const res = await api.challenges.get(id);
      setData(res);

      // If challenge is validated or unassigned, fetch AI university recommendations
      if (res.challenge.status === 'Validated' || !res.challenge.assigned_institution_id) {
        setMatchingLoading(true);
        const matchRes = await api.ai.matchInstitutions({
          category: res.challenge.category,
          description: res.challenge.description,
          district: res.challenge.district
        });
        setAiMatches(matchRes.matched_institutions || []);
        setMatchingLoading(false);
      }
    } catch (err) {
      console.error("Error loading challenge:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3" />
        <div className="text-sm font-semibold text-slate-600">Loading Societal Challenge #{id}...</div>
      </div>
    );
  }

  if (!data || !data.challenge) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Challenge Not Found</h3>
        <Link to="/challenges" className="text-xs font-bold text-blue-700 hover:underline">
          ← Back to All Challenges
        </Link>
      </div>
    );
  }

  const { challenge, media, duplicate_matches, assignments, proposals, feedback } = data;
  let priorityBreakdown = {};
  try {
    priorityBreakdown = JSON.parse(challenge.priority_breakdown_json || '{}');
  } catch (e) {}

  const activeProposal = proposals && proposals.length > 0 ? proposals[0] : null;

  // Actions
  const handleAdminValidate = async () => {
    try {
      await api.challenges.updateStatus(challenge.id, {
        status: 'Validated',
        reason: 'Official validated problem statement by District Innovation Committee'
      });
      loadDetail();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleAdminAssign = async (instId, matchScore, explanation) => {
    try {
      await api.assignments.assign({
        challenge_id: challenge.id,
        institution_id: instId,
        match_score: matchScore,
        match_explanation: explanation
      });
      loadDetail();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleUniversityResponse = async (status) => {
    const asg = assignments[0];
    if (!asg) return;
    try {
      await api.assignments.respond({
        assignment_id: asg.id,
        status: status,
        decline_reason: status === 'Declined' ? declineReason : null
      });
      setShowDeclineModal(false);
      loadDetail();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleMilestoneComplete = async (milestoneId) => {
    try {
      await api.proposals.updateMilestone({
        milestone_id: milestoneId,
        status: 'Completed',
        evidence_url: 'https://jharkhand-innovation.gov.in/docs/verified_field_evidence.pdf'
      });
      loadDetail();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.feedback.submit({
        challenge_id: challenge.id,
        rating: Number(feedbackRating),
        feedback_text: feedbackText,
        solution_working: solutionWorking,
        outcome_metrics: { verified_by_citizen: true }
      });
      setShowFeedbackModal(false);
      setFeedbackText('');
      loadDetail();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/challenges" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Challenges
        </Link>
        <span className="text-xs font-mono text-slate-400">Challenge ID: #{challenge.id}</span>
      </div>

      {/* 10-Stage Lifecycle Workflow Stepper */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Project Lifecycle Progression
        </div>
        <WorkflowTimeline currentStatus={challenge.status} />
      </div>

      {/* Main Grid: Details + AI Intelligence Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols): Challenge Overview & Project Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800">
                {challenge.category}
              </span>
              <div className="flex items-center gap-2">
                <StatusBadge status={challenge.status} />
                <PriorityBadge
                  tier={challenge.priority_tier}
                  score={challenge.priority_score}
                  isSafetyOverride={challenge.is_safety_override}
                />
              </div>
            </div>

            <h1 className="text-2xl font-black text-slate-900 leading-snug">
              {challenge.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400" />
                {challenge.district} District {challenge.village ? `• ${challenge.village}` : ''}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-400" />
                {challenge.affected_population?.toLocaleString()} Affected Population
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                Reported {new Date(challenge.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="pt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {challenge.description}
            </div>
          </div>

          {/* Admin Validation Actions Bar (if user is admin) */}
          {user?.role === 'admin' && challenge.status === 'Submitted' && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-blue-900">Administrative Triage Action Required</h4>
                <p className="text-xs text-blue-700 mt-0.5">Validate this challenge to approve it for university engineering matching.</p>
              </div>
              <button
                onClick={handleAdminValidate}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Validate Challenge
              </button>
            </div>
          )}

          {/* University Acceptance Actions Bar (if assigned to current user's university) */}
          {user?.role === 'university' && assignments.length > 0 && assignments[0].status === 'Assigned' && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-indigo-900">Societal Innovation Assignment Offered</h4>
                <p className="text-xs text-indigo-700 mt-0.5">Government has assigned this problem to your institution. Please review and respond.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeclineModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-semibold"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleUniversityResponse('Accepted')}
                  className="px-4 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm"
                >
                  Accept Assignment
                </button>
              </div>
            </div>
          )}

          {/* Approved Proposal, Student Team & Milestones */}
          {activeProposal ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Assigned University Technical Proposal
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {activeProposal.title}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    Led by <b>{activeProposal.institution_name}</b>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  Proposal {activeProposal.status}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase mb-1">Recommended Technical Approach</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {activeProposal.technical_approach}
                </p>
              </div>

              {/* Student Team & Faculty Mentor */}
              {activeProposal.team && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">Multidisciplinary Project Team</h4>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800">Faculty Principal Investigator: </span>
                      <span className="font-bold text-blue-900">{activeProposal.team.mentor_name}</span> ({activeProposal.team.department})
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {activeProposal.team.students.map((st, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900">{st.name}</div>
                            <div className="text-[11px] text-slate-500">{st.role} • {st.branch}</div>
                          </div>
                          <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {st.roll}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Milestone Tracker */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">Milestone Progression & Testing Evidence</h4>
                <div className="space-y-3">
                  {activeProposal.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                            {m.milestone_number}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{m.title}</span>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="text-xs text-slate-600 pl-7">{m.description}</p>
                        {m.evidence_url && (
                          <div className="pl-7 pt-1">
                            <a
                              href={m.evidence_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" /> View Verified Lab / Field Evidence
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Complete Milestone Button (for university or admin) */}
                      {(user?.role === 'university' || user?.role === 'admin') && m.status === 'In Progress' && (
                        <button
                          onClick={() => handleMilestoneComplete(m.id)}
                          className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            user?.role === 'university' && assignments.length > 0 && assignments[0].status === 'Accepted' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <GraduationCap className="w-10 h-10 text-blue-600 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">Assignment Accepted</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Use the AI Proposal Assistant to automatically draft your team's technical blueprint, budget, and milestones.
                </p>
                <Link
                  to={`/proposals/new?challenge_id=${challenge.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Launch AI Proposal Assistant →
                </Link>
              </div>
            )
          )}

          {/* Citizen Community Feedback & Outcome Verification */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base text-slate-900">Verified Community Outcome</h4>
                <p className="text-xs text-slate-500">Citizen feedback on implemented technological solutions</p>
              </div>
              {user && (
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm"
                >
                  Submit Feedback
                </button>
              )}
            </div>

            {feedback && feedback.length > 0 ? (
              <div className="space-y-3 pt-2">
                {feedback.map((f) => (
                  <div key={f.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                        <span className="text-xs text-slate-700 ml-1">({f.rating}/5)</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                        {f.solution_working ? 'Solution Confirmed Operational' : 'Issue Reported'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{f.feedback_text}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 italic">
                No community outcome surveys submitted yet. Citizen reviews will be recorded once the field pilot is active.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (1 col): AI Engine Insights & Recommendations */}
        <div className="space-y-6">
          {/* AI Explainable Prioritization Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Explainable AI Priority
              </span>
              <PriorityBadge
                tier={challenge.priority_tier}
                score={challenge.priority_score}
                isSafetyOverride={challenge.is_safety_override}
              />
            </div>

            {challenge.is_safety_override && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                  Emergency Safety Override
                </div>
                <p className="text-[11px] leading-relaxed">
                  {challenge.override_reason}
                </p>
              </div>
            )}

            {/* Factor breakdown table */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="font-bold text-slate-800 text-[11px] uppercase">Scoring Factor Breakdown:</div>
              {priorityBreakdown.severity && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Severity (25%):</span>
                  <span className="font-semibold text-slate-900">{priorityBreakdown.severity.value} ({priorityBreakdown.severity.score} pts)</span>
                </div>
              )}
              {priorityBreakdown.urgency && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Urgency (20%):</span>
                  <span className="font-semibold text-slate-900">{priorityBreakdown.urgency.value} ({priorityBreakdown.urgency.score} pts)</span>
                </div>
              )}
              {priorityBreakdown.population && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Population (20%):</span>
                  <span className="font-semibold text-slate-900">{priorityBreakdown.population.affected?.toLocaleString()} citizens</span>
                </div>
              )}
              {priorityBreakdown.health_and_safety && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Health & Hazard (20%):</span>
                  <span className="font-semibold text-slate-900">{priorityBreakdown.health_and_safety.score} pts</span>
                </div>
              )}
              {priorityBreakdown.feasibility && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Feasibility (15%):</span>
                  <span className="font-semibold text-slate-900">{priorityBreakdown.feasibility.value}</span>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 font-mono bg-slate-50 p-2 rounded">
              Rule-based explainable decision matrix • No opaque black-box scoring.
            </div>
          </div>

          {/* AI Duplicate Detection Panel */}
          {duplicate_matches && duplicate_matches.length > 0 && (
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-300 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-xs text-amber-900">Duplicate Detection Engine</h4>
              </div>
              <p className="text-xs text-amber-800">
                Found {duplicate_matches.length} potentially related challenges:
              </p>
              {duplicate_matches.map((dm) => (
                <div key={dm.id} className="bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="truncate max-w-[180px]">{dm.matched_title}</span>
                    <span className="text-amber-700 font-mono">{Math.round(dm.similarity_score * 100)}% Match</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{dm.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* AI University Capability Matching Panel */}
          {aiMatches.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                  Top 3 Recommended Universities
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                AI capability matching based on research domains, laboratories, faculty patents, and track record:
              </p>

              <div className="space-y-3">
                {aiMatches.map((m, idx) => (
                  <div key={m.institution_id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900">
                        {idx + 1}. {m.institution_name}
                      </div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-mono">
                        {m.match_score}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {m.explanation}
                    </p>

                    {/* Admin Assignment Trigger */}
                    {user?.role === 'admin' && challenge.status === 'Validated' && (
                      <button
                        onClick={() => handleAdminAssign(m.institution_id, m.match_score, m.explanation)}
                        className="w-full mt-1 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-[11px] shadow-sm transition-colors"
                      >
                        Approve & Formally Assign
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Citizen Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Citizen Outcome Verification</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Star Rating (1 to 5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`text-2xl ${star <= feedbackRating ? 'text-amber-500' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Citizen Feedback & Comments</label>
                <textarea
                  required
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Describe your satisfaction with the clean water, crop storage, or infrastructure..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="working"
                  checked={solutionWorking}
                  onChange={(e) => setSolutionWorking(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600"
                />
                <label htmlFor="working" className="text-xs text-slate-700 font-medium">
                  I verify that the solution is currently functional and delivering results.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-teal-600 text-white rounded-lg"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* University Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-rose-900">Decline Societal Assignment</h3>
            <p className="text-xs text-slate-600">Please record the official reason (e.g. laboratory maintenance, research capacity limit, lack of specialized testing equipment).</p>
            <textarea
              required
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="State reason for declining..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeclineModal(false)} className="px-3 py-1.5 text-xs text-slate-600">
                Cancel
              </button>
              <button
                onClick={() => handleUniversityResponse('Declined')}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
