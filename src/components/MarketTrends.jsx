import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/ThemeContext';
import { CROPS } from '../data/cropsData';
import MarketMoversWidget from './movers/MarketMoversWidget';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Thermometer,
  Droplets,
} from 'lucide-react';

/**
 * Independent Commodity Card component.
 * Maintains its OWN strictly isolated isExpanded state so clicking
 * one card NEVER affects or opens any other card.
 */
const CommodityCard = memo(function CommodityCard({ crop, dateLabels, onSelectCropForAdvisor, lang }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const startPrice = crop.priceHistory[0];
  const currentPrice = crop.priceHistory[crop.priceHistory.length - 1];
  const change = currentPrice - startPrice;
  const isUp = change >= 0;

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all">
      {/* 1. Essential Mandatory Info: Produce Header, Today Rate, Safe Shelf Life */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl p-2 rounded-2xl bg-forest-50 dark:bg-forest-950">
              {crop.emoji}
            </span>
            <div>
              <h3 className="font-bold text-base text-forest-900 dark:text-forest-100">
                {lang === 'ta' ? crop.tamilName : crop.name}
              </h3>
              <span className="text-[10px] font-bold text-forest-500 uppercase tracking-wider">
                {crop.category === 'fruit' ? 'Fresh Fruit' : 'Fresh Vegetable'} • ~{crop.baseShelfLife}d Safe Life
              </span>
            </div>
          </div>

          {/* Today Price & Trend Badge */}
          <div className="text-right">
            <div className="font-display font-extrabold text-xl text-forest-900 dark:text-forest-100">
              ₹{currentPrice}/kg
            </div>
            <span
              className={`inline-flex items-center space-x-0.5 text-[11px] font-bold ${
                isUp ? 'text-forest-600 dark:text-green-400' : 'text-tomato dark:text-red-400'
              }`}
            >
              {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isUp ? `+₹${change.toFixed(1)}` : `-₹${Math.abs(change).toFixed(1)}`}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Independent "Read More" Toggle Button */}
      <div>
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isExpanded}
          className="w-full flex items-center justify-between py-2.5 px-1 text-xs font-bold text-forest-700 dark:text-forest-300 hover:text-forest-900 dark:hover:text-white border-y border-forest-100 dark:border-forest-800/80 transition-colors focus:outline-none"
        >
          <span>{isExpanded ? 'Hide Details' : 'Read More Details (Prices & Storage)'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-3 overflow-hidden"
            >
              {/* Date-wise price progression bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-forest-500 font-medium">
                  <span>{dateLabels[0]}</span>
                  <span>Mid-week</span>
                  <span>{dateLabels[6]} (Today)</span>
                </div>

                <div className="flex items-end justify-between h-8 bg-forest-50 dark:bg-forest-950/60 p-1 rounded-xl gap-1">
                  {crop.priceHistory.map((p, idx) => {
                    const min = Math.min(...crop.priceHistory);
                    const max = Math.max(...crop.priceHistory);
                    const heightPct = Math.max(25, Math.min(100, Math.round(((p - min) / (max - min || 1)) * 75 + 25)));
                    const isLatest = idx === crop.priceHistory.length - 1;

                    return (
                      <div
                        key={`bar-${crop.id}-${idx}`}
                        title={`${dateLabels[idx]}: ₹${p}/kg`}
                        className="flex-1 flex flex-col justify-end items-center h-full relative"
                      >
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-md transition-all ${
                            isLatest ? 'bg-forest-600 dark:bg-green-500' : 'bg-forest-200 dark:bg-forest-700'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Storage conditions breakdown */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center pt-1">
                <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60">
                  <span className="font-semibold text-amber-900 dark:text-amber-200 block">Open Floor</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">
                    ~{crop.storageConditions?.open?.shelfLifeDays || Math.round(crop.baseShelfLife * 0.6)}d
                  </span>
                </div>
                <div className="p-1.5 rounded-xl bg-forest-50 dark:bg-forest-950/50 border border-forest-200 dark:border-forest-800">
                  <span className="font-semibold text-forest-800 dark:text-forest-200 block">Ventilated</span>
                  <span className="font-bold text-forest-700 dark:text-forest-300">
                    ~{crop.storageConditions?.ventilated?.shelfLifeDays || crop.baseShelfLife}d
                  </span>
                </div>
                <div className="p-1.5 rounded-xl bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800">
                  <span className="font-semibold text-green-900 dark:text-green-200 block">Cold Room</span>
                  <span className="font-bold text-forest-600 dark:text-green-300">
                    ~{crop.storageConditions?.cold?.shelfLifeDays || Math.round(crop.baseShelfLife * 1.8)}d
                  </span>
                </div>
              </div>

              {/* Ideal condition note */}
              <div className="flex items-center justify-between text-[10px] text-forest-600 dark:text-forest-400 bg-harvest-surface/50 dark:bg-forest-950/30 p-2 rounded-xl">
                <span className="flex items-center space-x-1">
                  <Thermometer className="w-3 h-3 text-forest-600" />
                  <span>{crop.idealTemp}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  <span>{crop.idealHumidity}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Essential Action: Analyze in Advisor */}
      <button
        type="button"
        onClick={() =>
          onSelectCropForAdvisor({
            cropId: crop.id,
            cropName: crop.name,
            currentPrice: currentPrice,
            priceChangePct: +((change / Math.max(1, startPrice)) * 100).toFixed(1),
            priceChangePerKg: change,
            emoji: crop.emoji,
            category: crop.category,
            timestamp: Date.now(),
          })
        }
        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
      >
        <span>Evaluate {crop.name} in Advisor</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

export default function MarketTrends({ onSelectCropForAdvisor }) {
  const { lang, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate date labels for past 7 days
  const today = new Date();
  const dateLabels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dateLabels.push(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
  }

  const filteredCrops = CROPS.filter((crop) => {
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.tamilName.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="market-trends" className="py-8 sm:py-12 space-y-8 font-sans">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-onion" />
            <span>COMMODITY INTELLIGENCE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-forest-900 dark:text-forest-100">
            Market Trends & Storage Conditions
          </h2>
          <p className="text-sm sm:text-base text-forest-700/80 dark:text-forest-300/80 mt-1 max-w-2xl">
            Live mandi rates and safe shelf life across 18 commodities. Each card expands independently to show date-wise price movements and climate conditions.
          </p>
        </div>

        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fruit or vegetable..."
              className="pl-9 pr-4 py-2 rounded-xl text-xs border border-forest-200 dark:border-forest-800 bg-harvest-surface/60 dark:bg-forest-900 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-600 w-full sm:w-52"
            />
          </div>

          {/* Category Buttons */}
          <div className="flex rounded-xl bg-forest-100/70 dark:bg-forest-900 p-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 shadow-sm'
                  : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
              }`}
            >
              All ({CROPS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('vegetable')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCategory === 'vegetable'
                  ? 'bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 shadow-sm'
                  : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
              }`}
            >
              🥬 Vegetables (10)
            </button>
            <button
              onClick={() => setSelectedCategory('fruit')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCategory === 'fruit'
                  ? 'bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 shadow-sm'
                  : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
              }`}
            >
              🍎 Fruits (8)
            </button>
          </div>
        </div>
      </div>

      {/* Fast-Scan Market Movers Leaderboard Widget (Gap 5 Fix) */}
      <MarketMoversWidget onSelectCropForAdvisor={onSelectCropForAdvisor} />

      {/* Commodity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <CommodityCard
            key={crop.id}
            crop={crop}
            dateLabels={dateLabels}
            onSelectCropForAdvisor={onSelectCropForAdvisor}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}
