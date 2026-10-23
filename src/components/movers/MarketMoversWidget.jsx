import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { CROPS } from '../../data/cropsData';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Flame,
  AlertTriangle,
  Sparkles,
  Zap,
  Activity,
} from 'lucide-react';

export default function MarketMoversWidget({ onSelectCropForAdvisor }) {
  const { lang, t } = useApp();
  const [timeWindow, setTimeWindow] = useState('7d'); // '24h' | '7d'

  // Calculate price changes for all crops
  const moversData = CROPS.map((crop) => {
    const history = crop.priceHistory;
    const latestPrice = history[history.length - 1];
    const prevDayPrice = history[history.length - 2] ?? latestPrice;
    const sevenDayPrice = history[0];

    // 24h change
    const change24h = latestPrice - prevDayPrice;
    const changePct24h = +((change24h / Math.max(1, prevDayPrice)) * 100).toFixed(1);

    // 7d velocity change
    const change7d = latestPrice - sevenDayPrice;
    const changePct7d = +((change7d / Math.max(1, sevenDayPrice)) * 100).toFixed(1);

    const activeChange = timeWindow === '24h' ? change24h : change7d;
    const activeChangePct = timeWindow === '24h' ? changePct24h : changePct7d;

    return {
      id: crop.id,
      name: crop.name,
      tamilName: crop.tamilName,
      emoji: crop.emoji,
      category: crop.category,
      latestPrice,
      activeChange,
      activeChangePct,
      change24h,
      changePct24h,
      change7d,
      changePct7d,
      history,
    };
  });

  // Top Gainers
  const topGainers = [...moversData]
    .sort((a, b) => b.activeChangePct - a.activeChangePct)
    .filter((c) => c.activeChangePct > 0)
    .slice(0, 4);

  // Top Decliners
  const topDecliners = [...moversData]
    .sort((a, b) => a.activeChangePct - b.activeChangePct)
    .filter((c) => c.activeChangePct < 0)
    .slice(0, 4);

  const handleAdviseClick = (crop) => {
    if (onSelectCropForAdvisor) {
      onSelectCropForAdvisor({
        cropId: crop.id,
        cropName: crop.name,
        currentPrice: crop.latestPrice,
        priceChangePct: crop.activeChangePct,
        priceChangePerKg: crop.activeChange,
        timeWindow: timeWindow,
        emoji: crop.emoji,
        category: crop.category,
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-5 font-sans">
      {/* Header with 24h / 7d Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-forest-100 dark:border-forest-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-900/10">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-forest-900 dark:text-forest-100">
                Market Velocity & Top Movers
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Fast-Scan Leaderboard
              </span>
            </div>
            <p className="text-xs text-forest-600 dark:text-forest-400">
              Top price surges and steep declines across mandis in real time
            </p>
          </div>
        </div>

        {/* Time Window Switcher */}
        <div className="flex rounded-xl bg-forest-100/70 dark:bg-forest-800/70 p-1 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeWindow('24h')}
            className={`px-3 py-1 rounded-lg transition-all ${
              timeWindow === '24h'
                ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
            }`}
          >
            Today (24h Moves)
          </button>
          <button
            type="button"
            onClick={() => setTimeWindow('7d')}
            className={`px-3 py-1 rounded-lg transition-all ${
              timeWindow === '7d'
                ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
            }`}
          >
            Weekly Velocity (7-Day)
          </button>
        </div>
      </div>

      {/* Two Column Grid: Top Gainers vs Top Decliners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Gainers Column */}
        <div className="rounded-2xl p-4 bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/60 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-green-200/60 dark:border-green-900/40">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-800 dark:text-green-300">
              <TrendingUp className="w-4 h-4 text-forest-600 dark:text-green-400" />
              <span>TOP GAINERS (BULLISH MOMENTUM)</span>
            </div>
            <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">
              Strong Demand Pull
            </span>
          </div>

          <div className="space-y-2">
            {topGainers.map((crop, idx) => (
              <div
                key={crop.id}
                className="p-2.5 rounded-xl bg-white dark:bg-forest-900 border border-green-100 dark:border-green-900/40 flex items-center justify-between hover:shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{crop.emoji}</span>
                  <div>
                    <div className="font-bold text-xs text-forest-900 dark:text-forest-100 flex items-center space-x-1.5">
                      <span>{lang === 'ta' ? crop.tamilName : crop.name}</span>
                      <span className="text-[10px] font-semibold text-forest-500">
                        ₹{crop.latestPrice}/kg
                      </span>
                    </div>
                    <div className="text-[10px] text-forest-500">
                      {idx === 0
                        ? '🔥 Peak festive rally'
                        : idx === 1
                        ? 'Arrivals down ~24%'
                        : 'Wholesale buying surge'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="inline-flex items-center text-xs font-extrabold text-forest-700 dark:text-green-400">
                      +{crop.activeChangePct}%
                    </span>
                    <span className="text-[10px] text-forest-500 block">
                      +₹{crop.activeChange.toFixed(1)}/kg
                    </span>
                  </div>

                  {onSelectCropForAdvisor && (
                    <button
                      type="button"
                      onClick={() => handleAdviseClick(crop)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors shadow-sm flex items-center space-x-1"
                      title={`Run Hold or Sell Advisor for ${crop.name}`}
                    >
                      <span>Advise</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Decliners Column */}
        <div className="rounded-2xl p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-red-200/60 dark:border-red-900/40">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-tomato dark:text-red-300">
              <TrendingDown className="w-4 h-4 text-tomato dark:text-red-400" />
              <span>TOP DECLINERS (SUPPLY GLUT / BEARISH)</span>
            </div>
            <span className="text-[10px] font-semibold text-red-700 dark:text-red-400">
              Arrival Inflow Surge
            </span>
          </div>

          <div className="space-y-2">
            {topDecliners.map((crop, idx) => (
              <div
                key={crop.id}
                className="p-2.5 rounded-xl bg-white dark:bg-forest-900 border border-red-100 dark:border-red-900/40 flex items-center justify-between hover:shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{crop.emoji}</span>
                  <div>
                    <div className="font-bold text-xs text-forest-900 dark:text-forest-100 flex items-center space-x-1.5">
                      <span>{lang === 'ta' ? crop.tamilName : crop.name}</span>
                      <span className="text-[10px] font-semibold text-forest-500">
                        ₹{crop.latestPrice}/kg
                      </span>
                    </div>
                    <div className="text-[10px] text-forest-500">
                      {idx === 0
                        ? '⚠️ Heavy local glut'
                        : idx === 1
                        ? 'Rapid shelf-life decay'
                        : 'Arrival inflow up ~35%'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="inline-flex items-center text-xs font-extrabold text-tomato dark:text-red-400">
                      {crop.activeChangePct}%
                    </span>
                    <span className="text-[10px] text-forest-500 block">
                      -₹{Math.abs(crop.activeChange).toFixed(1)}/kg
                    </span>
                  </div>

                  {onSelectCropForAdvisor && (
                    <button
                      type="button"
                      onClick={() => handleAdviseClick(crop)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-tomato hover:bg-red-700 transition-colors shadow-sm flex items-center space-x-1"
                      title={`Run Hold or Sell Advisor for ${crop.name}`}
                    >
                      <span>Advise</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
