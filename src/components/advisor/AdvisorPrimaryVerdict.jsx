import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { formatINR } from '../../lib/formatters';
import { buildWhatsAppShareUrl } from '../../lib/exportSummary';
import SummaryModal from './SummaryModal';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Share2,
  FileDown,
  Sparkles,
  Target,
  Database,
  ArrowRight,
} from 'lucide-react';

export default function AdvisorPrimaryVerdict({
  result,
  isLoading,
  onSaveToDatabase,
  isSaving,
  lastSavedId,
  onNavigateToDashboard,
  activeMarketAdvisory,
}) {
  const { lang, t, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-3xl p-7 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-5 animate-pulse h-full min-h-[600px] flex flex-col justify-between">
        <div className="h-28 bg-forest-100 dark:bg-forest-800 rounded-2xl w-full" />
        <div className="h-36 bg-forest-100 dark:bg-forest-800 rounded-2xl w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-forest-100 dark:bg-forest-800 rounded-2xl" />
          <div className="h-32 bg-forest-100 dark:bg-forest-800 rounded-2xl" />
        </div>
        <div className="h-16 bg-forest-100 dark:bg-forest-800 rounded-2xl w-full" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-3xl p-12 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft flex flex-col items-center justify-center text-center space-y-4 min-h-[600px]">
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
    <div id="advisor-verdict-section" className="space-y-5 font-sans h-full flex flex-col justify-between scroll-mt-24">
      {/* 1. Main Verdict Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className={`rounded-3xl p-6 sm:p-7 border shadow-lg relative overflow-hidden ${
          isHold
            ? 'bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900 text-white border-forest-600 shadow-glow-green/20'
            : 'bg-gradient-to-br from-tomato-700 via-tomato-800 to-tomato-900 text-white border-tomato-500 shadow-glow-red/20'
        }`}
      >
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative space-y-3.5">
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
            <div className="text-[11px] uppercase font-bold tracking-widest text-white/80 flex items-center space-x-1.5">
              <span>{result.crop?.emoji}</span>
              <span>ADVISORY FOR {result.crop?.name?.toUpperCase()}</span>
              {activeMarketAdvisory && (
                <span className="ml-1.5 px-2 py-0.2 rounded-full bg-amber-400 text-forest-950 text-[9px] font-black uppercase">
                  Live Market Velocity
                </span>
              )}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isHold ? `HOLD ${result.crop?.name?.toUpperCase()}` : `SELL ${result.crop?.name?.toUpperCase()} TODAY`}
            </h2>
          </div>

          {/* Active Market Velocity Price & Momentum Strip */}
          {activeMarketAdvisory && (
            <div className="flex flex-wrap items-center gap-2 text-xs bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <span>Mandi Price: <strong className="font-extrabold">₹{activeMarketAdvisory.currentPrice}/kg</strong></span>
              {activeMarketAdvisory.priceChangePct !== null && (
                <span className="flex items-center space-x-1">
                  <span className="text-white/70">• Velocity:</span>
                  <span className="font-black px-1.5 py-0.2 rounded bg-black/25 text-amber-300">
                    {activeMarketAdvisory.priceChangePct >= 0 ? `+${activeMarketAdvisory.priceChangePct}%` : `${activeMarketAdvisory.priceChangePct}%`}
                    {activeMarketAdvisory.priceChangePerKg !== null && (
                      <span className="ml-1 font-semibold text-white/90">
                        ({activeMarketAdvisory.priceChangePerKg >= 0 ? `+₹${activeMarketAdvisory.priceChangePerKg.toFixed(1)}` : `-₹${Math.abs(activeMarketAdvisory.priceChangePerKg).toFixed(1)}`}/kg)
                      </span>
                    )}
                  </span>
                </span>
              )}
            </div>
          )}

          <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal bg-black/20 p-3 rounded-2xl border border-white/10">
            {reasonText}
          </p>
        </div>
      </motion.div>

      {/* 2. Target "When will the price be the right price" Spotlight Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 bg-gradient-to-br from-amberGold-50 via-white to-forest-50 dark:from-forest-900 dark:via-forest-900/90 dark:to-forest-950 border-2 border-onion/40 dark:border-amber-700/50 shadow-soft space-y-3.5"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-forest-100 dark:border-forest-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-onion text-white flex items-center justify-center shadow-sm">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-forest-900 dark:text-forest-100">
                {t('rightPriceTitle')}
              </h3>
              <p className="text-[11px] text-forest-600 dark:text-forest-400">
                {t('rightPriceSubtitle')}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-onion text-white">
            {isHold ? 'PEAK TARGET' : 'SELL NOW'}
          </span>
        </div>

        {/* 3 Metric Target Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Target Date */}
          <div className="p-2.5 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
            <span className="text-[10px] font-semibold text-forest-600 dark:text-forest-400 block">
              {t('rightPriceDateLabel')}
            </span>
            <div className="font-display text-base font-bold text-forest-900 dark:text-forest-100 mt-0.5">
              {rightPrice.optimalDate}
            </div>
            <span className="text-[10px] text-forest-500">
              {rightPrice.daysAhead === 0 ? 'Today (Day 0)' : `In ${rightPrice.daysAhead} days`}
            </span>
          </div>

          {/* Target Price */}
          <div className="p-2.5 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
            <span className="text-[10px] font-semibold text-forest-600 dark:text-forest-400 block">
              {t('targetPriceLabel')}
            </span>
            <div className="font-display text-base font-extrabold text-forest-700 dark:text-green-400 mt-0.5">
              ₹{rightPrice.targetPrice?.toFixed(2)} / kg
            </div>
            <span className="text-[10px] text-forest-500">
              vs ₹{result.todayPrice?.toFixed(2)} today
            </span>
          </div>

          {/* Expected Net Realization */}
          <div className="p-2.5 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800">
            <span className="text-[10px] font-semibold text-forest-600 dark:text-forest-400 block">
              {t('expectedNetLabel')}
            </span>
            <div className="font-display text-base font-black text-forest-900 dark:text-forest-100 mt-0.5">
              {formatINR(rightPrice.targetNetMoney)}
            </div>
            <span className="text-[10px] font-bold text-forest-700 dark:text-green-400">
              {diffSign}{formatINR(Math.abs(result.difference))} ({result.percentGain >= 0 ? `+${result.percentGain}%` : `${result.percentGain}%`})
            </span>
          </div>
        </div>

        {/* Plain language explanation */}
        <p className="text-[11px] text-forest-800/90 dark:text-forest-200/90 leading-relaxed font-normal bg-forest-100/50 dark:bg-forest-800/40 p-2.5 rounded-xl border border-forest-200/60 dark:border-forest-700/60">
          💡 {lang === 'ta' ? rightPrice.tamilWhyRightPrice : rightPrice.whyRightPrice}
        </p>
      </motion.div>

      {/* 3. Side-by-Side Comparison Cards (SELL TODAY vs HOLD TO PEAK) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* SELL TODAY */}
        <div className={`rounded-3xl p-4 sm:p-5 border transition-all ${
          !isHold
            ? 'bg-red-50/60 dark:bg-red-950/30 border-tomato ring-2 ring-tomato/30 shadow-md'
            : 'bg-white dark:bg-forest-900 border-forest-100 dark:border-forest-800'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300">
              {t('sellNowCardTitle')}
            </span>
            <span className="text-[10px] text-forest-500 font-semibold">Immediate</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-forest-600 dark:text-forest-400">
              <span>{t('sellNowGross')} ({result.quantityKg?.toLocaleString('en-IN')}kg):</span>
              <span className="font-semibold text-forest-900 dark:text-forest-100">
                {formatINR(result.netSell)}
              </span>
            </div>
            <div className="flex justify-between text-forest-500 text-[11px]">
              <span>Storage & Spoilage:</span>
              <span>₹0 (0 kg)</span>
            </div>
            <div className="pt-2 border-t border-forest-100 dark:border-forest-800 flex justify-between items-baseline">
              <span className="font-bold text-forest-900 dark:text-forest-100 text-xs">
                {t('sellNowNet')}:
              </span>
              <span className="font-display text-xl sm:text-2xl font-black text-forest-900 dark:text-forest-100">
                {formatINR(result.netSell)}
              </span>
            </div>
          </div>
        </div>

        {/* HOLD UNTIL RIGHT PRICE */}
        <div className={`rounded-3xl p-4 sm:p-5 border transition-all ${
          isHold
            ? 'bg-green-50/60 dark:bg-green-950/30 border-forest-600 ring-2 ring-forest-600/30 shadow-md'
            : 'bg-white dark:bg-forest-900 border-forest-100 dark:border-forest-800'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300">
              {t('holdCardTitle')} ({result.bestDateFormatted})
            </span>
            <span className="text-[10px] text-green-700 dark:text-green-400 font-bold bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded-md">
              Target Peak
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-forest-600 dark:text-forest-400">
              <span>{t('holdGross')} ({result.usableQtyKg}kg @ ₹{result.projectedPriceAtBestDay}/kg):</span>
              <span className="font-semibold text-forest-900 dark:text-forest-100">
                {formatINR(result.grossHold)}
              </span>
            </div>
            <div className="flex justify-between text-tomato dark:text-red-400 text-[11px]">
              <span>Storage & Spoilage ({result.bestDay}d):</span>
              <span className="font-semibold">-{formatINR(result.storageCost + (result.spoilageKg * result.projectedPriceAtBestDay))}</span>
            </div>
            <div className="pt-2 border-t border-forest-100 dark:border-forest-800 flex justify-between items-baseline">
              <span className="font-bold text-forest-700 dark:text-green-400 text-xs">
                {t('holdNet')}:
              </span>
              <span className="font-display text-xl sm:text-2xl font-black text-forest-700 dark:text-green-400">
                {formatINR(result.netHold)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Difference Highlight Banner */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
        isHold
          ? 'bg-green-100/70 dark:bg-green-950/60 border-green-300 dark:border-green-800 text-forest-900 dark:text-green-200'
          : 'bg-red-100/70 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-forest-900 dark:text-red-200'
      }`}>
        <div className="flex items-center space-x-2 text-xs font-semibold">
          {isHold ? <TrendingUp className="w-4 h-4 text-forest-600" /> : <TrendingDown className="w-4 h-4 text-tomato" />}
          <span>
            {t('differenceHighlight')} {isHold ? 'HOLDING TO PEAK' : 'SELLING TODAY'}:
          </span>
        </div>
        <div className="font-display text-lg sm:text-xl font-black tracking-tight">
          {diffSign}{formatINR(Math.abs(result.difference))} ({result.percentGain >= 0 ? `+${result.percentGain}%` : `${result.percentGain}%`})
        </div>
      </div>

      {/* 5. Quick Action Buttons: Share & Download */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleOpenSummary}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl font-bold text-xs text-forest-800 dark:text-forest-100 bg-white dark:bg-forest-900 border border-forest-300 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-800 active:scale-95 transition-all shadow-sm"
        >
          <FileDown className="w-4 h-4 text-forest-600 dark:text-forest-400" />
          <span>{t('actionDownload')}</span>
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl font-bold text-xs text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all shadow-md shadow-green-900/15"
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
