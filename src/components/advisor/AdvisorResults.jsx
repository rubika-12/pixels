import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { formatINR } from '../../lib/formatters';
import { buildWhatsAppShareUrl } from '../../lib/exportSummary';
import ShelfLifeGauge from './ShelfLifeGauge';
import PriceTrendChart from './PriceTrendChart';
import NetValueChart from './NetValueChart';
import FactorsBreakdown from './FactorsBreakdown';
import DecisionHorizonMatrix from './DecisionHorizonMatrix';
import DownsideRiskCard from './DownsideRiskCard';
import SummaryModal from './SummaryModal';
import { calculateMandiArbitrage } from '../../lib/arbitrage';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Share2,
  FileDown,
  Sparkles,
  Target,
  Clock,
  Coins,
  CheckCircle2,
  Database,
  ArrowRight,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function AdvisorResults({
  result,
  isLoading,
  onSaveToDatabase,
  isSaving,
  lastSavedId,
  onNavigateToDashboard,
  onNavigateToArbitrage,
}) {
  const { lang, t, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArbitrageSnapshot, setShowArbitrageSnapshot] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-3xl p-7 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-6 animate-pulse">
        <div className="h-28 bg-forest-100 dark:bg-forest-800 rounded-2xl w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-36 bg-forest-100 dark:bg-forest-800 rounded-2xl" />
          <div className="h-36 bg-forest-100 dark:bg-forest-800 rounded-2xl" />
        </div>
        <div className="h-28 bg-forest-100 dark:bg-forest-800 rounded-2xl" />
        <div className="h-64 bg-forest-100 dark:bg-forest-800 rounded-2xl" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-3xl p-12 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
        <div className="w-20 h-20 rounded-3xl bg-forest-50 dark:bg-forest-950/80 flex items-center justify-center text-4xl shadow-inner">
          🌱
        </div>
        <h3 className="font-display text-2xl font-bold text-forest-900 dark:text-forest-100">
          {t('emptyStateTitle')}
        </h3>
        <p className="text-sm text-forest-700/80 dark:text-forest-300/80 max-w-sm leading-relaxed">
          {t('emptyStateDesc')}
        </p>
      </div>
    );
  }

  const isHold = result.verdict === 'HOLD';
  const reasonText = lang === 'ta' && result.tamilReason ? result.tamilReason : result.reason;
  const diffSign = result.difference >= 0 ? '+' : '-';
  const rightPrice = result.rightPriceDetails;

  // Inter-mandi quick arbitrage snapshot for this result's crop and quantity
  const arbitrageSnapshot = calculateMandiArbitrage({
    cropId: result.crop?.id || 'tomato',
    quantityKg: result.quantityKg || 1000,
    basePrice: result.todayPrice || 18,
  });

  const handleShareWhatsApp = () => {
    const url = buildWhatsAppShareUrl(result);
    window.open(url, '_blank');
    showToast('Opening WhatsApp with pre-filled advisory report!', 'success');
  };

  const handleOpenSummary = () => {
    setIsModalOpen(true);
    showToast(t('toastDownloaded'), 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Main Verdict Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`rounded-3xl p-6 sm:p-7 border shadow-lg relative overflow-hidden ${
          isHold
            ? 'bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900 text-white border-forest-600 shadow-glow-green/20'
            : 'bg-gradient-to-br from-tomato-700 via-tomato-800 to-tomato-900 text-white border-tomato-500 shadow-glow-red/20'
        }`}
      >
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {result.confidence === 'HIGH'
                  ? t('highConfidence')
                  : result.confidence === 'MEDIUM'
                  ? t('medConfidence')
                  : t('lowConfidence')}
              </span>
            </span>

            <span className="inline-flex items-center space-x-1 text-xs font-bold text-white/90 bg-black/25 px-3 py-1 rounded-full border border-white/10">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {isHold ? `${result.bestDateFormatted} (Hold +${result.bestDay}d)` : `Sell Today (${result.bestDateFormatted})`}
              </span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase font-bold tracking-widest text-white/80">
              {t('resultsTitle')}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isHold ? t('verdictHold') : t('verdictSell')}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal bg-black/20 p-3.5 rounded-2xl border border-white/10">
            {reasonText}
          </p>
        </div>
      </motion.div>

      {/* Target "When will the price be the right price" Spotlight Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 bg-gradient-to-br from-amberGold-50 via-white to-forest-50 dark:from-forest-900 dark:via-forest-900/90 dark:to-forest-950 border-2 border-onion/40 dark:border-amber-700/50 shadow-md space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-forest-100 dark:border-forest-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-onion text-white flex items-center justify-center shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-forest-900 dark:text-forest-100">
                {t('rightPriceTitle')}
              </h3>
              <p className="text-xs text-forest-600 dark:text-forest-400">
                {t('rightPriceSubtitle')}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-onion text-white">
            {isHold ? 'PEAK DATE TARGET' : 'SELL IMMEDIATELY'}
          </span>
        </div>

        {/* 3 Metric Target Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Target Date */}
          <div className="p-3 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
            <span className="text-[11px] font-semibold text-forest-600 dark:text-forest-400 block">
              {t('rightPriceDateLabel')}
            </span>
            <div className="font-display text-lg font-bold text-forest-900 dark:text-forest-100 mt-0.5">
              {rightPrice.optimalDate}
            </div>
            <span className="text-[10px] text-forest-500">
              {rightPrice.daysAhead === 0 ? 'Today (Day 0)' : `In ${rightPrice.daysAhead} days`}
            </span>
          </div>

          {/* Target Price */}
          <div className="p-3 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
            <span className="text-[11px] font-semibold text-forest-600 dark:text-forest-400 block">
              {t('targetPriceLabel')}
            </span>
            <div className="font-display text-lg font-extrabold text-forest-700 dark:text-green-400 mt-0.5">
              ₹{rightPrice.targetPrice?.toFixed(2)} / kg
            </div>
            <span className="text-[10px] text-forest-500">
              vs ₹{result.todayPrice?.toFixed(2)} today
            </span>
          </div>

          {/* Expected Net Realization */}
          <div className="p-3 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
            <span className="text-[11px] font-semibold text-forest-600 dark:text-forest-400 block">
              {t('expectedNetLabel')}
            </span>
            <div className="font-display text-lg font-black text-forest-900 dark:text-forest-100 mt-0.5">
              {formatINR(rightPrice.targetNetMoney)}
            </div>
            <span className="text-[10px] font-bold text-forest-700 dark:text-green-400">
              {diffSign}{formatINR(Math.abs(result.difference))} ({result.percentGain >= 0 ? `+${result.percentGain}%` : `${result.percentGain}%`})
            </span>
          </div>
        </div>

        {/* Plain language explanation */}
        <p className="text-xs text-forest-800/90 dark:text-forest-200/90 leading-relaxed font-normal bg-forest-100/50 dark:bg-forest-800/40 p-3 rounded-xl border border-forest-200/60 dark:border-forest-700/60">
          💡 {lang === 'ta' ? rightPrice.tamilWhyRightPrice : rightPrice.whyRightPrice}
        </p>
      </motion.div>

      {/* Explicit Downside Risk Protection Card (Gap 3 Fix) */}
      <DownsideRiskCard
        downsideRisk={result.downsideRisk}
        isHold={isHold}
        netSell={result.netSell}
        difference={result.difference}
      />

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* SELL TODAY */}
        <div className={`rounded-3xl p-5 border transition-all ${
          !isHold
            ? 'bg-red-50/60 dark:bg-red-950/30 border-tomato ring-2 ring-tomato/30 shadow-md'
            : 'bg-white dark:bg-forest-900 border-forest-100 dark:border-forest-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300">
              {t('sellNowCardTitle')} ({result.chartData[6]?.label?.replace(' (Today)', '') || 'Today'})
            </span>
            <span className="text-[10px] text-forest-500 font-semibold">Immediate</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-forest-600 dark:text-forest-400">
              <span>{t('sellNowGross')} ({result.quantityKg.toLocaleString('en-IN')}kg @ ₹{result.todayPrice}/kg):</span>
              <span className="font-semibold text-forest-900 dark:text-forest-100">
                {formatINR(result.netSell)}
              </span>
            </div>
            <div className="flex justify-between text-forest-500">
              <span>{t('sellNowStorage')}:</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between text-forest-500">
              <span>{t('sellNowSpoilage')}:</span>
              <span>0 kg (0%)</span>
            </div>
            <div className="pt-2 border-t border-forest-100 dark:border-forest-800 flex justify-between items-baseline">
              <span className="font-bold text-forest-900 dark:text-forest-100 text-xs">
                {t('sellNowNet')}:
              </span>
              <span className="font-display text-2xl font-black text-forest-900 dark:text-forest-100">
                {formatINR(result.netSell)}
              </span>
            </div>
          </div>
        </div>

        {/* HOLD UNTIL RIGHT PRICE */}
        <div className={`rounded-3xl p-5 border transition-all ${
          isHold
            ? 'bg-green-50/60 dark:bg-green-950/30 border-forest-600 ring-2 ring-forest-600/30 shadow-md'
            : 'bg-white dark:bg-forest-900 border-forest-100 dark:border-forest-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300">
              {t('holdCardTitle')} ({result.bestDateFormatted})
            </span>
            <span className="text-[10px] text-green-700 dark:text-green-400 font-bold bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded-md">
              Target Peak
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-forest-600 dark:text-forest-400">
              <span>{t('holdGross')} ({result.usableQtyKg}kg @ ₹{result.projectedPriceAtBestDay}/kg):</span>
              <span className="font-semibold text-forest-900 dark:text-forest-100">
                {formatINR(result.grossHold)}
              </span>
            </div>
            <div className="flex justify-between text-tomato dark:text-red-400">
              <span>{t('holdStorage')} ({result.bestDay}d):</span>
              <span className="font-semibold">-{formatINR(result.storageCost)}</span>
            </div>
            <div className="flex justify-between text-tomato dark:text-red-400">
              <span>{t('holdSpoilage')}:</span>
              <span className="font-semibold">-{result.spoilageKg} kg ({result.spoilagePercent}%)</span>
            </div>
            <div className="pt-2 border-t border-forest-100 dark:border-forest-800 flex justify-between items-baseline">
              <span className="font-bold text-forest-700 dark:text-green-400 text-xs">
                {t('holdNet')}:
              </span>
              <span className="font-display text-2xl font-black text-forest-700 dark:text-green-400">
                {formatINR(result.netHold)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Difference Highlight Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between ${
        isHold
          ? 'bg-green-100/70 dark:bg-green-950/60 border-green-300 dark:border-green-800 text-forest-900 dark:text-green-200'
          : 'bg-red-100/70 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-forest-900 dark:text-red-200'
      }`}>
        <div className="flex items-center space-x-2 text-xs font-semibold">
          {isHold ? <TrendingUp className="w-5 h-5 text-forest-600" /> : <TrendingDown className="w-5 h-5 text-tomato" />}
          <span>
            {t('differenceHighlight')} {isHold ? 'HOLDING TO PEAK' : 'SELLING TODAY'}:
          </span>
        </div>
        <div className="font-display text-xl font-black tracking-tight">
          {diffSign}{formatINR(Math.abs(result.difference))} ({result.percentGain >= 0 ? `+${result.percentGain}%` : `${result.percentGain}%`})
        </div>
      </div>

      {/* "Your Options" Consolidated Multi-Horizon Matrix (Gap 2 Fix) */}
      <DecisionHorizonMatrix
        matrix={result.decisionMatrix}
        bestDay={result.bestDay}
        isHold={isHold}
        currentPrice={result.todayPrice}
        quantityKg={result.quantityKg}
      />

      {/* "Where to Sell" Inter-Mandi Arbitrage Snapshot (Gap 4 Integration) */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-forest-50/70 via-white to-forest-50/40 dark:from-forest-900 dark:via-forest-950 dark:to-forest-900 border border-forest-200 dark:border-forest-800 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              <Truck className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-forest-900 dark:text-forest-100 flex items-center space-x-1.5">
                <span>Inter-Mandi Arbitrage Snapshot</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  Where to Sell
                </span>
              </div>
              <div className="text-[11px] text-forest-600 dark:text-forest-400">
                Top Mandi: <strong>{arbitrageSnapshot.bestMandi.name}</strong> •{' '}
                {arbitrageSnapshot.hasArbitrageProfit
                  ? `Extra +${formatINR(arbitrageSnapshot.maxArbitrageGain)} net after transport!`
                  : 'Local Mandi is optimal'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowArbitrageSnapshot(!showArbitrageSnapshot)}
              className="px-2.5 py-1 rounded-xl text-xs font-bold border border-forest-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-forest-700 dark:text-forest-200 flex items-center space-x-1"
            >
              <span>{showArbitrageSnapshot ? 'Hide' : 'Quick View'}</span>
              {showArbitrageSnapshot ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {onNavigateToArbitrage && (
              <button
                type="button"
                onClick={onNavigateToArbitrage}
                className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors flex items-center space-x-1 shadow-sm"
              >
                <span>Full Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {showArbitrageSnapshot && (
          <div className="pt-2 border-t border-forest-100 dark:border-forest-800/80 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {arbitrageSnapshot.comparison.slice(0, 3).map((m) => (
                <div
                  key={m.mandiId}
                  className={`p-2.5 rounded-xl border ${
                    m.isWinner
                      ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-800'
                      : 'bg-white dark:bg-forest-900 border-forest-100 dark:border-forest-800'
                  }`}
                >
                  <div className="font-bold text-forest-900 dark:text-forest-100 flex items-center justify-between">
                    <span className="line-clamp-1">{m.name.split(',')[0]}</span>
                    {m.isWinner && (
                      <span className="text-[9px] font-black bg-green-600 text-white px-1 rounded">
                        WINNER
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-[11px] text-forest-600 dark:text-forest-400 mt-1">
                    <span>{m.distanceKm} km</span>
                    <span className="font-bold text-forest-900 dark:text-white">
                      {formatINR(m.netInHand)} net
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shelf-Life Radial Gauge & Storage Condition Behavior */}
      <ShelfLifeGauge
        daysRemaining={result.remainingShelfLife}
        totalDays={result.crop.baseShelfLife * result.storage.factor}
        status={result.shelfLifeStatus}
      />

      {/* Current Market Price Trends by Date (Line Chart) */}
      <PriceTrendChart
        chartData={result.chartData}
        bestDay={result.bestDay}
        isHold={isHold}
      />

      {/* Net Value by Date Chart (Bar Chart) */}
      <NetValueChart
        dayByDay={result.dayByDay}
        netSell={result.netSell}
        bestDay={result.bestDay}
      />

      {/* Complete Multi-Factor Breakdown */}
      <FactorsBreakdown factors={result.factorBreakdown} />

      {/* Neon Database Action Card */}
      <div className="p-4 rounded-3xl bg-forest-50/80 dark:bg-forest-950/60 border border-forest-200 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            <Database className="w-4 h-4 text-green-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-forest-900 dark:text-forest-100 flex items-center space-x-1.5">
              <span>Neon PostgreSQL Sync</span>
              {lastSavedId && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300 font-bold">
                  Saved #{lastSavedId}
                </span>
              )}
            </div>
            <div className="text-[11px] text-forest-600 dark:text-forest-400">
              {lastSavedId
                ? 'This recommendation is saved in your Neon database.'
                : 'Save this stock lot into your Neon database to track in your Dashboard.'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onSaveToDatabase && (
            <button
              onClick={onSaveToDatabase}
              disabled={isSaving}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors shadow-sm disabled:opacity-60 flex items-center space-x-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : lastSavedId ? 'Update in DB' : 'Save to Neon DB'}</span>
            </button>
          )}

          {onNavigateToDashboard && (
            <button
              onClick={onNavigateToDashboard}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-forest-800 dark:text-forest-200 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors flex items-center space-x-1"
            >
              <span>View in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons: Download Slip & WhatsApp Share */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        <button
          onClick={handleOpenSummary}
          className="flex items-center justify-center space-x-2 py-3.5 px-5 rounded-2xl font-bold text-xs text-forest-800 dark:text-forest-100 bg-white dark:bg-forest-900 border border-forest-300 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-800 active:scale-95 transition-all shadow-sm"
        >
          <FileDown className="w-4 h-4 text-forest-600 dark:text-forest-400" />
          <span>{t('actionDownload')}</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center space-x-2 py-3.5 px-5 rounded-2xl font-bold text-xs text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all shadow-md shadow-green-900/15"
        >
          <Share2 className="w-4 h-4" />
          <span>{t('actionShareWhatsApp')}</span>
        </button>
      </div>

      {/* Printable Receipt Modal */}
      <SummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
      />
    </div>
  );
}
