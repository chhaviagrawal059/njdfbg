import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, Award, Building2, Calendar, CheckCircle2,
  Filter, PlusCircle, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';

const OPPORTUNITY_TYPES = [
  "All",
  "Funding Grant",
  "Student Project Opportunities",
  "Equipment Access",
  "Industry Mentorship",
  "Research Collaboration",
  "Pilot Testing",
  "Startup Incubation"
];

export const MarketplacePage = () => {
  const { user } = useAuth();

  const [opportunities, setOpportunities] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  // Apply Modal
  const [applyingOpp, setApplyingOpp] = useState(null);
  const [applyNote, setApplyNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Post Opportunity Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    opportunity_type: 'Funding Grant',
    description: '',
    eligibility: '',
    commitments: '',
    funding_amount: '₹2,50,000',
    deadline_days: 30,
    is_demo: false
  });

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const data = await api.marketplace.getOpportunities({
        opp_type: selectedType
      });
      setOpportunities(data);
    } catch (err) {
      console.error("Error loading opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [selectedType]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyingOpp) return;
    setIsApplying(true);
    try {
      await api.marketplace.apply({
        opportunity_id: applyingOpp.id,
        note: applyNote
      });
      alert("Application submitted successfully! The provider has been notified.");
      setApplyingOpp(null);
      setApplyNote('');
    } catch (err) {
      alert("Application error: " + err.message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.marketplace.createOpportunity(postData);
      setShowPostModal(false);
      setPostData({
        title: '',
        opportunity_type: 'Funding Grant',
        description: '',
        eligibility: '',
        commitments: '',
        funding_amount: '₹2,50,000',
        deadline_days: 30,
        is_demo: false
      });
      loadOpportunities();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Collaboration & Resource Exchange</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900">Innovation Opportunity Marketplace</h2>
          <p className="text-xs text-slate-600 mt-1">
            Real committed CSR grants, laboratory testing access, research fellowships, and pilot facilities for university teams.
          </p>
        </div>

        {(user?.role === 'industry' || user?.role === 'admin') && (
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow flex items-center gap-2 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Opportunity
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 text-xs font-bold">
        {OPPORTUNITY_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
              selectedType === t
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <div key={opp.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {opp.opportunity_type}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {opp.funding_amount || 'Resource Access'}
                </span>
              </div>

              <h4 className="font-bold text-base text-slate-900 leading-snug">
                {opp.title}
              </h4>

              <div className="text-xs text-slate-600">
                Provider: <span className="font-bold text-slate-900">{opp.provider_name}</span>
                <span className="text-slate-400 block text-[11px]">{opp.provider_type}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {opp.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px]">
                <div className="text-slate-700">
                  <b>Eligibility:</b> {opp.eligibility}
                </div>
                <div className="text-slate-700">
                  <b>Commitments:</b> {opp.commitments}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Closes {new Date(opp.deadline).toLocaleDateString()}
              </span>

              <button
                onClick={() => setApplyingOpp(opp)}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Apply Now →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {applyingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Apply for: {applyingOpp.title}
            </h3>
            <p className="text-xs text-slate-600">
              Offered by <b>{applyingOpp.provider_name}</b> • Value: {applyingOpp.funding_amount}
            </p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Team Credentials & Statement of Intent
                </label>
                <textarea
                  required
                  rows={4}
                  value={applyNote}
                  onChange={(e) => setApplyNote(e.target.value)}
                  placeholder="Outline your team members, branch, relevant laboratory experiments, and how you will deploy this grant/equipment..."
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setApplyingOpp(null)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-teal-600 text-white shadow"
                >
                  {isApplying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Opportunity Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Publish Innovation Opportunity</h3>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  placeholder="e.g. CSR Grant for Rural Drinking Water Sensors"
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={postData.opportunity_type}
                    onChange={(e) => setPostData({ ...postData, opportunity_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                  >
                    {OPPORTUNITY_TYPES.filter(t => t !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grant / Resource Value</label>
                  <input
                    type="text"
                    value={postData.funding_amount}
                    onChange={(e) => setPostData({ ...postData, funding_amount: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={postData.description}
                  onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility Criteria *</label>
                <input
                  type="text"
                  required
                  value={postData.eligibility}
                  onChange={(e) => setPostData({ ...postData, eligibility: e.target.value })}
                  placeholder="e.g. Engineering students in Jharkhand with faculty mentor"
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Commitments *</label>
                <input
                  type="text"
                  required
                  value={postData.commitments}
                  onChange={(e) => setPostData({ ...postData, commitments: e.target.value })}
                  placeholder="e.g. ₹5 Lakh disbursed across 3 milestone stages + lab access"
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-900 text-white shadow"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
