import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';
import { useApp } from '../../context/ThemeContext';
import { TrendingUp, Calendar } from 'lucide-react';

export default function PriceTrendChart({ chartData = [], bestDay = 5, isHold = true }) {
  const { theme, lang, t } = useApp();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#263E2D' : '#E8F1EA';
  const axisColor = isDark ? '#8BAE93' : '#557A5D';

  // Find the data point for the best day
  const bestPoint = chartData.find(d => d.isBestSell);

  // Custom clean tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const displayLabel = lang === 'ta' && data.tamilLabel ? data.tamilLabel : data.label;
      const price = data.actualPrice !== null ? data.actualPrice : data.projectedPrice;
      const isProjected = data.actualPrice === null;

      return (
        <div className="rounded-xl p-3 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 shadow-xl text-xs space-y-1">
          <div className="font-bold text-forest-900 dark:text-forest-100 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-forest-600" />
            <span>{displayLabel}</span>
          </div>
          <div className="text-sm font-extrabold text-forest-700 dark:text-green-400">
            ₹{price?.toFixed(2)} / kg
          </div>
          <div className="text-[10px] text-forest-500">
            {data.isToday
              ? "Today's Mandi Base"
              : isProjected
              ? 'Damped Momentum Projection'
              : 'Verified Mandi Rate'}
          </div>
          {data.isBestSell && (
            <div className="mt-1 pt-1 border-t border-forest-200 dark:border-forest-800 text-[10px] font-bold text-forest-600 dark:text-green-400">
              ⭐ Peak Recommended Sell Day
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-forest-900/90 border border-forest-100 dark:border-forest-800 shadow-sm">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-forest-100 dark:border-forest-800 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-forest-600 dark:text-forest-400" />
            <h4 className="font-bold text-sm text-forest-900 dark:text-forest-100">
              {t('priceChartTitle')}
            </h4>
          </div>
          <p className="text-xs text-forest-600/80 dark:text-forest-400/80 mt-0.5">
            {t('priceChartSubtitle')}
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-forest-600 rounded-full" />
            <span className="text-forest-700 dark:text-forest-300 text-[11px]">
              {t('legendHistorical')}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-onion" />
            <span className="text-forest-700 dark:text-forest-300 text-[11px]">
              {t('legendProjected')}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-60 sm:h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D45" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2E7D45" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            
            <XAxis
              dataKey="label"
              stroke={axisColor}
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            
            <YAxis
              stroke={axisColor}
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `₹${v}`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Historical Area */}
            <Area
              type="monotone"
              dataKey="actualPrice"
              stroke="#2E7D45"
              strokeWidth={2.5}
              fill="url(#historicalGrad)"
              connectNulls={false}
              dot={{ r: 3.5, fill: '#2E7D45', strokeWidth: 1.5, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#1F4D2B' }}
            />

            {/* Projected Line (Dashed) */}
            <Line
              type="monotone"
              dataKey="projectedPrice"
              stroke="#F2A93B"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              connectNulls={true}
              dot={{ r: 3.5, fill: '#F2A93B', strokeWidth: 1.5, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#D98A1E' }}
            />

            {/* Highlight Reference Dot on Best Sell Day */}
            {isHold && bestPoint && (
              <ReferenceDot
                x={bestPoint.label}
                y={bestPoint.projectedPrice}
                r={7}
                fill="#2E7D45"
                stroke="#ffffff"
                strokeWidth={2.5}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {isHold && bestPoint && (
        <div className="mt-3 text-center text-xs font-semibold text-forest-700 dark:text-green-400 bg-forest-50 dark:bg-forest-950/60 py-2 rounded-xl border border-forest-200/60 dark:border-forest-800">
          🎯 Projected Peak Rate: ₹{bestPoint.projectedPrice?.toFixed(2)}/kg on {bestPoint.label}
        </div>
      )}

    </div>
  );
}
