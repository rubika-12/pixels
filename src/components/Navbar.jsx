import React, { useState } from 'react';
import { useApp } from '../context/ThemeContext';
import { USER_PROFILE } from '../data/pnlData';
import { BrandSprout } from './common/BrandLogo';
import {
  Bell,
  ChevronDown,
  User,
  PanelLeft,
  X,
  Compass,
  TrendingUp,
  Truck,
  Sprout,
  Coins,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar({ onOpenSidebar, activeView = 'landing', onSelectView }) {
  const { lang, t } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleNavClick = (viewId) => {
    if (onSelectView) {
      onSelectView(viewId);
    }
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-forest-950/90 backdrop-blur-md border-b border-[#edf3ee] dark:border-forest-900 transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Mobile Sidebar Trigger & Brand Title with Subtitle */}
        <div className="flex items-center space-x-3.5">
          {/* Mobile hamburger to open sidebar */}
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-xl border border-[#e5efe7] dark:border-forest-800 text-[#1e5f37] dark:text-green-300 hover:bg-[#f2f8f4] dark:hover:bg-forest-900 transition-colors focus:outline-none"
            aria-label="Open sidebar menu"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          {/* Brand and Subtitle: Exactly as shown in the top bar of the reference image */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center space-x-2.5 text-left focus:outline-none group"
            aria-label="StoreOrSell Home"
          >
            <BrandSprout className="w-8 h-8 text-[#1e5f37] dark:text-green-400 group-hover:scale-105 transition-transform shrink-0" />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl sm:text-[22px] tracking-tight text-[#1a2d21] dark:text-forest-50 leading-tight">
                StoreOrSell
              </span>
              <span className="text-[11px] sm:text-xs font-normal text-[#5e7165] dark:text-forest-400 leading-none mt-0.5">
                Better Decisions. Higher Value.
              </span>
            </div>
          </button>
        </div>

        {/* Right Corner: Notification Bell & User Profile Dropdown Pill */}
        <div className="flex items-center space-x-3">
          
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setUserDropdownOpen(false);
              }}
              className="p-2.5 rounded-full border border-[#e2ebe4] dark:border-forest-800 bg-white dark:bg-forest-900 text-[#4a5e51] dark:text-forest-300 hover:bg-[#f4faf5] hover:text-[#1e5f37] transition-all relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1e5f37] ring-2 ring-white dark:ring-forest-900" />
            </button>

            {/* Notification Popup Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-forest-900 border border-[#e2ebe4] dark:border-forest-800 shadow-xl p-3 space-y-2 z-50 text-xs font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-[#edf3ee] dark:border-forest-800 font-bold text-[#183d27] dark:text-forest-100">
                  <span>Recent Market Alerts</span>
                  <span className="text-[10px] text-[#1e5f37] dark:text-green-400 font-bold">2 New</span>
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 rounded-xl bg-[#f7fbf8] dark:bg-forest-800/60">
                    <div className="font-semibold text-[#183d27] dark:text-forest-100">Tomato rates +12% in Dindigul</div>
                    <div className="text-[10px] text-[#5e7165] dark:text-forest-400 mt-0.5">Recommended HOLD strategy working</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f7fbf8] dark:bg-forest-800/60">
                    <div className="font-semibold text-[#183d27] dark:text-forest-100">Optimal Sell Window Open</div>
                    <div className="text-[10px] text-[#5e7165] dark:text-forest-400 mt-0.5">Cold storage lot #23 reaches peak valuation</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill Button matching reference: [Avatar] Rohith L ▾ */}
          <div className="relative">
            <button
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setNotificationOpen(false);
              }}
              className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-[#e2ebe4] dark:border-forest-800 bg-white dark:bg-forest-900 hover:bg-[#f4faf5] transition-all text-xs font-bold text-[#1a2d21] dark:text-forest-100 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#e8f4ec] dark:bg-forest-800 text-[#1e5f37] dark:text-green-300 flex items-center justify-center text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{USER_PROFILE.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#5e7165]" />
            </button>

            {/* Profile Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-forest-900 border border-[#e2ebe4] dark:border-forest-800 shadow-xl p-2 space-y-1 z-50 text-xs font-sans">
                <div className="px-3 py-2 border-b border-[#edf3ee] dark:border-forest-800">
                  <div className="font-bold text-[#183d27] dark:text-forest-100">{USER_PROFILE.name}</div>
                  <div className="text-[11px] text-[#5e7165] dark:text-forest-400">{USER_PROFILE.organization}</div>
                  <div className="text-[11px] font-bold text-[#1e5f37] dark:text-green-400 mt-1">+₹59,120 Ledger Profit</div>
                </div>

                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f2f8f4] dark:hover:bg-forest-800 text-[#183d27] dark:text-forest-100 font-semibold flex items-center justify-between"
                >
                  <span>P&L Dashboard</span>
                  <Coins className="w-3.5 h-3.5 text-[#1e5f37]" />
                </button>

                <button
                  onClick={() => handleNavClick('advisor')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f2f8f4] dark:hover:bg-forest-800 text-[#183d27] dark:text-forest-100 font-semibold flex items-center justify-between"
                >
                  <span>Hold/Sell Advisor</span>
                  <Compass className="w-3.5 h-3.5 text-[#1e5f37]" />
                </button>

                <button
                  onClick={() => handleNavClick('trends')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f2f8f4] dark:hover:bg-forest-800 text-[#183d27] dark:text-forest-100 font-semibold flex items-center justify-between"
                >
                  <span>Market Trends</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#1e5f37]" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
