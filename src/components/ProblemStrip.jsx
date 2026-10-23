import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/ThemeContext';
import { AlertOctagon, TrendingDown, ArrowRight, XCircle, Flame } from 'lucide-react';

export default function ProblemStrip() {
  const { t } = useApp();

  return (
    <section className="py-16 bg-harvest-pale/60 dark:bg-forest-950/60 border-y border-forest-100 dark:border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-tomato dark:text-red-400">
            {t('problemTitle')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 dark:text-forest-100 mt-2">
            Why Guessing Fails Every Season
          </h2>
          <p className="text-sm sm:text-base text-forest-800/80 dark:text-forest-300/80 mt-3 font-normal">
            {t('problemSubtitle')}
          </p>
        </div>

        {/* Dual Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: Wait Too Long */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl p-7 bg-white dark:bg-forest-900 border border-tomato/30 dark:border-red-900/40 shadow-soft relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-tomato-50 dark:bg-red-950/70 border border-tomato/30 flex items-center justify-center text-tomato dark:text-red-400 mb-5">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/80 text-tomato dark:text-red-300 mb-3">
              Pitfall #1: Excessive Holding
            </div>

            <h3 className="font-display text-2xl font-bold text-forest-900 dark:text-forest-100 mb-2">
              {t('problemWaitTitle')}
            </h3>

            <p className="text-sm text-forest-800/80 dark:text-forest-300/80 leading-relaxed mb-6 font-normal">
              {t('problemWaitDesc')}
            </p>

            <div className="pt-4 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between text-xs font-semibold text-tomato dark:text-red-400">
              <span className="flex items-center space-x-1.5">
                <XCircle className="w-4 h-4" />
                <span>{t('problemWaitLoss')}</span>
              </span>
              <span className="text-forest-500 text-[11px]">Unsalvageable</span>
            </div>
          </motion.div>

          {/* Card 2: Sell Too Early */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl p-7 bg-white dark:bg-forest-900 border border-onion/30 dark:border-amber-900/40 shadow-soft relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-onion/30 flex items-center justify-center text-onion dark:text-amber-400 mb-5">
              <TrendingDown className="w-6 h-6" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 mb-3">
              Pitfall #2: Panic Distress Sale
            </div>

            <h3 className="font-display text-2xl font-bold text-forest-900 dark:text-forest-100 mb-2">
              {t('problemSellTitle')}
            </h3>

            <p className="text-sm text-forest-800/80 dark:text-forest-300/80 leading-relaxed mb-6 font-normal">
              {t('problemSellDesc')}
            </p>

            <div className="pt-4 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between text-xs font-semibold text-onion dark:text-amber-400">
              <span className="flex items-center space-x-1.5">
                <AlertOctagon className="w-4 h-4" />
                <span>{t('problemSellLoss')}</span>
              </span>
              <span className="text-forest-500 text-[11px]">Middlemen margin</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
