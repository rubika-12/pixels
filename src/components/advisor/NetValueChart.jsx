import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useApp } from '../../context/ThemeContext';
import { formatINR, formatCompactINR } from '../../lib/formatters';
import { Coins } from 'lucide-react';

export default function NetValueChart({ dayByDay = [], netSell = 18000, bestDay = 5 }) {
  const { theme, t } = useApp();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#263E2D' : '#E8F1EA';
  const axisColor = isDark ? '#8BAE93' : '#557A5D';

  const todayDateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  // Include Day 0 (Sell Today) in the sequence with date-aware labels
  const fullSequence = [
    {
      dateLabel: `${todayDateStr} (Today)`,
      fullDate: 'Today',
      netRevenue: netSell,
      spoilagePercent: 0,
      storageCost: 0,
      isBestDay: bestDay === 0,
      isToday: true,
    },
    ...dayByDay.map(d => ({
      dateLabel: d.isBestDay ? `${d.dateFormatted} (Peak)` : d.dateFormatted,
      fullDate: d.fullDateFormatted || d.dateFormatted,
      netRevenue: d.netRevenue,
      spoilagePercent: d.spoilagePercent,
      storageCost: d.storageCost,
      isBestDay: d.isBestDay,
      isToday: false,
    })),
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl p-3 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 shadow-xl text-xs space-y-1">
          <div className="font-bold text-forest-900 dark:text-forest-100">
            {data.fullDate || data.dateLabel}
          </div>
          <div className="text-sm font-extrabold text-forest-700 dark:text-green-400">
            {formatINR(data.netRevenue)} Net In Pocket
          </div>
          <div className="text-[11px] text-forest-600/80 dark:text-forest-400/80 pt-1 border-t border-forest-100 dark:border-forest-800">
            • Projected Rot Loss: {data.spoilagePercent}%
          </div>
          <div className="text-[11px] text-tomato dark:text-red-400">
            • Storage Tariff Incurred: {formatINR(data.storageCost)}
          </div>
          {data.isBestDay && (
            <div className="text-[10px] font-bold text-forest-600 dark:text-green-400 pt-0.5">
              🎯 Optimal Right Price Selling Date
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-forest-900/90 border border-forest-100 dark:border-forest-800 shadow-sm">
      
      {/* Header */}
      <div className="pb-3 border-b border-forest-100 dark:border-forest-800">
        <div className="flex items-center space-x-2">
          <Coins className="w-4 h-4 text-forest-600 dark:text-forest-400" />
          <h4 className="font-bold text-sm text-forest-900 dark:text-forest-100">
            {t('netValueChartTitle')}
          </h4>
        </div>
        <p className="text-xs text-forest-600/80 dark:text-forest-400/80 mt-0.5">
          {t('netValueChartSubtitle')}
        </p>
      </div>

      {/* Bar Chart Canvas */}
      <div className="h-56 sm:h-60 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fullSequence} margin={{ top: 10, right: 10, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            
            <XAxis
              dataKey="dateLabel"
              stroke={axisColor}
              tick={{ fontSize: 10, fill: axisColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            
            <YAxis
              stroke={axisColor}
              tick={{ fontSize: 10, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactINR(v)}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="netRevenue" radius={[6, 6, 0, 0]}>
              {fullSequence.map((entry, index) => {
                let fill = '#97BF9E';
                if (entry.isBestDay) {
                  fill = '#2E7D45'; // optimal peak date
                } else if (entry.isToday) {
                  fill = '#689F72'; // today
                } else if (entry.netRevenue < netSell) {
                  fill = '#E47B6A'; // lower than today's realization
                }
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-forest-700/80 dark:text-forest-300/80 pt-2 border-t border-forest-100 dark:border-forest-800">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-forest-600" />
          <span>Optimal Target Date (Peak Net)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-[#E47B6A]" />
          <span>Value Drop (Rot & Fees)</span>
        </div>
      </div>

    </div>
  );
}
