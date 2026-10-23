import React from 'react';
import { Database, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function NeonSyncCard({
  lastSavedId,
  isSaving,
  onSaveToDatabase,
  onNavigateToDashboard,
}) {
  return (
    <div className="p-5 rounded-3xl bg-forest-50/80 dark:bg-forest-950/60 border border-forest-200 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-forest-700 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
          <Database className="w-5 h-5 text-green-300" />
        </div>
        <div>
          <div className="text-xs font-bold text-forest-900 dark:text-forest-100 flex items-center space-x-2">
            <span>Neon PostgreSQL Cloud Sync</span>
            {lastSavedId && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-950 text-forest-700 dark:text-green-300 font-extrabold">
                Lot #{lastSavedId} Synced
              </span>
            )}
          </div>
          <div className="text-xs text-forest-600 dark:text-forest-400 mt-0.5">
            {lastSavedId
              ? 'This stock assessment is recorded in your live Neon ledger.'
              : 'Save this stock lot into your Neon database to track profit/loss in your P&L Dashboard.'}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 self-start sm:self-auto shrink-0">
        {onSaveToDatabase && (
          <button
            type="button"
            onClick={onSaveToDatabase}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors shadow-sm disabled:opacity-60 flex items-center space-x-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSavedId ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-green-300" />
                <span>Update in DB</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-green-300" />
                <span>Save to Neon DB</span>
              </>
            )}
          </button>
        )}

        {onNavigateToDashboard && (
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-forest-800 dark:text-forest-200 bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors flex items-center space-x-1"
          >
            <span>View in Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
