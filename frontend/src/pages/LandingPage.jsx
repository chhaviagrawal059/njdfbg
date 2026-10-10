import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  Compass, PlusCircle, ArrowRight, CheckCircle2, ShieldAlert,
  Building2, GraduationCap, Users, Award, Sparkles, MapPin, ExternalLink,
  ChevronRight, BarChart2, CheckCheck, Gift, Coins, BookOpen, Clock,
  Droplet, Zap, HeartPulse, Sprout, ShieldCheck, PhoneCall, Rocket, TrendingUp, Calendar
} from 'lucide-react';

// --- AUTHENTIC INSTITUTIONAL & UNIVERSITY LOGOS ---
const BitMesraLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#0f2b5c" stroke="#d4af37" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="23" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 2" />
    <path d="M32 14 L36 24 L28 24 Z" fill="#d4af37" />
    <path d="M30 24 L34 24 L34 32 L30 32 Z" fill="#ffffff" />
    <path d="M22 34 Q32 30 32 38 Q32 30 42 34 L42 42 Q32 38 32 44 Q32 38 22 42 Z" fill="#d4af37" />
    <text x="32" y="52" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">BIT MESRA</text>
  </svg>
);

const IitDhanbadLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4 L56 16 L56 42 Q32 60 32 60 Q8 42 8 42 L8 16 Z" fill="#0a2540" stroke="#f59e0b" strokeWidth="2" />
    <circle cx="32" cy="28" r="10" stroke="#f59e0b" strokeWidth="2" fill="#0a2540" />
    <circle cx="32" cy="28" r="4" fill="#f59e0b" />
    <path d="M24 20 L40 36 M40 20 L24 36" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <text x="32" y="47" textAnchor="middle" fill="#f59e0b" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">IIT (ISM)</text>
    <text x="32" y="54" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold" fontFamily="sans-serif">DHANBAD</text>
  </svg>
);

const NitJamshedpurLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#1e3a8a" stroke="#ea580c" strokeWidth="2.5" />
    <circle cx="32" cy="30" r="12" stroke="#ea580c" strokeWidth="3" fill="#ffffff" />
    <path d="M32 20 L35 27 L32 34 L29 27 Z" fill="#ea580c" />
    <path d="M32 17 Q34 22 32 25 Q30 22 32 17 Z" fill="#f97316" />
    <text x="32" y="50" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">NIT JSR</text>
  </svg>
);

const BirsaAgroLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#065f46" stroke="#eab308" strokeWidth="2.5" />
    <circle cx="32" cy="26" r="8" fill="#eab308" />
    <path d="M32 28 Q22 36 22 44 Q32 40 32 48 Q32 40 42 44 Q42 36 32 28 Z" fill="#ffffff" />
    <path d="M32 48 L32 28" stroke="#065f46" strokeWidth="2" />
    <text x="32" y="56" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">BAU RANCHI</text>
  </svg>
);

const TataSteelLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#00539b" />
    <path d="M16 26 L48 26 M32 26 L32 44" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
    <text x="32" y="54" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" letterSpacing="0.5" fontFamily="sans-serif">TATA STEEL</text>
  </svg>
);

const CsirNmlLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#1e293b" stroke="#06b6d4" strokeWidth="2.5" />
    <ellipse cx="32" cy="28" rx="12" ry="4" transform="rotate(30 32 28)" stroke="#06b6d4" strokeWidth="1.5" />
    <ellipse cx="32" cy="28" rx="12" ry="4" transform="rotate(-30 32 28)" stroke="#06b6d4" strokeWidth="1.5" />
    <circle cx="32" cy="28" r="3.5" fill="#f59e0b" />
    <text x="32" y="48" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">CSIR-NML</text>
    <text x="32" y="55" textAnchor="middle" fill="#94a3b8" fontSize="4.5" fontWeight="medium" fontFamily="sans-serif">JAMSHEDPUR</text>
  </svg>
);

const CmpdiLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#14532d" stroke="#84cc16" strokeWidth="2.5" />
    <path d="M32 16 Q20 26 20 38 Q32 46 32 46 Q32 46 44 38 Q44 26 32 16 Z" fill="#84cc16" />
    <circle cx="32" cy="32" r="6" fill="#14532d" />
    <text x="32" y="54" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">CMPDI</text>
  </svg>
);

const RanchiUniversityLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#881337" stroke="#f59e0b" strokeWidth="2.5" />
    <circle cx="32" cy="24" r="6" fill="#f59e0b" />
    <path d="M22 34 L32 30 L42 34 L42 42 L32 38 L22 42 Z" fill="#ffffff" />
    <text x="32" y="52" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">RANCHI UNIV</text>
  </svg>
);

export const LandingPage = () => {
  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState({
    total_challenges: 6,
    awaiting_validation: 2,
    validated: 1,
    in_progress: 2,
    completed: 1,
    avg_community_rating: 4.9
  });
  const [featuredChallenges, setFeaturedChallenges] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stats, chList, oppList] = await Promise.all([
          api.analytics.getOverview().catch(() => null),
          api.challenges.list().catch(() => []),
          api.marketplace.getOpportunities().catch(() => [])
        ]);
        if (stats) setOverview(stats);
        if (chList) setFeaturedChallenges(chList.slice(0, 3));
        if (oppList) setOpportunities(oppList.slice(0, 3));
      } catch (err) {
        console.error("Error loading landing data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-20 bg-slate-50">

      {/* 1. HERO SECTION: ATTRACTIVE, PRESTIGIOUS & DYNAMIC */}
      <section className="relative bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-7">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-bold backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Government of Jharkhand • Department of Higher & Technical Education • State Innovation Council</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Turning Community Challenges into{' '}
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              Real-World Impact
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            An AI-powered civic technology ecosystem connecting citizens facing grassroots problems with Jharkhand’s
            universities, faculty mentors, student researchers, and industry CSR partners to deliver validated engineering prototypes and measurable societal solutions.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/submit"
              className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Report a Problem (Voice or Text)</span>
            </Link>

            <Link
              to="/challenges"
              className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 backdrop-blur transition-all hover:scale-105 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Explore 24 District Challenges</span>
            </Link>

            <Link
              to="/achievements"
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Village Impact Stories (Blog)</span>
            </Link>
          </div>

          {/* Voice Problem Intake (Gram Vaani) Teaser Banner */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Gram Vaani Voice Problem Intake</div>
                  <div className="text-[11px] text-slate-300">Rural citizens can record problems by speaking in Hindi or regional dialects.</div>
                </div>
              </div>
              <Link
                to="/submit"
                className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] transition-colors"
              >
                Try Voice Intake →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE PLATFORM METRICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-0 text-center">
            <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">{overview.total_challenges}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Challenges Reported</div>
          </div>
          <div className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-0 text-center">
            <div className="text-2xl sm:text-4xl font-black text-blue-700 dark:text-blue-400">₹6.50 Lakh</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Grant Requests Listed</div>
          </div>
          <div className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-0 text-center">
            <div className="text-2xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400">₹3.00 Lakh</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Disbursed to Teams</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">8 Roles</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Interconnected Stakeholders</div>
          </div>
        </div>
      </section>

      {/* 3. PARTNER INSTITUTIONAL NETWORK WITH OFFICIAL LOGOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>Academic & Industry Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Partner Institutional Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Connecting premier Jharkhand technical universities with national research laboratories and industry CSR leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. BIT Mesra */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 hover:border-blue-400 dark:hover:border-blue-500 group">
            <div className="flex items-center gap-3.5">
              <BitMesraLogo />
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                  BIT Mesra, Ranchi
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Estd. 1955 • Deemed Univ</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Specialized Water & Environmental Telemetry Lab with electrochemical calibration probes.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-0.5 rounded-md">
                Active: Khunti Water Pilot
              </span>
              <span className="text-slate-400 font-medium">12 Labs</span>
            </div>
          </div>

          {/* 2. IIT (ISM) Dhanbad */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 hover:border-blue-400 dark:hover:border-blue-500 group">
            <div className="flex items-center gap-3.5">
              <IitDhanbadLogo />
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                  IIT (ISM) Dhanbad
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Estd. 1926 • National Institute</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mine Environment & Geo-Hydrology Center with automated ICP-MS analytical instruments.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-0.5 rounded-md">
                Matched: Coal Runoff Tech
              </span>
              <span className="text-slate-400 font-medium">20+ Hours</span>
            </div>
          </div>

          {/* 3. NIT Jamshedpur */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 hover:border-blue-400 dark:hover:border-blue-500 group">
            <div className="flex items-center gap-3.5">
              <NitJamshedpurLogo />
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                  NIT Jamshedpur
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Estd. 1960 • National Institute</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Center for Renewable Energy & Embedded Systems for off-grid forest clinics and schools.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-0.5 rounded-md">
                Active: Saranda Cold-Chain
              </span>
              <span className="text-slate-400 font-medium">8 Labs</span>
            </div>
          </div>

          {/* 4. Birsa Agricultural University */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 hover:border-blue-400 dark:hover:border-blue-500 group">
            <div className="flex items-center gap-3.5">
              <BirsaAgroLogo />
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                  Birsa Agricultural Univ
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Estd. 1981 • State Univ</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Post-Harvest Agro Engineering Center working on solar greenhouse dehydration for forest produce.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-0.5 rounded-md">
                Assigned: Mahua Storage
              </span>
              <span className="text-slate-400 font-medium">15 Centers</span>
            </div>
          </div>

          {/* 5. Tata Steel Foundation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 hover:border-blue-400 dark:hover:border-blue-500 group">
            <div className="flex items-center gap-3.5">
              <TataSteelLogo />
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                  Tata Steel Foundation
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">CSR & Rural Innovation Lead</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Primary CSR sponsor funding village pilots, student kits, and technical mentorship.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-md">
                ₹15 Lakh Grants Sanctioned
              </span>
              <span className="text-slate-400 font-medium">CSR Sec 135</span>
            </div>
          </div>

          {/* 6. CSIR - NML */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 hover:border-blue-400 dark:hover:border-blue-500 group">
            <div className="flex items-center gap-3.5">
              <CsirNmlLogo />
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                  CSIR - NML Jamshedpur
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">National Research Lab</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Advanced Metallurgical Laboratory providing sensor corrosion analysis and metal filtration.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-0.5 rounded-md">
                Certified Testing Lab
              </span>
              <span className="text-slate-400 font-medium">Govt of India</span>
            </div>
          </div>

          {/* 7. CMPDI (Coal India) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 hover:border-blue-400 dark:hover:border-blue-500 group">
            <div className="flex items-center gap-3.5">
              <CmpdiLogo />
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                  CMPDI (Coal India)
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Miniratna PSU • Ranchi</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sponsors solar field battery kits and environmental baseline monitoring in mining districts.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-0.5 rounded-md">
                Solar Kit Co-Sponsor
              </span>
              <span className="text-slate-400 font-medium">PSU Partner</span>
            </div>
          </div>

          {/* 8. Ranchi University */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 hover:border-blue-400 dark:hover:border-blue-500 group">
            <div className="flex items-center gap-3.5">
              <RanchiUniversityLogo />
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                  Ranchi University
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Estd. 1960 • State University</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Community immersion field cell linking tribal students with rural technology development.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-0.5 rounded-md">
                Field Immersion SPOC
              </span>
              <span className="text-slate-400 font-medium">State Lead</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VILLAGE IMPACT STORIES (BLOG SPOTLIGHT ON HOMEPAGE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ground Truth Stories</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Village Impact Chronicles
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Read how student teams solved real community crises reported by villagers across Jharkhand.
            </p>
          </div>

          <Link
            to="/achievements"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            Read All Blog Stories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Featured Blog Highlight Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all grid md:grid-cols-12">
          <div className="md:col-span-5 relative min-h-[240px] bg-slate-900">
            <img
              src="/images/village-dormo-water.jpg"
              alt="Dormo village water station"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <span className="absolute top-3 left-3 bg-blue-950/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
              📍 Dormo Village, Khunti District
            </span>
          </div>

          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase">
                Water Quality & Public Health • 4 min read
              </div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                How 4 BIT Mesra Students Solved Dormo Village’s 10-Year Water Crisis
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                For over a decade, 1,200 villagers in Dormo suffered from invisible fluoride contamination. Here is how four students from BIT Mesra built an automated solar monitoring system that changed everything.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                ✅ Outcome: 1,200 villagers drinking 100% compliant WHO safe water daily.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Team: JalDrishti Innovators (+2,450 pts won)
              </span>
              <Link
                to="/achievements"
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. IMPACT POINTS & GOODIES STORE TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/20 text-slate-950 text-xs font-black">
              <Gift className="w-3.5 h-3.5" />
              <span>Verified Contributor Perks</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Earn Impact Points & Redeem Corporate Goodies
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
              Every verified village problem you solve earns Impact Points funded by Tata Steel and CMPDI. Redeem them for smart engineer backpacks, IoT hardware prototyping kits, and direct internship passes!
            </p>
          </div>

          <Link
            to="/rewards"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Visit Goodies Store</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </section>

      {/* 5.5 STARTUP PITCH DECKS & INVESTOR DUE DILIGENCE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-400/30">
              <Rocket className="w-3.5 h-3.5 text-indigo-400" />
              <span>Commercialization & Venture Capital Hub</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Startup Pitch Decks & Investor Meeting Scheduler
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Bridge proven rural innovations directly to angel investors, venture funds, and state grant incubators. Review traction metrics, unit economics, DPIIT recognition, and book 15-minute due diligence video meetings instantly.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-indigo-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Live 1-Page Decks
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Verified Unit Economics & MRR
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                15-Min Due Diligence Meets
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <Link
              to="/pitch-decks"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Rocket className="w-4 h-4 text-white" />
              <span>Explore Pitch Decks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pitch-decks"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-300" />
              <span>Schedule Investor Call</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FEATURED COMMUNITY CHALLENGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Featured Jharkhand Challenges</h3>
            <p className="text-xs text-slate-500">Real problems awaiting or actively undergoing technical interventions</p>
          </div>
          <Link
            to="/challenges"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            Explore All 24 Districts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredChallenges.map((ch) => (
            <div
              key={ch.id}
              onClick={() => navigate(`/challenges/${ch.id}`)}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    {ch.category}
                  </span>
                  <StatusBadge status={ch.status} />
                </div>

                <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug line-clamp-2">
                  {ch.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {ch.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {ch.district} {ch.village ? `• ${ch.village}` : ''}
                  </span>
                  <span>{ch.affected_population?.toLocaleString()} affected</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <PriorityBadge
                  tier={ch.priority_tier}
                  score={ch.priority_score}
                  isSafetyOverride={ch.is_safety_override}
                />
                <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
                  View Project →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. ALL 8 STAKEHOLDER WORKSPACES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-wider">Multidisciplinary Collaboration</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Dedicated Workspaces for All 8 Stakeholders
          </h3>
          <p className="text-xs text-slate-600">
            Click any persona to immediately explore their customized dashboard and permissions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { role: 'citizen', label: '🧑‍🌾 Citizens & Communities', desc: 'Submit local problems, upload field photos, track progress.', color: 'emerald' },
            { role: 'student', label: '🎒 Students & Teams', desc: 'Form multidisciplinary teams, submit technical proposals, earn awards.', color: 'amber' },
            { role: 'university', label: '🎓 Universities & Researchers', desc: 'List labs & equipment, mentor student teams, apply for grants.', color: 'blue' },
            { role: 'startup', label: '🚀 Startups & Innovators', desc: 'Pitch decks, DPIIT recognition, venture due diligence, pilot requests.', color: 'purple' },
            { role: 'industry', label: '🏭 Companies & Partners', desc: 'Sponsor projects, provide testing labs, offer competitive internships.', color: 'indigo' },
            { role: 'csr', label: '💚 CSR Foundations', desc: 'Section 135 CSR grants, Schedule VII verification, monitor outcomes.', color: 'teal' },
            { role: 'investor', label: '💼 Angel Investors & VCs', desc: 'Discover clean-tech startups, review unit economics, schedule meetings.', color: 'cyan' },
            { role: 'admin', label: '🏛️ Govt Administration', desc: 'AI triage validation, university matching, audit trails, policy KPIs.', color: 'rose' }
          ].map((item) => (
            <div
              key={item.role}
              onClick={async () => {
                await switchDemoRole(item.role);
                navigate(`/${item.role}`);
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer space-y-2 group"
            >
              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {item.label}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
              <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1 pt-1">
                <span>Enter Workspace</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
