import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800 dark:border-slate-800/80 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Identity & Govt Dept */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-900 font-black flex items-center justify-center text-sm">
                JH
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight">
                  Jharkhand Societal Innovation Portal
                </div>
                <div className="text-xs text-amber-400 font-medium">
                  झारखंड सरकार | Govt of Jharkhand
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An AI-powered civic technology ecosystem transforming grassroots rural and urban community problems
              into university research prototypes, industry pilots, and verified societal solutions.
            </p>
            <div className="text-[11px] text-slate-500">
              Department of Higher & Technical Education • Government of Jharkhand
            </div>
          </div>

          {/* Col 2: Four Stakeholders */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/funding" className="hover:text-teal-400 transition-colors">
                  💰 Project Funding Marketplace
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="hover:text-teal-400 transition-colors">
                  🏆 Opportunities & Verifiable Rewards
                </Link>
              </li>
              <li>
                <Link to="/sponsor-benefits" className="hover:text-teal-400 transition-colors">
                  🤝 Sponsor & Funder Benefits Guide
                </Link>
              </li>
              <li>
                <Link to="/workflow-demo" className="hover:text-teal-400 transition-colors">
                  ✨ End-to-End Demonstration Walkthrough
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-teal-400 transition-colors">
                  🔍 Explore 24 Districts Challenges
                </Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-teal-400 transition-colors">
                  ➕ Report Community Issue (AI-Assisted)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Focus Domains */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Key Societal Domains
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Safe Water Resources & Arsenic/Fluoride Abatement</li>
              <li>• Agro-Processing & Tribal Forest Produce Storage</li>
              <li>• Maternal Tele-Diagnostics in Remote Anganwadis</li>
              <li>• Clean Energy Microgrids & Forest Hamlets</li>
              <li>• Mine Runoff & Eco-Restoration Engineering</li>
              <li>• Rural Livelihoods & Tribal Artisan Linkages</li>
            </ul>
          </div>

          {/* Col 4: Official Helpdesk & Emergency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Official Helpline & Support
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Project Building, Dhurwa, Ranchi, Jharkhand - 834004</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Toll-Free Helpline: 1800-345-6570</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>innovate@jharkhand.gov.in</span>
              </div>
            </div>
            <div className="pt-2">
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-[11px] text-slate-300 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Emergency safety hazards bypass normal queue via AI Emergency Safety Override.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 Government of Jharkhand. Department of Higher & Technical Education. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Open Civic Data</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Web Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
