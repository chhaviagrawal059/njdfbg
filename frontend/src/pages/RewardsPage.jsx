import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Award, ShieldCheck, Briefcase, Sparkles, CheckCircle2,
  Search, ExternalLink, Printer, Download, Users, Lightbulb,
  Building2, GraduationCap, X, Check, Gift, Coins, Package,
  Clock, ArrowRight, Tag, Truck, Copy, CheckCheck, MapPin, Filter
} from 'lucide-react';

const GOODIE_IMAGE_MAP = {
  'goodie-1': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  'goodie-2': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'goodie-3': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
  'goodie-4': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
  'goodie-5': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
  'goodie-6': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  'goodie-7': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
  'goodie-8': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
};

export const RewardsPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('goodies'); // Default to goodies store!
  const [certificates, setCertificates] = useState([]);
  const [opportunities, setOpportunities] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Impact Points & Corporate Goodies Store State
  const [pointsData, setPointsData] = useState(null);
  const [goodiesList, setGoodiesList] = useState([]);
  const [selectedGoodie, setSelectedGoodie] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState('campus'); // 'campus' | 'courier'
  const [shippingAddress, setShippingAddress] = useState('BIT Mesra Boys Hostel 7, Room 304, Ranchi, Jharkhand - 835215');
  const [redeemSuccessModal, setRedeemSuccessModal] = useState(null);
  const [redeeming, setRedeming] = useState(false);
  const [goodiesCategory, setGoodiesCategory] = useState('all'); // 'all' | 'affordable' | 'hardware' | 'apparel' | 'vouchers'
  const [goodiesSearch, setGoodiesSearch] = useState('');
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  // Verification Search
  const [searchCertId, setSearchCertId] = useState('');
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Certificate Modal Preview
  const [previewCert, setPreviewCert] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [certs, opps, port, pts, gds] = await Promise.all([
          api.rewards.getCertificates(),
          api.rewards.getOpportunities(),
          api.rewards.getPortfolio(user?.id || 8), // default to Amit Soren (id 8) if unauthed
          api.rewards.getPoints(user?.id || 8),
          api.rewards.getGoodies()
        ]);
        setCertificates(certs);
        setOpportunities(opps);
        setPortfolio(port);
        setPointsData(pts);
        const enriched = (gds || []).map(item => ({
          ...item,
          image_url: item.image_url || GOODIE_IMAGE_MAP[item.id] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
        }));
        setGoodiesList(enriched);
      } catch (err) {
        console.error("Error loading rewards:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleCopyVoucher = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  const handleRedeemSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGoodie) return;
    setRedeming(true);
    const finalAddress = deliveryOption === 'campus'
      ? 'BIT Mesra Innovation Cell & Incubation Hub, Ranchi - 835215 (Self-Pickup)'
      : shippingAddress;

    try {
      const res = await api.rewards.redeemGoodie({
        goodie_id: selectedGoodie.id,
        user_id: user?.id || 8,
        shipping_address: finalAddress
      });
      // Update points state
      setPointsData(prev => ({
        ...prev,
        points_balance: res.remaining_points,
        points_redeemed: (prev?.points_redeemed || 0) + res.points_spent,
        recent_activity: [
          {
            title: `Redeemed ${selectedGoodie.title}`,
            type: "spent",
            points: -res.points_spent,
            date: "Just now",
            proof: `Voucher: ${res.voucher_code}`
          },
          ...(prev?.recent_activity || [])
        ]
      }));
      setRedeemSuccessModal({
        ...res,
        image_url: selectedGoodie.image_url,
        delivery_type: deliveryOption === 'campus' ? 'Campus Innovation Desk (Pickup in 24h)' : 'Courier Dispatch',
        pickup_address: finalAddress
      });
      setSelectedGoodie(null);
    } catch (err) {
      alert("Redemption error: " + (err.message || "Failed to redeem"));
    } finally {
      setRedeming(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchCertId.trim()) return;
    setIsVerifying(true);
    try {
      const res = await api.rewards.verifyCertificate(searchCertId.trim());
      setVerifiedResult(res);
    } catch (err) {
      alert("Verification check failed: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-900/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Opportunities, Recognition & Verifiable Rewards</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Incentivizing Societal Innovation Across Jharkhand
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Gain verified credentials from the Government of Jharkhand, participate in ₹5,00,000 grand challenges,
            access subsidized national laboratories, and earn competitive industry internships.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('goodies')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'goodies'
                ? 'border-amber-500 text-amber-800 bg-amber-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-600" />
            <span className="font-extrabold text-amber-900">🎁 Impact Points & Goodies Store</span>
            {pointsData && (
              <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                {pointsData.points_balance} pts
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'certificates'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Certificates & Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('competitions')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'competitions'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Grand Challenges & Prizes</span>
          </button>

          <button
            onClick={() => setActiveTab('internships')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'internships'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Internships & Mentorship</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'portfolio'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Contributor Portfolios</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'labs'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Lab & Equipment Support</span>
          </button>
        </nav>
      </div>

      {/* TAB 0: IMPACT POINTS & GOODIES BAZAAR */}
      {activeTab === 'goodies' && (() => {
        const userBalance = pointsData?.points_balance ?? 2450;

        const filteredGoodies = goodiesList.filter(item => {
          if (goodiesSearch.trim()) {
            const q = goodiesSearch.toLowerCase();
            const matchTitle = item.title?.toLowerCase().includes(q);
            const matchSponsor = item.sponsor?.toLowerCase().includes(q);
            const matchTag = item.tag?.toLowerCase().includes(q);
            const matchDesc = item.description?.toLowerCase().includes(q);
            if (!matchTitle && !matchSponsor && !matchTag && !matchDesc) return false;
          }

          if (goodiesCategory === 'affordable') {
            return userBalance >= item.points_cost;
          }
          if (goodiesCategory === 'hardware') {
            const tag = (item.tag || '').toLowerCase();
            return tag.includes('hardware') || tag.includes('equipment') || tag.includes('prototyping');
          }
          if (goodiesCategory === 'apparel') {
            const tag = (item.tag || '').toLowerCase();
            return tag.includes('gear') || tag.includes('swag') || tag.includes('apparel');
          }
          if (goodiesCategory === 'vouchers') {
            const tag = (item.tag || '').toLowerCase();
            return tag.includes('career') || tag.includes('research') || tag.includes('academic') || tag.includes('internship');
          }
          return true;
        });

        const affordableCount = goodiesList.filter(g => userBalance >= g.points_cost).length;

        return (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Wallet & Impact Points Balance Bar */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-800/40 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('points_badge')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {t('points_title')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Solve rural problems across Jharkhand, deploy hardware, and earn <b>Impact Points</b> sponsored by Tata Steel, CMPDI, and the Jharkhand Innovation Council. Redeem points for physical gear, engineering developer kits, or career passes!
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/achievements"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-teal-200 underline"
                    >
                      <span>View village success stories where students earned these points</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Student Points Balance Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[260px] shadow-lg shrink-0">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {t('points_balance')}
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-amber-400 my-1">
                    {userBalance.toLocaleString()} <span className="text-base text-amber-200">{t('pts')}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">
                    Active Solver: <b className="text-white">{pointsData?.user_name || 'Amit Soren (BIT Mesra)'}</b>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-left text-[11px]">
                    <div>
                      <span className="text-slate-400">Total Earned:</span>
                      <div className="font-bold text-emerald-300">+{pointsData?.points_earned || 2450}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Redeemed:</span>
                      <div className="font-bold text-amber-300">-{pointsData?.points_redeemed || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Controls: Easy Search & Filter Pills */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={goodiesSearch}
                    onChange={(e) => setGoodiesSearch(e.target.value)}
                    placeholder="Search goodies (e.g. backpack, IoT kit, hoodie, power bank)..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white transition-all"
                  />
                  {goodiesSearch && (
                    <button
                      onClick={() => setGoodiesSearch('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <span>Showing: <b>{filteredGoodies.length} items</b></span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {affordableCount} Redeemable Now
                  </span>
                </div>
              </div>

              {/* Simple Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => setGoodiesCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    goodiesCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Goodies ({goodiesList.length})
                </button>

                <button
                  onClick={() => setGoodiesCategory('affordable')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    goodiesCategory === 'affordable'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <span>⚡ Can Redeem Now</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                    {affordableCount}
                  </span>
                </button>

                <button
                  onClick={() => setGoodiesCategory('hardware')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    goodiesCategory === 'hardware'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🛠️ Prototyping Hardware & Kits
                </button>

                <button
                  onClick={() => setGoodiesCategory('apparel')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    goodiesCategory === 'apparel'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🎒 Gear & Official Apparel
                </button>

                <button
                  onClick={() => setGoodiesCategory('vouchers')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    goodiesCategory === 'vouchers'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🎟️ Career Passes & Lab Grants
                </button>
              </div>
            </div>

            {/* Goodies Cards Grid with High-Res Photos */}
            {filteredGoodies.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Gift className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">No goodies match your selection</h4>
                <p className="text-xs text-slate-500">Try changing your search terms or clearing category filters.</p>
                <button
                  onClick={() => { setGoodiesSearch(''); setGoodiesCategory('all'); }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoodies.map((item) => {
                  const canAfford = userBalance >= item.points_cost;
                  const pointsNeeded = item.points_cost - userBalance;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group hover:border-amber-300"
                    >
                      <div>
                        {/* Goodie Real Photo Container */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = GOODIE_IMAGE_MAP[item.id] || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80";
                            }}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                          {/* Category Tag pill on top left */}
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                            {item.tag}
                          </span>

                          {/* Points pill on top right */}
                          <div className="absolute top-3 right-3 flex items-center gap-1 font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-xl shadow-md text-xs border border-amber-300">
                            <Coins className="w-3.5 h-3.5 text-slate-950" />
                            <span>{item.points_cost} {t('pts')}</span>
                          </div>

                          {/* Stock remaining on bottom left */}
                          <div className="absolute bottom-2.5 left-3 text-[11px] text-white/95 font-bold flex items-center gap-1.5 drop-shadow">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>{item.stock_remaining} available</span>
                          </div>
                        </div>

                        {/* Goodie Details */}
                        <div className="p-5 space-y-2.5">
                          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span className="truncate">{item.sponsor}</span>
                          </div>

                          <h4 className="text-base font-black text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                            {item.title}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{item.delivery_time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-3">
                        {canAfford ? (
                          <>
                            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
                              ✓ In your budget
                            </span>
                            <button
                              onClick={() => setSelectedGoodie(item)}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Gift className="w-3.5 h-3.5" />
                              <span>Redeem Now</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Need {pointsNeeded} pts
                            </span>
                            <button
                              disabled
                              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed"
                            >
                              Locked
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Points Ledger & Activity History */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <span>{t('points_history')}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent record of impact points credited for village problem solving and field deployments.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {pointsData?.recent_activity?.map((act, index) => (
                  <div key={index} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">{act.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Proof: <span className="font-mono text-blue-700">{act.proof}</span> • {act.date}
                      </div>
                    </div>
                    <div className={`font-black text-sm px-2.5 py-1 rounded-lg ${
                      act.points > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {act.points > 0 ? `+${act.points}` : act.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* EASY 1-CLICK REDEEM CONFIRMATION MODAL WITH GOODIE PHOTO */}
      {selectedGoodie && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Confirm Goodie Redemption</h3>
                  <p className="text-[11px] text-slate-500">Fast 1-click redemption with your earned impact points</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGoodie(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Goodie Card Preview with Photo */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center gap-3.5">
              <img
                src={selectedGoodie.image_url}
                alt={selectedGoodie.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] font-bold text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedGoodie.sponsor}
                </span>
                <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-1">
                  {selectedGoodie.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-700">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cost: {selectedGoodie.points_cost} Impact Points</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleRedeemSubmit} className="space-y-4">
              {/* Simple Delivery Options (Not Complicated!) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select Delivery / Collection Preference:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption('campus')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      deliveryOption === 'campus'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Campus Pickup</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      BIT Mesra Innovation Desk (Fastest - Ready in 24 hrs)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryOption('courier')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      deliveryOption === 'courier'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Courier Delivery</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Dispatched to hostel room or home
                    </p>
                  </button>
                </div>

                {deliveryOption === 'courier' && (
                  <div className="pt-2 animate-in fade-in">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Shipping Address with PIN Code:
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Room 304, Hostel 7, BIT Mesra, Ranchi - 835215"
                    />
                  </div>
                )}
              </div>

              {/* Clear Points Math Breakdown */}
              <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Your Current Balance:</span>
                  <b>{(pointsData?.points_balance ?? 2450)} pts</b>
                </div>
                <div className="flex justify-between text-rose-600 text-[11px] font-bold">
                  <span>Points to Deduct:</span>
                  <span>-{selectedGoodie.points_cost} pts</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black border-t border-slate-200 pt-1 text-xs">
                  <span>Remaining Balance After:</span>
                  <span className="text-emerald-700">{(pointsData?.points_balance ?? 2450) - selectedGoodie.points_cost} pts</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedGoodie(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={redeeming}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Gift className="w-4 h-4" />
                  <span>{redeeming ? 'Redeeming...' : 'Confirm & Get Voucher'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REDEEM SUCCESS CELEBRATION MODAL WITH PHOTO & COPY CODE */}
      {redeemSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-4 border-emerald-500/30 text-center space-y-4 animate-in fade-in zoom-in-95">
            {/* Real Goodie Photo Thumbnail with Celebration Check */}
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={redeemSuccessModal.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'}
                alt={redeemSuccessModal.goodie_title}
                className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-emerald-500"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Redemption Successful!</h3>
              <p className="text-xs text-slate-600">
                You redeemed <b>{redeemSuccessModal.goodie_title}</b> for <b>{redeemSuccessModal.points_spent} pts</b>.
              </p>
            </div>

            {/* Voucher Box with 1-Click Copy */}
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Your Official Dispatch Voucher Code:
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-base tracking-wider font-black text-amber-400">
                  {redeemSuccessModal.voucher_code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyVoucher(redeemSuccessModal.voucher_code)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Copy Voucher Code"
                >
                  {copiedVoucher ? (
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copiedVoucher && (
                <div className="text-[10px] text-emerald-400 font-bold animate-in fade-in">
                  ✓ Copied to clipboard!
                </div>
              )}
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-left">
              <div className="flex justify-between">
                <span>Sponsor:</span>
                <b>{redeemSuccessModal.sponsor}</b>
              </div>
              <div className="flex justify-between">
                <span>Collection Point:</span>
                <b className="text-blue-900">{redeemSuccessModal.delivery_type}</b>
              </div>
              <div className="flex justify-between">
                <span>Remaining Points:</span>
                <b className="text-emerald-700">{redeemSuccessModal.remaining_points} pts</b>
              </div>
            </div>

            <button
              onClick={() => setRedeemSuccessModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition-colors cursor-pointer"
            >
              Done & Back to Store
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: CERTIFICATES & VERIFICATION */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {/* Certificate Verification Search Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                Public Digital Certificate Verification
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify the authenticity of any completion certificate issued by the Government of Jharkhand State Innovation Council.
                Try demo ID: <code className="bg-slate-100 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold cursor-pointer" onClick={() => setSearchCertId("JH-INNOV-2026-WTR-8821")}>JH-INNOV-2026-WTR-8821</code>
              </p>
            </div>

            <form onSubmit={handleVerify} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. JH-INNOV-2026-WTR-8821)"
                value={searchCertId}
                onChange={(e) => setSearchCertId(e.target.value)}
                className="flex-1 px-4 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors"
              >
                {isVerifying ? "Verifying..." : "Verify Credential"}
              </button>
            </form>

            {verifiedResult && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                verifiedResult.valid
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {verifiedResult.valid ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-sm text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>OFFICIALLY VERIFIED CERTIFICATE</span>
                    </div>
                    <div>Recipient: <b>{verifiedResult.recipient_name}</b> ({verifiedResult.recipient_role})</div>
                    <div>Project: <b>{verifiedResult.project_title}</b></div>
                    <div>Issuing Authority: <b>{verifiedResult.issuing_authority}</b></div>
                    <div>Issued Date: <b>{verifiedResult.issued_at}</b> • SHA-256 Hash: <code className="font-mono bg-white px-1.5 py-0.5 rounded">{verifiedResult.verification_hash}</code></div>
                  </div>
                ) : (
                  <div>{verifiedResult.message}</div>
                )}
              </div>
            )}
          </div>

          {/* List of Issued Certificates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Issued Certificates in System Registry
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                Certificates are issued only after verified milestone completion.
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {cert.certificate_type}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {cert.project_title}
                      </h4>
                      <div className="text-xs text-slate-600">
                        Awarded to: <b className="text-slate-900">{cert.recipient_name}</b> ({cert.recipient_role})
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="font-mono text-[11px] text-slate-400">
                      ID: {cert.certificate_id}
                    </div>
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      View Official Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPETITIONS & PRIZES */}
      {activeTab === 'competitions' && opportunities && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <b>Hackathon & Grand Challenge Guidelines:</b> Prizes are allocated by designated evaluation juries
              based on working prototypes and field validation. Submissions must adhere to official State Innovation Council eligibility rules.
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {opportunities.competitions.map((comp) => (
              <div key={comp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      {comp.type}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-2">
                      {comp.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Organized by: <b>{comp.organizer}</b>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-amber-600">{comp.prize_pool}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Deadline: {comp.deadline}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                  <div className="font-bold text-slate-700">Eligibility:</div>
                  <p>{comp.eligibility}</p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700">Top Awards & Perks:</span>
                  <div className="space-y-1">
                    {comp.perks.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-1.5 text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {comp.status}
                  </span>
                  <button
                    onClick={() => alert(`Redirecting to registration for ${comp.title}...`)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-2xs"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INTERNSHIPS & MENTORSHIP */}
      {activeTab === 'internships' && opportunities && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-2.5">
            <Briefcase className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <b>Transparency Policy:</b> Internships and stipend offers are posted directly by verified partners (e.g. Tata Steel Foundation).
              They represent competitive opportunities upon interview qualification, not guaranteed appointments.
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {opportunities.internships.map((int) => (
              <div key={int.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800">
                      {int.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">{int.stipend}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 pt-1">
                    {int.title}
                  </h3>
                  <div className="text-xs text-slate-600 font-medium">
                    🏢 {int.company} • 📍 {int.location} ({int.duration})
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                  <div className="font-bold text-slate-700">Requirements:</div>
                  <p>{int.requirements}</p>
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  * {int.disclaimer}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => alert(`Application submitted for ${int.title}. The company mentor will reach out.`)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    Express Interest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONTRIBUTOR PORTFOLIO */}
      {activeTab === 'portfolio' && portfolio && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl font-black shadow-xs">
                  AS
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{portfolio.full_name}</h3>
                  <p className="text-xs text-slate-500">{portfolio.organization} • 📍 {portfolio.district}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {portfolio.badges.map((b, bIdx) => (
                  <span key={bIdx} className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1">
                    🏅 {b.name} ({b.level})
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Verified Civic Projects & Outcomes:
              </h4>
              <div className="space-y-3">
                {portfolio.verified_projects.map((proj, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{proj.title}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {proj.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <b>Role:</b> {proj.role} • <b>Domain:</b> {proj.domain} ({proj.district} District)
                    </div>
                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                      💡 <b>Verified Community Outcome:</b> {proj.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LAB & EQUIPMENT ACCESS */}
      {activeTab === 'labs' && opportunities && (
        <div className="grid md:grid-cols-2 gap-4">
          {opportunities.lab_access.map((lab) => (
            <div key={lab.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                  {lab.type}
                </span>
                <h3 className="text-base font-black text-slate-900 pt-1">
                  {lab.facility_name}
                </h3>
                <div className="text-xs text-slate-500 font-medium">
                  🏛️ {lab.institution}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700">Available Diagnostic & Testing Equipment:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lab.available_equipment.map((eq, eIdx) => (
                    <span key={eIdx} className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium text-[11px]">
                      🔬 {eq}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <b>Subsidy:</b> {lab.subsidy}
              </div>

              <button
                onClick={() => alert(`Requested testing session at ${lab.facility_name}. University coordinator will approve.`)}
                className="w-full py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs"
              >
                Request Lab Testing Hours
              </button>
            </div>
          ))}
        </div>
      )}

      {/* OFFICIAL CERTIFICATE PREVIEW MODAL */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-600/30 space-y-6 relative print:border-none print:shadow-none animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPreviewCert(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header with Seal */}
            <div className="text-center space-y-2 border-b-2 border-amber-500/40 pb-5">
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-900 text-amber-400 font-black flex items-center justify-center text-lg border-2 border-amber-400">
                  JS
                </div>
              </div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
                Government of Jharkhand • State Innovation Council
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-serif">
                Certificate of Societal Innovation & Impact
              </h2>
              <div className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                {previewCert.certificate_type}
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-2">
              <p className="text-xs text-slate-500 italic">
                This is proudly presented in recognition of verified technical contribution to
              </p>
              <div className="text-2xl font-extrabold text-blue-950 font-serif">
                {previewCert.recipient_name}
              </div>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                For outstanding multidisciplinary research, field engineering, and successful prototype deployment on:
                <br />
                <b className="text-slate-900 font-semibold text-sm">“{previewCert.project_title}”</b>
              </p>

              {/* Verified Skills */}
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Verified Technical Competencies:
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {previewCert.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with Signatures & Hash */}
            <div className="border-t border-slate-200 pt-5 flex items-center justify-between text-left text-xs">
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] text-slate-500">
                  Certificate ID: <b className="text-slate-800">{previewCert.certificate_id}</b>
                </div>
                <div className="font-mono text-[9px] text-slate-400">
                  Verification SHA: {previewCert.verification_hash}
                </div>
                <div className="text-[10px] text-slate-400">
                  Issued: {previewCert.issued_at}
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-serif italic font-bold text-slate-800 text-xs">
                  Rajesh Kumar Verma, IAS
                </div>
                <div className="text-[9px] text-slate-500">
                  Commissioner, State Innovation Council
                </div>
                <div className="text-[9px] text-emerald-700 font-bold">
                  ✓ Digitally Signed & Blockchain-Backed
                </div>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex items-center justify-end gap-2 pt-2 print:hidden border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
