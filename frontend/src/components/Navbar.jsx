import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Compass, PlusCircle, Coins, Award, BarChart3, LayoutDashboard,
  Bell, Menu, X, Sparkles, ShieldCheck, Globe, LogIn, Sun, Moon, Rocket
} from 'lucide-react';

const ALL_ROLES = [
  { role: 'citizen', label: '🧑‍🌾 Citizen', name: 'Soma Munda', route: '/citizen', color: 'emerald' },
  { role: 'student', label: '🎒 Student Lead', name: 'Amit Soren (BIT Mesra)', route: '/student', color: 'amber' },
  { role: 'university', label: '🎓 University', name: 'Dr. Ananya Roy (Dean R&D)', route: '/university', color: 'blue' },
  { role: 'startup', label: '🚀 Startup', name: 'Priya Tirkey (JalDrishti)', route: '/startup', color: 'purple' },
  { role: 'industry', label: '🏭 Industry Partner', name: 'Sanjay Singhal (Tata Steel)', route: '/industry', color: 'indigo' },
  { role: 'csr', label: '💚 CSR Foundation', name: 'Sunita Murmu (Tribal Trust)', route: '/csr', color: 'teal' },
  { role: 'investor', label: '💼 Angel / VC', name: 'Vikramaditya Singh', route: '/investor', color: 'cyan' },
  { role: 'admin', label: '🏛️ Govt Admin', name: 'Rajesh Kumar Verma, IAS', route: '/admin', color: 'rose' }
];

export const Navbar = () => {
  const { user, unreadCount, logout } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/citizen';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'student': return '/student';
      case 'university': return '/university';
      case 'startup': return '/startup';
      case 'industry': return '/industry';
      case 'csr': return '/csr';
      case 'investor': return '/investor';
      case 'citizen': return '/citizen';
      default: return '/citizen';
    }
  };

  // Base navigation links
  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_problems'), path: '/challenges', icon: Compass },
    { name: t('nav_funding'), path: '/funding', icon: Coins },
    { name: '🚀 Pitch Decks', path: '/pitch-decks', icon: Rocket },
    { name: t('nav_rewards'), path: '/rewards', icon: Award },
    { name: t('nav_achievements'), path: '/achievements', icon: ShieldCheck },
    { name: t('nav_demo'), path: '/workflow-demo', icon: Sparkles, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
      {/* 1. National Flag Accent Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      {/* 2. Official Govt Sub-Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">{t('govt_subtitle')}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-200 font-medium">{t('govt_title')}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Light / Dark Mode Toggle in Top Utility Bar */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold border border-slate-600 shadow-2xs transition-all cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-300" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Bilingual EN | हिन्दी Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold border border-slate-600 shadow-2xs transition-all cursor-pointer"
              title="Switch Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className={lang === 'en' ? 'text-amber-300 font-black' : 'text-slate-400'}>EN</span>
              <span className="text-slate-500">|</span>
              <span className={lang === 'hi' ? 'text-amber-300 font-black' : 'text-slate-400'}>हिन्दी</span>
            </button>

            <span className="bg-blue-950 text-blue-200 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-blue-800 hidden sm:inline">
              {t('portal_badge')}
            </span>
            {user ? (
              <span className="text-slate-400 text-[11px]">
                {t('active_persona')}: <b className="text-teal-300 capitalize">{user.role}</b> ({user.full_name?.split(' ')[0] || 'User'})
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                Jharkhand Civic Innovation & Impact Portal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-blue-800 transition-colors">
              JS
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-slate-900 dark:text-white text-base tracking-tight leading-tight">
                {t('portal_name')}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t('portal_tagline')}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    link.highlight
                      ? isActive
                        ? 'bg-blue-900 text-white font-bold'
                        : 'bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800'
                      : isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
                  {link.name}
                </Link>
              );
            })}

            <Link
              to="/submit"
              className="ml-2 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {t('nav_report_issue')}
            </Link>
          </nav>

          {/* Right Section: Quick Theme Toggle, Clean Login Button OR Dashboard + Logout */}
          <div className="flex items-center gap-2">
            {/* Quick Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Sign out of current account"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Login</span>
              </Link>
            )}

            {user && (
              <Link
                to="/notifications"
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors hidden sm:block"
                title="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/sponsor-benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Sponsor Benefits
            </Link>

            <Link
              to="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold text-center mt-2"
            >
              + Report Community Issue
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold text-center"
                >
                  My Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
