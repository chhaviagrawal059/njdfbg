import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Building, MapPin, Phone, Mail, Shield } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <div className="p-8 text-center text-sm">Please log in to view profile.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-800 font-black text-2xl flex items-center justify-center">
            {user.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{user.full_name}</h2>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
              Role: {user.role}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" /> Email Address
            </span>
            <span className="font-bold text-slate-900 block">{user.email}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400" /> Contact Phone
            </span>
            <span className="font-bold text-slate-900 block">{user.phone || '+91-XXXXXXXXXX'}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" /> Organization / Department
            </span>
            <span className="font-bold text-slate-900 block">{user.organization_name || 'Individual Citizen'}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" /> District (Jharkhand)
            </span>
            <span className="font-bold text-slate-900 block">{user.district || 'Ranchi'}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600" />
          <span>Role-based access credentials verified by Jharkhand State Innovation Portal.</span>
        </div>
      </div>
    </div>
  );
};
