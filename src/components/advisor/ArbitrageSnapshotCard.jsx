import React, { useState } from 'react';
import { formatINR } from '../../lib/formatters';
import { calculateMandiArbitrage } from '../../lib/arbitrage';
import { Truck, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function ArbitrageSnapshotCard({ result, onNavigateToArbitrage }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  const arbitrageSnapshot = calculateMandiArbitrage({
    cropId: result.crop?.id || 'tomato',
    quantityKg: result.quantityKg || 1000,
    basePrice: result.todayPrice || 18,
  });

  return (
    <div className="rounded-3xl p-5 bg-gradient-to-br from-forest-50/80 via-white to-forest-50/40 dark:from-forest-900 dark:via-forest-950 dark:to-forest-900 border border-forest-200 dark:border-forest-800 shadow-soft space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-700 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
            <Truck className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-forest-900 dark:text-forest-100 flex items-center space-x-1.5">
              <span>Inter-Mandi Arbitrage Snapshot</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                Where to Sell
              </span>
            </div>
            <div className="text-[11px] text-forest-600 dark:text-forest-400 mt-0.5">
              Top Mandi: <strong>{arbitrageSnapshot.bestMandi.name}</strong> •{' '}
              {arbitrageSnapshot.hasArbitrageProfit
                ? `Extra +${formatINR(arbitrageSnapshot.maxArbitrageGain)} net after transport!`
                : 'Local Mandi is optimal'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-forest-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-forest-700 dark:text-forest-200 flex items-center space-x-1 hover:bg-forest-50"
          >
            <span>{showDetails ? 'Hide' : 'Quick View'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onNavigateToArbitrage && (
            <button
              type="button"
              onClick={onNavigateToArbitrage}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors flex items-center space-x-1 shadow-sm"
            >
              <span>Full Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {showDetails && (
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
  );
}
