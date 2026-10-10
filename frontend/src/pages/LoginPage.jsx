import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LogIn, AlertCircle, Mail, Lock, Sparkles
} from 'lucide-react';

const DEMO_PERSONAS = [
  { role: 'student', label: '🎒 Student Lead (Amit Soren)', email: 'student@jharkhand.ac.in' },
  { role: 'university', label: '🎓 University SPOC (Dr. Ananya Roy)', email: 'bit.mesra@jharkhand.ac.in' },
  { role: 'startup', label: '🚀 Startup Founder (Priya Tirkey)', email: 'startup@jharinnovate.in' },
  { role: 'citizen', label: '🧑‍🌾 Rural Citizen (Soma Munda)', email: 'citizen@jharkhand.gov.in' },
  { role: 'industry', label: '🏭 Industry CSR (Sanjay Singhal)', email: 'csr@tatasteel.com' },
  { role: 'admin', label: '🏛️ Govt Admin (Rajesh Kumar Verma, IAS)', email: 'admin@jharkhand.gov.in' },
  { role: 'csr', label: '💚 CSR Foundation (Sunita Murmu)', email: 'csr.foundation@jharkhand.org' },
  { role: 'investor', label: '💼 Angel Investor (Vikramaditya Singh)', email: 'investor@jharkhandangels.in' }
];

export const LoginPage = () => {
  const { login, switchDemoRole } = useAuth();
  const { isHindi } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUser = (role) => {
    switch (role) {
      case 'student': navigate('/student'); break;
      case 'university': navigate('/university'); break;
      case 'startup': navigate('/startup'); break;
      case 'citizen': navigate('/citizen'); break;
      case 'industry': navigate('/industry'); break;
      case 'csr': navigate('/csr'); break;
      case 'investor': navigate('/investor'); break;
      case 'admin': navigate('/admin'); break;
      default: navigate('/'); break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      redirectUser(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (roleKey) => {
    if (!roleKey) return;
    const persona = DEMO_PERSONAS.find(p => p.role === roleKey);
    if (persona) {
      setEmail(persona.email);
      setPassword('demo123');
    }
    setError('');
    setLoading(true);
    try {
      const user = await switchDemoRole(roleKey);
      redirectUser(user.role);
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
            JS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isHindi ? "उपयोगकर्ता लॉगिन" : "User Login"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi
              ? "झारखंड इनोवेशन पोर्टल में अपने खाते से प्रवेश करें"
              : "Enter your registered credentials to access your dashboard"}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Dropdown */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1 text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Role Demo Access:</span>
              </span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-bold">
                1-Click
              </span>
            </div>
            <select
              defaultValue=""
              onChange={(e) => handleDemoSelect(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="" disabled>-- Select Persona to Log In Instantly --</option>
              {DEMO_PERSONAS.map(p => (
                <option key={p.role} value={p.role}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-semibold uppercase">Or with credentials</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@jharkhand.ac.in"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span>Remember me</span>
              </label>
              <span className="text-blue-700 hover:underline cursor-pointer font-semibold">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-700 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
