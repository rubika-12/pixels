import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { CROPS } from '../../data/cropsData';
import { MANDIS, VEHICLE_FLEET } from '../../data/mandiData';
import { calculateMandiArbitrage, getRecommendedVehicle } from '../../lib/arbitrage';
import { formatINR } from '../../lib/formatters';
import {
  Truck,
  MapPin,
  TrendingUp,
  TrendingDown,
  Navigation,
  Coins,
  CheckCircle2,
  Clock,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function InterMandiArbitrage({
  initialCropId = 'tomato',
  initialQuantityKg = 1000,
  initialPrice = 18,
  initialOriginMandiId = 'mandi-dindigul',
  onSelectCropForAdvisor,
  isEmbedded = false,
}) {
  const { lang, t } = useApp();

  const [selectedCropId, setSelectedCropId] = useState(initialCropId);
  const [quantityKg, setQuantityKg] = useState(initialQuantityKg);
  const [originMandiId, setOriginMandiId] = useState(initialOriginMandiId);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [sortBy, setSortBy] = useState('netProfit'); // 'netProfit' | 'distance' | 'price'

  const selectedCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  const [basePrice, setBasePrice] = useState(initialPrice || selectedCrop.defaultPrice || 18);

  const handleCropChange = (cropId) => {
    setSelectedCropId(cropId);
    const crop = CROPS.find((c) => c.id === cropId);
    if (crop) {
      setBasePrice(crop.defaultPrice);
    }
  };

  // Run calculation
  const arbitrageResults = calculateMandiArbitrage({
    cropId: selectedCropId,
    quantityKg,
    originMandiId,
    basePrice,
    selectedVehicleId,
  });

  const { originMandi, selectedVehicle, totalQuintals, originNetInHand, comparison, bestMandi, hasArbitrageProfit, maxArbitrageGain } =
    arbitrageResults;

  // Sorting
  const sortedComparison = [...comparison].sort((a, b) => {
    if (sortBy === 'netProfit') return b.netInHand - a.netInHand;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'price') return b.mandiPrice - a.mandiPrice;
    return 0;
  });

  return (
    <div className={`space-y-6 font-sans ${isEmbedded ? '' : 'py-6 sm:py-10'}`}>
      {/* Section Header */}
      {!isEmbedded && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300 mb-2">
              <Truck className="w-3.5 h-3.5 text-onion" />
              <span>INTER-MANDI ARBITRAGE & HAULAGE CALCULATOR</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-forest-900 dark:text-forest-100">
              Where to Sell: Mandi Price & Transport Engine
            </h2>
            <p className="text-sm sm:text-base text-forest-700/80 dark:text-forest-300/80 mt-1 max-w-2xl">
              Compare take-home profit across regional and interstate mandis net of road freight, truck hiring, tolls, loading labor, and APMC market cess.
            </p>
          </div>

          <div className="text-xs font-bold text-forest-600 dark:text-forest-400 bg-white dark:bg-forest-900 p-2.5 rounded-2xl border border-forest-200 dark:border-forest-800 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-forest-600 dark:text-green-400" />
            <span>Net of Real Road Mileage & Transit Shrinkage</span>
          </div>
        </div>
      )}

      {/* Top Controls Box: Origin, Crop, Quantity, Vehicle */}
      <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Crop Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 block mb-1">
              Produce / Crop
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-forest-200 dark:border-forest-700 bg-forest-50/60 dark:bg-forest-950 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name} (₹{c.defaultPrice}/kg)
                </option>
              ))}
            </select>
          </div>

          {/* Farm Origin Mandi */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 block mb-1">
              Farm Origin Hub
            </label>
            <select
              value={originMandiId}
              onChange={(e) => setOriginMandiId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-forest-200 dark:border-forest-700 bg-forest-50/60 dark:bg-forest-950 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              {MANDIS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.stateCode})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300">
                Quantity
              </label>
              <span className="text-[10px] text-forest-500 font-semibold">{totalQuintals} qtl</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="100"
                max="50000"
                step="50"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Math.max(50, Number(e.target.value) || 50))}
                className="w-full pl-3 pr-10 py-2 rounded-xl text-xs font-bold border border-forest-200 dark:border-forest-700 bg-forest-50/60 dark:bg-forest-950 text-forest-900 dark:text-forest-100"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-forest-500">
                kg
              </span>
            </div>
          </div>

          {/* Base Origin Price */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 block mb-1">
              Origin Rate (₹/kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-forest-500">
                ₹
              </span>
              <input
                type="number"
                min="1"
                max="1000"
                step="0.5"
                value={basePrice}
                onChange={(e) => setBasePrice(Math.max(1, Number(e.target.value) || 1))}
                className="w-full pl-6 pr-3 py-2 rounded-xl text-xs font-bold border border-forest-200 dark:border-forest-700 bg-forest-50/60 dark:bg-forest-950 text-forest-900 dark:text-forest-100"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Selection Chips */}
        <div className="pt-2 border-t border-forest-100 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs">
            <Truck className="w-4 h-4 text-forest-600 dark:text-green-400" />
            <span className="font-bold text-forest-800 dark:text-forest-200">Transport Fleet:</span>
            <span className="text-forest-500">
              (Auto-selected: <strong>{selectedVehicle.name}</strong>)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {VEHICLE_FLEET.map((veh) => {
              const isSelected = (selectedVehicleId || selectedVehicle.id) === veh.id;
              return (
                <button
                  key={veh.id}
                  type="button"
                  onClick={() => setSelectedVehicleId(veh.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                    isSelected
                      ? 'bg-forest-700 text-white shadow-sm'
                      : 'bg-forest-100/60 dark:bg-forest-800/60 text-forest-700 dark:text-forest-300 hover:bg-forest-200'
                  }`}
                >
                  {veh.capacityQuintals} qtl ({veh.name.split('(')[0]})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Arbitrage Top Result Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl p-5 sm:p-6 border shadow-md relative overflow-hidden ${
          hasArbitrageProfit
            ? 'bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-white border-forest-700'
            : 'bg-white dark:bg-forest-900 border-forest-200 dark:border-forest-800 text-forest-900 dark:text-forest-100'
        }`}
      >
        <div className="relative space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-forest-950">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ARBITRAGE WINNER RECOMMENDATION</span>
            </span>

            <span className="text-xs text-forest-300 font-semibold">
              Comparing {comparison.length} regional mandis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-1.5">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Sell at: {bestMandi.name} ({bestMandi.stateCode})
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
                Take Home {formatINR(bestMandi.netInHand)} Net Cash
              </h3>
              <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed font-normal">
                {hasArbitrageProfit ? (
                  <>
                    Hauling {totalQuintals} qtl to <strong>{bestMandi.name}</strong> ({bestMandi.distanceKm} km) fetches{' '}
                    <strong>₹{bestMandi.mandiPrice}/kg</strong>. Even after deducting{' '}
                    <strong>{formatINR(bestMandi.totalLogisticsCost)}</strong> total logistics (freight, toll, cess), you earn{' '}
                    <strong className="text-amber-300 font-bold">
                      +{formatINR(maxArbitrageGain)} (+{bestMandi.percentDiffVsOrigin}%)
                    </strong>{' '}
                    extra take-home profit than selling locally at {originMandi.name}.
                  </>
                ) : (
                  <>
                    Local sales at <strong>{originMandi.name}</strong> is your best option. Transporting produce to other mandis does not justify the road freight costs.
                  </>
                )}
              </p>
            </div>

            <div className="md:col-span-4 bg-white/10 dark:bg-forest-950/70 p-4 rounded-2xl border border-white/10 text-right space-y-1">
              <span className="text-[11px] font-bold text-forest-300 uppercase block">
                Net Advantage vs Local Mandi
              </span>
              <div className="font-display text-2xl sm:text-3xl font-black text-amber-300">
                {hasArbitrageProfit ? `+${formatINR(maxArbitrageGain)}` : '₹0 (Sell Local)'}
              </div>
              <span className="text-[10px] text-forest-300 block">
                Local Realization: {formatINR(originNetInHand)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sorting Tabs */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 flex items-center space-x-1.5">
          <Filter className="w-3.5 h-3.5" />
          <span>All Mandis Ranked ({comparison.length})</span>
        </span>

        <div className="flex rounded-xl bg-forest-100/70 dark:bg-forest-800/70 p-1">
          <button
            type="button"
            onClick={() => setSortBy('netProfit')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              sortBy === 'netProfit'
                ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                : 'text-forest-600 dark:text-forest-400'
            }`}
          >
            Highest Net Profit
          </button>
          <button
            type="button"
            onClick={() => setSortBy('distance')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              sortBy === 'distance'
                ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                : 'text-forest-600 dark:text-forest-400'
            }`}
          >
            Nearest Distance
          </button>
          <button
            type="button"
            onClick={() => setSortBy('price')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              sortBy === 'price'
                ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                : 'text-forest-600 dark:text-forest-400'
            }`}
          >
            Highest Mandi Rate
          </button>
        </div>
      </div>

      {/* Mandis Comparison Table */}
      <div className="overflow-x-auto rounded-3xl border border-forest-200 dark:border-forest-800 bg-white dark:bg-forest-900 shadow-soft">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-forest-50 dark:bg-forest-950/80 text-forest-700 dark:text-forest-300 font-bold border-b border-forest-200 dark:border-forest-800">
              <th className="py-3 px-4 whitespace-nowrap">Mandi & State</th>
              <th className="py-3 px-3 whitespace-nowrap">Distance & Time</th>
              <th className="py-3 px-3 whitespace-nowrap">Mandi Rate</th>
              <th className="py-3 px-3 whitespace-nowrap">Gross Value</th>
              <th className="py-3 px-3 whitespace-nowrap">Road Freight & Cess</th>
              <th className="py-3 px-3 whitespace-nowrap">Freight / qtl</th>
              <th className="py-3 px-4 whitespace-nowrap font-extrabold">Net in Hand</th>
              <th className="py-3 px-4 whitespace-nowrap">vs Local Hub</th>
              <th className="py-3 px-3 whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-100 dark:divide-forest-800/70 font-medium">
            {sortedComparison.map((mandi) => {
              const isProfit = mandi.netDifferenceVsOrigin > 0;
              const isLocal = mandi.isOrigin;

              return (
                <tr
                  key={mandi.mandiId}
                  className={`transition-colors ${
                    mandi.isWinner
                      ? 'bg-green-50/80 dark:bg-green-950/40'
                      : isLocal
                      ? 'bg-amber-50/60 dark:bg-amber-950/30'
                      : 'hover:bg-forest-50/50 dark:hover:bg-forest-800/30'
                  }`}
                >
                  {/* Mandi Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      {mandi.isWinner && (
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-forest-900 dark:text-forest-100 flex items-center space-x-1.5">
                          <span>{mandi.name}</span>
                          {mandi.isWinner && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-green-600 text-white">
                              WINNER
                            </span>
                          )}
                          {isLocal && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500 text-white">
                              LOCAL ORIGIN
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-forest-500">
                          {mandi.state} • {mandi.specialty}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Distance & Time */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-bold text-forest-900 dark:text-forest-100">
                      {mandi.distanceKm} km
                    </div>
                    <div className="text-[10px] text-forest-500 flex items-center space-x-0.5">
                      <Clock className="w-3 h-3" />
                      <span>~{mandi.transitHours} hrs transit</span>
                    </div>
                  </td>

                  {/* Mandi Rate */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-bold text-forest-900 dark:text-forest-100">
                      ₹{mandi.mandiPrice}/kg
                    </div>
                    <div className="text-[10px] text-forest-500">
                      ₹{mandi.mandiPricePerQuintal}/qtl
                    </div>
                  </td>

                  {/* Gross Value */}
                  <td className="py-3 px-3 whitespace-nowrap text-forest-700 dark:text-forest-300 font-semibold">
                    {formatINR(mandi.grossValue)}
                  </td>

                  {/* Logistics Cost */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-semibold text-tomato dark:text-red-400">
                      -{formatINR(mandi.totalLogisticsCost)}
                    </div>
                    <div className="text-[10px] text-forest-500">
                      Freight ₹{mandi.freightCost} + Cess ₹{mandi.apmcCess}
                    </div>
                  </td>

                  {/* Freight per Quintal */}
                  <td className="py-3 px-3 whitespace-nowrap text-forest-600 dark:text-forest-400 font-semibold">
                    ₹{mandi.transportCostPerQuintal}/qtl
                  </td>

                  {/* Net in Hand */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-display font-black text-sm text-forest-900 dark:text-forest-100">
                      {formatINR(mandi.netInHand)}
                    </div>
                    <div className="text-[10px] text-forest-500">
                      ~{mandi.usableKg} kg delivered
                    </div>
                  </td>

                  {/* vs Local Hub */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {isLocal ? (
                      <span className="text-[11px] font-bold text-forest-500">Local Baseline</span>
                    ) : (
                      <span
                        className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-lg text-xs font-bold ${
                          isProfit
                            ? 'bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-950 text-tomato dark:text-red-300'
                        }`}
                      >
                        {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>
                          {isProfit ? '+' : ''}
                          {formatINR(mandi.netDifferenceVsOrigin)} ({isProfit ? `+${mandi.percentDiffVsOrigin}%` : `${mandi.percentDiffVsOrigin}%`})
                        </span>
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    {onSelectCropForAdvisor && (
                      <button
                        type="button"
                        onClick={() => onSelectCropForAdvisor(selectedCropId)}
                        className="p-1.5 rounded-xl bg-forest-100 dark:bg-forest-800 hover:bg-forest-200 text-forest-700 dark:text-forest-200 transition-colors"
                        title="Evaluate in Advisor"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
