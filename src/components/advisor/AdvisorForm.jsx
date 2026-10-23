import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { CROPS, STORAGE_TYPES, UNIT_TYPES, DEMO_PRESETS } from '../../data/cropsData';
import { STATES_AND_REGIONS, MANDIS } from '../../data/mandiData';
import {
  Sun,
  Wind,
  Snowflake,
  Loader2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Coins,
  CheckCircle,
  Database,
  Sparkles,
  Calendar,
  Layers,
  Scale,
  RefreshCw,
  Tag,
} from 'lucide-react';

export default function AdvisorForm({
  formData,
  setFormData,
  onCalculate,
  isLoading,
  selectedPresetId,
  onSelectPreset,
  onSaveToDatabase,
  isSaving,
  lastSavedId,
}) {
  const { lang, t } = useApp();

  // Active crop category tab: 'all' | 'vegetable' | 'fruit'
  const [activeCategory, setActiveCategory] = useState('all');

  // Selected state for regional filtering: default 'TN'
  const [selectedState, setSelectedState] = useState(formData.stateCode || 'TN');

  // Selected unit: 'kg' | 'quintal' | 'crate' | 'bag'
  const [selectedUnit, setSelectedUnit] = useState(formData.unit || 'quintal');
  const [rawUnitAmount, setRawUnitAmount] = useState(
    formData.unitAmount || Math.round(formData.quantityKg / 100) || 10
  );

  // "Read More / Advanced Options" toggle state
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Custom price override toggle
  const [customPriceEnabled, setCustomPriceEnabled] = useState(false);

  const selectedCrop = CROPS.find((c) => c.id === formData.cropId) || CROPS[0];
  const selectedStorage = STORAGE_TYPES.find((s) => s.id === formData.storageType) || STORAGE_TYPES[1];

  // Filter crops by category
  const filteredCrops = CROPS.filter((crop) => {
    if (activeCategory === 'all') return true;
    return crop.category === activeCategory;
  });

  // Automatically ensure selected crop is visible in category filter
  useEffect(() => {
    if (formData.cropId) {
      const crop = CROPS.find((c) => c.id === formData.cropId);
      if (crop && activeCategory !== 'all' && crop.category !== activeCategory) {
        setActiveCategory('all');
      }
    }
  }, [formData.cropId]);

  // Filter mandis by state
  const stateMandis = MANDIS.filter((m) => m.stateCode === selectedState);
  const currentMandis = stateMandis.length > 0 ? stateMandis : MANDIS;

  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    const stateObj = STATES_AND_REGIONS.find((s) => s.id === stateCode);
    const firstMandi = MANDIS.find((m) => m.stateCode === stateCode) || MANDIS[0];

    setFormData((prev) => ({
      ...prev,
      stateCode,
      stateName: stateObj?.name || 'Tamil Nadu',
      locationMandi: firstMandi.name,
      mandiId: firstMandi.id,
      isExactPreset: false,
    }));
  };

  const handleCropChange = (cropId) => {
    const crop = CROPS.find((c) => c.id === cropId);
    if (!crop) return;

    setFormData((prev) => ({
      ...prev,
      cropId,
      todayPrice: customPriceEnabled ? prev.todayPrice : crop.defaultPrice,
      storageCostPerDay: crop.defaultStorageCost,
      ageDays: crop.defaultAge || 2,
      isExactPreset: false,
    }));
  };

  const handleStorageChange = (storageType) => {
    setFormData((prev) => ({ ...prev, storageType, isExactPreset: false }));
  };

  const handleUnitAmountChange = (val, unitId = selectedUnit) => {
    const rawNum = Math.max(1, Number(val) || 1);
    setRawUnitAmount(rawNum);

    const unitObj = UNIT_TYPES.find((u) => u.id === unitId) || UNIT_TYPES[1];
    const totalKg = Math.max(50, Math.min(100000, Math.round(rawNum * unitObj.factor)));

    setFormData((prev) => ({
      ...prev,
      quantityKg: totalKg,
      unit: unitId,
      unitAmount: rawNum,
      isExactPreset: false,
    }));
  };

  const handleUnitTypeChange = (newUnitId) => {
    setSelectedUnit(newUnitId);
    const unitObj = UNIT_TYPES.find((u) => u.id === newUnitId) || UNIT_TYPES[1];
    const newRaw = Math.max(1, Math.round(formData.quantityKg / unitObj.factor));
    setRawUnitAmount(newRaw);
    setFormData((prev) => ({
      ...prev,
      unit: newUnitId,
      unitAmount: newRaw,
      isExactPreset: false,
    }));
  };

  const handleQuickAddQuintals = (delta) => {
    const currentQtl = selectedUnit === 'quintal' ? rawUnitAmount : Math.round(formData.quantityKg / 100);
    const nextQtl = Math.max(1, currentQtl + delta);
    handleUnitAmountChange(nextQtl, 'quintal');
    setSelectedUnit('quintal');
  };

  const handleAgeChange = (val) => {
    const num = Math.max(0, Math.min(45, Number(val) || 0));
    setFormData((prev) => ({ ...prev, ageDays: num, isExactPreset: false }));
  };

  const handleHarvestTimingPreset = (days) => {
    handleAgeChange(days);
  };

  const handleLocationChange = (mandiName) => {
    const mandiObj = MANDIS.find((m) => m.name === mandiName);
    setFormData((prev) => ({
      ...prev,
      locationMandi: mandiName,
      mandiId: mandiObj?.id || prev.mandiId,
      isExactPreset: false,
    }));
  };

  const handlePriceChange = (val) => {
    const num = Math.max(1, Number(val) || 1);
    setFormData((prev) => ({ ...prev, todayPrice: num, isExactPreset: false }));
  };

  const handleGenerateNewLot = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const prefix = selectedCrop.name.slice(0, 3).toUpperCase();
    const newLot = `LOT-2026-${prefix}-${randomCode}`;
    setFormData((prev) => ({ ...prev, lotNumber: newLot }));
  };

  const getStorageIcon = (iconName) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-blue-500" />;
      case 'Snowflake':
        return <Snowflake className="w-4 h-4 text-cyan-500" />;
      default:
        return <Wind className="w-4 h-4 text-forest-600" />;
    }
  };

  const cropStorageInfo = selectedCrop.storageConditions?.[formData.storageType];
  const lotNumber = formData.lotNumber || `LOT-2026-TOM-8420`;
  const totalQuintals = (formData.quantityKg / 100).toFixed(1);
  const totalCrates = Math.round(formData.quantityKg / 25);
  const totalBags = Math.round(formData.quantityKg / 50);

  // Harvest date calculation
  const harvestDate = new Date();
  harvestDate.setDate(harvestDate.getDate() - (formData.ageDays || 0));
  const harvestDateString = harvestDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-6 font-sans">
      {/* Header with Lot Identification */}
      <div className="pb-4 border-b border-forest-100 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-forest-100 dark:bg-forest-800 text-[10px] font-extrabold uppercase tracking-wider text-forest-700 dark:text-green-300">
              Harvest Lot Entry
            </span>
            <div className="flex items-center space-x-1 text-xs font-mono font-bold text-forest-600 dark:text-forest-400">
              <Tag className="w-3.5 h-3.5" />
              <span>{lotNumber}</span>
              <button
                type="button"
                onClick={handleGenerateNewLot}
                title="Generate new Lot ID"
                className="p-1 hover:text-forest-900 dark:hover:text-white"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-forest-900 dark:text-forest-100 mt-1">
            {t('formTitle')}
          </h3>
          <p className="text-xs text-forest-700/80 dark:text-forest-300/80 mt-0.5">
            Select crop, state, harvest timing, quintals, storage method, and target market.
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-forest-50 dark:bg-forest-950 text-forest-700 dark:text-green-300 text-[11px] font-bold border border-forest-200 dark:border-forest-800 self-start sm:self-auto">
          <Database className="w-3.5 h-3.5 text-forest-600 dark:text-green-400" />
          <span>PostgreSQL Lot Synced</span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="space-y-5"
      >
        {/* 1. State & Regional Market Hub Selector */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-forest-50/70 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-200 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-forest-600 dark:text-green-400" />
              <span>State & Target Mandi</span>
            </label>
            <span className="text-[10px] text-forest-500 font-semibold">APMC Network</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* State Picker */}
            <div>
              <span className="text-[10px] font-semibold text-forest-600 dark:text-forest-400 block mb-1">
                State / Region
              </span>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-forest-200 dark:border-forest-700 bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                {STATES_AND_REGIONS.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({lang === 'ta' ? st.tamilName : st.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Mandi within selected state */}
            <div>
              <span className="text-[10px] font-semibold text-forest-600 dark:text-forest-400 block mb-1">
                Local Mandi / Market
              </span>
              <select
                value={formData.locationMandi || currentMandis[0].name}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-forest-200 dark:border-forest-700 bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                {currentMandis.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Crop Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-200">
              {t('stockWhatCropLabel')}
            </label>

            {/* Category tabs */}
            <div className="flex rounded-xl bg-forest-100/70 dark:bg-forest-800/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeCategory === 'all'
                    ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                    : 'text-forest-600 dark:text-forest-300 hover:text-forest-900'
                }`}
              >
                {t('tabAll')}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('vegetable')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeCategory === 'vegetable'
                    ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                    : 'text-forest-600 dark:text-forest-300 hover:text-forest-900'
                }`}
              >
                {t('tabVegetables')}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('fruit')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeCategory === 'fruit'
                    ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                    : 'text-forest-600 dark:text-forest-300 hover:text-forest-900'
                }`}
              >
                {t('tabFruits')}
              </button>
            </div>
          </div>

          {/* Compact Produce Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
            {filteredCrops.map((crop) => {
              const isSelected = formData.cropId === crop.id;
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => handleCropChange(crop.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all text-center group ${
                    isSelected
                      ? 'border-forest-600 dark:border-forest-500 bg-forest-50 dark:bg-forest-950/80 ring-2 ring-forest-600/30 shadow-sm'
                      : 'border-forest-200 dark:border-forest-800 hover:border-forest-300 dark:hover:border-forest-700 hover:bg-forest-50/40 dark:hover:bg-forest-800/40'
                  }`}
                >
                  <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform">
                    {crop.emoji}
                  </span>
                  <span className="text-xs font-bold text-forest-900 dark:text-forest-100 line-clamp-1">
                    {lang === 'ta' ? crop.tamilName : crop.name}
                  </span>
                  <span className="text-[10px] text-forest-500 font-semibold">
                    ₹{crop.defaultPrice}/kg
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Produce Live Rate Badge & Custom Price Option */}
          <div className="p-3 rounded-2xl bg-forest-50/70 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{selectedCrop.emoji}</span>
              <div>
                <span className="font-bold text-forest-900 dark:text-forest-100">
                  {lang === 'ta' ? selectedCrop.tamilName : selectedCrop.name}
                </span>
                <span className="text-[11px] text-forest-500 ml-1.5 font-medium">
                  ({selectedCrop.category === 'fruit' ? 'Fruit' : 'Vegetable'})
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setCustomPriceEnabled(!customPriceEnabled)}
                className="text-[10px] font-bold text-forest-600 dark:text-forest-400 underline hover:text-forest-800"
              >
                {customPriceEnabled ? 'Use Mandi Rate' : 'Edit Price'}
              </button>

              {customPriceEnabled ? (
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="0.5"
                    value={formData.todayPrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-16 px-1.5 py-0.5 rounded-lg border border-forest-300 dark:border-forest-700 bg-white dark:bg-forest-900 text-xs font-bold text-right"
                  />
                  <span className="text-[10px] text-forest-500">/kg</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="font-display font-extrabold text-base text-forest-700 dark:text-green-400">
                    ₹{formData.todayPrice?.toFixed(2)} / kg
                    <span className="text-xs font-normal text-forest-500 ml-1">
                      (₹{(formData.todayPrice * 100).toFixed(0)}/qtl)
                    </span>
                  </div>
                  {formData.priceChangePct !== null && formData.priceChangePct !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        formData.priceChangePct >= 0
                          ? 'bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-950 text-tomato dark:text-red-300'
                      }`}
                    >
                      {formData.priceChangePct >= 0 ? `+${formData.priceChangePct}%` : `${formData.priceChangePct}%`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Harvest Timing & Produce Age */}
        <div className="space-y-2.5 p-3.5 rounded-2xl bg-forest-50/50 dark:bg-forest-950/30 border border-forest-100 dark:border-forest-800">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold uppercase tracking-wider text-forest-800 dark:text-forest-200 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-forest-600 dark:text-green-400" />
              <span>Harvest Timing & Age in Storage</span>
            </label>
            <span className="font-bold text-forest-700 dark:text-green-400 bg-forest-100 dark:bg-forest-800 px-2.5 py-0.5 rounded-full text-xs">
              {formData.ageDays} {formData.ageDays === 1 ? 'day old' : 'days old'} ({harvestDateString})
            </span>
          </div>

          {/* Quick timing selector buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 text-xs">
            {[
              { label: 'Harvested Today', days: 0 },
              { label: 'Yesterday', days: 1 },
              { label: '2-3 Days Ago', days: 2 },
              { label: '5 Days Ago', days: 5 },
              { label: '1 Week Ago', days: 7 },
            ].map((timing) => (
              <button
                key={timing.label}
                type="button"
                onClick={() => handleHarvestTimingPreset(timing.days)}
                className={`py-1 px-2 rounded-xl text-[11px] font-bold transition-all ${
                  formData.ageDays === timing.days
                    ? 'bg-forest-700 text-white shadow-sm'
                    : 'bg-white dark:bg-forest-800 text-forest-700 dark:text-forest-200 border border-forest-200 dark:border-forest-700 hover:border-forest-400'
                }`}
              >
                {timing.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={formData.ageDays}
            onChange={(e) => handleAgeChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 4. Quantity in Quintals / Kg / Crates / Bags */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-200 flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-forest-600 dark:text-green-400" />
              <span>{t('stockHowMuchLabel')} (Quintals / Kg / Crates)</span>
            </label>

            {/* Units Toggle */}
            <div className="flex items-center space-x-1 bg-forest-100/60 dark:bg-forest-800/60 p-1 rounded-xl">
              {UNIT_TYPES.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleUnitTypeChange(u.id)}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedUnit === u.id
                      ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm font-bold'
                      : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <input
                type="number"
                min="1"
                max="50000"
                step="1"
                value={rawUnitAmount}
                onChange={(e) => handleUnitAmountChange(e.target.value)}
                className="w-full pl-4 pr-24 py-3 rounded-2xl border border-forest-300 dark:border-forest-700 bg-forest-50/50 dark:bg-forest-950/60 font-display font-black text-xl text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-forest-600 dark:text-forest-400 uppercase">
                {selectedUnit}
              </span>
            </div>

            {/* Quintal Quick Increment Buttons */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleQuickAddQuintals(5)}
                className="px-2.5 py-3 rounded-xl bg-forest-100 dark:bg-forest-800 hover:bg-forest-200 text-forest-800 dark:text-forest-100 text-xs font-bold transition-colors"
                title="Add 5 Quintals"
              >
                +5 qtl
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddQuintals(20)}
                className="px-2.5 py-3 rounded-xl bg-forest-100 dark:bg-forest-800 hover:bg-forest-200 text-forest-800 dark:text-forest-100 text-xs font-bold transition-colors"
                title="Add 20 Quintals"
              >
                +20 qtl
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddQuintals(50)}
                className="px-2.5 py-3 rounded-xl bg-forest-100 dark:bg-forest-800 hover:bg-forest-200 text-forest-800 dark:text-forest-100 text-xs font-bold transition-colors"
                title="Add 50 Quintals"
              >
                +50 qtl
              </button>
            </div>
          </div>

          {/* Unit Conversion live strip */}
          <div className="p-2.5 rounded-xl bg-forest-100/60 dark:bg-forest-800/40 flex flex-wrap items-center justify-between text-xs font-medium text-forest-800 dark:text-forest-200 gap-2">
            <span>
              ⚖️ Stock: <strong className="font-display font-bold text-forest-900 dark:text-white">{totalQuintals} Quintals</strong>
            </span>
            <span className="text-forest-400">•</span>
            <span>{formData.quantityKg.toLocaleString('en-IN')} kg</span>
            <span className="text-forest-400">•</span>
            <span>~{totalCrates} Crates (25kg)</span>
            <span className="text-forest-400">•</span>
            <span>~{totalBags} Bags (50kg)</span>
          </div>
        </div>

        {/* 5. Storage Facility Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-200">
            {t('stockStorageLabel')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {STORAGE_TYPES.map((s) => {
              const isSelected = formData.storageType === s.id;
              const cond = selectedCrop.storageConditions?.[s.id];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStorageChange(s.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-forest-600 dark:border-forest-500 bg-forest-50 dark:bg-forest-950/80 ring-2 ring-forest-600/30'
                      : 'border-forest-200 dark:border-forest-800 hover:border-forest-300 dark:hover:border-forest-700 bg-white dark:bg-forest-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {getStorageIcon(s.icon)}
                    <div className="font-bold text-xs text-forest-900 dark:text-forest-100 leading-tight">
                      {lang === 'ta' ? s.tamilName : s.name}
                    </div>
                  </div>
                  {cond && (
                    <div className="text-[10px] text-forest-500 mt-1 font-semibold">
                      ⏱ ~{cond.shelfLifeDays}d safe life
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Consolidated Lot Summary Strip */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-forest-50 via-forest-100/40 to-harvest-surface dark:from-forest-950 dark:via-forest-900 dark:to-forest-950 border border-forest-200 dark:border-forest-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{selectedCrop.emoji}</span>
            <span className="font-bold text-forest-900 dark:text-white">
              {selectedCrop.name}
            </span>
            <span className="text-forest-400">•</span>
            <span className="font-semibold text-forest-700 dark:text-forest-300">
              {totalQuintals} qtl ({formData.quantityKg.toLocaleString('en-IN')} kg)
            </span>
          </div>

          <div className="text-[11px] text-forest-600 dark:text-forest-400">
            {formData.locationMandi?.split(',')[0]} • {selectedStorage.name} • {formData.ageDays}d stored
          </div>
        </div>

        {/* 7. "Read More / Advanced Options" Expandable Accordion */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold text-forest-700 dark:text-forest-300 hover:bg-forest-50 dark:hover:bg-forest-800/60 border border-forest-200 dark:border-forest-800 transition-colors"
          >
            <span>{showAdvanced ? 'Hide Advanced Options' : 'Read More: Advanced Storage Tariffs & Notes ▾'}</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 pt-3 overflow-hidden"
              >
                {/* Storage daily tariff input */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-bold text-forest-800 dark:text-forest-200">
                      Daily Storage Tariff (₹/kg/day)
                    </label>
                    <span className="text-forest-500 font-medium">Default: ₹{selectedCrop.defaultStorageCost}/kg/d</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.05"
                    value={formData.storageCostPerDay}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        storageCostPerDay: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs border border-forest-200 dark:border-forest-800 bg-forest-50/50 dark:bg-forest-950 font-bold"
                  />
                </div>

                {/* Storage Micro-climate details */}
                {cropStorageInfo && (
                  <div className="text-[11px] text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-950/40 p-2.5 rounded-xl border border-forest-100 dark:border-forest-800">
                    💡 <span className="font-semibold">{selectedStorage.name} Note:</span> {cropStorageInfo.note}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons: Calculate + Save to Database */}
        <div className="pt-2 space-y-2.5">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-forest-700 hover:bg-forest-800 active:scale-98 transition-all shadow-md shadow-forest-900/20 flex items-center justify-center space-x-2.5 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-forest-200" />
                <span>{t('btnCalculating')}</span>
              </>
            ) : (
              <>
                <span>{t('btnCalculate')}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {onSaveToDatabase && (
            <button
              type="button"
              disabled={isSaving}
              onClick={onSaveToDatabase}
              className="w-full py-3 rounded-2xl font-bold text-xs text-forest-800 dark:text-forest-100 bg-white dark:bg-forest-800/90 border border-forest-300 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-700 active:scale-98 transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-forest-600" />
                  <span>Saving Lot to PostgreSQL Database...</span>
                </>
              ) : lastSavedId ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Lot Assessment Saved to Database (ID: #{lastSavedId})</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 text-forest-600 dark:text-green-400" />
                  <span>Save Harvest Lot Assessment to Database</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
