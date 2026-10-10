import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, MapPin,
  Building, Coins, Award, FileText, ChevronRight, Activity,
  ShieldCheck, RefreshCw, Layers, Check, ExternalLink
} from 'lucide-react';

const STEPS = [
  {
    step: 1,
    title: "1. Citizen Problem Submission",
    actor: "Citizen: Soma Munda (Gram Vikas Samiti, Khunti)",
    role: "citizen",
    short: "Problem Reported"
  },
  {
    step: 2,
    title: "2. AI Categorization & Duplicate Check",
    actor: "Autonomous AI Engine (Pure-Python NLP & Haversine Proximity)",
    role: "admin",
    short: "AI Triage"
  },
  {
    step: 3,
    title: "3. Institutional & Expert Matching",
    actor: "AI University Matcher & Govt Admin Approval",
    role: "admin",
    short: "University Match"
  },
  {
    step: 4,
    title: "4. Multidisciplinary Technical Proposal",
    actor: "Student Team (Amit Soren) & Faculty Mentor (Dr. Ananya Roy, BIT Mesra)",
    role: "student",
    short: "Proposal & Budget"
  },
  {
    step: 5,
    title: "5. Funder Discovery & Evaluation",
    actor: "Funder: Sanjay Singhal (Tata Steel CSR) & State Council",
    role: "csr",
    short: "Funder Discovery"
  },
  {
    step: 6,
    title: "6. Grant Approval & Milestones Tranche Release",
    actor: "Tata Steel Foundation & State Innovation Council",
    role: "industry",
    short: "Funding Sanctioned"
  },
  {
    step: 7,
    title: "7. Prototype Development & Rural IoT Field Pilot",
    actor: "Student & Researcher Team in Dormo Village, Khunti",
    role: "university",
    short: "Field Prototyping"
  },
  {
    step: 8,
    title: "8. Community Verification & Verifiable Certificate",
    actor: "Gram Sabha Community + Govt Certification Council",
    role: "admin",
    short: "Verified Impact & Reward"
  }
];

export const WorkflowDemoPage = () => {
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleRoleSwitch = async (role, destination) => {
    try {
      await switchDemoRole(role);
      navigate(destination);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-blue-800">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Jharkhand State Innovation Flagship Demonstration Case</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            “Affordable drinking-water quality monitoring for rural communities in Jharkhand”
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Follow the complete real-world innovation journey from a grassroots contamination complaint in Khunti district
            to an AI-triaged technical proposal, ₹1,80,000 co-funded grant, village telemetry deployment, and blockchain-backed certificate.
          </p>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`flex-1 p-2 rounded-xl text-left border transition-all ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCompleted ? "✓" : s.step}
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                    {s.short}
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 line-clamp-1">
                  {s.actor.split(':')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Detailed Interactive View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Step Header */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Stage {currentStep} of 8 In Innovation Lifecycle
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {STEPS[currentStep - 1].title}
            </h2>
            <div className="text-xs text-slate-300">
              Primary Stakeholder: <b className="text-teal-300">{STEPS[currentStep - 1].actor}</b>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRoleSwitch(STEPS[currentStep - 1].role, `/${STEPS[currentStep - 1].role}`)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Switch to this Persona & Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: CITIZEN SUBMISSION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    High Urgency • Water Contamination Hazard
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">📍 Dormo Village, Torpa Block, Khunti</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Fluoride & Arsenic Contamination in Borewell Drinking Water
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Over 18 government handpumps across Dormo and adjoining hamlets in Torpa block discharge water
                  with fluoride levels exceeding 3.8 mg/L (safe limit: 1.0 mg/L) and traces of arsenic. Over 4,200 villagers
                  suffer from dental enamel decay, skeletal pain, and joint stiffness. Low-cost water quality telemetry and filtration needed.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Affected Citizens:</span>
                    <div className="font-bold text-slate-800">4,200 Persons</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">GPS Coordinates:</span>
                    <div className="font-bold text-slate-800 font-mono">22.9734° N, 85.2589° E</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Initial Urgency:</span>
                    <div className="font-bold text-rose-700">Immediate Hazard</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Evidence Uploaded:</span>
                    <div className="font-bold text-blue-700">3 Handpump Photos + Test Sheet</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AI TRIAGE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">
                    Feature 1: Auto Categorization
                  </div>
                  <div className="text-2xl font-black text-blue-950">Water Resources</div>
                  <div className="text-xs font-bold text-blue-700">Confidence Score: 96%</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Triggered keywords: <i>fluoride, borewell, handpump, drinking water, arsenic</i>.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
                    Feature 2: Duplicate Detection
                  </div>
                  <div className="text-2xl font-black text-amber-950">Near-Match Checked</div>
                  <div className="text-xs font-bold text-amber-700">Cosine Similarity: 42% (Unique Problem)</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Compared against Torpa borewell database. Distinct water vein; flagged as unique report.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-rose-800 tracking-wider">
                    Feature 3: Safety Override Prioritizer
                  </div>
                  <div className="text-2xl font-black text-rose-950">Critical (92/100)</div>
                  <div className="text-xs font-bold text-rose-700">Emergency Safety Rule Fired</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Rule triggered: Chemical drinking water contamination affecting &gt; 4,000 citizens overrides standard feasibility queue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UNIVERSITY MATCHING */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Feature 4: Top 3 Recommended Universities by AI Capability Index:
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 space-y-2 relative">
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
                    Rank #1 (Match: 94%)
                  </span>
                  <div className="text-sm font-bold text-slate-900">BIT Mesra, Ranchi</div>
                  <div className="text-xs text-slate-600">
                    <b>Labs:</b> Environmental Chemistry & Adsorption Lab, Rural IoT Microgrid Center
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <b>Capacity:</b> Active Load: 2/10 • Distance: 44 km from Khunti
                  </div>
                  <div className="pt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold inline-block">
                      ✓ Assignment Approved by State Admin
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Rank #2 (Match: 88%)
                  </span>
                  <div className="text-sm font-bold text-slate-900">IIT (ISM) Dhanbad</div>
                  <div className="text-xs text-slate-600">
                    <b>Labs:</b> Centre for Water Quality & Advanced Spectrometry
                  </div>
                  <div className="text-[11px] text-slate-500">Distance: 172 km from Khunti</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Rank #3 (Match: 76%)
                  </span>
                  <div className="text-sm font-bold text-slate-900">NIT Jamshedpur</div>
                  <div className="text-xs text-slate-600">
                    <b>Labs:</b> Biomedical Instrumentation & Clean Power Lab
                  </div>
                  <div className="text-[11px] text-slate-500">Distance: 118 km from Khunti</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROPOSAL SUBMITTED */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Technical Proposal: Decentralized Adsorbent Fluoride & Arsenic Remediation Unit
                    </h3>
                    <div className="text-slate-500 mt-0.5">
                      Submitted by: <b>Amit Soren</b> (Student Lead) & <b>Dr. Ananya Roy</b> (PI, BIT Mesra)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">₹1,80,000</div>
                    <div className="text-slate-500 text-[11px]">Proposed Budget (6 Months)</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-700">Technical Approach:</span>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      1. Multi-stage filtration column: pre-sedimentation, activated alumina adsorption, and coconut shell GAC.
                      2. Low-cost IoT sensor module measuring pH, TDS, fluoride ion concentration, and cumulative discharge volume.
                      3. Solar micro-inverter telemetry transmitting daily water safety logs to the district portal and village digital kiosk.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700">Multidisciplinary Student Team:</span>
                    <div className="mt-1 space-y-1 text-slate-600">
                      <div>• <b>Amit Soren</b> (B.Tech IoT) — Telemetry & Edge Embedded C</div>
                      <div>• <b>Neha Kumari</b> (B.Tech Chemical) — Adsorption Column & Activated Alumina</div>
                      <div>• <b>Rahul Hansda</b> (M.Tech Env Engg) — Water Testing & Field Immersion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FUNDER DISCOVERY */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                    Sponsor Discovery: Section 135 CSR + State Council Matching Grant
                  </span>
                  <span className="text-xs text-slate-500">Discovered via Funding Marketplace</span>
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Tata Steel Foundation CSR & State Innovation Council Joint Review
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tata Steel CSR team in Jamshedpur discovers the project on the Jharkhand Societal Innovation Funding Marketplace.
                  With 4,200 tribal villagers at acute risk of skeletal fluorosis in Torpa block, the project aligns with Schedule VII priorities.
                  A co-funding structure is approved: Tata Steel CSR pledges ₹1,00,000 and the State Innovation Council pledges ₹80,000 matching funds.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Requested Ask:</span>
                    <div className="text-base font-black text-slate-900">₹1,80,000</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-700 font-bold uppercase">Tata Steel CSR Pledge:</span>
                    <div className="text-base font-black text-amber-700">₹1,00,000</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <span className="text-[10px] text-blue-700 font-bold uppercase">State Innovation Pledge:</span>
                    <div className="text-base font-black text-blue-700">₹80,000</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase">Total Pledged:</span>
                    <div className="text-base font-black text-emerald-700">₹1,80,000 (100%)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: GRANT SANCTION & TRANCHE RELEASE */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Official Milestone Tranches & Disbursement Status:
                  </h3>
                  <span className="font-bold text-emerald-700">
                    Tranche 1 Disbursed: ₹90,000 released
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-900">Tranche 1 (₹50,000) — Electrochemical Sensor Calibration</div>
                      <div className="text-[11px] text-emerald-700">Deliverable: Lab calibration report at BIT Mesra verified by State Inspector</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-black text-[10px]">
                      DISBURSED
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-900">Tranche 2 (₹40,000) — Solar Enclosure & LoRa Telemetry Unit</div>
                      <div className="text-[11px] text-emerald-700">Deliverable: Weatherproof prototypes constructed with battery telemetry</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-black text-[10px]">
                      DISBURSED
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-blue-900">Tranche 3 (₹50,000) — Handpump Installation in Dormo Village</div>
                      <div className="text-[11px] text-blue-700">Deliverable: Field pilot deployment + Panchayat live warning LED siren</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-black text-[10px]">
                      APPROVED (Pending Release)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-700">Tranche 4 (₹40,000) — Final Outcome Verification & Training</div>
                      <div className="text-[11px] text-slate-500">Deliverable: Community feedback survey + Gram Sabha signoff</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                      PENDING DELIVERABLE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PROTOTYPING & FIELD TESTING */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">
                    Live Telemetry from Dormo Village Handpump #4
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    IoT Telemetry Active
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Raw Borewell Fluoride:</span>
                    <div className="text-lg font-black text-rose-600">3.82 mg/L</div>
                    <div className="text-[10px] text-rose-500">Exceeds 1.0 safe limit</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Post-Filter Output:</span>
                    <div className="text-lg font-black text-emerald-600">0.42 mg/L</div>
                    <div className="text-[10px] text-emerald-600">Safe WHO Standard ✓</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Water Purified:</span>
                    <div className="text-lg font-black text-slate-900">2,840 Liters</div>
                    <div className="text-[10px] text-slate-500">Serving 145 households</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Battery & Solar Status:</span>
                    <div className="text-lg font-black text-slate-900">98% Charge</div>
                    <div className="text-[10px] text-slate-500">Autonomous operation</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: VERIFIED IMPACT & REWARD */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px]">
                      COMPLETED & VERIFIED BY GRAM SABHA
                    </span>
                    <h3 className="text-lg font-black text-emerald-950 mt-1">
                      Societal Impact Outcome: 4,200 Citizens Protected from Skeletal Fluorosis
                    </h3>
                  </div>
                  <Link
                    to="/rewards"
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs"
                  >
                    View Official Certificate
                  </Link>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  Community feedback verified with 5/5 stars by Soma Munda (Gram Vikas Samiti).
                  Student lead Amit Soren and Faculty Mentor Dr. Ananya Roy are awarded official digital certificates
                  by the State Innovation Council. In parallel, startup JalDrishti CleanTech Innovations (founded by Priya Tirkey)
                  receives a venture due diligence meeting request from Chotanagpur Venture Fund to commercialize the sensor unit across 1,000 Jharkhand schools!
                </p>

                <div className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-800">
                      Certificate ID: JH-INNOV-2026-WTR-8821
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Issued to Amit Soren • Verified by Government of Jharkhand Blockchain Registry
                    </div>
                  </div>
                  <Link
                    to="/rewards"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    Verify in Public Registry <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentStep === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous Step
            </button>

            <div className="text-xs text-slate-400 font-semibold hidden sm:block">
              Click any step above to jump directly
            </div>

            <button
              onClick={() => setCurrentStep(prev => Math.min(8, prev + 1))}
              disabled={currentStep === 8}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentStep === 8
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-blue-900 text-white hover:bg-blue-800 shadow-xs'
              }`}
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
