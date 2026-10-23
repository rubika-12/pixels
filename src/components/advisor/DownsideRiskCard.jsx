import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { formatINR } from '../../lib/formatters';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  ArrowDownRight,
  Info,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export default function DownsideRiskCard({ downsideRisk, isHold, netSell, difference }) {
  const { lang, t } = useApp();

  if (!downsideRisk) return null;

  const {
    priceFloor,
    priceFloorPerQuintal,
    historicalCrashDropPercent,
    historicalVolatilityHitRate,
    worstCaseLossRupees,
    worstCaseLossPercent,
    worstCaseNetInHand,
    safetyStopLossPrice,
    upsidePotentialRupees,
    riskRewardRatio,
  } = downsideRisk;

  // Visual calculation for upside vs downside bar
  const totalBarSpread = (upsidePotentialRupees || 0) + (worstCaseLossRupees || 1);
  const upsidePct = Math.max(15, Math.min(85, Math.round(((upsidePotentialRupees || 0) / totalBarSpread) * 100)));
  const downsidePct = 100 - upsidePct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-red-50/80 via-white to-amber-50/60 dark:from-red-950/40 dark:via-forest-900 dark:to-forest-950 border-2 border-red-200 dark:border-red-900/60 shadow-soft space-y-4 font-sans"
    >
      {/* Top Warning Banner */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-red-100 dark:border-red-900/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-2 py-0.5 rounded-md">
                Downside Risk Protection
              </span>
              <span className="text-xs text-forest-500 font-semibold">Worst-Case Scenario</span>
            </div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-forest-900 dark:text-forest-100 mt-0.5">
              Price Crash & Volatility Exposure
            </h3>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold text-forest-500 uppercase tracking-wider block">
            Volatility Hit-Rate
          </span>
          <span className="text-sm font-extrabold text-amber-700 dark:text-amber-400">
            {historicalVolatilityHitRate}% Historical Surge Risk
          </span>
        </div>
      </div>

      {/* Explicit Rupee Crash Warning Box */}
      <div className="p-3.5 rounded-2xl bg-red-100/70 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-forest-900 dark:text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-extrabold text-red-800 dark:text-red-300 block sm:inline mr-1">
              If prices crash:
            </span>
            <span>
              You could lose up to{' '}
              <strong className="font-display font-black text-red-700 dark:text-red-300 text-sm sm:text-base">
                {formatINR(worstCaseLossRupees)}
              </strong>{' '}
              (-{worstCaseLossPercent}%) vs selling today.
            </span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl bg-white dark:bg-forest-900 border border-red-200 dark:border-red-800 text-right self-start sm:self-auto shrink-0">
          <span className="text-[10px] font-bold text-forest-500 uppercase block">Floor Mandi Rate</span>
          <span className="font-display font-extrabold text-xs sm:text-sm text-red-600 dark:text-red-400">
            ₹{priceFloor}/kg (₹{priceFloorPerQuintal}/qtl)
          </span>
        </div>
      </div>

      {/* 3 Scenario Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Stop-Loss Trigger */}
        <div className="p-3 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-forest-600 dark:text-forest-400">
              Safety Stop-Loss Price
            </span>
            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="font-display text-base font-extrabold text-forest-900 dark:text-forest-100 mt-1">
            ₹{safetyStopLossPrice} / kg
          </div>
          <span className="text-[10px] text-forest-500">
            Liquidate immediately if price breaks below this
          </span>
        </div>

        {/* Metric 2: Worst-Case Net in Hand */}
        <div className="p-3 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-forest-600 dark:text-forest-400">
              Worst-Case Realization
            </span>
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="font-display text-base font-extrabold text-red-700 dark:text-red-400 mt-1">
            {formatINR(worstCaseNetInHand)}
          </div>
          <span className="text-[10px] text-forest-500">
            Net cash in hand if market hits -{historicalCrashDropPercent}% floor
          </span>
        </div>

        {/* Metric 3: Risk-to-Reward Ratio */}
        <div className="p-3 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-forest-600 dark:text-forest-400">
              Risk-to-Reward Ratio
            </span>
            <Activity className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="font-display text-base font-extrabold text-forest-900 dark:text-forest-100 mt-1">
            1 : {riskRewardRatio}
          </div>
          <span className="text-[10px] text-forest-500">
            {upsidePotentialRupees > 0
              ? `Risk ₹${riskRewardRatio} downside per ₹1 upside`
              : 'Zero upside buffer; Sell immediately'}
          </span>
        </div>
      </div>

      {/* Visual Upside Potential vs Downside Risk Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-forest-700 dark:text-green-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Target Upside: +{formatINR(upsidePotentialRupees)}</span>
          </span>
          <span className="text-tomato dark:text-red-400 flex items-center space-x-1">
            <TrendingDown className="w-3 h-3" />
            <span>Crash Downside: -{formatINR(worstCaseLossRupees)}</span>
          </span>
        </div>

        <div className="h-3 rounded-full bg-forest-100 dark:bg-forest-800 overflow-hidden flex">
          <div
            style={{ width: `${upsidePct}%` }}
            className="bg-forest-600 dark:bg-green-500 h-full transition-all"
            title={`Upside Potential: ${upsidePct}%`}
          />
          <div
            style={{ width: `${downsidePct}%` }}
            className="bg-red-500 dark:bg-red-600 h-full transition-all"
            title={`Downside Risk: ${downsidePct}%`}
          />
        </div>

        <div className="flex justify-between text-[10px] text-forest-500 font-medium">
          <span>{upsidePct}% Potential Upside</span>
          <span>{downsidePct}% Crash Exposure</span>
        </div>
      </div>

      {/* Downside Protection Advice Note */}
      <div className="text-[11px] text-forest-700 dark:text-forest-300 bg-white/70 dark:bg-forest-900/60 p-2.5 rounded-xl border border-forest-100 dark:border-forest-800 flex items-center space-x-2">
        <Info className="w-4 h-4 text-forest-600 dark:text-green-400 shrink-0" />
        <span>
          <strong>Downside Protection Rule:</strong> If local arrivals suddenly surge and mandi rate drops below{' '}
          <strong>₹{safetyStopLossPrice}/kg</strong>, liquidate immediately. Do not wait for the target peak day, as price degradation combined with daily storage fees will compound your losses.
        </span>
      </div>
    </motion.div>
  );
}
