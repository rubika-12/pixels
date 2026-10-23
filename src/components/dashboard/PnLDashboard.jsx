import React, { useState, useEffect } from 'react';
import { formatINR } from '../../lib/formatters';
import { PNL_RECORDS, USER_PROFILE, getPnLSummary } from '../../data/pnlData';
import {
  fetchPnLRecords,
  fetchPnLSummary,
  fetchStockAssessments,
  fetchUserProfile,
  testDatabaseConnection,
  markStockSold,
  deleteStockAssessment,
} from '../../lib/api';
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  Filter,
  DollarSign,
  ArrowUpRight,
  Package,
  Database,
  User,
  Building,
  Phone,
  CheckCircle2,
  Trash2,
  Download,
  PlusCircle,
  RefreshCw,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function PnLDashboard({ onNavigateToAdvisor }) {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [dbStatus, setDbStatus] = useState({ connected: false, loading: true, info: null });
  const [userProfile, setUserProfile] = useState(USER_PROFILE);
  const [stockHoldings, setStockHoldings] = useState([]);
  const [pnlRecords, setPnlRecords] = useState(PNL_RECORDS);
  const [summary, setSummary] = useState(getPnLSummary(PNL_RECORDS));
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingId, setIsProcessingId] = useState(null);

  // Load live data from Neon PostgreSQL backend
  const loadDashboardData = async () => {
    setIsLoading(true);

    // 1. Check live database connectivity
    const dbTest = await testDatabaseConnection();
    if (dbTest.ok && dbTest.data?.details?.connected) {
      setDbStatus({
        connected: true,
        loading: false,
        info: dbTest.data.details,
      });
    } else {
      setDbStatus({
        connected: false,
        loading: false,
        info: dbTest.data?.detail || null,
      });
    }

    // 2. Fetch User Profile
    const profile = await fetchUserProfile();
    if (profile) {
      setUserProfile(profile);
    }

    // 3. Fetch User Stock Holdings (active assessments in DB)
    const holdings = await fetchStockAssessments();
    if (holdings && Array.isArray(holdings)) {
      setStockHoldings(holdings);
    }

    // 4. Fetch P&L Records
    const records = await fetchPnLRecords(selectedMonth);
    if (records && Array.isArray(records) && records.length > 0) {
      setPnlRecords(records);
    } else {
      const filtered = PNL_RECORDS.filter((r) => {
        if (selectedMonth === 'all') return true;
        return r.month.toLowerCase() === selectedMonth.toLowerCase();
      });
      setPnlRecords(filtered);
    }

    // 5. Fetch Summary
    const summaryData = await fetchPnLSummary(selectedMonth);
    if (summaryData) {
      setSummary({
        totalNetRealized: summaryData.total_net_realized,
        totalExtraGain: summaryData.total_extra_gain,
        totalSpoilageSavedKg: summaryData.total_spoilage_saved_kg,
        totalQuantityKg: summaryData.total_quantity_kg,
        totalLots: summaryData.total_lots,
      });
    } else {
      const filtered = PNL_RECORDS.filter((r) => {
        if (selectedMonth === 'all') return true;
        return r.month.toLowerCase() === selectedMonth.toLowerCase();
      });
      setSummary(getPnLSummary(filtered));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth]);

  // Handle Mark Stock Sold
  const handleMarkSold = async (holdingId) => {
    const inputPrice = prompt('Enter actual realized selling price (₹/kg):');
    const priceNum = inputPrice ? Number(inputPrice) : null;
    setIsProcessingId(holdingId);
    const res = await markStockSold(holdingId, priceNum);
    setIsProcessingId(null);
    if (res.ok) {
      await loadDashboardData();
    } else {
      alert('Could not mark lot as sold: ' + (res.error || 'Server unavailable'));
    }
  };

  // Handle Delete Stock Lot
  const handleDeleteHolding = async (holdingId) => {
    if (!confirm('Are you sure you want to remove this stock assessment?')) return;
    setIsProcessingId(holdingId);
    const res = await deleteStockAssessment(holdingId);
    setIsProcessingId(null);
    if (res.ok) {
      setStockHoldings((prev) => prev.filter((h) => h.id !== holdingId));
    } else {
      alert('Could not delete holding from database');
    }
  };

  // Download CSV
  const handleDownloadCSV = () => {
    const headers = [
      'Date',
      'Commodity',
      'Quantity_kg',
      'Decision',
      'Target_Date',
      'Realized_Net_INR',
      'Extra_Gain_INR',
      'Spoilage_Avoided_kg',
    ];
    const rows = pnlRecords.map((r) => [
      r.date_formatted || r.dateFormatted,
      r.crop_name || r.cropName,
      r.quantity_kg || r.quantityKg,
      r.decision,
      r.target_date || r.targetDate,
      r.realized_net || r.realizedNet,
      r.profit_gain || r.profitGain,
      r.spoilage_avoided_kg || r.spoilageAvoidedKg,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StoreOrSell_PnL_Statement_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const months = ['all', 'October', 'September', 'August'];

  return (
    <div id="pnl-dashboard" className="py-8 sm:py-12 space-y-10 font-sans">
      {/* Header & Neon DB Connectivity Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-forest-100 dark:border-forest-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300 mb-2">
            <DollarSign className="w-3.5 h-3.5 text-forest-600" />
            <span>FINANCIAL PERFORMANCE & HOLDINGS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-forest-900 dark:text-forest-100">
            User Profit & Loss Dashboard
          </h2>
          <p className="text-sm text-forest-700/80 dark:text-forest-300/80 mt-1 max-w-2xl">
            Live statements and stock holdings backed by your Neon PostgreSQL database. Track actual financial returns and avoided spoilage loss.
          </p>
        </div>

        {/* Database Status Pill & Refresh Trigger */}
        <div className="flex items-center space-x-2.5">
          <div
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
              dbStatus.connected
                ? 'bg-green-50 dark:bg-green-950/80 text-forest-700 dark:text-green-300 border-green-300 dark:border-green-800'
                : 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}
          >
            <Database className="w-4 h-4 text-forest-600 dark:text-green-400" />
            <span>
              {dbStatus.connected
                ? `Neon PostgreSQL (${dbStatus.info?.database_name || 'neondb'}) • Live SSL`
                : 'Neon DB Standby / Local Mode'}
            </span>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="p-2.5 rounded-2xl border border-forest-200 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-800 text-forest-700 dark:text-forest-300 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Basic User Details Card */}
      <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-forest-100 dark:border-forest-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-700 to-forest-800 text-white font-bold text-lg flex items-center justify-center shadow-md">
              RL
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-extrabold text-xl text-forest-900 dark:text-forest-100">
                  {userProfile.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                  {userProfile.kyc_status || userProfile.kycStatus || 'Verified Member'}
                </span>
              </div>
              <p className="text-xs text-forest-600 dark:text-forest-400">
                {userProfile.role || 'FPO Trader & Member'} • {userProfile.organization || 'Pixel Punks FPO'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-forest-600 dark:text-forest-400">
            <span className="font-semibold">ID: #{userProfile.member_id || userProfile.memberId || 'FPO-TN-2026-884'}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{userProfile.phone}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-forest-50/60 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-500 block mb-0.5">
              Central Mandi Hub
            </span>
            <span className="font-bold text-forest-900 dark:text-forest-100">
              {userProfile.hub || 'Dindigul & Oddanchatram Central Mandi Hub'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-forest-50/60 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-500 block mb-0.5">
              Active Storage Lots
            </span>
            <span className="font-bold text-forest-900 dark:text-forest-100">
              {stockHoldings.length} Lots Tracked in Neon DB
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-forest-50/60 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-500 block mb-0.5">
              State & Mandi Jurisdiction
            </span>
            <span className="font-bold text-forest-900 dark:text-forest-100">
              {userProfile.state || 'Tamil Nadu'} Agricultural Board
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic User Stock Holdings (Backed by Neon DB) */}
      <div className="rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-forest-100 dark:border-forest-800">
          <div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-forest-600 dark:text-green-400" />
              <h3 className="font-display text-xl font-bold text-forest-900 dark:text-forest-100">
                Active Crop Holdings & Assessments
              </h3>
            </div>
            <p className="text-xs text-forest-600 dark:text-forest-400 mt-0.5">
              Lots currently stored, evaluated by Hold-or-Sell intelligence, and persisted to your Neon database
            </p>
          </div>

          {onNavigateToAdvisor && (
            <button
              onClick={onNavigateToAdvisor}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Evaluate New Stock in Advisor</span>
            </button>
          )}
        </div>

        {stockHoldings.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3">
            <div className="text-4xl">📦</div>
            <div className="text-sm font-bold text-forest-800 dark:text-forest-200">
              No active stock holdings saved yet
            </div>
            <p className="text-xs text-forest-500 max-w-sm mx-auto">
              Use the Post-Harvest Advisor to evaluate your produce and click "Save Stock Assessment to Neon Database".
            </p>
            {onNavigateToAdvisor && (
              <button
                onClick={onNavigateToAdvisor}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800"
              >
                Go to Advisor →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-forest-100 dark:border-forest-800 text-forest-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Lot ID & Crop</th>
                  <th className="pb-3 font-bold">Quantity</th>
                  <th className="pb-3 font-bold">Storage & Mandi</th>
                  <th className="pb-3 font-bold">Current Mandi Price</th>
                  <th className="pb-3 font-bold">Recommendation</th>
                  <th className="pb-3 font-bold">Target Date</th>
                  <th className="pb-3 font-bold text-right">Expected Advantage</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50 dark:divide-forest-800/60 font-medium">
                {stockHoldings.map((h) => {
                  const isHold = h.decision === 'HOLD';
                  return (
                    <tr key={h.id} className="hover:bg-forest-50/50 dark:hover:bg-forest-800/30 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-7 h-7 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center text-xs font-bold text-forest-800 dark:text-forest-200">
                            #{h.id}
                          </span>
                          <div>
                            <div className="font-bold text-forest-900 dark:text-forest-100">{h.crop_name}</div>
                            <div className="text-[10px] text-forest-500 capitalize">{h.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 text-forest-800 dark:text-forest-200">
                        <span className="font-bold">{h.quantity_kg?.toLocaleString('en-IN')} kg</span>
                        {h.unit !== 'kg' && h.unit_amount && (
                          <span className="text-[10px] text-forest-500 block">
                            ({h.unit_amount} {h.unit})
                          </span>
                        )}
                      </td>

                      <td className="py-3.5">
                        <div className="text-forest-900 dark:text-forest-100 capitalize font-medium">
                          {h.storage_type} storage
                        </div>
                        <div className="text-[10px] text-forest-500 truncate max-w-[140px]">
                          {h.location_mandi}
                        </div>
                      </td>

                      <td className="py-3.5 font-bold text-forest-800 dark:text-forest-200">
                        ₹{h.current_mandi_price}/kg
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            isHold
                              ? 'bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300 border border-green-300 dark:border-green-800'
                              : 'bg-red-100 dark:bg-red-950 text-tomato dark:text-red-300 border border-red-300 dark:border-red-800'
                          }`}
                        >
                          {h.decision}
                        </span>
                      </td>

                      <td className="py-3.5 text-forest-700 dark:text-forest-300">
                        {h.target_date || 'Day 5'}
                      </td>

                      <td className="py-3.5 text-right font-display font-bold text-forest-700 dark:text-green-400 text-sm">
                        +{formatINR(h.net_advantage || 0)}
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            disabled={isProcessingId === h.id}
                            onClick={() => handleMarkSold(h.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors shadow-xs"
                            title="Mark this lot as sold and record to P&L"
                          >
                            Mark Sold
                          </button>
                          <button
                            type="button"
                            disabled={isProcessingId === h.id}
                            onClick={() => handleDeleteHolding(h.id)}
                            className="p-1 rounded-lg text-forest-400 hover:text-tomato hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
                            title="Delete this holding"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4 Key Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Realized Net */}
        <div className="rounded-3xl p-6 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-2">
          <span className="text-xs font-semibold text-forest-600 dark:text-forest-400 uppercase tracking-wider font-sans">
            Total Realized Net Cash
          </span>
          <div className="font-display text-3xl font-black text-forest-900 dark:text-forest-100">
            {formatINR(summary.totalNetRealized)}
          </div>
          <span className="text-[11px] text-forest-500 block font-sans">
            Across {summary.totalLots} harvest lots ({selectedMonth === 'all' ? '90 days' : selectedMonth})
          </span>
        </div>

        {/* Metric 2: Net Extra Advantage */}
        <div className="rounded-3xl p-6 bg-green-50/70 dark:bg-green-950/40 border border-green-200 dark:border-green-800/80 shadow-soft space-y-2">
          <span className="text-xs font-semibold text-forest-700 dark:text-green-400 uppercase tracking-wider font-sans">
            Net Extra Margin Advantage
          </span>
          <div className="font-display text-3xl font-black text-forest-700 dark:text-green-400 flex items-center space-x-1">
            <span>+{formatINR(summary.totalExtraGain)}</span>
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <span className="text-[11px] text-green-700 dark:text-green-300 font-semibold block font-sans">
            Gained via optimal Right Price selling dates
          </span>
        </div>

        {/* Metric 3: Spoilage Saved */}
        <div className="rounded-3xl p-6 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-2">
          <span className="text-xs font-semibold text-onion dark:text-amber-400 uppercase tracking-wider font-sans">
            Produce Spoilage Prevented
          </span>
          <div className="font-display text-3xl font-black text-onion dark:text-amber-400">
            {summary.totalSpoilageSavedKg.toLocaleString('en-IN')} kg
          </div>
          <span className="text-[11px] text-forest-500 block font-sans">
            Saved from post-harvest rot & decay
          </span>
        </div>

        {/* Metric 4: Total Volume Advised */}
        <div className="rounded-3xl p-6 bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft space-y-2">
          <span className="text-xs font-semibold text-forest-600 dark:text-forest-400 uppercase tracking-wider font-sans">
            Total Stock Managed
          </span>
          <div className="font-display text-3xl font-black text-forest-900 dark:text-forest-100">
            {(summary.totalQuantityKg / 1000).toFixed(1)} MT
          </div>
          <span className="text-[11px] text-forest-500 block font-sans">
            {summary.totalQuantityKg.toLocaleString('en-IN')} kg total inventory
          </span>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-soft p-6 sm:p-8 space-y-6">
        {/* Table Header & Month Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest-100 dark:border-forest-800">
          <div>
            <h3 className="font-display text-xl font-bold text-forest-900 dark:text-forest-100">
              P&L Statement & Transaction History
            </h3>
            <p className="text-xs text-forest-600 dark:text-forest-400 font-sans">
              Historical settled transactions persisted in Neon PostgreSQL
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Month Filter Tabs */}
            <div className="flex rounded-xl bg-forest-100/70 dark:bg-forest-800/60 p-1 text-xs font-sans">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all font-sans ${
                    selectedMonth === m
                      ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 shadow-sm'
                      : 'text-forest-600 dark:text-forest-400 hover:text-forest-900'
                  }`}
                >
                  {m === 'all' ? 'All (3 Months)' : m}
                </button>
              ))}
            </div>

            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-xl border border-forest-200 dark:border-forest-700 text-xs font-bold text-forest-800 dark:text-forest-200 hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-forest-100 dark:border-forest-800 text-forest-500 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Date & Commodity</th>
                <th className="pb-3 font-bold">Stock Quantity</th>
                <th className="pb-3 font-bold">Decision</th>
                <th className="pb-3 font-bold">Target Date</th>
                <th className="pb-3 font-bold text-right">Realized Net</th>
                <th className="pb-3 font-bold text-right">Extra Margin Gain</th>
                <th className="pb-3 font-bold text-right">Spoilage Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50 dark:divide-forest-800/60 font-medium">
              {pnlRecords.map((tx) => (
                <tr key={tx.id} className="hover:bg-forest-50/50 dark:hover:bg-forest-800/30 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl">{tx.crop_emoji || tx.cropEmoji || '📦'}</span>
                      <div>
                        <div className="font-bold text-forest-900 dark:text-forest-100 font-sans">
                          {tx.crop_name || tx.cropName}
                        </div>
                        <div className="text-[10px] text-forest-500">
                          {tx.date_formatted || tx.dateFormatted}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 text-forest-800 dark:text-forest-200">
                    {(tx.quantity_kg || tx.quantityKg)?.toLocaleString('en-IN')} kg
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        tx.decision === 'HOLD'
                          ? 'bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-950 text-tomato dark:text-red-300'
                      }`}
                    >
                      {tx.decision}
                    </span>
                  </td>

                  <td className="py-3.5 text-forest-700 dark:text-forest-300">
                    {tx.target_date || tx.targetDate}
                  </td>

                  <td className="py-3.5 text-right font-display font-bold text-forest-900 dark:text-forest-100 text-sm">
                    {formatINR(tx.realized_net || tx.realizedNet)}
                  </td>

                  <td className="py-3.5 text-right font-bold text-forest-700 dark:text-green-400">
                    +{formatINR(tx.profit_gain || tx.profitGain)} (+{tx.gain_percent || tx.gainPercent}%)
                  </td>

                  <td className="py-3.5 text-right text-onion dark:text-amber-400 font-semibold">
                    {tx.spoilage_avoided_kg || tx.spoilageAvoidedKg} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
