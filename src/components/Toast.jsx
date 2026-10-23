import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/ThemeContext';

export default function Toast() {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-20 right-6 z-50 max-w-md shadow-2xl rounded-2xl border border-forest-200 dark:border-forest-800 bg-white dark:bg-forest-900 px-4 py-3 text-forest-900 dark:text-forest-100 flex items-center space-x-3"
          role="alert"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-forest-600 dark:text-forest-400 flex-shrink-0" />
          )}
          {toast.type === 'warning' && (
            <AlertCircle className="w-5 h-5 text-onion flex-shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          )}

          <div className="flex-1 text-sm font-medium pr-2">{toast.message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
