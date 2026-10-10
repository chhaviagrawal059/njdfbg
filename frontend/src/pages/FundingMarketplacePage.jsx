import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { JHARKHAND_DISTRICTS } from './SubmitProblemPage';
import {
  Coins, TrendingUp, CheckCircle, Clock, AlertCircle, Building,
  ArrowRight, Filter, Download, FileText, PlusCircle, ShieldCheck,
  CheckCircle2, Sparkles, X, ChevronDown, ChevronUp, Award, Search,
  Check, HeartHandshake, HelpCircle
} from 'lucide-react';

const CATEGORIES = [
  "All Categories", "Water Resources", "Healthcare", "Agriculture", "Education",
  "Environment", "Renewable Energy", "Rural Livelihoods", "Urban Infrastructure"
];

export const FundingMarketplacePage = () => {
  const { user } = useAuth();
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'open', 'approved', 'funded'
  const [searchQuery, setSearchQuery] = useState("");

  // Expanded Milestones Accordion state per project ID
  const [expandedMilestones, setExpandedMilestones] = useState({});

  // Contribute Modal
  const [selectedProject, setSelectedProject] = useState(null);
  const [contributeAction, setContributeAction] = useState("pledge"); // pledge, approve, disburse
  const [funderType, setFunderType] = useState("CSR Foundation");
  const [amount, setAmount] = useState(50000);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  const loadFundings = async () => {
    setLoading(true);
    try {
      const data = await api.funding.list({
        category: selectedCategory === "All Categories" ? "" : selectedCategory,
        district: selectedDistrict === "All" ? "" : selectedDistrict
      });
      setFundings(data || []);
    } catch (err) {
      console.error("Error loading fundings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundings();
  }, [selectedCategory, selectedDistrict]);

  const toggleMilestones = (id) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    setIsSubmitting(true);
    try {
      await api.funding.contribute({
        proposal_id: selectedProject.proposal_id,
        funder_type: funderType,
        action_type: contributeAction,
        amount: Number(amount),
        notes: notes || `Direct ${contributeAction} from ${user?.organization_name || user?.full_name || 'Contributor'}`
      });
      setSuccessModal({
        projectTitle: selectedProject.title,
        amount: Number(amount),
        action: contributeAction,
        funder: funderType
      });
      setSelectedProject(null);
      setNotes("");
      loadFundings();
    } catch (err) {
      alert("Error recording contribution: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aggregated totals
  const totalRequested = fundings.reduce((sum, f) => sum + (f.requested_funding || 0), 0);
  const totalPledged = fundings.reduce((sum, f) => sum + (f.amount_pledged || 0), 0);
  const totalApproved = fundings.reduce((sum, f) => sum + (f.amount_approved || 0), 0);
  const totalDisbursed = fundings.reduce((sum, f) => sum + (f.amount_disbursed || 0), 0);

  // Filtered projects
  const filteredProjects = fundings.filter(p => {
    const matchesSearch = !searchQuery.trim() ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institution_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'open') {
      return p.funding_status === 'Open for Funding' || (p.amount_pledged || 0) < (p.requested_funding || 1);
    }
    if (activeTab === 'approved') {
      return p.funding_status === 'Approved' || p.funding_status === 'Disbursing';
    }
    if (activeTab === 'funded') {
      return p.funding_status === 'Fully Funded' || (p.amount_pledged || 0) >= (p.requested_funding || 1);
    }

    return true; // 'all'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-blue-900/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Jharkhand State Societal Project Funding Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Fund Verified Innovation Projects Across Jharkhand
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Transparently connect verified student & university solutions with Corporate CSR grants, government allocations, and philanthropic donors. Every rupee is tied to measurable milestones on the ground.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Clear Financial Overview Cards (Easy to understand!) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Funding Needed</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{totalRequested.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Across all listed proposals</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs bg-gradient-to-br from-amber-50/40 to-white space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Pledged by Sponsors</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700">
            ₹{totalPledged.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-700 font-medium">Formal sponsor commitments</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-xs bg-gradient-to-br from-blue-50/40 to-white space-y-1">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
            <span>Grants Approved</span>
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700">
            ₹{totalApproved.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-blue-700 font-medium">Sanctioned by review committees</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs bg-gradient-to-br from-emerald-50/40 to-white space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>Disbursed to Teams</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">Released against tested milestones</div>
        </div>
      </div>

      {/* 3. Easy Filter Toolbar & Tab Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Top Search & Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects (e.g. water, BIT Mesra, solar, Khunti)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="All">All 24 Districts</option>
              {JHARKHAND_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Tab Pills for Fast Viewing */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Projects ({fundings.length})
          </button>

          <button
            onClick={() => setActiveTab('open')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'open'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            Open for Funding
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Approved & Disbursing
          </button>

          <button
            onClick={() => setActiveTab('funded')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'funded'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Fully Funded
          </button>
        </div>
      </div>

      {/* 4. Projects List (Clear, Modern & Easy to Read) */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Loading projects and funding pipelines...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Coins className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No projects found matching your selection</h3>
          <p className="text-xs text-slate-500">Try adjusting your category, district, or search query.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProjects.map((project) => {
            const requested = project.requested_funding || 1;
            const pledged = project.amount_pledged || 0;
            const approved = project.amount_approved || 0;
            const disbursed = project.amount_disbursed || 0;

            const pctFunded = Math.min(100, Math.round((pledged / requested) * 100));
            const pctDisbursed = Math.min(100, Math.round((disbursed / requested) * 100));
            const isFullyFunded = pledged >= requested;
            const isExpanded = !!expandedMilestones[project.id];

            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Project Header Row */}
                <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200">
                        {project.category}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                        📍 {project.district} District
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                        isFullyFunded
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {isFullyFunded ? '✓ 100% Pledged' : 'Seeking Funding'}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {project.title}
                    </h3>

                    <div className="text-xs text-slate-600 font-medium flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-800">🏛️ {project.institution_name}</span>
                      {project.team?.mentor_name && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>Faculty Mentor: <b className="text-slate-800">{project.team.mentor_name}</b></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 1-Click Action CTA */}
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setContributeAction("pledge");
                        const remaining = Math.max(0, requested - pledged);
                        setAmount(remaining > 0 ? remaining : 25000);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-95 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sponsor / Fund Project</span>
                    </button>
                  </div>
                </div>

                {/* Clear Narrative Section */}
                <div className="p-6 sm:p-7 bg-slate-50/50 border-b border-slate-100 grid md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      The Problem on the Ground:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {project.problem_statement}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      The Technical Solution:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {project.proposed_solution}
                    </p>
                  </div>
                </div>

                {/* THE CLEAR, VISUAL FUNDING PROGRESS BAR (EASY TO READ!) */}
                <div className="p-6 sm:p-7 space-y-4 bg-white">
                  {/* Progress Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{pledged.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        pledged of ₹{requested.toLocaleString('en-IN')} goal
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {pctFunded}% Funded
                      </span>
                      <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        ₹{disbursed.toLocaleString('en-IN')} Disbursed ({pctDisbursed}%)
                      </span>
                    </div>
                  </div>

                  {/* Clean Dual-Color Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
                    {/* Disbursed (Solid Green) */}
                    <div
                      className="h-full bg-emerald-600 rounded-full absolute left-0 top-0 transition-all z-10"
                      style={{ width: `${pctDisbursed}%` }}
                      title={`Disbursed: ₹${disbursed.toLocaleString('en-IN')}`}
                    />
                    {/* Pledged / Committed (Amber) */}
                    <div
                      className="h-full bg-amber-400 rounded-full absolute left-0 top-0 transition-all"
                      style={{ width: `${pctFunded}%` }}
                      title={`Pledged: ₹${pledged.toLocaleString('en-IN')}`}
                    />
                  </div>

                  {/* Clean 3-Box Breakdown */}
                  <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">1. Total Required</div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                        ₹{requested.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                      <div className="text-[10px] font-bold text-amber-800 uppercase">2. Committed / Pledged</div>
                      <div className="text-xs sm:text-sm font-extrabold text-amber-900 mt-0.5">
                        ₹{pledged.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase">3. Disbursed to Date</div>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-900 mt-0.5">
                        ₹{disbursed.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verified Sponsors Pill Row */}
                {project.contributions && project.contributions.length > 0 && (
                  <div className="px-6 sm:px-7 py-3 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-500 text-[11px] uppercase">Backed by:</span>
                      {project.contributions.map((c) => (
                        <span key={c.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-medium shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{c.funder_name}</span>
                          <b className="text-emerald-700 font-bold">
                            (₹{(c.disbursed_amount || c.approved_amount || c.pledged_amount).toLocaleString('en-IN')})
                          </b>
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleMilestones(project.id)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Milestones' : `View ${project.funding_milestones?.length || 3} Milestones`}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {/* ACCORDION: Milestone Tranches & Deliverables (Clean & Collapsible) */}
                {isExpanded && project.funding_milestones && (
                  <div className="p-6 border-t border-slate-100 bg-slate-50/40 animate-in fade-in">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Payment Milestones & Delivery Conditions:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {project.funding_milestones.map((m, mIdx) => (
                        <div key={mIdx} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-500 text-[10px]">
                              Milestone {m.milestone_num || mIdx + 1}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.status === 'Disbursed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {m.status || 'Pending'}
                            </span>
                          </div>

                          <div className="font-extrabold text-slate-900 leading-snug">
                            {m.title}
                          </div>

                          <div className="text-emerald-700 font-black text-sm">
                            ₹{Number(m.tranche_amount || 0).toLocaleString('en-IN')}
                          </div>

                          <p className="text-[11px] text-slate-600 border-t border-slate-100 pt-1.5 leading-relaxed">
                            {m.deliverable}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. SIMPLE 1-CLICK FUNDING MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Sponsor Innovation Project
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {selectedProject.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleContribute} className="space-y-4 text-xs">
              {/* Step 1: Action Choice */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">1. Select Action Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContributeAction("pledge")}
                    className={`py-2 px-3 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                      contributeAction === 'pledge'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🤝 1. Pledge
                  </button>
                  <button
                    type="button"
                    onClick={() => setContributeAction("approve")}
                    className={`py-2 px-3 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                      contributeAction === 'approve'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ✓ 2. Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setContributeAction("disburse")}
                    className={`py-2 px-3 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                      contributeAction === 'disburse'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    💸 3. Disburse
                  </button>
                </div>
              </div>

              {/* Step 2: Sponsor Category */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">2. Sponsor / Funder Category:</label>
                <select
                  value={funderType}
                  onChange={(e) => setFunderType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="CSR Foundation">CSR Foundation (Section 135 Compliant)</option>
                  <option value="Government Department">Government Department / State Innovation Agency</option>
                  <option value="Industry Partner">Industry & MSME Partner</option>
                  <option value="Angel Investor">Angel Investor / Venture Capital Fund</option>
                </select>
              </div>

              {/* Step 3: Quick Amount Pills & Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">3. Contribution Amount (₹):</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[25000, 50000, 100000, selectedProject.requested_funding - selectedProject.amount_pledged > 0 ? selectedProject.requested_funding - selectedProject.amount_pledged : 150000].map((presetAmt, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setAmount(presetAmt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-[11px] font-bold text-slate-700 hover:text-blue-900 border border-slate-200 cursor-pointer"
                    >
                      ₹{presetAmt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 4: Official Note */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Official Note / Milestone Conditions (Optional):</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sanctioned under Rural Innovation Mission. Tranche release upon hardware validation."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : `Confirm ${contributeAction.toUpperCase()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. SUCCESS CONFIRMATION MODAL */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-4 border-emerald-500/30 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Funding Successfully Recorded!</h3>
              <p className="text-xs text-slate-600">
                You committed <b>₹{successModal.amount.toLocaleString('en-IN')}</b> to <b>{successModal.projectTitle}</b>.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-left space-y-1">
              <div>Action: <b className="capitalize text-blue-900">{successModal.action}</b></div>
              <div>Funder Category: <b>{successModal.funder}</b></div>
              <div>Blockchain & Audit Hash: <b className="font-mono text-emerald-700">JH-FUND-2026-VERIFIED</b></div>
            </div>

            <button
              onClick={() => setSuccessModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Done & Return to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
