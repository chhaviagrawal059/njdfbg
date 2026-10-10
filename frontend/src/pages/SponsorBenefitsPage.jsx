import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Landmark, HeartHandshake, TrendingUp, ShieldAlert,
  CheckCircle2, ArrowRight, FileCheck, Users, Eye, Lightbulb,
  Sparkles, Award, Scale
} from 'lucide-react';

export const SponsorBenefitsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-700" />
          <span>Funder & Sponsor Value Proposition</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Why Funders & Industry Leaders Invest in Jharkhand
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          From CSR foundations ensuring Section 135 compliance to venture investors discovering DPIIT-recognized clean-tech startups,
          see what each stakeholder gains through transparent, milestone-backed societal innovation.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 1. Companies & Industry Partners */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-indigo-700 tracking-wider">
                Industrial Ecosystem
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Companies & Industry Partners
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Collaborate directly with Jharkhand's premier technical institutions (BIT Mesra, NIT Jamshedpur, IIT ISM) to resolve high-friction operational challenges.
          </p>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Targeted Problem Solving:</b> Access customized technological solutions for regional manufacturing, clean energy, and supply chain friction.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Pre-Vetted Talent Pipeline:</b> Discover outstanding student engineers and multidisciplinary teams through verified milestone demonstrations.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Prototyping & Pilots:</b> Rapid field immersion testing of new technologies before capital-intensive deployment.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Live Telemetry & Demos:</b> Access real-time IoT dashboards and milestone progress reports without overhead.</span>
            </div>
          </div>
        </div>

        {/* 2. Government Departments & Funding Agencies */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-rose-700 tracking-wider">
                State Administration
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Government Departments & Agencies
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Transform public grievances into scientifically backed technological solutions across all 24 Jharkhand districts with zero leakages.
          </p>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Public-Service Problem Solvers:</b> High-feasibility innovations addressing contaminated water, tribal post-harvest loss, and remote health access.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Transparent Grant Tracking:</b> Complete audit trail of grant approval and milestone-based tranche disbursements.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Measurable Community Impact:</b> Quantitative outcome indicators verified by local panchayats and citizen feedback.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>District Performance Analytics:</b> Real-time GIS heatmaps comparing innovation velocity across Santhal Pargana, Kolhan, and Chotanagpur.</span>
            </div>
          </div>
        </div>

        {/* 3. CSR Foundations & Philanthropic Trusts */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-teal-700 tracking-wider">
                Section 135 Compliant
              </span>
              <h2 className="text-lg font-black text-slate-900">
                CSR Foundations & Philanthropy
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Deploy statutory corporate social responsibility capital directly into verified grassroots projects with complete audit readiness.
          </p>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Verified Beneficiary Reach:</b> Direct verification of rural families impacted (e.g. 4,200 villagers protected from fluorosis in Dormo).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Evidence of Expenditure:</b> Itemized expense sheets, third-party laboratory receipts, and tranche release logs.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Schedule VII Alignment:</b> Turnkey project alignment with national priorities: safe drinking water, agro-processing, and clean energy.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>State Level Visibility:</b> Co-branding on official state portal and recognition in annual Government of Jharkhand Innovation Reports.</span>
            </div>
          </div>
        </div>

        {/* 4. Angel Investors & Venture Capital */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-cyan-700 tracking-wider">
                Venture Ecosystem
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Angel Investors & Venture Funds
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Access proprietary deal flow of academic spin-outs and DPIIT-recognized startups addressing mass-market societal problems.
          </p>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Field-Tested Business Models:</b> Startups whose hardware and software solutions have already completed subsidized field pilots.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Direct Founder Meetings:</b> Request structured due diligence meetings and review pitch decks with one click.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Intellectual Property Protection:</b> Clear visibility into provisional patent filings, university licensing terms, and technology readiness levels.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Attractive Unit Economics:</b> Indigenous hardware innovations engineered for frugal Indian rural markets with high gross margins.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer Box */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Scale className="w-4 h-4 text-slate-700" />
          <span>Statutory Compliance & Regulatory Notice</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          The Jharkhand Innovation Portal facilitates discovery and administrative coordination between researchers, funders, and citizens.
          <b> No guaranteed profits, returns on investment, employment appointments, tax exemptions, or guaranteed project successes are promised or implied.</b>
          All legal, financial, Section 135 CSR eligibility, and Intellectual Property agreements must undergo formal statutory due diligence
          by respective legal counsels prior to binding financial transactions.
        </p>
      </div>

      {/* Call to Action */}
      <div className="text-center py-6 space-y-4">
        <h3 className="text-xl font-black text-slate-900">
          Ready to Back Groundbreaking Societal Innovation in Jharkhand?
        </h3>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/funding"
            className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <span>Explore Funding Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/challenges"
            className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition-all"
          >
            Browse Validated Challenges
          </Link>
        </div>
      </div>
    </div>
  );
};
