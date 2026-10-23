import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

export default function ShelfLifeGauge({ daysRemaining = 5, totalDays = 12, status = 'healthy' }) {
  const { t } = useApp();

  // Clamp fraction between 0 and 1
  const safeTotal = Math.max(1, totalDays);
  const ratio = Math.max(0, Math.min(1, daysRemaining / safeTotal));
  
  // Circumference for SVG circle radius 42
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - ratio);

  // Status colors
  let strokeColor = '#2E7D45'; // green
  let statusBg = 'bg-green-100 dark:bg-green-950/80 text-forest-700 dark:text-green-300 border-green-300 dark:border-green-800';
  let statusText = 'Optimal Shelf Buffer';
  let Icon = ShieldCheck;

  if (status === 'critical' || daysRemaining <= 2) {
    strokeColor = '#D8432B'; // tomato red
    statusBg = 'bg-red-100 dark:bg-red-950/80 text-tomato dark:text-red-300 border-red-300 dark:border-red-800';
    statusText = 'Critical Spoilage Phase';
    Icon = Flame;
  } else if (status === 'warning' || daysRemaining <= 5) {
    strokeColor = '#F2A93B'; // onion amber
    statusBg = 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    statusText = 'Moderate Buffer';
    Icon = AlertTriangle;
  }

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-forest-900/90 border border-forest-100 dark:border-forest-800 shadow-sm flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
      
      {/* SVG Radial Arc */}
      <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E1ECE3"
            strokeWidth="8"
            fill="transparent"
            className="dark:stroke-forest-800"
          />
          {/* Animated Progress Arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-2xl font-black text-forest-900 dark:text-forest-100 leading-none">
            {daysRemaining}
          </span>
          <span className="text-[10px] uppercase font-bold text-forest-600 dark:text-forest-400 mt-0.5">
            Days
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 text-center sm:text-left space-y-1.5">
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBg}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{statusText}</span>
          </span>
        </div>

        <h4 className="font-bold text-base text-forest-900 dark:text-forest-100">
          {t('shelfLifeTitle')}
        </h4>

        <p className="text-xs text-forest-700/80 dark:text-forest-300/80 leading-relaxed font-normal">
          {daysRemaining > 0
            ? `${daysRemaining} ${t('shelfLifeDaysLeft')} ${t('shelfLifeCondition')}.`
            : 'Zero shelf life remaining. Produce must be liquidated today to salvage residual value.'}
        </p>

        {daysRemaining <= 3 && (
          <p className="text-[11px] font-semibold text-tomato dark:text-red-400">
            ⚠️ {t('shelfLifeWarning')}
          </p>
        )}
      </div>

    </div>
  );
}
