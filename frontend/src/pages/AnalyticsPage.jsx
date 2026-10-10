import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { JharkhandMap } from '../components/map/JharkhandMap';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  BarChart3, Download, MapPin, Building, CheckCircle2,
  RefreshCw, Award, Activity
} from 'lucide-react';

const COLORS = ['#2563eb', '#0d9488', '#059669', '#d97706', '#7c3aed', '#db2777', '#0284c7'];

export const AnalyticsPage = () => {
  const [overview, setOverview] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [stagesData, setStagesData] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllAnalytics = async () => {
    setLoading(true);
    try {
      const [stats, dists, cats, stgs, insts, chList] = await Promise.all([
        api.analytics.getOverview(),
        api.analytics.getDistricts(),
        api.analytics.getCategories(),
        api.analytics.getStages(),
        api.analytics.getInstitutions(),
        api.challenges.list()
      ]);
      setOverview(stats);
      setDistrictData(dists.filter(d => d.count > 0));
      setCategoryData(cats);
      setStagesData(stgs);
      setInstitutions(insts);
      setChallenges(chList);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-blue-700" />
            <span>State Innovation Analytics & GIS Intelligence</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            Jharkhand Societal Innovation Analytics
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time database analytics covering civic challenges, university participation, and verified field outcomes across 24 districts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAnalytics}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <a
            href={api.analytics.exportCsvUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export Official CSV Report
          </a>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold">Total Reported</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{overview.total_challenges}</div>
            <div className="text-[11px] text-slate-400 mt-1">Community problems logged</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-amber-700 font-semibold">Under Evaluation</div>
            <div className="text-3xl font-black text-amber-600 mt-1">{overview.awaiting_validation}</div>
            <div className="text-[11px] text-slate-400 mt-1">In triage queue</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-teal-700 font-semibold">Active Prototypes & Pilots</div>
            <div className="text-3xl font-black text-teal-700 mt-1">{overview.in_progress}</div>
            <div className="text-[11px] text-slate-400 mt-1">With universities & CSR</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-emerald-700 font-semibold">Verified Community Outcomes</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">⭐ {overview.avg_community_rating} / 5.0</div>
            <div className="text-[11px] text-slate-400 mt-1">Based on citizen surveys</div>
          </div>
        </div>
      )}

      {/* District GIS Map Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              Statewide GIS Problem Distribution Map
            </h3>
            <p className="text-xs text-slate-500">Pins colored by priority urgency and emergency safety overrides</p>
          </div>
        </div>
        <JharkhandMap challenges={challenges} height="480px" />
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Domain Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-900">Challenges by Focus Domain</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="category" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Workflow Lifecycle Funnel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-900">10-Stage Lifecycle Progression</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stagesData.filter(s => s.count > 0)} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={45} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* University Participation Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-700" />
          University & Research Institute Engagement
        </h4>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="px-4 py-2.5 text-left">Institution Name</th>
                <th className="px-4 py-2.5 text-left">Classification</th>
                <th className="px-4 py-2.5 text-left">Active Civic Projects</th>
                <th className="px-4 py-2.5 text-left">Proposals Submitted</th>
                <th className="px-4 py-2.5 text-left">Current Load / Max Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutions.map((inst) => (
                <tr key={inst.institution_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900">{inst.institution_name}</td>
                  <td className="px-4 py-3 text-slate-600">{inst.institution_type}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">{inst.active_projects}</td>
                  <td className="px-4 py-3 font-semibold text-teal-700">{inst.proposals_count}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{inst.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
