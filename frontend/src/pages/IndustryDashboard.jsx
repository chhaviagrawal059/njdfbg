import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  Building2, Award, FileText, CheckCircle2, PlusCircle, Handshake,
  DollarSign, Sparkles, ExternalLink, ArrowRight
} from 'lucide-react';

export const IndustryDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [validatedChallenges, setValidatedChallenges] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Partnership offer modal
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [offerType, setOfferType] = useState('Funding Grant');
  const [fundingAmount, setFundingAmount] = useState('₹5,00,000');
  const [commitmentText, setCommitmentText] = useState('');
  const [ipTerms, setIpTerms] = useState('Open Civic Innovation License (Non-Commercial Community Deployment)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allCh, oppList] = await Promise.all([
        api.challenges.list({ status: 'Validated' }),
        api.marketplace.getOpportunities()
      ]);
      setValidatedChallenges(allCh);
      setOpportunities(oppList);
    } catch (err) {
      console.error("Error loading industry data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAgreement = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create opportunity listing in marketplace or collaboration
      await api.marketplace.createOpportunity({
        title: `Industry Collaboration for ${selectedChallenge.title}`,
        opportunity_type: offerType,
        description: commitmentText || `Support from ${user?.organization_name || 'Tata Steel Foundation'}`,
        eligibility: `Assigned university engineering teams working on Challenge #${selectedChallenge.id}`,
        commitments: `${fundingAmount} funding support + technical mentorship. IP terms: ${ipTerms}`,
        funding_amount: fundingAmount,
        deadline_days: 45,
        is_demo: false
      });
      alert("Partnership commitment recorded and published to Innovation Marketplace!");
      setSelectedChallenge(null);
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-indigo-200">
            Industry, CSR & Social Startup Partnership Portal
          </span>
          <h2 className="text-2xl font-black mt-2">Tata Steel Foundation (TSF)</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Representative: <b>{user?.full_name || 'Sanjay Singhal (Head CSR)'}</b> • Sector: <b>Steel & Rural CSR</b> • Kolhan Division
          </p>
        </div>

        <Link
          to="/marketplace"
          className="self-start md:self-auto px-5 py-3 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs shadow flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-indigo-900" />
          Post New Innovation Grant
        </Link>
      </div>

      {/* Facilities & Commitment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Committed CSR Grants</div>
          <div className="text-xl font-black text-slate-900">₹20,00,000</div>
          <p className="text-[11px] text-slate-500">Allocated for drinking water & agro-processing prototypes</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Laboratory Hours Offered</div>
          <div className="text-xl font-black text-indigo-700">60 Hours</div>
          <p className="text-[11px] text-slate-500">Jamshedpur Metallurgical & Materials Characterization Lab</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Student Internships & Mentorship</div>
          <div className="text-xl font-black text-emerald-700">4 Active Mentors</div>
          <p className="text-[11px] text-slate-500">Engineering guidance for BIT Mesra & NIT Jamshedpur teams</p>
        </div>
      </div>

      {/* Validated Challenges Matching Capabilities */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Validated Challenges Ready for Industry Support</h3>
            <p className="text-xs text-slate-500">Grassroots problems verified by district administration seeking CSR/technical partners</p>
          </div>
        </div>

        {validatedChallenges.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No validated challenges currently seeking industry support.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {validatedChallenges.map((ch) => (
              <div key={ch.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {ch.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 hover:text-blue-700 cursor-pointer" onClick={() => navigate(`/challenges/${ch.id}`)}>
                      {ch.title}
                    </h4>
                    <PriorityBadge tier={ch.priority_tier} score={ch.priority_score} isSafetyOverride={ch.is_safety_override} />
                  </div>
                  <div className="text-xs text-slate-500">
                    {ch.district} • Population: {ch.affected_population?.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">{ch.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedChallenge(ch)}
                    className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5 text-indigo-200" />
                    Offer CSR Grant / Mentorship
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collaboration Agreement Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Offer Support for Challenge #{selectedChallenge.id}
            </h3>
            <p className="text-xs text-slate-600">
              "{selectedChallenge.title}" ({selectedChallenge.district})
            </p>

            <form onSubmit={handleCreateAgreement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Support Type</label>
                <select
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                >
                  <option value="Funding Grant">CSR Funding Grant</option>
                  <option value="Equipment Access">Equipment & Lab Access</option>
                  <option value="Mentorship">Industry Engineering Mentorship</option>
                  <option value="Pilot Testing">Pilot Field Testing & Deployment Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Funding Commitment / Resource Value</label>
                <input
                  type="text"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  placeholder="e.g. ₹5,00,000 or 40 Lab Hours"
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Commitment & Deliverables Details</label>
                <textarea
                  required
                  rows={3}
                  value={commitmentText}
                  onChange={(e) => setCommitmentText(e.target.value)}
                  placeholder="Describe testing equipment provided, mentorship frequency, or field sites..."
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intellectual Property & Terms</label>
                <input
                  type="text"
                  value={ipTerms}
                  onChange={(e) => setIpTerms(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg shadow"
                >
                  {isSubmitting ? 'Recording...' : 'Formalize Support Commitment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
