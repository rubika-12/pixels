import React from 'react';
import Hero from './Hero';
import ProblemStrip from './ProblemStrip';
import HowItWorks from './HowItWorks';
import { ArrowRight, Compass, BarChart3, TrendingUp, ShieldCheck, Database, Sparkles } from 'lucide-react';

export default function LandingPage({
  onNavigateToAdvisor,
  onNavigateToDashboard,
  onNavigateToTrends,
  onNavigateToArbitrage,
  onNavigateToSowing,
}) {
  return (
    <div className="space-y-16 lg:space-y-24 font-sans">
      {/* 1. Main Hero with Interactive Preview & Quick Actions */}
      <Hero
        onNavigateToAdvisor={onNavigateToAdvisor}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToTrends={onNavigateToTrends}
      />

      {/* 2. Feature Gateway Cards (Quick jump into specific application modules) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-onion" />
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-forest-900 dark:text-forest-100">
            Choose What You Want to Do Today
          </h2>
          <p className="text-sm text-forest-600 dark:text-forest-400 mt-1">
            Access our decision engine, live Tamil Nadu & national mandi rates, or your Neon-backed performance ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Advisor */}
          <div
            onClick={onNavigateToAdvisor}
            className="group cursor-pointer rounded-3xl p-5 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 hover:border-forest-500 dark:hover:border-forest-600 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-forest-800 flex items-center justify-center text-forest-700 dark:text-green-300 text-xl group-hover:scale-110 transition-transform">
                🧭
              </div>
              <h3 className="font-display text-base font-bold text-forest-900 dark:text-forest-100 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                Hold-or-Sell Advisor
              </h3>
              <p className="text-[11px] text-forest-600 dark:text-forest-400 leading-relaxed">
                Lot entry, shelf life decay, Downside Risk Protection, and "Your Options" matrix.
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-700 dark:text-green-400 pt-1">
              <span>Start Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Market Trends & Movers */}
          <div
            onClick={onNavigateToTrends}
            className="group cursor-pointer rounded-3xl p-5 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 hover:border-forest-500 dark:hover:border-forest-600 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-onion dark:text-amber-300 text-xl group-hover:scale-110 transition-transform">
                📈
              </div>
              <h3 className="font-display text-base font-bold text-forest-900 dark:text-forest-100 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                Market Trends & Movers
              </h3>
              <p className="text-[11px] text-forest-600 dark:text-forest-400 leading-relaxed">
                18 commodity rates with 24h & 7d top gainers & decliners velocity widget.
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-700 dark:text-green-400 pt-1">
              <span>Explore Prices</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Where to Sell (Arbitrage) */}
          <div
            onClick={onNavigateToArbitrage}
            className="group cursor-pointer rounded-3xl p-5 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 hover:border-forest-500 dark:hover:border-forest-600 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xl group-hover:scale-110 transition-transform">
                🚚
              </div>
              <h3 className="font-display text-base font-bold text-forest-900 dark:text-forest-100 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                Where to Sell (Arbitrage)
              </h3>
              <p className="text-[11px] text-forest-600 dark:text-forest-400 leading-relaxed">
                Inter-mandi arbitrage & transport calculator net of road freight and distance.
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-700 dark:text-green-400 pt-1">
              <span>Find Best Mandi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Plan a Season (Sowing Guide) */}
          <div
            onClick={onNavigateToSowing}
            className="group cursor-pointer rounded-3xl p-5 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 hover:border-forest-500 dark:hover:border-forest-600 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-300 text-xl group-hover:scale-110 transition-transform">
                🌱
              </div>
              <h3 className="font-display text-base font-bold text-forest-900 dark:text-forest-100 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                Plan a Season (Sowing)
              </h3>
              <p className="text-[11px] text-forest-600 dark:text-forest-400 leading-relaxed">
                Pre-harvest sowing calendar, water requirements, and expected harvest yield.
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-700 dark:text-green-400 pt-1">
              <span>Plan Season</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: P&L Dashboard */}
          <div
            onClick={onNavigateToDashboard}
            className="group cursor-pointer rounded-3xl p-5 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 hover:border-forest-500 dark:hover:border-forest-600 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-950 flex items-center justify-center text-forest-600 dark:text-green-300 text-xl group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="font-display text-base font-bold text-forest-900 dark:text-forest-100 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                P&L Dashboard
              </h3>
              <p className="text-[11px] text-forest-600 dark:text-forest-400 leading-relaxed">
                Track saved harvest lots and real cumulative profit margins in Neon PostgreSQL.
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-700 dark:text-green-400 pt-1">
              <span>Open Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Dilemma: Why Guessing Fails Every Season */}
      <ProblemStrip />

      {/* 4. How It Works (3 Steps) */}
      <HowItWorks />

      {/* 5. Bottom Hero Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-forest-600/20 blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Stop Guessing Harvest Timing.
              <span className="text-green-400 block mt-1">Start Banking the Right Price.</span>
            </h2>
            <p className="text-sm text-forest-200 leading-relaxed">
              Join farmer producer organizations across Tamil Nadu who hold with science instead of fear.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onNavigateToAdvisor}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-white text-forest-900 hover:bg-forest-100 transition-all shadow-lg shadow-black/20 flex items-center justify-center space-x-2"
              >
                <span>Launch Advisor Now</span>
                <ArrowRight className="w-4 h-4 text-forest-700" />
              </button>
              <button
                onClick={onNavigateToDashboard}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-forest-800/80 hover:bg-forest-700 text-white border border-forest-600 transition-all flex items-center justify-center space-x-2"
              >
                <Database className="w-4 h-4 text-green-300" />
                <span>Open Neon Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
