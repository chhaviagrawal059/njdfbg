import React from 'react';
import { Award, CheckCircle2, Droplets, HeartPulse, Sprout, Star, MapPin, Users } from 'lucide-react';

export const ImpactReportsPage = () => {
  const impacts = [
    {
      id: 1,
      title: "Tele-Diagnostics for Maternal & Infant Health (Chaibasa)",
      district: "West Singhbhum",
      domain: "Healthcare",
      institution: "NIT Jamshedpur & AIIMS Deoghar",
      industry: "Tata Steel CSR Health Mission",
      before: "High-risk pregnancy complications detected after delivery; 14-day delay in medical referral from forested hamlets.",
      after: "100% of high-risk cases identified at Anganwadis within 48 hours; 280 mothers screened with zero maternal mortality during pilot.",
      rating: 5,
      citizenQuote: "The portable diagnostic unit allowed our village Sahiyas to test blood pressure and anemia right in our hamlet. 14 critical mothers received emergency hospital care.",
      citizenName: "Soma Munda (Panchayat Health Volunteer)",
      metrics: [
        { label: "Mothers Screened", val: "280" },
        { label: "Emergency Referrals", val: "14" },
        { label: "Complication Drop", val: "78%" }
      ]
    },
    {
      id: 2,
      title: "Decentralized Fluoride Remediation Unit (Torpa Block)",
      district: "Khunti",
      domain: "Water Resources",
      institution: "BIT Mesra (Environmental Engineering)",
      industry: "Tata Steel Foundation",
      before: "3.8 mg/L toxic fluoride causing skeletal joint deformation and dental fluorosis across 4,200 villagers.",
      after: "Bench prototype achieved 98.2% removal (<0.8 mg/L WHO limit) across 10,000 liters with real-time solar IoT telemetry active.",
      rating: 5,
      citizenQuote: "For 10 years our handpump water tasted like bitter chemicals. The university filter prototype has made the water clean and safe for our school children.",
      citizenName: "Birsa Munda (Gram Vikas Samiti, Dormo)",
      metrics: [
        { label: "Fluoride Reduction", val: "98.2%" },
        { label: "Daily Safe Water", val: "40 LPCD" },
        { label: "Beneficiaries", val: "4,200" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Measurable Societal Outcomes</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900">Verified Project Impact Reports</h2>
        <p className="text-xs text-slate-600 mt-1">
          Evidence-based verification of completed and piloted technological innovations across Jharkhand communities.
        </p>
      </div>

      <div className="space-y-6">
        {impacts.map((imp) => (
          <div key={imp.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800">
                  {imp.domain}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{imp.title}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {imp.district} District
                  </span>
                  <span>• Academic Lead: <b>{imp.institution}</b></span>
                  <span>• Industry Partner: <b>{imp.industry}</b></span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-500 font-bold self-start md:self-auto">
                {'★'.repeat(imp.rating)}
                <span className="text-xs text-slate-700 ml-1">({imp.rating}.0 / 5.0 Verified)</span>
              </div>
            </div>

            {/* Before vs After comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Baseline Condition (Before Intervention)</span>
                <p className="text-xs text-slate-700 leading-relaxed">{imp.before}</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Measured Societal Outcome (After Intervention)</span>
                <p className="text-xs text-slate-700 leading-relaxed">{imp.after}</p>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-3">
              {imp.metrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200">
                  <div className="text-lg font-black text-slate-900">{m.val}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Citizen Testimonial */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs space-y-1.5 italic">
              <p className="text-slate-700">"{imp.citizenQuote}"</p>
              <div className="text-[11px] text-slate-500 font-bold not-italic">
                — {imp.citizenName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
