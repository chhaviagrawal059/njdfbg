import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, Users, Award, Coins, Compass, FileText,
  CheckCircle2, Clock, PlusCircle, ArrowRight, ExternalLink,
  ShieldCheck, Sparkles, Building2
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      setLoading(true);
      try {
        const [certs, fundList] = await Promise.all([
          api.rewards.getCertificates(user?.id || 8),
          api.funding.list()
        ]);
        setCertificates(certs);
        setFundings(fundList);
      } catch (err) {
        console.error("Error loading student dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-amber-800/40">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Student & Project Team Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Welcome, Amit Soren
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Project Lead • <b>Rural IoT Innovators Team</b>, BIT Mesra (Ranchi)
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-400/30 font-semibold text-amber-200">
              🏅 Rural Impact Champion (Gold)
            </span>
            <span className="bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-400/30 font-semibold text-blue-200">
              ⚡ State Innovation Fellow
            </span>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Active Proposals</div>
          <div className="text-2xl font-black text-slate-900 mt-1">1</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Khunti Drinking Water IoT</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Grant Sanctioned</div>
          <div className="text-2xl font-black text-blue-900 mt-1">₹1,80,000</div>
          <div className="text-[11px] text-blue-600 mt-1 font-semibold">Tata CSR + State Innovation</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Milestones Released</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">₹90,000</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Tranches 1 & 2 Disbursed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Verifiable Certificates</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{certificates.length || 1}</div>
          <div className="text-[11px] text-amber-600 mt-1 font-semibold">Government Certified</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: My Active Innovation Project (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Prototype Testing in Dormo Village
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Decentralized Adsorbent Fluoride Remediation Unit with IoT Telemetry
                </h3>
              </div>
              <Link
                to="/workflow-demo"
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                Inspect Workflow <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Serving 4,200 villagers across Dormo village, Khunti. Multi-stage adsorption column with real-time solar-powered LoRa telemetry sensor node.
            </p>

            {/* Multidisciplinary Team */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-700 flex items-center justify-between">
                <span>Multidisciplinary Student Team:</span>
                <span className="text-blue-700">BIT Mesra R&D Cell</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">Amit Soren</div>
                  <div className="text-[11px] text-slate-500">Lead IoT & Hardware</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">Neha Kumari</div>
                  <div className="text-[11px] text-slate-500">Chemical Adsorption</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">Rahul Hansda</div>
                  <div className="text-[11px] text-slate-500">Env Engg & Field Immersion</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                to="/funding"
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Track Grant Disbursal (₹1.80L)
              </Link>
              <Link
                to="/rewards"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                View Digital Certificate
              </Link>
              <Link
                to="/challenges"
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                Discover New Civic Problems
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Opportunities & Badges (1 col) */}
        <div className="space-y-6">
          {/* Certificate Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Verifiable Credentials</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <div className="font-mono text-[10px] text-emerald-700 font-bold">
                ID: JH-INNOV-2026-WTR-8821
              </div>
              <div className="font-bold text-slate-900">
                Project Completion & Social Impact
              </div>
              <div className="text-[11px] text-slate-600">
                Issued by Government of Jharkhand State Innovation Council
              </div>
            </div>
            <Link
              to="/rewards"
              className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs text-center block"
            >
              Verify in Public Registry
            </Link>
          </div>

          {/* Quick Links */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Team Innovation Hubs</h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/rewards"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-700 block transition-colors"
              >
                <span>🏆 Jharkhand GreenTech Challenge (₹5L)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/funding"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-700 block transition-colors"
              >
                <span>💰 Project Funding Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/sponsor-benefits"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-700 block transition-colors"
              >
                <span>🤝 Sponsor & Funder Benefits Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
