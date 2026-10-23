import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR } from '../../lib/formatters';
import { USER_PROFILE, PNL_RECORDS, getPnLSummary } from '../../data/pnlData';
import {
  X,
  User,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Building,
  Phone,
  Package,
  Download,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export default function UserDashboardModal({ isOpen, onClose }) {
  const [selectedMonth, setSelectedMonth] = useState('all');

  if (!isOpen) return null;

  const filteredRecords = PNL_RECORDS.filter((r) => {
    if (selectedMonth === 'all') return true;
    return r.month.toLowerCase() === selectedMonth.toLowerCase();
  });

  const { totalNetRealized, totalExtraGain, totalSpoilageSavedKg, totalQuantityKg } = getPnLSummary(filteredRecords);

  const months = ['all', 'October', 'September', 'August'];

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Commodity', 'Quantity_kg', 'Decision', 'Target_Date', 'Realized_Net_INR', 'Extra_Gain_INR', 'Spoilage_Avoided_kg'];
    const rows = filteredRecords.map(r => [
      r.dateFormatted,
      r.cropName,
      r.quantityKg,
      r.decision,
      r.targetDate,
      r.realizedNet,
      r.profitGain,
      r.spoilageAvoidedKg,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StoreOrSell_PnL_Statement_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/60 backdrop-blur-sm flex justify-end p-2 sm:p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 80, scale: 0.98 }}
        transition={{ type: 'spring', damping: 26, stiffness: 240 }}
        className="w-full max-w-2xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden my-auto"
      >
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-forest-100 dark:border-forest-800 flex items-center justify-between bg-harvest-surface/50 dark:bg-forest-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-700 to-forest-800 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-forest-900/15">
              RL
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-extrabold text-xl text-forest-900 dark:text-forest-100">
                  User Dashboard & P&L
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                  Verified FPO
                </span>
              </div>
              <p className="text-xs text-forest-600 dark:text-forest-400">
                Member Profile & 3-Month Performance Statements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-forest-500 hover:text-forest-900 dark:hover:text-forest-100 hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
            aria-label="Close user dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Basic User Details */}
          <div className="rounded-2xl p-5 bg-forest-50/60 dark:bg-forest-800/40 border border-forest-100 dark:border-forest-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600 dark:text-forest-400">
                Basic User Details
              </span>
              <span className="text-xs text-forest-500">ID: {USER_PROFILE.memberId}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-forest-500 uppercase">Trader / Member</span>
                <div className="font-bold text-forest-900 dark:text-forest-100 text-sm flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-forest-600" />
                  <span>{USER_PROFILE.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-forest-500 uppercase">FPO Organization</span>
                <div className="font-bold text-forest-900 dark:text-forest-100 text-sm flex items-center space-x-1.5">
                  <Building className="w-3.5 h-3.5 text-forest-600" />
                  <span>{USER_PROFILE.organization}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-forest-500 uppercase">Mandi Market Hub</span>
                <div className="font-medium text-forest-800 dark:text-forest-200">
                  {USER_PROFILE.hub}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-forest-500 uppercase">Phone & State</span>
                <div className="font-medium text-forest-800 dark:text-forest-200 flex items-center space-x-1.5">
                  <Phone className="w-3 h-3 text-forest-500" />
                  <span>{USER_PROFILE.phone} • {USER_PROFILE.state}</span>
                </div>
              </div>
            </div>

            {/* Active Inventory Holdings */}
            <div className="pt-2 border-t border-forest-100 dark:border-forest-700/50">
              <span className="text-[10px] font-semibold text-forest-500 uppercase block mb-1.5">
                Current Active Storage Lots
              </span>
              <div className="flex flex-wrap gap-2">
                {USER_PROFILE.activeHoldings.map((h, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-xs font-semibold text-forest-800 dark:text-forest-200 flex items-center space-x-1"
                  >
                    <span>📦 {h.crop}:</span>
                    <span className="text-forest-600 dark:text-forest-300 font-bold">{h.quantity}</span>
                    <span className="text-[10px] text-forest-500">({h.storage})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Only P&L Statements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600 dark:text-forest-400">
                P&L Statements (Last 3 Months)
              </span>

              {/* Month Selector */}
              <div className="flex rounded-xl bg-forest-100/70 dark:bg-forest-800/60 p-1 text-xs">
                {months.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                      selectedMonth === m
                        ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                        : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
                    }`}
                  >
                    {m === 'all' ? 'All (3M)' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl p-3.5 bg-forest-50/50 dark:bg-forest-800/30 border border-forest-100 dark:border-forest-800">
                <span className="text-[10px] font-semibold text-forest-500 uppercase block">Realized Net</span>
                <span className="font-display text-lg font-black text-forest-900 dark:text-forest-100">
                  {formatINR(totalNetRealized)}
                </span>
                <span className="text-[10px] text-forest-500 block">{filteredRecords.length} Lots</span>
              </div>

              <div className="rounded-2xl p-3.5 bg-green-50/70 dark:bg-green-950/40 border border-green-200 dark:border-green-800/80">
                <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 uppercase block">Net Margin Gain</span>
                <span className="font-display text-lg font-black text-forest-700 dark:text-green-400">
                  +{formatINR(totalExtraGain)}
                </span>
                <span className="text-[10px] text-green-700 dark:text-green-300 block font-semibold">+8.6% Lift</span>
              </div>

              <div className="rounded-2xl p-3.5 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50">
                <span className="text-[10px] font-semibold text-onion dark:text-amber-400 uppercase block">Spoilage Saved</span>
                <span className="font-display text-lg font-black text-onion dark:text-amber-400">
                  {totalSpoilageSavedKg.toLocaleString('en-IN')} kg
                </span>
                <span className="text-[10px] text-forest-500 block">Prevented rot</span>
              </div>

              <div className="rounded-2xl p-3.5 bg-forest-50/50 dark:bg-forest-800/30 border border-forest-100 dark:border-forest-800">
                <span className="text-[10px] font-semibold text-forest-500 uppercase block">Total Stock</span>
                <span className="font-display text-lg font-black text-forest-900 dark:text-forest-100">
                  {(totalQuantityKg / 1000).toFixed(1)} MT
                </span>
                <span className="text-[10px] text-forest-500 block">{totalQuantityKg.toLocaleString('en-IN')} kg</span>
              </div>
            </div>

            {/* P&L Statement Table */}
            <div className="rounded-2xl border border-forest-100 dark:border-forest-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-forest-50 dark:bg-forest-950 border-b border-forest-100 dark:border-forest-800 text-[10px] uppercase font-bold text-forest-500 tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Date & Crop</th>
                      <th className="py-2.5 px-3">Quantity</th>
                      <th className="py-2.5 px-3">Decision</th>
                      <th className="py-2.5 px-3 text-right">Realized Net</th>
                      <th className="py-2.5 px-3 text-right">Extra Margin</th>
                      <th className="py-2.5 px-3 text-right">Spoilage Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-50 dark:divide-forest-800/50 font-medium">
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-forest-50/40 dark:hover:bg-forest-800/20">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center space-x-1.5">
                            <span>{r.cropEmoji}</span>
                            <div>
                              <div className="font-bold text-forest-900 dark:text-forest-100">{r.cropName}</div>
                              <div className="text-[10px] text-forest-500">{r.dateFormatted}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-forest-700 dark:text-forest-300">
                          {r.quantityKg.toLocaleString('en-IN')} kg
                        </td>

                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            r.decision === 'HOLD'
                              ? 'bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-950 text-tomato dark:text-red-300'
                          }`}>
                            {r.decision}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right font-display font-bold text-forest-900 dark:text-forest-100">
                          {formatINR(r.realizedNet)}
                        </td>

                        <td className="py-2.5 px-3 text-right font-bold text-forest-700 dark:text-green-400">
                          +{formatINR(r.profitGain)}
                        </td>

                        <td className="py-2.5 px-3 text-right text-onion dark:text-amber-400 font-semibold">
                          {r.spoilageAvoidedKg} kg
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between bg-harvest-surface/30 dark:bg-forest-950/40">
          <span className="text-[11px] text-forest-500">
            Statement Period: Aug 2026 – Oct 2026
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl text-xs font-bold text-forest-800 dark:text-forest-200 border border-forest-200 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Statement (CSV)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 shadow-sm"
            >
              Close
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
