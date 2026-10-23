import React from 'react';
import { useApp } from '../context/ThemeContext';
import { BrandSprout } from './common/BrandLogo';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="border-t border-[#edf3ee] dark:border-forest-900 bg-[#f9fbf9] dark:bg-forest-950 py-10 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Brand & Mission */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-2.5">
            <BrandSprout className="w-6 h-6 text-[#1e5f37] dark:text-green-400" />
            <span className="font-display text-xl font-extrabold text-[#1a2d21] dark:text-forest-100">
              StoreOrSell
            </span>
            <span className="text-xs text-[#5e7165] dark:text-forest-400 hidden sm:inline">
              • Post-Harvest Hold or Sell Advisor
            </span>
          </div>

          <div className="text-xs text-[#5e7165] dark:text-forest-400">
            © 2026 StoreOrSell. Better Decisions. Higher Value.
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-[#edf3ee] dark:border-forest-900 text-[11px] text-[#7a8d81] dark:text-forest-500 leading-relaxed text-center md:text-left">
          {t('footerDisclaimer')}
        </div>

      </div>
    </footer>
  );
}
