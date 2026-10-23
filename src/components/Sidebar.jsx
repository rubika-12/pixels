import React from 'react';
import { useApp } from '../context/ThemeContext';
import { USER_PROFILE } from '../data/pnlData';
import { BrandSprout } from './common/BrandLogo';
import {
  Home,
  Compass,
  TrendingUp,
  Coins,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  ChevronRight,
  X,
  ArrowUpRight,
  Truck,
  Sprout,
  User,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, activeView = 'landing', onSelectView }) {
  const { theme, toggleTheme, lang, toggleLang, t } = useApp();

  const navItems = [
    {
      id: 'landing',
      label: 'Home & Overview',
      tamilLabel: 'முகப்பு & கண்ணோட்டம்',
      icon: Home,
    },
    {
      id: 'advisor',
      label: 'Hold or Sell Advisor',
      tamilLabel: 'பரிந்துரை & சரியான விலை',
      icon: Compass,
    },
    {
      id: 'trends',
      label: 'Market Trends (18 Crops)',
      tamilLabel: 'சந்தை நிலவரம் (18 பயிர்கள்)',
      icon: TrendingUp,
    },
    {
      id: 'arbitrage',
      label: 'Where to Sell (Arbitrage)',
      tamilLabel: 'பல்வேறு சந்தை ஒப்பீடு',
      icon: Truck,
    },
    {
      id: 'sowing',
      label: 'Plan a Season (Sowing)',
      tamilLabel: 'விதைப்பு & பருவ திட்டம்',
      icon: Sprout,
    },
    {
      id: 'dashboard',
      label: 'P&L Dashboard (Neon DB)',
      tamilLabel: 'லாப நஷ்ட அறிக்கை (3M)',
      icon: Coins,
    },
    {
      id: 'impact',
      label: 'How It Works & Impact',
      tamilLabel: 'செயல்பாடு & சேமிப்பு',
      icon: ShieldCheck,
    },
  ];

  const handleNavigate = (viewId) => {
    if (onSelectView) {
      onSelectView(viewId);
    }
    if (onClose) {
      onClose();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-5 font-sans bg-white dark:bg-forest-950">
      {/* Top Section */}
      <div className="space-y-6">
        
        {/* Brand Header: Crisp Sprout Icon + StoreOrSell */}
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={() => handleNavigate('landing')}
            className="flex items-center space-x-2.5 group text-left focus:outline-none"
            aria-label="StoreOrSell Home"
          >
            <BrandSprout className="w-8 h-8 text-[#1e5f37] dark:text-green-400 group-hover:scale-105 transition-transform" />
            <span className="font-display font-extrabold text-xl text-[#1a2d21] dark:text-forest-100 tracking-tight leading-none">
              StoreOrSell
            </span>
          </button>

          {/* Close button for mobile drawer */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-xl text-forest-500 hover:bg-forest-100 dark:hover:bg-forest-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Label: NAVIGATION & ANALYSIS */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e9485] dark:text-forest-400 block px-3">
            NAVIGATION & ANALYSIS
          </span>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#e4f3e7] dark:bg-forest-900 text-[#1a4427] dark:text-green-300 font-bold shadow-2xs'
                      : 'text-[#4a5e51] dark:text-forest-300 hover:bg-[#f2f8f4] dark:hover:bg-forest-900/60 hover:text-[#1a4427] dark:hover:text-green-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive
                          ? 'text-[#1e5f37] dark:text-green-400'
                          : 'text-[#6b7f72] dark:text-forest-400'
                      }`}
                    />
                    <span className="truncate">{lang === 'ta' ? item.tamilLabel : item.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive
                        ? 'text-[#1e5f37] dark:text-green-400'
                        : 'text-[#a5b8ab] dark:text-forest-600'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: User Profile Card & Quick Toggles */}
      <div className="space-y-3 pt-4 border-t border-[#edf3ee] dark:border-forest-800">
        
        {/* Profile Card matching reference design */}
        <button
          onClick={() => handleNavigate('dashboard')}
          className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs group ${
            activeView === 'dashboard'
              ? 'bg-[#e4f3e7] dark:bg-forest-900 border-[#c4e3cb] dark:border-forest-700 shadow-sm'
              : 'bg-[#fbfdfa] dark:bg-forest-900/70 border-[#e5efe7] dark:border-forest-800 hover:border-[#bcdfc4] hover:bg-[#f4faf5]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#e4f3e7] dark:bg-forest-800 text-[#1e5f37] dark:text-green-300 flex items-center justify-center text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#183d27] dark:text-forest-100 leading-tight">
                  {USER_PROFILE.name}
                </div>
                <div className="text-[11px] text-[#5e7165] dark:text-forest-400 leading-tight mt-0.5">
                  {USER_PROFILE.organization}
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#5e7165] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[11px] font-extrabold text-[#1e5f37] dark:text-green-400 mt-1">
                +₹59.1k
              </span>
            </div>
          </div>
        </button>

        {/* Small Toggles Row (Lang & Theme) */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#5e7165] dark:text-forest-400">
          <button
            onClick={toggleLang}
            className="flex items-center space-x-1.5 py-1 px-2 rounded-lg hover:bg-[#f2f8f4] dark:hover:bg-forest-900 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('langToggle')}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center space-x-1.5 py-1 px-2 rounded-lg hover:bg-[#f2f8f4] dark:hover:bg-forest-900 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#1e5f37]" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <>
      {/* 1. Static Sidebar for Desktop (Always Present, Never Hidden on md+) */}
      <aside className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 w-64 lg:w-72 bg-white dark:bg-forest-950 border-r border-[#edf3ee] dark:border-forest-800 z-30 shadow-sm">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer for small screens when toggled */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden flex">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm transition-opacity"
          />
          <aside className="relative w-72 max-w-full bg-white dark:bg-forest-950 border-r border-[#edf3ee] dark:border-forest-800 shadow-2xl flex flex-col justify-between z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
