import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/ThemeContext';
import {
  ArrowRight,
  TrendingUp,
  Warehouse,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Coins,
  Users,
  Leaf,
} from 'lucide-react';

/**
 * Custom Stylized Organic Leaf SVG matching the reference design
 */
function FloatingLeaf({ className = 'w-6 h-6 text-[#1e5f37]' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 25C3 25 5 14 15 10C25 6 25 3 25 3C25 3 21 13 11 17C6 19 3 25 3 25Z"
        fill="currentColor"
      />
      <path
        d="M4 24C6 20 11 16 17 15"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Hero({ onNavigateToAdvisor, onNavigateToDashboard, onNavigateToTrends }) {
  const { t } = useApp();

  const handleAdvisorClick = () => {
    if (onNavigateToAdvisor) {
      onNavigateToAdvisor();
    } else {
      const el = document.getElementById('advisor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrendsClick = () => {
    if (onNavigateToTrends) {
      onNavigateToTrends();
    } else {
      handleAdvisorClick();
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-16 font-sans">
      {/* ============================================================ */}
      {/* SOFT GREEN-AND-WHITE OVERLAPPING WAVE BACKGROUND            */}
      {/* Matching the exact organic pastel waves in the reference    */}
      {/* ============================================================ */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        {/* Layer 1: Soft Outer Wave 1 */}
        <svg
          className="absolute -top-12 right-0 w-[820px] h-[720px] max-w-none opacity-80 transition-opacity"
          viewBox="0 0 820 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M320 60 C 520 -20, 750 40, 820 220 C 880 380, 780 620, 600 680 C 420 730, 240 640, 160 480 C 90 340, 140 130, 320 60 Z"
            fill="#eaf5ec"
          />
        </svg>

        {/* Layer 2: Deeper Soft Pastel Middle Wave */}
        <svg
          className="absolute top-4 right-10 w-[690px] h-[640px] max-w-none opacity-85 transition-opacity"
          viewBox="0 0 690 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M260 80 C 440 20, 640 70, 680 230 C 720 380, 640 560, 480 600 C 330 630, 180 540, 130 400 C 90 280, 110 130, 260 80 Z"
            fill="#dcf0e2"
          />
        </svg>

        {/* Layer 3: Soft ambient radial bloom */}
        <div className="absolute top-1/4 right-[15%] w-[420px] h-[420px] rounded-full bg-[#c8e8d1]/40 blur-3xl" />
        <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-[#f3faf4]/80 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: HERO HEADLINE & PRIMARY CTA                    */}
          {/* ============================================================ */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Pill Badge: Leaf icon + "Post-Harvest Decision Support" */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#e8f4ec] dark:bg-forest-900 border border-[#cde8d5] dark:border-forest-700/60 text-[#1e5f37] dark:text-green-300 text-xs font-bold tracking-tight shadow-2xs">
              <Leaf className="w-3.5 h-3.5 text-[#1e5f37] dark:text-green-400 fill-[#1e5f37] dark:fill-green-400" />
              <span>Post-Harvest Decision Support</span>
            </div>

            {/* Main Headline: Exactly matching reference layout */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#1a2d21] dark:text-forest-50 tracking-tight leading-[1.12]">
              Make the <span className="text-[#1e5f37] dark:text-green-400">Right Call</span>
              <br />
              for Your <span className="text-[#1e5f37] dark:text-green-400">Harvest.</span>
            </h1>

            {/* Subheading: Clean, minimal explanatory text */}
            <p className="text-sm sm:text-base text-[#4a5e51] dark:text-forest-200/90 max-w-xl font-normal leading-relaxed">
              StoreOrSell helps farmers and traders decide whether to HOLD or SELL their produce using real-time market trends, storage conditions, shelf-life estimates and price analysis.
            </p>

            {/* Primary Action Button: "Check Your Stock Now →" */}
            <div className="pt-2 flex items-center">
              <button
                onClick={handleAdvisorClick}
                className="inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-full font-bold text-sm text-white bg-[#1e5f37] hover:bg-[#184d2c] active:scale-95 transition-all shadow-md shadow-[#1e5f37]/25 hover:shadow-lg hover:shadow-[#1e5f37]/30"
              >
                <span>Check Your Stock Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: HARVEST CRATE & 3 FLOATING ACTION CARDS        */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 relative flex items-center justify-center lg:justify-end"
          >
            {/* Ambient Wave Frame Behind Image */}
            <div className="relative w-full max-w-[560px] flex items-center justify-center">
              
              {/* Floating Leaf 1: Top Right */}
              <div className="absolute -top-3 right-28 sm:right-36 z-20 pointer-events-none drop-shadow">
                <FloatingLeaf className="w-8 h-8 text-[#1b5e32] rotate-12" />
              </div>

              {/* Floating Leaf 2: Bottom Left */}
              <div className="absolute -bottom-2 left-6 sm:left-12 z-20 pointer-events-none drop-shadow">
                <FloatingLeaf className="w-7 h-7 text-[#1b5e32] -rotate-45" />
              </div>

              {/* Central Organic Picture Frame (Wooden Harvest Crate) */}
              <div className="relative w-[340px] sm:w-[410px] aspect-[4/3.1] rounded-[75px] sm:rounded-[95px] overflow-hidden shadow-soft-lg border-4 border-white dark:border-forest-800 bg-[#eaf4ec] z-10 shrink-0">
                <img
                  src="/harvest_crate.jpg"
                  alt="Freshly harvested farm produce in rustic wooden crate"
                  className="w-full h-full object-cover object-center scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* 3 Overlapping Floating Pill Action Cards */}
              <div className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-3 z-30 w-56 sm:w-64">
                
                {/* Card 1: Market Trends */}
                <div
                  onClick={handleTrendsClick}
                  className="group cursor-pointer rounded-2xl p-2.5 sm:p-3 bg-white/95 dark:bg-forest-900/95 backdrop-blur-md border border-[#e5efe7] dark:border-forest-800 shadow-md shadow-[#1e5f37]/5 hover:shadow-lg hover:translate-x-1 transition-all flex items-center justify-between space-x-2.5"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#eaf5ed] dark:bg-forest-800 text-[#1e5f37] dark:text-green-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-[#183d27] dark:text-forest-100 truncate">
                        Market Trends
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#5e7165] dark:text-forest-400 truncate">
                        Track price trends & find better markets
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1e5f37] transition-colors shrink-0" />
                </div>

                {/* Card 2: Storage Conditions */}
                <div
                  onClick={handleAdvisorClick}
                  className="group cursor-pointer rounded-2xl p-2.5 sm:p-3 bg-white/95 dark:bg-forest-900/95 backdrop-blur-md border border-[#e5efe7] dark:border-forest-800 shadow-md shadow-[#1e5f37]/5 hover:shadow-lg hover:translate-x-1 transition-all flex items-center justify-between space-x-2.5"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#eaf5ed] dark:bg-forest-800 text-[#1e5f37] dark:text-green-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Warehouse className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-[#183d27] dark:text-forest-100 truncate">
                        Storage Conditions
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#5e7165] dark:text-forest-400 truncate">
                        Consider temperature, humidity & storage type
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1e5f37] transition-colors shrink-0" />
                </div>

                {/* Card 3: HOLD or SELL */}
                <div
                  onClick={handleAdvisorClick}
                  className="group cursor-pointer rounded-2xl p-2.5 sm:p-3 bg-white/95 dark:bg-forest-900/95 backdrop-blur-md border border-[#e5efe7] dark:border-forest-800 shadow-md shadow-[#1e5f37]/5 hover:shadow-lg hover:translate-x-1 transition-all flex items-center justify-between space-x-2.5"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#eaf5ed] dark:bg-forest-800 text-[#1e5f37] dark:text-green-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-[#183d27] dark:text-forest-100 truncate">
                        HOLD or SELL
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#5e7165] dark:text-forest-400 truncate">
                        Get smart recommendations
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1e5f37] transition-colors shrink-0" />
                </div>

              </div>

            </div>
          </motion.div>

        </div>

        {/* ============================================================ */}
        {/* 4-PILLAR VALUE PROPOSITION STRIP                            */}
        {/* Matching the exact 4 icons & copy in the reference image     */}
        {/* ============================================================ */}
        <div className="mt-14 pt-8 border-t border-[#e2efe5] dark:border-forest-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#e2efe5] dark:lg:divide-forest-800">
            
            {/* 1. Better Decisions */}
            <div className="flex flex-col items-center text-center px-4 space-y-2.5">
              <div className="w-11 h-11 rounded-full bg-[#e8f5ec] dark:bg-forest-800 text-[#1e5f37] dark:text-green-400 flex items-center justify-center shadow-xs">
                <Leaf className="w-5 h-5 fill-[#1e5f37]/20" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#183d27] dark:text-forest-100">
                  Better Decisions
                </h4>
                <p className="text-xs text-[#5e7165] dark:text-forest-400 mt-0.5">
                  Use data, not guesswork.
                </p>
              </div>
            </div>

            {/* 2. Reduce Losses */}
            <div className="flex flex-col items-center text-center px-4 space-y-2.5">
              <div className="w-11 h-11 rounded-full bg-[#e8f5ec] dark:bg-forest-800 text-[#1e5f37] dark:text-green-400 flex items-center justify-center shadow-xs">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#183d27] dark:text-forest-100">
                  Reduce Losses
                </h4>
                <p className="text-xs text-[#5e7165] dark:text-forest-400 mt-0.5">
                  Avoid spoilage and price drops.
                </p>
              </div>
            </div>

            {/* 3. Increase Profitability */}
            <div className="flex flex-col items-center text-center px-4 space-y-2.5">
              <div className="w-11 h-11 rounded-full bg-[#e8f5ec] dark:bg-forest-800 text-[#1e5f37] dark:text-green-400 flex items-center justify-center shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#183d27] dark:text-forest-100">
                  Increase Profitability
                </h4>
                <p className="text-xs text-[#5e7165] dark:text-forest-400 mt-0.5">
                  Get the best value for your produce.
                </p>
              </div>
            </div>

            {/* 4. Support Farmers */}
            <div className="flex flex-col items-center text-center px-4 space-y-2.5">
              <div className="w-11 h-11 rounded-full bg-[#e8f5ec] dark:bg-forest-800 text-[#1e5f37] dark:text-green-400 flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#183d27] dark:text-forest-100">
                  Support Farmers
                </h4>
                <p className="text-xs text-[#5e7165] dark:text-forest-400 mt-0.5">
                  Build a stronger agri ecosystem.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
