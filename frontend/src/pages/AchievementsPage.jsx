import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Award, CheckCircle2, MapPin, Users, Sparkles, ChevronRight,
  TrendingUp, ArrowRight, ShieldCheck, Cpu, Droplet, Sun, Zap,
  Gift, HeartHandshake, FileCheck, Layers, BookOpen, Clock,
  Calendar, Quote, X, ExternalLink, ThumbsUp
} from 'lucide-react';

const STORY_MEDIA = {
  1: {
    heroImage: '/images/village-dormo-water.jpg',
    readTime: '4 min read',
    blogTitle: 'How 4 BIT Mesra Students Brought Safe Drinking Water to Dormo Village',
    subtitle: 'From toxic fluoride well water to continuous IoT telemetry: The story of how student innovators solved a 10-year public health crisis in Khunti district.',
    tagline: 'Water Quality & Public Health',
    author: 'Amit Soren (Lead Innovator, BIT Mesra)',
    authorRole: 'Final Year B.Tech, Chemical Engineering',
    publishedDate: 'October 06, 2026'
  },
  2: {
    heroImage: '/images/village-gumla-solar.jpg',
    readTime: '3 min read',
    blogTitle: 'Saving the Forest Gold: Solar Dehydrators Double Income for Mahua Farmers',
    subtitle: 'Tribal harvesters in Gumla were losing 40% of their produce to spoilage. Students engineered a solar greenhouse drying system that preserved high-grade quality.',
    tagline: 'Agro-Tech & Tribal Livelihoods',
    author: 'Priya Tirkey (Birsa Agricultural University)',
    authorRole: 'Post-Harvest Engineering Research Fellow',
    publishedDate: 'September 22, 2026'
  },
  3: {
    heroImage: '/images/village-bokaro-health.jpg',
    readTime: '5 min read',
    blogTitle: 'Zero Spoilage: Solar Cold-Chain Keeps Vaccines Alive Deep in Saranda Forest',
    subtitle: 'Without reliable power, healthcare sub-centers in West Singhbhum struggled to maintain child immunization. NIT Jamshedpur engineers stepped in with smart solar cooling.',
    tagline: 'Rural Healthcare & Solar Tech',
    author: 'Rahul Mahto (NIT Jamshedpur)',
    authorRole: 'M.Tech Energy Systems',
    publishedDate: 'August 14, 2026'
  }
};

export const AchievementsPage = () => {
  const { t, isHindi } = useLanguage();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingStory, setReadingStory] = useState(null); // Story modal state

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await api.rewards.getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const districts = ['all', ...new Set(achievements.map(a => a.district).filter(Boolean))];

  const filteredAchievements = achievements.filter(a => {
    const matchesDistrict = selectedDistrict === 'all' || a.district === selectedDistrict;
    const matchesSearch = !searchQuery.trim() ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.village?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.district?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const featuredStory = filteredAchievements[0];
  const otherStories = filteredAchievements.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* 1. Magazine Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-blue-900/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Village Impact Chronicles • Ground-Level Stories</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Stories of Real Community Change Across Jharkhand
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Read how engineering students and university researchers stepped into rural villages, solved real crises reported by citizens, and earned government honors and company-sponsored goodies.
            </p>

            {/* Quick KPI stats */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800">
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">3</div>
                <div className="text-xs text-slate-300 font-medium">Villages Transformed</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-teal-300">3,600+</div>
                <div className="text-xs text-slate-300 font-medium">Villagers Benefited</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">2,450</div>
                <div className="text-xs text-slate-300 font-medium">Points Awarded</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-blue-300">100%</div>
                <div className="text-xs text-slate-300 font-medium">Field Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Reader Toolbar & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
              Browse District Stories:
            </span>
            {districts.map(dist => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDistrict === dist
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dist === 'all' ? 'All Stories' : `${dist} District`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/rewards"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Redeem Points for Goodies</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 3. Blog Content Area */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-slate-500 text-sm font-medium">Loading inspiring stories from the field...</div>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No stories match your filter</h3>
            <p className="text-xs text-slate-500">Try selecting "All Stories" to see all published impact case studies.</p>
          </div>
        ) : (
          <div className="space-y-10">

            {/* A. FEATURED LEAD ARTICLE (Wide Editorial Hero Layout) */}
            {featuredStory && (() => {
              const meta = STORY_MEDIA[featuredStory.id] || STORY_MEDIA[1];
              return (
                <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Hero Image */}
                    <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-slate-900">
                      <img
                        src={meta.heroImage}
                        alt={meta.blogTitle}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-blue-900/90 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
                          Featured Story
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold backdrop-blur-md">
                          📍 {featuredStory.village}, {featuredStory.district}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white text-xs font-semibold flex items-center gap-2 drop-shadow">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{meta.readTime}</span>
                      </div>
                    </div>

                    {/* Editorial Content */}
                    <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                          <span className="text-blue-700 font-bold uppercase">{meta.tagline}</span>
                          <span>•</span>
                          <span>{meta.publishedDate}</span>
                        </div>

                        <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug hover:text-blue-900 transition-colors">
                          {meta.blogTitle}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {meta.subtitle}
                        </p>

                        {/* Pull-quote snippet */}
                        {featuredStory.quote && (
                          <div className="bg-amber-50/70 border-l-4 border-amber-500 p-3.5 rounded-r-2xl text-xs text-slate-700 italic space-y-1">
                            <Quote className="w-4 h-4 text-amber-500 opacity-60 inline mr-1" />
                            <span>"{featuredStory.quote}"</span>
                            <div className="text-[11px] font-bold text-slate-800 not-italic">
                              — {featuredStory.problem_statement?.reported_by || 'Village Resident'}
                            </div>
                          </div>
                        )}

                        {/* Impact Before vs After Pill comparison */}
                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                          <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                            <div className="text-[10px] font-bold uppercase text-rose-700">Before Intervention</div>
                            <div className="text-xs font-semibold text-slate-800 mt-0.5 line-clamp-1">
                              {featuredStory.impact_metrics?.before || 'High contamination'}
                            </div>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                            <div className="text-[10px] font-bold uppercase text-emerald-700">Current Result</div>
                            <div className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                              {featuredStory.impact_metrics?.after || '100% Safe Outcomes'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Byline & Actions */}
                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs">
                          <div className="font-bold text-slate-900">{featuredStory.engineering_solution?.team_name}</div>
                          <div className="text-[11px] text-slate-500">
                            {featuredStory.engineering_solution?.institution}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-xl">
                            +{featuredStory.rewards_and_goodies?.points_earned || 2450} pts
                          </span>
                          <button
                            onClick={() => setReadingStory(featuredStory)}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>Read Full Story</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })()}

            {/* B. REMAINING VILLAGE STORIES (Magazine Grid Format) */}
            {otherStories.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>More Stories from the Field</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherStories.map((item) => {
                    const meta = STORY_MEDIA[item.id] || STORY_MEDIA[2];

                    return (
                      <article
                        key={item.id}
                        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image Thumbnail */}
                          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                            <img
                              src={meta.heroImage}
                              alt={meta.blogTitle}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                                📍 {item.village}, {item.district}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 text-white text-[11px] font-semibold flex items-center gap-1.5 drop-shadow">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>{meta.readTime}</span>
                            </div>
                          </div>

                          {/* Story Body */}
                          <div className="p-6 space-y-3">
                            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                              {meta.tagline} • {meta.publishedDate}
                            </div>

                            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                              {meta.blogTitle}
                            </h4>

                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {meta.subtitle}
                            </p>

                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                              <div className="text-[11px] text-slate-500">
                                <b>Team:</b> {item.engineering_solution?.team_name} ({item.engineering_solution?.institution})
                              </div>
                              <div className="text-[11px] text-slate-500">
                                <b>Impact:</b> {item.impact_metrics?.beneficiaries} villagers benefited
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-3">
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            +{item.rewards_and_goodies?.points_earned || 2000} pts
                          </span>

                          <button
                            onClick={() => setReadingStory(item)}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Read Article</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. READ FULL STORY MODAL (Editorial Long-Form Article) */}
        {readingStory && (() => {
          const meta = STORY_MEDIA[readingStory.id] || STORY_MEDIA[1];

          return (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
                {/* Article Header Image */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
                  <img
                    src={meta.heroImage}
                    alt={meta.blogTitle}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/30 pointer-events-none" />

                  <button
                    onClick={() => setReadingStory(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                      <span className="bg-blue-600 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                        {meta.tagline}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px]">
                        📍 {readingStory.village}, {readingStory.district} District
                      </span>
                      <span className="text-slate-300 text-xs">
                        {meta.readTime} • {meta.publishedDate}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                      {meta.blogTitle}
                    </h2>
                  </div>
                </div>

                {/* Article Prose Content */}
                <div className="p-6 sm:p-10 space-y-8 text-slate-800">
                  {/* Byline */}
                  <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-blue-900 text-white font-black flex items-center justify-center text-sm shadow-xs">
                      {readingStory.engineering_solution?.lead?.slice(0, 2) || 'AS'}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{meta.author}</div>
                      <div className="text-xs text-slate-500">{meta.authorRole} • {readingStory.engineering_solution?.institution}</div>
                    </div>
                  </div>

                  {/* Chapter 1: The Problem */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      <span>The Ground Reality: What the Village Faced</span>
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {readingStory.problem_statement?.crisis}
                    </p>
                    <div className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      Reported by {readingStory.problem_statement?.reported_by} • Verified by Local Panchayat & Ground Worker
                    </div>
                  </div>

                  {/* Chapter 2: The Student Intervention */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span>How the Team Engineered the Solution</span>
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {readingStory.engineering_solution?.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {readingStory.engineering_solution?.technologies?.map((tech, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-900 font-semibold px-2.5 py-1 rounded-lg text-xs border border-blue-200">
                          #{tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Villager Quote Box */}
                  {readingStory.quote && (
                    <div className="bg-amber-50/80 border-l-4 border-amber-500 p-5 rounded-r-2xl space-y-2">
                      <Quote className="w-6 h-6 text-amber-500 opacity-50" />
                      <p className="text-sm font-medium italic text-slate-800 leading-relaxed">
                        "{readingStory.quote}"
                      </p>
                      <div className="text-xs font-bold text-amber-900">
                        — {readingStory.problem_statement?.reported_by || 'Resident Voice'}, {readingStory.village}
                      </div>
                    </div>
                  )}

                  {/* Chapter 3: Verified Measurable Impact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Measurable Results on the Ground</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-1">
                        <div className="text-xs font-bold uppercase text-rose-800">Deficit Before Project:</div>
                        <div className="text-xs text-slate-700 leading-relaxed">
                          {readingStory.impact_metrics?.before}
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1">
                        <div className="text-xs font-bold uppercase text-emerald-800">Verified Outcome Today:</div>
                        <div className="text-xs text-slate-800 font-medium leading-relaxed">
                          {readingStory.impact_metrics?.after}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl text-xs text-slate-600 flex items-center justify-between border border-slate-200">
                      <span>Total Villagers Directly Impacted:</span>
                      <b className="text-slate-900 text-sm">{readingStory.impact_metrics?.beneficiaries?.toLocaleString()} people</b>
                    </div>
                  </div>

                  {/* Chapter 4: Student Rewards & Corporate Goodies Won */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-black text-amber-900">
                        <Gift className="w-5 h-5 text-amber-700" />
                        <span>Honors & Rewards Awarded to the Team</span>
                      </div>
                      <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                        +{readingStory.rewards_and_goodies?.points_earned || 2450} Points
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-800">
                      <div className="bg-white/90 p-3 rounded-xl border border-amber-200 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span className="text-slate-500 font-medium">Cash Prize: </span>
                          <b className="text-emerald-700 font-bold">{readingStory.rewards_and_goodies?.cash_prize}</b>
                        </div>
                      </div>

                      <div className="bg-white/90 p-3 rounded-xl border border-amber-200 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <span className="text-slate-500 font-medium">Physical Goodie: </span>
                          <b className="text-teal-900 font-bold">{readingStory.rewards_and_goodies?.corporate_goodie}</b>
                        </div>
                      </div>

                      <div className="bg-white/90 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-500 font-medium">State Citations: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {readingStory.rewards_and_goodies?.certificates?.map((cert, cIdx) => (
                              <span key={cIdx} className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[10px] font-bold">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <Link
                        to="/rewards"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-colors"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Visit Goodies Store to Redeem Your Points</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Close Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setReadingStory(null)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Close Story
                    </button>
                    <Link
                      to="/challenges"
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <span>Explore Other Problems Awaiting Solutions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
