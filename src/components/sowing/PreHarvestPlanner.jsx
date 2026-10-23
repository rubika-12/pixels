import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { SOWING_SEASONS, SOWING_CROPS_GUIDE } from '../../data/sowingData';
import { formatINR } from '../../lib/formatters';
import {
  Sprout,
  Droplets,
  Calendar,
  Coins,
  TrendingUp,
  Scale,
  Sparkles,
  CheckCircle2,
  Info,
  Layers,
  Thermometer,
  ShieldCheck,
  ArrowRight,
  Sun,
  CloudRain,
  Snowflake,
} from 'lucide-react';

export default function PreHarvestPlanner({ onSelectCropForAdvisor }) {
  const { lang, t } = useApp();

  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCropId, setSelectedCropId] = useState('tomato');
  const [acreage, setAcreage] = useState(2.0);

  const selectedCrop =
    SOWING_CROPS_GUIDE.find((c) => c.id === selectedCropId) || SOWING_CROPS_GUIDE[0];

  // Filter crops by season
  const filteredCrops = SOWING_CROPS_GUIDE.filter((c) => {
    if (selectedSeason === 'all') return true;
    return c.seasons.includes(selectedSeason) || c.seasons.includes('all');
  });

  // Financial & agronomic calculations for input acreage
  const totalQuintalsAvg = Math.round(selectedCrop.expectedYieldQuintalsPerAcre.avg * acreage);
  const totalQuintalsMin = Math.round(selectedCrop.expectedYieldQuintalsPerAcre.min * acreage);
  const totalQuintalsMax = Math.round(selectedCrop.expectedYieldQuintalsPerAcre.max * acreage);
  const totalKgAvg = totalQuintalsAvg * 100;

  const totalCost = Math.round(selectedCrop.costOfCultivationPerAcre.totalCostRs * acreage);
  const forecastPrice = selectedCrop.forecastHarvestPricePerKg[selectedSeason] || selectedCrop.forecastHarvestPricePerKg.avg;
  const projectedGross = Math.round(totalKgAvg * forecastPrice);
  const projectedNet = projectedGross - totalCost;
  const roiPct = Math.round((projectedNet / Math.max(1, totalCost)) * 100);

  const getSeasonIcon = (seasonId) => {
    switch (seasonId) {
      case 'kharif':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'rabi':
        return <Snowflake className="w-4 h-4 text-cyan-500" />;
      case 'zaid':
        return <Sun className="w-4 h-4 text-amber-500" />;
      default:
        return <Sprout className="w-4 h-4 text-forest-600" />;
    }
  };

  return (
    <div id="pre-harvest-planner" className="py-6 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300 mb-2">
            <Sprout className="w-3.5 h-3.5 text-forest-600 dark:text-green-400" />
            <span>PRE-HARVEST SOWING & CROP PLANNING GUIDE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-forest-900 dark:text-forest-100">
            Plan a Season: Sowing, Water & Yield Forecast
          </h2>
          <p className="text-sm sm:text-base text-forest-700/80 dark:text-forest-300/80 mt-1 max-w-2xl">
            Choose the most profitable crop before sowing. Calculate required acreage investment, water needs, and expected harvest window market rates.
          </p>
        </div>

        <div className="text-xs font-bold text-forest-600 dark:text-forest-400 bg-white dark:bg-forest-900 p-2.5 rounded-2xl border border-forest-200 dark:border-forest-800 flex items-center space-x-2 self-start md:self-auto">
          <Calendar className="w-4 h-4 text-forest-600 dark:text-green-400" />
          <span>Kharif • Rabi • Zaid Crop Rotations</span>
        </div>
      </div>

      {/* Season Selection & Acreage Input Bar */}
      <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Seasons Tabs */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 block mb-1.5">
              Select Planting Season
            </label>
            <div className="flex flex-wrap rounded-2xl bg-forest-100/70 dark:bg-forest-800/70 p-1 text-xs font-bold gap-1">
              {SOWING_SEASONS.map((s) => {
                const isSelected = selectedSeason === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSeason(s.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${isSelected
                        ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                        : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
                      }`}
                  >
                    {getSeasonIcon(s.id)}
                    <span>{lang === 'ta' ? s.tamilName : s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acreage Input & Presets */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 mb-1">
                <span>Land Acreage</span>
                <span className="text-forest-500 font-semibold">{acreage} Acres</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0.25"
                  max="100"
                  step="0.25"
                  value={acreage}
                  onChange={(e) => setAcreage(Math.max(0.25, Number(e.target.value) || 0.25))}
                  className="w-28 px-3 py-2 rounded-xl text-xs font-black border border-forest-300 dark:border-forest-700 bg-forest-50/50 dark:bg-forest-950 text-forest-900 dark:text-forest-100"
                />
                <div className="flex space-x-1">
                  {[1.0, 2.5, 5.0].map((ac) => (
                    <button
                      key={ac}
                      type="button"
                      onClick={() => setAcreage(ac)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold border ${acreage === ac
                          ? 'bg-forest-700 text-white border-forest-700'
                          : 'bg-white dark:bg-forest-800 text-forest-700 dark:text-forest-200 border-forest-200 dark:border-forest-700'
                        }`}
                    >
                      {ac}ac
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crops Selector Pills */}
        <div className="pt-2 border-t border-forest-100 dark:border-forest-800">
          <label className="text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 block mb-2">
            Select Crop to Plan ({filteredCrops.length} Crops Available)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {filteredCrops.map((c) => {
              const isSelected = selectedCropId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCropId(c.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${isSelected
                      ? 'border-forest-600 dark:border-forest-500 bg-forest-50 dark:bg-forest-950 ring-2 ring-forest-600/30 shadow-sm'
                      : 'border-forest-200 dark:border-forest-800 bg-white dark:bg-forest-900 hover:bg-forest-50/50'
                    }`}
                >
                  <span className="text-2xl mb-1">{c.emoji}</span>
                  <span className="text-xs font-bold text-forest-900 dark:text-forest-100 line-clamp-1">
                    {lang === 'ta' ? c.tamilName.split('(')[0] : c.cropName.split('(')[0]}
                  </span>
                  <span className="text-[10px] text-forest-500 font-semibold">
                    ~{c.expectedYieldQuintalsPerAcre.avg} qtl/ac
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Selected Crop Dashboard */}
      <motion.div
        key={selectedCrop.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-forest-50/90 via-white to-forest-50/50 dark:from-forest-900 dark:via-forest-900 dark:to-forest-950 border border-forest-200 dark:border-forest-800 shadow-soft space-y-6"
      >
        {/* Top Summary Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-forest-200 dark:border-forest-800 gap-4">
          <div className="flex items-center space-x-3.5">
            <span className="text-4xl p-2.5 rounded-2xl bg-white dark:bg-forest-950 border border-forest-100 dark:border-forest-800 shadow-sm">
              {selectedCrop.emoji}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-extrabold text-2xl text-forest-900 dark:text-forest-100">
                  {lang === 'ta' ? selectedCrop.tamilName : selectedCrop.cropName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-green-300">
                  {selectedCrop.category === 'fruit' ? 'Perennial / Orchard' : 'Short Vegetable Cycle'}
                </span>
              </div>
              <p className="text-xs text-forest-600 dark:text-forest-400 mt-0.5">
                Full crop cycle: <strong>{selectedCrop.totalCropCycleDays} days</strong> • Nursery: {selectedCrop.nurseryPeriodDays}d • Field duration: {selectedCrop.fieldDurationDays}d
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start lg:self-auto">
            {onSelectCropForAdvisor && (
              <button
                type="button"
                onClick={() => onSelectCropForAdvisor(selectedCrop.id)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <span>Check Post-Harvest Storage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Essential Seasonal Calculations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Expected Yield */}
          <div className="p-4 rounded-2xl bg-white dark:bg-forest-950/80 border border-forest-100 dark:border-forest-800 space-y-1">
            <div className="flex items-center justify-between text-forest-600 dark:text-forest-400 text-xs font-bold uppercase">
              <span>Expected Harvest Yield</span>
              <Scale className="w-4 h-4 text-forest-600" />
            </div>
            <div className="font-display text-2xl font-black text-forest-900 dark:text-forest-100">
              {totalQuintalsAvg.toLocaleString('en-IN')} Quintals
            </div>
            <span className="text-[11px] text-forest-500 block">
              ({totalKgAvg.toLocaleString('en-IN')} kg for {acreage} acres)
            </span>
          </div>

          {/* Metric 2: Cultivation Investment */}
          <div className="p-4 rounded-2xl bg-white dark:bg-forest-950/80 border border-forest-100 dark:border-forest-800 space-y-1">
            <div className="flex items-center justify-between text-forest-600 dark:text-forest-400 text-xs font-bold uppercase">
              <span>Cultivation Investment</span>
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-display text-2xl font-black text-forest-900 dark:text-forest-100">
              {formatINR(totalCost)}
            </div>
            <span className="text-[11px] text-forest-500 block">
              ₹{selectedCrop.costOfCultivationPerAcre.totalCostRs.toLocaleString('en-IN')} / acre
            </span>
          </div>

          {/* Metric 3: Forecasted Harvest Price */}
          <div className="p-4 rounded-2xl bg-white dark:bg-forest-950/80 border border-forest-100 dark:border-forest-800 space-y-1">
            <div className="flex items-center justify-between text-forest-600 dark:text-forest-400 text-xs font-bold uppercase">
              <span>Forecast Harvest Rate</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="font-display text-2xl font-black text-forest-700 dark:text-green-400">
              ₹{forecastPrice.toFixed(2)} / kg
            </div>
            <span className="text-[11px] text-forest-500 block">
              ₹{(forecastPrice * 100).toFixed(0)} / quintal benchmark
            </span>
          </div>

          {/* Metric 4: Projected Net Farm Profit */}
          <div className="p-4 rounded-2xl bg-white dark:bg-forest-950/80 border border-forest-100 dark:border-forest-800 space-y-1">
            <div className="flex items-center justify-between text-forest-600 dark:text-forest-400 text-xs font-bold uppercase">
              <span>Projected Net Profit</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-display text-2xl font-black text-forest-700 dark:text-green-400">
              {formatINR(projectedNet)}
            </div>
            <span className="text-[11px] text-forest-500 block font-bold">
              Estimated {roiPct}% ROI on input cost
            </span>
          </div>
        </div>

        {/* Detailed Agronomic Panels: Water, Sowing Windows, Soil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Water & Irrigation Requirements */}
          <div className="p-4 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800 space-y-2">
            <div className="flex items-center space-x-2 text-forest-800 dark:text-forest-200 font-bold">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>WATER & IRRIGATION PROTOCOL</span>
            </div>
            <div className="space-y-1 text-forest-700 dark:text-forest-300">
              <div className="flex justify-between py-1 border-b border-forest-100 dark:border-forest-800">
                <span className="text-forest-500">Total Crop Water:</span>
                <span className="font-bold text-forest-900 dark:text-forest-100">
                  {selectedCrop.waterRequirementMm}
                </span>
              </div>
              <div className="py-1">
                <span className="text-forest-500 block mb-0.5">Irrigation Schedule:</span>
                <span className="font-medium">{selectedCrop.waterFrequency}</span>
              </div>
            </div>
          </div>

          {/* Soil & Sowing Calendar Window */}
          <div className="p-4 rounded-2xl bg-white dark:bg-forest-950/70 border border-forest-100 dark:border-forest-800 space-y-2">
            <div className="flex items-center space-x-2 text-forest-800 dark:text-forest-200 font-bold">
              <Calendar className="w-4 h-4 text-forest-600 dark:text-green-400" />
              <span>OPTIMAL SOWING WINDOWS</span>
            </div>
            <div className="space-y-1 text-forest-700 dark:text-forest-300">
              <div className="flex justify-between py-1 border-b border-forest-100 dark:border-forest-800">
                <span className="text-forest-500">Seed / Planting Rate:</span>
                <span className="font-bold text-forest-900 dark:text-forest-100">
                  {selectedCrop.seedRatePerAcre}
                </span>
              </div>
              <div className="py-1">
                <span className="text-forest-500 block mb-0.5">Recommended Sowing Months:</span>
                <span className="font-bold text-forest-900 dark:text-forest-100">
                  {selectedCrop.bestSowingMonths.join(' • ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Agronomic Pro-Tips & Post-Harvest Storage Readiness Strip */}
        <div className="p-4 rounded-2xl bg-forest-100/60 dark:bg-forest-800/40 border border-forest-200 dark:border-forest-700 space-y-2.5 text-xs">
          <div className="flex items-center space-x-2 font-bold text-forest-900 dark:text-forest-100">
            <ShieldCheck className="w-4 h-4 text-forest-600 dark:text-green-400" />
            <span>AGRONOMIC BEST PRACTICES & POST-HARVEST PREPARATION</span>
          </div>

          <ul className="space-y-1.5 text-forest-800/90 dark:text-forest-200/90 list-disc list-inside">
            {selectedCrop.keyAgronomicTips.map((tip, idx) => (
              <li key={idx} className="leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-forest-200/60 dark:border-forest-700/60 flex items-center space-x-2 text-forest-700 dark:text-forest-300">
            <Info className="w-4 h-4 text-forest-600 shrink-0" />
            <span>
              <strong>Post-Harvest Bridge:</strong> {selectedCrop.storageReadiness}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
