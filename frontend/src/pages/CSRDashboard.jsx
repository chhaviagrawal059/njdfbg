import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake, Coins, TrendingUp, CheckCircle2, ShieldCheck,
  Building, FileText, ArrowRight, Download, Users, Landmark
} from 'lucide-react';

export const CSRDashboard = () => {
  const { user } = useAuth();
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await api.funding.list();
        setFundings(data);
      } catch (err) {
        console.error("Error loading CSR dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-teal-900/40">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
            <span>CSR Foundation & Philanthropic Grants Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Jharkhand Tribal Empowerment & Rural CSR Trust
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Director: <b>Sunita Murmu</b> • MCA Registration: <code className="bg-teal-900/60 px-1.5 py-0.5 rounded font-mono text-teal-200">CSR00048192 (Sec 135 Compliant)</code>
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-teal-500/20 px-2.5 py-1 rounded-lg border border-teal-400/30 font-semibold text-teal-200">
              🌱 Focus Areas: Safe Drinking Water, Tribal Child Health, Agro Value Addition
            </span>
            <span className="bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-400/30 font-semibold text-blue-200">
              📍 Priority Districts: Khunti, Simdega, Gumla, Dumka
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Annual CSR Budget</div>
          <div className="text-2xl font-black text-teal-950 mt-1">₹4.50 Crore</div>
          <div className="text-[11px] text-teal-700 mt-1 font-semibold">Statutory Schedule VII</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Committed Grants</div>
          <div className="text-2xl font-black text-blue-900 mt-1">₹2.20 Lakh</div>
          <div className="text-[11px] text-blue-600 mt-1 font-semibold">Khunti Water & Gumla Mahua</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Beneficiaries Reached</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">4,450 Citizens</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Verified by Local Panchayats</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Audit Compliance</div>
          <div className="text-2xl font-black text-slate-900 mt-1">100%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-semibold">Tranche Receipts & Lab Tests</div>
        </div>
      </div>

      {/* Eligible Projects Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Eligible Schedule VII Social Impact Projects in Jharkhand
            </h3>
            <p className="text-xs text-slate-500">
              Verified university and grassroots proposals ready for direct corporate sponsorship.
            </p>
          </div>
          <Link
            to="/funding"
            className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 self-start"
          >
            <span>Open Funding Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {fundings.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-teal-300 transition-all text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {proj.category}
                    </span>
                    <span className="font-bold text-slate-500">📍 {proj.district} District</span>
                    <span className="text-[10px] text-slate-400">Status: {proj.funding_status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                  <div className="text-slate-600">
                    🏛️ <b>Institution:</b> {proj.institution_name}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-teal-950">
                    ₹{proj.requested_funding?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Total Grant Ask</div>
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-lg border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Pledged:</div>
                  <div className="font-bold text-amber-700">₹{proj.amount_pledged?.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Approved:</div>
                  <div className="font-bold text-blue-700">₹{proj.amount_approved?.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Disbursed:</div>
                  <div className="font-bold text-emerald-700">₹{proj.amount_disbursed?.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Impact Callout */}
              {proj.expected_impact && (
                <div className="p-2.5 bg-teal-50/60 rounded-lg border border-teal-100 text-teal-900 text-[11px]">
                  👥 <b>Target Beneficiaries:</b> {proj.expected_impact.community}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <Link
                  to="/funding"
                  className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Pledge / Approve CSR Tranche
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
