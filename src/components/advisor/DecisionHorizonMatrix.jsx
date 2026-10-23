import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { formatINR } from '../../lib/formatters';
import {
  Table,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';

export default function DecisionHorizonMatrix({ matrix, bestDay, isHold, currentPrice, quantityKg }) {
  const { lang, t } = useApp();
  const [activeHorizonId, setActiveHorizonId] = useState(
    matrix?.find((h) => h.isOptimal)?.id || matrix?.[0]?.id || 'horizon-0'
  );

  if (!matrix || matrix.length === 0) return null;

  const getRiskBadge = (horizon) => {
    if (horizon.isExceedingShelfLife) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
          <AlertTriangle className="w-3 h-3 text-red-500" />
          <span>Past Safe Life</span>
        </span>
      );
    }

    switch (horizon.riskRating) {
      case 'LOW':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800">
            <ShieldCheck className="w-3 h-3 text-green-600" />
            <span>Low Risk</span>
          </span>
        );
      case 'MODERATE':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Info className="w-3 h-3 text-amber-600" />
            <span>Moderate</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
            <Flame className="w-3 h-3 text-orange-600" />
            <span>High Risk</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>Rot Risk</span>
          </span>
        );
    }
  };

  const selectedHorizon = matrix.find((h) => h.id === activeHorizonId) || matrix[0];

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-forest-100 dark:border-forest-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white flex items-center justify-center shadow-md shadow-forest-900/10">
            <Layers className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-forest-900 dark:text-forest-100">
                "Your Options" Horizon Matrix
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-green-300">
                Side-by-Side
              </span>
            </div>
            <p className="text-xs text-forest-600 dark:text-forest-400">
              Comparing Sell Today vs Hold 3 Days vs Hold 7 Days vs Hold 15 Days vs Hold 30 Days
            </p>
          </div>
        </div>

        <div className="text-xs text-forest-500 font-semibold self-start sm:self-auto">
          Stock: <strong className="text-forest-800 dark:text-forest-200">{quantityKg.toLocaleString('en-IN')} kg</strong>
        </div>
      </div>

      {/* Desktop / Tablet Scrollable Table */}
      <div className="overflow-x-auto rounded-2xl border border-forest-200 dark:border-forest-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-forest-50 dark:bg-forest-950/80 text-forest-700 dark:text-forest-300 font-bold border-b border-forest-200 dark:border-forest-800">
              <th className="py-3 px-3.5 whitespace-nowrap">Decision Horizon</th>
              <th className="py-3 px-3 whitespace-nowrap">Projected Price</th>
              <th className="py-3 px-3 whitespace-nowrap">Spoilage Loss</th>
              <th className="py-3 px-3 whitespace-nowrap">Storage Cost</th>
              <th className="py-3 px-3 whitespace-nowrap" title="Interest on locked inventory capital at ~1%/month">
                Cost of Waiting
              </th>
              <th className="py-3 px-3.5 whitespace-nowrap font-extrabold">Net in Hand</th>
              <th className="py-3 px-3 whitespace-nowrap">vs Selling Now</th>
              <th className="py-3 px-3 whitespace-nowrap">Risk Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-100 dark:divide-forest-800/70 font-medium">
            {matrix.map((row) => {
              const isSelected = row.id === activeHorizonId;
              const isDiffPositive = row.netDifferenceVsNow > 0;
              const isDiffNegative = row.netDifferenceVsNow < 0;

              return (
                <tr
                  key={row.id}
                  onClick={() => setActiveHorizonId(row.id)}
                  className={`cursor-pointer transition-colors ${
                    row.isOptimal
                      ? 'bg-green-50/70 dark:bg-green-950/40 hover:bg-green-100/70 dark:hover:bg-green-950/60'
                      : isSelected
                      ? 'bg-forest-50/80 dark:bg-forest-800/50'
                      : 'hover:bg-forest-50/50 dark:hover:bg-forest-800/20'
                  }`}
                >
                  {/* Horizon Column */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center space-x-1.5">
                      {row.isOptimal && (
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-forest-900 dark:text-forest-100 flex items-center space-x-1.5">
                          <span>{row.label}</span>
                          {row.isOptimal && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-green-600 text-white">
                              OPTIMAL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-forest-500 font-semibold">
                          {row.dateFormatted} ({row.day === 0 ? 'Today' : `+${row.day}d`})
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Projected Price */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-forest-900 dark:text-forest-100">
                      ₹{row.projectedPrice?.toFixed(2)}/kg
                    </div>
                    <div className="text-[10px] text-forest-500">
                      ₹{row.projectedPricePerQuintal?.toLocaleString('en-IN')}/qtl
                    </div>
                  </td>

                  {/* Spoilage Loss */}
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        row.spoilagePercent > 15
                          ? 'text-tomato dark:text-red-400 font-bold'
                          : row.spoilagePercent > 0
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-forest-500'
                      }`}
                    >
                      {row.spoilagePercent}%
                    </span>
                    {row.spoilageKg > 0 && (
                      <span className="text-[10px] text-forest-500 block">
                        (-{row.spoilageKg} kg)
                      </span>
                    )}
                  </td>

                  {/* Storage Tariff */}
                  <td className="py-3 px-3 text-forest-700 dark:text-forest-300">
                    {row.storageCost > 0 ? `-${formatINR(row.storageCost)}` : '₹0'}
                  </td>

                  {/* Cost of Waiting / Interest */}
                  <td className="py-3 px-3 text-forest-500">
                    {row.costOfWaitingInterest > 0
                      ? `-${formatINR(row.costOfWaitingInterest)}`
                      : '₹0'}
                  </td>

                  {/* Net in Hand */}
                  <td className="py-3 px-3.5">
                    <div
                      className={`font-display font-extrabold text-sm ${
                        row.isOptimal
                          ? 'text-forest-700 dark:text-green-400'
                          : 'text-forest-900 dark:text-forest-100'
                      }`}
                    >
                      {formatINR(row.netInHand)}
                    </div>
                    <div className="text-[10px] text-forest-500">
                      ~{row.usableQtyKg} kg usable
                    </div>
                  </td>

                  {/* vs Selling Now */}
                  <td className="py-3 px-3">
                    {row.day === 0 ? (
                      <span className="text-[11px] font-bold text-forest-500">Baseline</span>
                    ) : (
                      <span
                        className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-lg text-xs font-bold ${
                          isDiffPositive
                            ? 'bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300'
                            : isDiffNegative
                            ? 'bg-red-100 dark:bg-red-950 text-tomato dark:text-red-300'
                            : 'text-forest-500'
                        }`}
                      >
                        {isDiffPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {isDiffPositive ? '+' : ''}
                          {formatINR(row.netDifferenceVsNow)} ({row.percentGainVsNow > 0 ? `+${row.percentGainVsNow}%` : `${row.percentGainVsNow}%`})
                        </span>
                      </span>
                    )}
                  </td>

                  {/* Risk Rating */}
                  <td className="py-3 px-3">{getRiskBadge(row)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Horizon Deep-Dive Insight Box */}
      {selectedHorizon && (
        <div className="p-4 rounded-2xl bg-forest-50/70 dark:bg-forest-950/50 border border-forest-200 dark:border-forest-800 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-forest-900 dark:text-forest-100 flex items-center space-x-2">
              <span>Selected Option: <strong>{selectedHorizon.label}</strong> ({selectedHorizon.fullDateFormatted})</span>
              {selectedHorizon.isOptimal && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-forest-950 text-[10px] font-black uppercase">
                  Best Return Choice
                </span>
              )}
            </span>

            <span className="font-bold">
              Net in Hand: <span className="font-display text-forest-700 dark:text-green-400 text-sm font-extrabold">{formatINR(selectedHorizon.netInHand)}</span>
            </span>
          </div>

          <p className="text-forest-700/90 dark:text-forest-300/90 leading-relaxed">
            {selectedHorizon.day === 0
              ? 'Selling immediately eliminates all climate risk, storage tariff, and moisture weight loss, securing prompt cash for working capital.'
              : selectedHorizon.isExceedingShelfLife
              ? `⚠️ Holding for ${selectedHorizon.day} days exceeds the crop's remaining safe shelf life. Moisture loss and rot will destroy ${selectedHorizon.spoilagePercent}% of produce, resulting in net financial loss.`
              : `Holding until ${selectedHorizon.dateFormatted} gives a projected price of ₹${selectedHorizon.projectedPrice}/kg. After subtracting ₹${selectedHorizon.storageCost.toLocaleString('en-IN')} in storage costs and accounting for ${selectedHorizon.spoilagePercent}% expected spoilage (${selectedHorizon.spoilageKg} kg), your net advantage is ${selectedHorizon.netDifferenceVsNow >= 0 ? '+' : ''}${formatINR(selectedHorizon.netDifferenceVsNow)}.`}
          </p>
        </div>
      )}
    </div>
  );
}
