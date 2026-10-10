import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Rocket, TrendingUp, Calendar, FileText, CheckCircle2,
  Coins, ArrowRight, ShieldCheck, Building2, Users, Clock,
  ExternalLink, Sparkles
} from 'lucide-react';

export const StartupDashboard = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      setLoading(true);
      try {
        const data = await api.investor.getMeetings();
        setMeetings(data);
      } catch (err) {
        console.error("Error loading startup meetings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMeetings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-purple-900/40">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
            <Rocket className="w-3.5 h-3.5 text-purple-400" />
            <span>Startup & Innovator Commercialization Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            JalDrishti CleanTech Innovations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Founded by <b>Priya Tirkey</b> • DPIIT Registered: <code className="bg-purple-900/60 px-1.5 py-0.5 rounded font-mono text-purple-200">DPIIT-JH-2024-8849</code>
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-400/30 font-semibold text-purple-200">
              📜 Provisional Patent Filed (CBR No. 89412/2025)
            </span>
            <span className="bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-400/30 font-semibold text-emerald-200">
              📍 Prototype Tested in Khunti
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Seed Funding Ask</div>
          <div className="text-2xl font-black text-purple-950 mt-1">₹15,00,000</div>
          <div className="text-[11px] text-purple-700 mt-1 font-semibold">Pre-Seed / Angel Round</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Investor Inquiries</div>
          <div className="text-2xl font-black text-blue-900 mt-1">{meetings.length || 1}</div>
          <div className="text-[11px] text-blue-600 mt-1 font-semibold">Active Due Diligence</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Field Units Deployed</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">14 Sensors</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">4,200 Citizens Impacted</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Hardware Unit Cost</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹3,200</div>
          <div className="text-[11px] text-slate-500 mt-1 font-semibold">vs ₹85,000 imported</div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Investor Meetings & Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Angel & VC Due Diligence Pipeline
              </h3>
              <span className="text-xs font-bold text-purple-700">
                1 Pending Meeting
              </span>
            </div>

            {meetings.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No active meeting requests yet. Pitch decks are visible to registered angel investors.
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-950 text-sm">💼 {m.investor_name}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-900 text-[10px] font-bold">
                        {m.status}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      <b>Proposed Ticket Size:</b> {m.ticket_size_range} • <b>Meeting Date:</b> {m.meeting_date}
                    </div>
                    <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-purple-100">
                      <b>Investor Note:</b> {m.notes}
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => alert("Meeting confirmed! Ranchi Incubation Center calendar invite dispatched.")}
                        className="px-3 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-white font-bold text-[11px]"
                      >
                        Accept & Dispatch Invite
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Industrial Pilot Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Corporate Pilot & Commercialization Opportunities
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">🏢 Tata Steel Foundation — Rural Water Pilot</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Field Immersion Active
                </span>
              </div>
              <p className="text-slate-600">
                Evaluating deployment of 50 JalDrishti IoT water monitoring units across Kolhan Division schools and Anganwadis.
              </p>
              <div className="pt-2 flex gap-2">
                <Link
                  to="/funding"
                  className="px-3 py-1.5 rounded-lg bg-blue-900 text-white font-bold text-[11px]"
                >
                  View Co-Funding Record (₹1.80L)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pitch Deck & Profile */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Commercial Collateral</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">JalDrishti_Seed_PitchDeck.pdf</div>
                  <div className="text-[10px] text-slate-500">Updated: October 2026 • 18 Slides</div>
                </div>
                <button onClick={() => alert("Downloading confidential pitch deck...")} className="text-blue-700 font-bold text-xs">
                  Download
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Provisional_Patent_Draft.pdf</div>
                  <div className="text-[10px] text-slate-500">CBR No. 89412/2025</div>
                </div>
                <button onClick={() => alert("Viewing provisional patent claim details...")} className="text-blue-700 font-bold text-xs">
                  View
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Explore Ecosystem</h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/investor"
                className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center justify-between font-bold text-purple-900 block"
              >
                <span>💼 View Angel & VC Perspectives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/rewards"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-700 block"
              >
                <span>🏆 Apply to Jharkhand GreenTech Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
