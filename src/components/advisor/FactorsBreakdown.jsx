import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/ThemeContext';
import { ChevronDown, ChevronUp, Layers, Warehouse, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function FactorsBreakdown({ factors }) {
  const { lang, t } = useApp();
  const [isOpen, setIsOpen] = useState(true);

  if (!factors) return null;

  const factorItems = [
    {
      id: 'storage',
      icon: Warehouse,
      title: t('factorStorage'),
      score: factors.storageEfficiency.score,
      label: lang === 'ta' && factors.storageEfficiency.tamilLabel ? factors.storageEfficiency.tamilLabel : factors.storageEfficiency.label,
      impact: factors.storageEfficiency.impact,
      barColor: 'bg-forest-600',
    },
    {
      id: 'age',
      icon: Clock,
      title: t('factorAge'),
      score: factors.produceFreshness.score,
      label: lang === 'ta' && factors.produceFreshness.tamilLabel ? factors.produceFreshness.tamilLabel : factors.produceFreshness.label,
      impact: factors.produceFreshness.impact,
      barColor: factors.produceFreshness.score > 50 ? 'bg-forest-600' : 'bg-tomato',
    },
    {
      id: 'momentum',
      icon: TrendingUp,
      title: t('factorMomentum'),
      score: factors.priceMomentum.score,
      label: lang === 'ta' && factors.priceMomentum.tamilLabel ? factors.priceMomentum.tamilLabel : factors.priceMomentum.label,
      impact: factors.priceMomentum.impact,
      barColor: factors.priceMomentum.score > 50 ? 'bg-forest-600' : 'bg-onion',
    },
    {
      id: 'spoilage',
      icon: AlertTriangle,
      title: t('factorSpoilage'),
      score: factors.spoilageControl.score,
      label: lang === 'ta' && factors.spoilageControl.tamilLabel ? factors.spoilageControl.tamilLabel : factors.spoilageControl.label,
      impact: factors.spoilageControl.impact,
      barColor: factors.spoilageControl.score > 60 ? 'bg-forest-600' : 'bg-tomato',
    },
  ];

  return (
    <div className="rounded-2xl border border-forest-100 dark:border-forest-800 bg-white dark:bg-forest-900/90 shadow-sm overflow-hidden">
      
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-forest-50/50 dark:hover:bg-forest-800/40 transition-colors focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-forest-900 dark:text-forest-100">
              {t('factorsTitle')}
            </h4>
            <p className="text-xs text-forest-600/80 dark:text-forest-400/80">
              {t('factorsSubtitle')}
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg text-forest-600 dark:text-forest-400 hover:bg-forest-100 dark:hover:bg-forest-800">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-forest-100 dark:border-forest-800 p-5 space-y-4"
          >
            {factorItems.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-semibold text-forest-900 dark:text-forest-100">
                      <Icon className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
                      <span>{item.title}</span>
                    </div>
                    <span className="font-bold text-forest-700 dark:text-forest-300">
                      {item.label}
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-2 rounded-full bg-forest-100 dark:bg-forest-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${item.barColor}`}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-forest-500">
                    <span>Impact: {item.impact}</span>
                    <span>Index: {item.score}/100</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
