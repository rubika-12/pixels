import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/ThemeContext';
import { ClipboardList, Cpu, BadgeCheck, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useApp();

  const steps = [
    {
      num: t('step1Num'),
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: ClipboardList,
      accent: 'border-forest-300 dark:border-forest-700 text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-900',
    },
    {
      num: t('step2Num'),
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: Cpu,
      accent: 'border-onion/40 text-onion dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      num: t('step3Num'),
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: BadgeCheck,
      accent: 'border-forest-600/40 text-forest-600 dark:text-green-400 bg-green-50 dark:bg-green-950/60',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-400">
            {t('navHowItWorks')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 dark:text-forest-100 mt-2">
            {t('howTitle')}
          </h2>
          <p className="text-sm sm:text-base text-forest-800/80 dark:text-forest-300/80 mt-3 font-normal">
            {t('howSubtitle')}
          </p>
        </div>

        {/* 3 Steps Pipeline with Connecting Line */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-forest-200 via-forest-400 to-forest-600 dark:from-forest-800 dark:via-forest-600 dark:to-green-500 -translate-y-8 -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="rounded-3xl p-8 bg-white dark:bg-forest-900/90 border border-forest-100 dark:border-forest-800 shadow-soft relative flex flex-col items-start hover:shadow-soft-lg transition-all group"
                >
                  {/* Top Badge Row */}
                  <div className="w-full flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${step.accent}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-display text-3xl font-extrabold text-forest-300 dark:text-forest-700 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-forest-900 dark:text-forest-100 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-forest-800/80 dark:text-forest-300/80 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
