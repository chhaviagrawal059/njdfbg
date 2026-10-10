import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, CheckCircle2, AlertTriangle, FileText, PlusCircle,
  Trash2, ArrowRight, ArrowLeft
} from 'lucide-react';

export const ProjectProposalPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const challengeId = searchParams.get('challenge_id') || 1;

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proposal Form State
  const [formData, setFormData] = useState({
    title: '',
    problem_summary: '',
    technical_approach: '',
    estimated_cost: 175000,
    proposed_duration_months: 6,
    mentor_name: user?.full_name || 'Dr. Ananya Roy',
    mentor_email: user?.email || 'ananya.roy@bitmesra.ac.in',
    department: 'Department of Environmental Engineering',
    required_expertise: [
      { role: 'Faculty Mentor', domain: 'Environmental & Chemical Engineering' },
      { role: 'Student Tech Lead', domain: 'Embedded IoT & Telemetry' }
    ],
    student_members: [
      { name: 'Aman Kumar Hansda', role: 'Embedded Systems Lead', roll: 'BTECH/CS/22/014', branch: 'Computer Science' },
      { name: 'Priyanka Mahto', role: 'Filter Chemistry Lead', roll: 'BTECH/CH/22/032', branch: 'Chemical Engineering' }
    ],
    milestones: [
      { milestone_number: 1, title: 'Field Water Sampling & Baseline Characterization', description: 'Sample collection and laboratory spectrophotometry', target_days: 30 },
      { milestone_number: 2, title: 'Bench Prototype Fabrication & Lab Breakthrough Testing', description: 'Column testing against IS:10500 standards', target_days: 90 },
      { milestone_number: 3, title: 'Field Pilot Deployment in Village', description: 'Commissioning solar IoT telemetry unit in target panchayat', target_days: 150 },
      { milestone_number: 4, title: 'Citizen Handover & Community Impact Audit', description: 'Gram Panchayat training and final societal impact audit', target_days: 180 }
    ],
    risks: [
      { risk: 'Monsoon silt clogging filter media', mitigation: 'Dual-chamber sedimentation pre-filter' }
    ],
    evaluation_metrics: [
      'Fluoride levels below 0.8 mg/L consistently',
      'Continuous telemetry uptime > 98%'
    ]
  });

  const [aiDraftNotice, setAiDraftNotice] = useState(null);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const res = await api.challenges.get(challengeId);
        setChallenge(res.challenge);
        setFormData(prev => ({
          ...prev,
          title: `Technical Intervention for ${res.challenge.title}`
        }));
      } catch (err) {
        console.error("Error loading challenge:", err);
      } finally {
        setLoading(false);
      }
    };
    loadChallenge();
  }, [challengeId]);

  const handleLaunchAIAssistant = async () => {
    setIsDrafting(true);
    try {
      const draft = await api.ai.draftProposal(challengeId);
      setFormData(prev => ({
        ...prev,
        title: draft.title,
        problem_summary: draft.problem_summary,
        technical_approach: draft.technical_approach,
        estimated_cost: draft.estimated_cost,
        proposed_duration_months: draft.proposed_duration_months,
        required_expertise: draft.required_expertise || prev.required_expertise,
        milestones: draft.proposed_milestones || prev.milestones,
        risks: draft.risks || prev.risks,
        evaluation_metrics: draft.evaluation_metrics || prev.evaluation_metrics
      }));
      setAiDraftNotice(draft.ai_generated_note);
    } catch (err) {
      alert("AI Assistant error: " + err.message);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.proposals.submit({
        challenge_id: Number(challengeId),
        ...formData
      });
      alert("Proposal submitted successfully to Government Administration!");
      navigate(`/challenges/${challengeId}`);
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm font-semibold">Loading proposal wizard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <button onClick={() => navigate(-1)} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h2 className="text-2xl font-black text-slate-900">
            Submit Technical Research Proposal
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Target Challenge: <b>{challenge?.title}</b> ({challenge?.district} District)
          </p>
        </div>

        <button
          type="button"
          onClick={handleLaunchAIAssistant}
          disabled={isDrafting}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-500 hover:to-blue-600 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          {isDrafting ? 'Generating AI Blueprint...' : 'AI Proposal Assistant'}
        </button>
      </div>

      {/* AI Draft Banner */}
      {aiDraftNotice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-xs text-teal-900 space-y-1 animate-fadeIn">
          <div className="font-bold flex items-center gap-1.5 text-teal-950">
            <Sparkles className="w-4 h-4 text-teal-700" />
            AI Proposal Assistant Draft Loaded
          </div>
          <p className="leading-relaxed">
            {aiDraftNotice} All fields below have been pre-structured and can be tailored before official faculty sign-off.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmitProposal} className="space-y-6">
        {/* Section 1: Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">1. Proposal Title & Scope</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Proposal Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Root-Cause Summary</label>
            <textarea
              required
              rows={3}
              value={formData.problem_summary}
              onChange={(e) => setFormData({ ...formData, problem_summary: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Technical Approach & Methodology</label>
            <textarea
              required
              rows={4}
              value={formData.technical_approach}
              onChange={(e) => setFormData({ ...formData, technical_approach: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget (₹ INR)</label>
              <input
                type="number"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({ ...formData, estimated_cost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Duration (Months)</label>
              <input
                type="number"
                value={formData.proposed_duration_months}
                onChange={(e) => setFormData({ ...formData, proposed_duration_months: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Multidisciplinary Team */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">2. Multidisciplinary Research Team</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Mentor Name</label>
              <input
                type="text"
                value={formData.mentor_name}
                onChange={(e) => setFormData({ ...formData, mentor_name: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mentor Email</label>
              <input
                type="email"
                value={formData.mentor_email}
                onChange={(e) => setFormData({ ...formData, mentor_email: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Student Team Members</label>
            <div className="space-y-2">
              {formData.student_members.map((st, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-4 gap-2 text-xs items-center">
                  <span className="font-bold text-slate-900">{st.name}</span>
                  <span className="text-slate-600">{st.role}</span>
                  <span className="text-slate-500">{st.branch}</span>
                  <span className="font-mono text-slate-500 text-[11px] text-right">{st.roll}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Phased Milestones */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">3. Phased Deliverable Milestones</h3>

          <div className="space-y-3">
            {formData.milestones.map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Milestone #{m.milestone_number}: {m.title}</span>
                  <span className="text-blue-700">Target: Day {m.target_days}</span>
                </div>
                <p className="text-slate-600">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Submitting to Administration...' : 'Formally Submit Research Proposal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
