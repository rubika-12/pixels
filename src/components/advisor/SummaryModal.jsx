import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, CheckCircle, ShieldCheck, Download, Share2 } from 'lucide-react';
import { formatINR } from '../../lib/formatters';
import { triggerPrintSummary } from '../../lib/exportSummary';

export default function SummaryModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    triggerPrintSummary();
  };

  const isHold = result.verdict === 'HOLD';
  const diffSign = result.difference >= 0 ? '+' : '-';
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm">
        
        {/* Backdrop dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Window / Printable Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6 print-sheet"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-forest-100 dark:border-forest-800 no-print">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📄</span>
              <h3 className="font-bold text-lg text-forest-900 dark:text-forest-100">
                Official Advisory Summary Slip
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-forest-500 hover:text-forest-900 dark:hover:text-forest-100 hover:bg-forest-100 dark:hover:bg-forest-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Document Body */}
          <div className="space-y-6">
            
            {/* Slip Header with Stamp */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-display text-2xl font-black text-forest-900 dark:text-forest-100">
                  Store<span className="text-forest-600">Or</span>Sell
                </span>
                <p className="text-xs text-forest-600 dark:text-forest-400 mt-0.5">
                  Post-Harvest Agricultural Decision Intelligence
                </p>
                <div className="text-[11px] text-forest-500 mt-1">
                  Issued: {dateStr} • Ref #{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </div>
              </div>

              {/* Verdict Stamp */}
              <div
                className={`px-4 py-2 rounded-2xl border-2 font-display text-center uppercase tracking-wider ${
                  isHold
                    ? 'border-forest-600 text-forest-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50'
                    : 'border-tomato text-tomato dark:text-red-400 bg-red-50 dark:bg-red-950/50'
                }`}
              >
                <div className="text-xs font-bold">RECOMMENDATION</div>
                <div className="text-xl font-extrabold">{result.verdict}</div>
                {isHold && (
                  <div className="text-[10px] font-semibold">TARGET DATE: {result.bestDateFormatted}</div>
                )}
              </div>
            </div>

            {/* Produce Specification Table */}
            <div className="rounded-2xl bg-forest-50/70 dark:bg-forest-950/50 p-4 border border-forest-100 dark:border-forest-800/80 text-xs space-y-2">
              <div className="font-bold text-forest-900 dark:text-forest-100 uppercase tracking-wider text-[11px] mb-1">
                Current Stock & Storage Inventory
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 text-forest-800 dark:text-forest-200">
                <div><span className="text-forest-500">Produce:</span> {result.crop.name} {result.crop.emoji} ({result.crop.category === 'fruit' ? 'Fruit' : 'Vegetable'})</div>
                <div><span className="text-forest-500">Current Stock:</span> {result.quantityKg.toLocaleString('en-IN')} kg in hand</div>
                <div><span className="text-forest-500">Storage Condition:</span> {result.storage.name}</div>
                <div><span className="text-forest-500">Days in Storage:</span> {result.crop.defaultAge || 2} days</div>
                <div><span className="text-forest-500">Today Mandi Rate:</span> ₹{result.todayPrice}/kg</div>
                <div><span className="text-forest-500">Remaining Shelf Life:</span> ~{result.remainingShelfLife} days</div>
              </div>
            </div>

            {/* Financial Ledger Comparison */}
            <div className="space-y-3">
              <div className="font-bold text-forest-900 dark:text-forest-100 uppercase tracking-wider text-xs">
                Financial Liquidation Ledger
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Sell Now Column */}
                <div className="p-3.5 rounded-xl border border-forest-200 dark:border-forest-800 bg-white dark:bg-forest-900 space-y-1.5">
                  <div className="font-bold text-forest-800 dark:text-forest-200 uppercase text-[10px]">
                    Option A: Immediate Sale Today
                  </div>
                  <div className="flex justify-between text-forest-600 dark:text-forest-400">
                    <span>Gross Realization:</span>
                    <span>{formatINR(result.netSell)}</span>
                  </div>
                  <div className="flex justify-between text-forest-500">
                    <span>Storage Cost:</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between font-bold text-forest-900 dark:text-forest-100 pt-1 border-t border-forest-100 dark:border-forest-800">
                    <span>Net In Pocket:</span>
                    <span className="text-sm">{formatINR(result.netSell)}</span>
                  </div>
                </div>

                {/* Hold Option Column */}
                <div className="p-3.5 rounded-xl border border-forest-300 dark:border-forest-700 bg-forest-50/50 dark:bg-forest-950/60 space-y-1.5">
                  <div className="font-bold text-forest-700 dark:text-green-400 uppercase text-[10px]">
                    Option B: Hold to {result.bestDateFormatted} ({result.bestDay}d)
                  </div>
                  <div className="flex justify-between text-forest-600 dark:text-forest-400">
                    <span>Gross ({result.usableQtyKg}kg @ ₹{result.projectedPriceAtBestDay}/kg):</span>
                    <span>{formatINR(result.grossHold)}</span>
                  </div>
                  <div className="flex justify-between text-tomato dark:text-red-400">
                    <span>Storage Tariff ({result.bestDay}d):</span>
                    <span>-{formatINR(result.storageCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-forest-900 dark:text-forest-100 pt-1 border-t border-forest-200 dark:border-forest-800">
                    <span>Net Expected:</span>
                    <span className="text-sm text-forest-700 dark:text-green-400">{formatINR(result.netHold)}</span>
                  </div>
                </div>
              </div>

              {/* Net Advantage Banner */}
              <div className="p-3.5 rounded-xl bg-forest-100 dark:bg-forest-800/80 flex items-center justify-between text-xs font-bold text-forest-900 dark:text-forest-100">
                <span>Net Strategic Difference:</span>
                <span className="text-sm text-forest-700 dark:text-green-300">
                  {diffSign}{formatINR(Math.abs(result.difference))} ({result.percentGain >= 0 ? `+${result.percentGain}%` : `${result.percentGain}%`})
                </span>
              </div>
            </div>

            {/* Mathematical Reason */}
            <div className="text-xs text-forest-700 dark:text-forest-300 bg-white dark:bg-forest-900/60 p-3 rounded-xl border border-forest-100 dark:border-forest-800 leading-relaxed font-medium">
              💡 <span className="font-semibold">Analysis:</span> {result.reason}
            </div>

            {/* Validation Stamp & Footer */}
            <div className="pt-3 border-t border-forest-100 dark:border-forest-800 flex justify-between items-center text-[10px] text-forest-500">
              <div>StoreOrSell Decision Engine</div>
              <div>Certified AgriTech Analysis • 2026</div>
            </div>

          </div>

          {/* Action Buttons (Excluded from Print) */}
          <div className="pt-3 border-t border-forest-100 dark:border-forest-800 flex items-center justify-end space-x-3 no-print">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 active:scale-95 transition-all shadow-md shadow-forest-900/15"
            >
              <Printer className="w-4 h-4" />
              <span>Print or Save as PDF</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
