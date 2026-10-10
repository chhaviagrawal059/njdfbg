import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SaarthiAiWidget } from './components/common/SaarthiAiWidget';

// Existing Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SubmitProblemPage } from './pages/SubmitProblemPage';
import { ExploreChallengesPage } from './pages/ExploreChallengesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UniversityDashboard } from './pages/UniversityDashboard';
import { IndustryDashboard } from './pages/IndustryDashboard';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProjectProposalPage } from './pages/ProjectProposalPage';
import { TeamManagementPage } from './pages/TeamManagementPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ImpactReportsPage } from './pages/ImpactReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';

// Upgraded Pages & Dashboards
import { FundingMarketplacePage } from './pages/FundingMarketplacePage';
import { RewardsPage } from './pages/RewardsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SponsorBenefitsPage } from './pages/SponsorBenefitsPage';
import { WorkflowDemoPage } from './pages/WorkflowDemoPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StartupDashboard } from './pages/StartupDashboard';
import { CSRDashboard } from './pages/CSRDashboard';
import { InvestorDashboard } from './pages/InvestorDashboard';
import { StartupPitchDecksPage } from './pages/StartupPitchDecksPage';

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit" element={<SubmitProblemPage />} />
          <Route path="/challenges" element={<ExploreChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
          
          {/* 8 Dedicated Stakeholder Dashboards */}
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/university" element={<UniversityDashboard />} />
          <Route path="/startup" element={<StartupDashboard />} />
          <Route path="/industry" element={<IndustryDashboard />} />
          <Route path="/csr" element={<CSRDashboard />} />
          <Route path="/investor" element={<InvestorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Upgraded Collaboration, Funding & Rewards Hubs */}
          <Route path="/funding" element={<FundingMarketplacePage />} />
          <Route path="/pitch-decks" element={<StartupPitchDecksPage />} />
          <Route path="/investors" element={<StartupPitchDecksPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/sponsor-benefits" element={<SponsorBenefitsPage />} />
          <Route path="/workflow-demo" element={<WorkflowDemoPage />} />

          {/* Existing Features */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/proposals/new" element={<ProjectProposalPage />} />
          <Route path="/teams" element={<TeamManagementPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/impact" element={<ImpactReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <SaarthiAiWidget />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
