import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, Building2, Calendar, FileText, CheckCircle2,
  Coins, ArrowRight, ShieldCheck, Users, Clock, Search,
  Briefcase, ExternalLink, Sparkles
} from 'lucide-react';

export const InvestorDashboard = () => {
  const { user } = useAuth();
  const [startups, setStartups] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Meeting Request Modal
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [ticketSize, setTicketSize] = useState("₹15,00,000 - ₹25,00,000");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [startList, meetList] = await Promise.all([
        api.investor.getStartups(),
        api.investor.getMeetings()
      ]);
      setStartups(startList);
      setMeetings(meetList);
    } catch (err) {
      console.error("Error loading investor data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestMeeting = async (e) => {
    e.preventDefault();
    if (!selectedStartup) return;
    setIsSubmitting(true);
    try {
      await api.investor.requestMeeting({
        startup_user_id: selectedStartup.user_id,
        project_title: selectedStartup.startup_name,
        stage: selectedStartup.stage,
        ticket_size_range: ticketSize,
        pitch_deck_url: selectedStartup.pitch_deck_url,
        notes: meetingNotes,
        meeting_date: meetingDate || "Next Tuesday, 11:00 AM"
      });
      alert(`Due diligence pitch meeting requested with ${selectedStartup.founder_name}!`);
      setSelectedStartup(null);
      setMeetingNotes("");
      loadData();
    } catch (err) {
      alert("Error requesting meeting: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-cyan-900/40">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Angel Network & Venture Capital Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Chotanagpur Venture Fund & Angel Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Managing Partner: <b>Vikramaditya Singh</b> • Ticket Size: <code className="bg-cyan-900/60 px-1.5 py-0.5 rounded font-mono text-cyan-200">₹5 Lakh - ₹50 Lakh</code> • AUM: ₹25 Crore
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-400/30 font-semibold text-cyan-200">
              ⚡ Sectors: CleanTech, Agri-Value Chain, IoT Telemetry, Remote Health
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Pipeline Dealflow</div>
          <div className="text-2xl font-black text-cyan-950 mt-1">{startups.length || 1} Startups</div>
          <div className="text-[11px] text-cyan-700 mt-1 font-semibold">DPIIT & Academic Spinouts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Scheduled Due Diligence</div>
          <div className="text-2xl font-black text-blue-900 mt-1">{meetings.length || 1} Meetings</div>
          <div className="text-[11px] text-blue-600 mt-1 font-semibold">Pitch Decks Under Review</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Average Ticket Size</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">₹15 Lakh</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Seed Stage Co-Invest</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Field Deployed Units</div>
          <div className="text-2xl font-black text-slate-900 mt-1">14 Systems</div>
          <div className="text-[11px] text-slate-500 mt-1 font-semibold">Proof of Value Established</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Discover Startups (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Vetted Seed-Stage Startups & Academic Spinouts
                </h3>
                <p className="text-xs text-slate-500">
                  Startups with verified field pilot deployments in Jharkhand communities.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {startups.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-cyan-300 transition-all text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-900">
                          {st.sector}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">
                          Stage: {st.stage}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700">
                          {st.patent_status}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{st.startup_name}</h4>
                      <div className="text-slate-600">
                        Founder: <b>{st.founder_name}</b> • 📍 {st.district} District • Reg: {st.dpiit_recognition}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-cyan-950">{st.funding_ask}</div>
                      <div className="text-[10px] text-slate-400">Target Seed Round</div>
                    </div>
                  </div>

                  {/* Traction Metrics */}
                  {st.traction_metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-white rounded-xl border border-slate-200 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Deployments:</div>
                        <div className="font-bold text-slate-800">{st.traction_metrics.sensors_deployed} Units</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Citizens:</div>
                        <div className="font-bold text-emerald-700">{st.traction_metrics.households_protected} People</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Monthly Reads:</div>
                        <div className="font-bold text-blue-700">{st.traction_metrics.monthly_active_telemetry_reads}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Unit Cost:</div>
                        <div className="font-bold text-purple-700">{st.traction_metrics.hardware_unit_cost}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => alert("Confidential pitch deck downloaded for review.")}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Download Pitch Deck & Financials
                    </button>

                    <button
                      onClick={() => setSelectedStartup(st)}
                      className="px-4 py-2 rounded-xl bg-cyan-900 hover:bg-cyan-800 text-white font-bold text-xs shadow-xs"
                    >
                      Request Pitch & Due Diligence Meeting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scheduled Meetings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Due Diligence Calendar</h3>
            <div className="space-y-2 text-xs">
              {meetings.map((m) => (
                <div key={m.id} className="p-3.5 bg-cyan-50/50 rounded-xl border border-cyan-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-950">{m.project_title}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-200 text-cyan-900 text-[10px] font-bold">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <b>Ticket Range:</b> {m.ticket_size_range}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    📅 {m.meeting_date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Funder Guidelines</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <Link
                to="/sponsor-benefits"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-700 block"
              >
                <span>📘 Investor & Sponsor Benefits Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/funding"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-700 block"
              >
                <span>💰 Project Funding Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Request Modal */}
      {selectedStartup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Request Due Diligence Meeting
                </h3>
                <div className="text-xs text-slate-500">
                  Target: {selectedStartup.startup_name} ({selectedStartup.founder_name})
                </div>
              </div>
              <button
                onClick={() => setSelectedStartup(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestMeeting} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Anticipated Ticket Size Range:</label>
                <input
                  type="text"
                  value={ticketSize}
                  onChange={(e) => setTicketSize(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Preferred Meeting Date / Time:</label>
                <input
                  type="text"
                  placeholder="e.g. Next Tuesday at 11:30 AM (Incubation Center or Zoom)"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Due Diligence Notes / Questions:</label>
                <textarea
                  rows="3"
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  placeholder="e.g. Impressed by Khunti field pilot. Want to review bill of materials and intellectual property assignment."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStartup(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-cyan-900 hover:bg-cyan-800 text-white font-bold"
                >
                  {isSubmitting ? "Dispatching..." : "Send Meeting Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
