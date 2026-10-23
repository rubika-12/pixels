import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/ThemeContext';
import { calculateRecommendation } from '../../lib/advisor';
import { DEMO_PRESETS, CROPS } from '../../data/cropsData';
import { createStockAssessment } from '../../lib/api';
import AdvisorForm from './AdvisorForm';
import AdvisorPrimaryVerdict from './AdvisorPrimaryVerdict';
import DecisionHorizonMatrix from './DecisionHorizonMatrix';
import DownsideRiskCard from './DownsideRiskCard';
import ArbitrageSnapshotCard from './ArbitrageSnapshotCard';
import ShelfLifeGauge from './ShelfLifeGauge';
import PriceTrendChart from './PriceTrendChart';
import NetValueChart from './NetValueChart';
import FactorsBreakdown from './FactorsBreakdown';
import NeonSyncCard from './NeonSyncCard';
import { Sparkles, Compass } from 'lucide-react';

export default function AdvisorSection({ externalCropData, externalCropId, onNavigateToDashboard, onNavigateToArbitrage }) {
  const { lang, t, showToast } = useApp();

  // Form State initialized to standard 1,000kg Tomato Hold scenario
  const [formData, setFormData] = useState({
    cropId: 'tomato',
    quantityKg: 1000,
    unit: 'kg',
    unitAmount: 1000,
    storageType: 'cold',
    ageDays: 2,
    todayPrice: 18,
    storageCostPerDay: 0.30,
    locationMandi: 'Dindigul Central Market Hub, TN',
    isExactPreset: true,
  });

  const [selectedPresetId, setSelectedPresetId] = useState('preset-tomato-hold');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedId, setLastSavedId] = useState(null);
  const [activeMarketAdvisory, setActiveMarketAdvisory] = useState(null);

  // Trigger celebration confetti when result is HOLD with notable gain
  const triggerConfettiCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#2E7D45', '#F2A93B', '#1F4D2B', '#E28E1D'],
      });
    } catch (e) {
      // safe fallback if canvas not available
    }
  };

  // Run calculation
  const handleCalculate = (dataToUse = formData, shouldCelebrate = true) => {
    setIsLoading(true);

    setTimeout(() => {
      const res = calculateRecommendation({
        cropId: dataToUse.cropId,
        quantityKg: dataToUse.quantityKg,
        storageType: dataToUse.storageType,
        ageDays: dataToUse.ageDays,
        todayPrice: dataToUse.todayPrice,
        storageCostPerDay: dataToUse.storageCostPerDay,
        isExactPreset: dataToUse.isExactPreset,
      });

      setResult(res);
      setIsLoading(false);

      if (shouldCelebrate && res.verdict === 'HOLD' && res.difference > 500) {
        triggerConfettiCelebration();
      }
    }, 280);
  };

  // Save current assessment to Neon PostgreSQL database
  const handleSaveToDatabase = async () => {
    if (!result) {
      handleCalculate(formData, false);
    }

    const cropObj = CROPS.find((c) => c.id === formData.cropId) || CROPS[0];
    const currentRes = result || calculateRecommendation(formData);

    setIsSaving(true);
    const payload = {
      crop_id: formData.cropId,
      crop_name: cropObj.name,
      category: cropObj.category || 'vegetable',
      quantity_kg: Number(formData.quantityKg),
      unit: formData.unit || 'kg',
      unit_amount: Number(formData.unitAmount || formData.quantityKg),
      storage_type: formData.storageType,
      storage_cost_per_day: Number(formData.storageCostPerDay),
      age_days: Number(formData.ageDays),
      location_mandi: formData.locationMandi || 'Dindigul Central Market Hub, TN',
      current_mandi_price: Number(formData.todayPrice),
      decision: currentRes.verdict,
      target_date: currentRes.rightPriceDetails?.sellingDate || 'Day 5',
      optimal_days: currentRes.bestDay || 5,
      expected_net_revenue: currentRes.netHold || currentRes.netSell,
      sell_now_net_revenue: currentRes.netSell,
      net_advantage: currentRes.difference,
      expected_spoilage_kg: currentRes.spoilageLossKg || 0,
      confidence: currentRes.confidence || 'HIGH',
      notes: `Evaluated at ${formData.locationMandi || 'Mandi'}`,
      status: 'Active',
    };

    const res = await createStockAssessment(payload);
    setIsSaving(false);

    if (res.ok) {
      setLastSavedId(res.data.id);
      showToast(`Stock assessment saved to Neon Database! Lot #${res.data.id}`, 'success');
    } else {
      showToast(`Database saved locally (Backend status: ${res.error || 'offline'})`, 'info');
    }
  };

  // Load preset handler
  const handleSelectPreset = (presetId) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setActiveMarketAdvisory(null);
    const updatedForm = {
      ...formData,
      cropId: preset.cropId,
      quantityKg: preset.quantity,
      unit: 'kg',
      unitAmount: preset.quantity,
      storageType: preset.storageType,
      ageDays: preset.ageDays,
      todayPrice: preset.todayPrice,
      storageCostPerDay: preset.storageCostPerDay,
      isExactPreset: presetId === 'preset-tomato-hold',
    };

    setFormData(updatedForm);
    showToast(t('toastPresetLoaded'), 'success');
    handleCalculate(updatedForm, true);
  };

  // Initial calculation on mount
  useEffect(() => {
    handleCalculate(formData, false);
  }, []);

  // Listen to crop selection from MarketTrends / Market Velocity Top Movers section
  useEffect(() => {
    const rawData = externalCropData || externalCropId;
    if (rawData) {
      const targetCropId = typeof rawData === 'object' ? rawData.cropId : rawData;
      const crop = CROPS.find((c) => c.id === targetCropId);
      if (crop) {
        setSelectedPresetId(null);

        const cropName = (typeof rawData === 'object' && rawData.cropName) ? rawData.cropName : crop.name;
        const currentPrice = (typeof rawData === 'object' && rawData.currentPrice !== undefined)
          ? Number(rawData.currentPrice)
          : (typeof rawData === 'object' && rawData.todayPrice !== undefined)
          ? Number(rawData.todayPrice)
          : crop.defaultPrice;
        const priceChangePct = typeof rawData === 'object' && rawData.priceChangePct !== undefined ? rawData.priceChangePct : null;
        const priceChangePerKg = typeof rawData === 'object' && rawData.priceChangePerKg !== undefined ? rawData.priceChangePerKg : null;

        const updated = {
          ...formData,
          cropId: crop.id,
          cropName: cropName,
          todayPrice: Number(currentPrice),
          storageCostPerDay: crop.defaultStorageCost,
          ageDays: crop.defaultAge || 2,
          priceChangePct,
          priceChangePerKg,
          isExactPreset: false,
        };

        setFormData(updated);
        handleCalculate(updated, true);

        const advisory = {
          cropId: crop.id,
          cropName,
          emoji: crop.emoji,
          category: crop.category,
          currentPrice: Number(currentPrice),
          priceChangePct,
          priceChangePerKg,
          timeWindow: typeof rawData === 'object' ? rawData.timeWindow : '24h',
        };
        setActiveMarketAdvisory(advisory);

        showToast(
          `Advisory generated for ${cropName} (₹${currentPrice}/kg)!`,
          'success'
        );

        // Smoothly scroll down to the recommendation view so user sees the advice immediately
        setTimeout(() => {
          const recEl = document.getElementById('advisor-verdict-section');
          if (recEl) {
            recEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  }, [externalCropData, externalCropId]);

  return (
    <div id="advisor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-sans">
      {/* 1. Header & Quick Scenarios Bar */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300">
          <Compass className="w-3.5 h-3.5" />
          <span>{t('advisorSectionBadge')}</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 dark:text-forest-100 tracking-tight">
          {t('advisorSectionTitle')}
        </h2>
        <p className="text-sm sm:text-base text-forest-800/80 dark:text-forest-300/80 font-normal max-w-2xl mx-auto leading-relaxed">
          {t('advisorSectionSubtitle')}
        </p>

        {/* Quick Benchmark Presets Row */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-forest-500 uppercase tracking-wider mr-1">
            Benchmarks:
          </span>
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                selectedPresetId === preset.id
                  ? 'bg-forest-700 text-white shadow-sm'
                  : 'bg-white dark:bg-forest-900 text-forest-700 dark:text-forest-200 border border-forest-200 dark:border-forest-800 hover:border-forest-400'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Market Velocity Advisory Banner */}
      {activeMarketAdvisory && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-forest-500/10 to-emerald-500/10 border-2 border-amber-300 dark:border-amber-700/80 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center space-x-3.5">
            <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-forest-900 shadow-sm shrink-0">
              {activeMarketAdvisory.emoji}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  Market Velocity Selection
                </span>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-forest-900 dark:text-forest-100">
                  Advisory for {activeMarketAdvisory.cropName}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 text-xs text-forest-700 dark:text-forest-300 mt-0.5">
                <span>
                  Current Market Rate: <strong className="text-forest-900 dark:text-white font-display text-sm font-bold">₹{activeMarketAdvisory.currentPrice}/kg</strong>
                </span>
                {activeMarketAdvisory.priceChangePct !== null && (
                  <span className="inline-flex items-center space-x-1">
                    <span>• Price Change:</span>
                    <strong className={`font-bold ${activeMarketAdvisory.priceChangePct >= 0 ? 'text-forest-700 dark:text-green-400' : 'text-tomato dark:text-red-400'}`}>
                      {activeMarketAdvisory.priceChangePct >= 0 ? `+${activeMarketAdvisory.priceChangePct}%` : `${activeMarketAdvisory.priceChangePct}%`}
                      {activeMarketAdvisory.priceChangePerKg !== null && (
                        <span className="ml-1 text-[11px] font-normal">
                          ({activeMarketAdvisory.priceChangePerKg >= 0 ? `+₹${activeMarketAdvisory.priceChangePerKg.toFixed(1)}` : `-₹${Math.abs(activeMarketAdvisory.priceChangePerKg).toFixed(1)}`}/kg)
                        </span>
                      )}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveMarketAdvisory(null)}
            className="text-xs font-bold text-forest-600 dark:text-forest-400 hover:text-forest-900 dark:hover:text-white underline self-end sm:self-auto shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Top Interactive Section: Balanced 2-Column Split (Height-Matched) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Harvest Lot Configuration & Inputs Form */}
        <div className="lg:col-span-6 xl:col-span-5">
          <AdvisorForm
            formData={formData}
            setFormData={setFormData}
            onCalculate={() => handleCalculate(formData, true)}
            isLoading={isLoading}
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            onSaveToDatabase={handleSaveToDatabase}
            isSaving={isSaving}
            lastSavedId={lastSavedId}
          />
        </div>

        {/* Right Column: Primary Recommendation & Target Horizon Cards */}
        <div className="lg:col-span-6 xl:col-span-7">
          <AdvisorPrimaryVerdict
            result={result}
            isLoading={isLoading}
            onSaveToDatabase={handleSaveToDatabase}
            isSaving={isSaving}
            lastSavedId={lastSavedId}
            onNavigateToDashboard={onNavigateToDashboard}
            activeMarketAdvisory={activeMarketAdvisory}
          />
        </div>
      </div>

      {/* 3. Section 2: "Your Options" Decision Horizon Matrix (Full Available Screen Width) */}
      {result && (
        <div className="w-full">
          <DecisionHorizonMatrix
            matrix={result.decisionMatrix}
            bestDay={result.bestDay}
            isHold={result.verdict === 'HOLD'}
            currentPrice={result.todayPrice}
            quantityKg={result.quantityKg}
          />
        </div>
      )}

      {/* 4. Section 3: Downside Risk & Logistics Grid (2 Balanced Columns) */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Downside Risk Protection Card */}
          <DownsideRiskCard
            downsideRisk={result.downsideRisk}
            isHold={result.verdict === 'HOLD'}
            netSell={result.netSell}
            difference={result.difference}
          />

          {/* Right: Where to Sell Arbitrage Snapshot + Shelf-Life Radial Gauge */}
          <div className="space-y-6">
            <ArbitrageSnapshotCard
              result={result}
              onNavigateToArbitrage={onNavigateToArbitrage}
            />
            <ShelfLifeGauge
              daysRemaining={result.remainingShelfLife}
              totalDays={result.crop.baseShelfLife * result.storage.factor}
              status={result.shelfLifeStatus}
            />
          </div>
        </div>
      )}

      {/* 5. Section 4: Dual Visual Analytics (2 Balanced Side-by-Side Columns) */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <PriceTrendChart
            chartData={result.chartData}
            bestDay={result.bestDay}
            isHold={result.verdict === 'HOLD'}
          />
          <NetValueChart
            dayByDay={result.dayByDay}
            netSell={result.netSell}
            bestDay={result.bestDay}
          />
        </div>
      )}

      {/* 6. Section 5: Multi-Factor AI Breakdown & Neon DB Sync (Full Width) */}
      {result && (
        <div className="space-y-6">
          <FactorsBreakdown factors={result.factorBreakdown} />
          
          <NeonSyncCard
            lastSavedId={lastSavedId}
            isSaving={isSaving}
            onSaveToDatabase={handleSaveToDatabase}
            onNavigateToDashboard={onNavigateToDashboard}
          />
        </div>
      )}
    </div>
  );
}
