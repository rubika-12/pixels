import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UserDashboardModal from './components/dashboard/UserDashboardModal';
import LandingPage from './components/LandingPage';
import MarketTrends from './components/MarketTrends';
import AdvisorSection from './components/advisor/AdvisorSection';
import PnLDashboard from './components/dashboard/PnLDashboard';
import HowItWorks from './components/HowItWorks';
import InterMandiArbitrage from './components/arbitrage/InterMandiArbitrage';
import PreHarvestPlanner from './components/sowing/PreHarvestPlanner';
import Footer from './components/Footer';
import Toast from './components/Toast';

export default function App() {
  // Page view routing state: 'landing' is the first screen users see
  const [activeView, setActiveView] = useState('landing');
  const [selectedCropFromTrends, setSelectedCropFromTrends] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);

  // Navigate between views smoothly
  const handleNavigate = (viewId) => {
    setActiveView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCropForAdvisor = (cropData) => {
    const payload = typeof cropData === 'string'
      ? { cropId: cropData, timestamp: Date.now() }
      : { ...cropData, timestamp: Date.now() };

    setSelectedCropFromTrends(payload);
    handleNavigate('advisor');
  };

  return (
    <div className="min-h-screen flex bg-harvest-surface dark:bg-forest-950 text-forest-900 dark:text-forest-100 transition-colors duration-200 font-sans antialiased selection:bg-forest-600 selection:text-white">
      {/* Toast Notification Container */}
      <Toast />

      {/* Static Sidebar on Left (always visible on desktop, mobile drawer on small screens) */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeView={activeView}
        onSelectView={handleNavigate}
      />

      {/* Optional Top-Right User Dashboard Modal */}
      <UserDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
      />

      {/* Main Content Area (offset left by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 lg:pl-72 transition-all">
        {/* Sticky Top Navigation Bar */}
        <Navbar
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
          activeView={activeView}
          onSelectView={handleNavigate}
        />

        {/* Content View Router - Each feature is strictly contained within its page view */}
        <main className="flex-grow">
          {activeView === 'landing' && (
            <LandingPage
              onNavigateToAdvisor={() => handleNavigate('advisor')}
              onNavigateToDashboard={() => handleNavigate('dashboard')}
              onNavigateToTrends={() => handleNavigate('trends')}
              onNavigateToArbitrage={() => handleNavigate('arbitrage')}
              onNavigateToSowing={() => handleNavigate('sowing')}
            />
          )}

          {activeView === 'advisor' && (
            <div className="py-6 sm:py-10 animate-fadeIn">
              <AdvisorSection
                externalCropData={selectedCropFromTrends}
                onNavigateToDashboard={() => handleNavigate('dashboard')}
                onNavigateToArbitrage={() => handleNavigate('arbitrage')}
              />
            </div>
          )}

          {activeView === 'trends' && (
            <div className="py-6 sm:py-10 animate-fadeIn">
              <MarketTrends onSelectCropForAdvisor={handleSelectCropForAdvisor} />
            </div>
          )}

          {activeView === 'arbitrage' && (
            <div className="py-6 sm:py-10 animate-fadeIn">
              <InterMandiArbitrage onSelectCropForAdvisor={handleSelectCropForAdvisor} />
            </div>
          )}

          {activeView === 'sowing' && (
            <div className="py-6 sm:py-10 animate-fadeIn">
              <PreHarvestPlanner onSelectCropForAdvisor={handleSelectCropForAdvisor} />
            </div>
          )}

          {activeView === 'dashboard' && (
            <div className="py-6 sm:py-10 animate-fadeIn">
              <PnLDashboard onNavigateToAdvisor={() => handleNavigate('advisor')} />
            </div>
          )}

          {activeView === 'impact' && (
            <div className="py-8 sm:py-12 space-y-16 animate-fadeIn">
              <HowItWorks />
            </div>
          )}
        </main>

        {/* Footer with Team Credits */}
        <Footer />
      </div>
    </div>
  );
}
