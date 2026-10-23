import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/ThemeContext';
import { TrendingUp, Users, ShieldCheck } from 'lucide-react';

export default function ImpactRoadmap() {
  const { t } = useApp();

  const metrics = [
    {
      val: t('impactStat1Val'),
      label: t('impactStat1Label'),
      icon: TrendingUp,
      color: 'text-forest-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800/80',
    },
    {
      val: t('impactStat2Val'),
      label: t('impactStat2Label'),
      icon: ShieldCheck,
      color: 'text-onion dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80',
    },
    {
      val: t('impactStat3Val'),
      label: t('impactStat3Label'),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/80',
    },
  ];

  return (
    <section id="impact" className="py-20 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Ground Impact Section */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-400">
            {t('navImpact')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 dark:text-forest-100 mt-2">
            {t('impactTitle')}
          </h2>
          <p className="text-sm sm:text-base text-forest-800/80 dark:text-forest-300/80 mt-3 font-normal">
            {t('impactSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className={`rounded-3xl p-7 border ${m.bg} shadow-soft flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-forest-900 flex items-center justify-center shadow-sm">
                    <Icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                </div>
                <div>
                  <div className={`font-display text-3xl sm:text-4xl font-extrabold ${m.color}`}>
                    {m.val}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-forest-900 dark:text-forest-100 mt-2">
                    {m.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
