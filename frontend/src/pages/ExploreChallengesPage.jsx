import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { JharkhandMap } from '../components/map/JharkhandMap';
import { JHARKHAND_DISTRICTS } from './SubmitProblemPage';
import {
  Search, Filter, Map, LayoutGrid, MapPin, Users,
  ArrowUpDown, ExternalLink, RefreshCw
} from 'lucide-react';

const CATEGORIES = [
  "All", "Water Resources", "Healthcare", "Agriculture", "Education",
  "Environment", "Renewable Energy", "Rural Livelihoods", "Accessibility",
  "Urban Infrastructure", "Public Administration"
];

const STATUSES = [
  "All", "Submitted", "Under Review", "Validated", "Assigned to University",
  "In Progress", "Prototype Testing", "Pilot/Implementation", "Outcome Verification", "Completed"
];

export const ExploreChallengesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await api.challenges.list({
        category: selectedCategory,
        district: selectedDistrict,
        status: selectedStatus,
        search: searchTerm
      });
      setChallenges(data);
    } catch (err) {
      console.error("Error loading challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [selectedCategory, selectedDistrict, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadChallenges();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Explore Jharkhand Societal Challenges
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Browse citizen-reported problems across all 24 districts, track ongoing prototypes, and discover research collaboration opportunities.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'map'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Jharkhand GIS Map
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, village, or technology..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Focus Domain</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
            >
              <option value="All">All Districts (24)</option>
              {JHARKHAND_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Lifecycle Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area: Grid View vs GIS Map View */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <JharkhandMap
            challenges={challenges}
            selectedDistrict={selectedDistrict !== 'All' ? selectedDistrict : null}
            onSelectChallenge={(id) => navigate(`/challenges/${id}`)}
            height="580px"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing <b>{challenges.length}</b> challenges matching criteria</span>
            <button onClick={loadChallenges} className="flex items-center gap-1 hover:text-slate-800">
              <RefreshCw className="w-3 h-3" /> Refresh List
            </button>
          </div>

          {challenges.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Filter className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800">No challenges found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No issues match your current filters. Try resetting the filters or submit a new problem.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => navigate(`/challenges/${ch.id}`)}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800">
                        {ch.category}
                      </span>
                      <StatusBadge status={ch.status} />
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {ch.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {ch.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ch.district} {ch.village ? `• ${ch.village}` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {ch.affected_population?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <PriorityBadge
                      tier={ch.priority_tier}
                      score={ch.priority_score}
                      isSafetyOverride={ch.is_safety_override}
                    />

                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                      Details <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
