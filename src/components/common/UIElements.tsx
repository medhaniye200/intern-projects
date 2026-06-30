/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, XCircle, Info, Loader2, RefreshCw } from 'lucide-react';
import { useFiscalYearStore } from '../../store/fiscalYearStore';

// -------------------------------------------------------------
// STATUS BADGE COMPONENT
// -------------------------------------------------------------
interface StatusBadgeProps {
  status: 'ACTIVE' | 'INACTIVE';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isActive = status === 'ACTIVE';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition-colors ${
        isActive
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
          : 'bg-slate-50/70 border-slate-200 text-slate-600 dark:bg-slate-900/20 dark:border-slate-800/30 dark:text-slate-400'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
      />
      {status}
    </span>
  );
};

// -------------------------------------------------------------
// LOADING SPINNER COMPONENT
// -------------------------------------------------------------
interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="text-slate-600 dark:text-slate-400 mb-4"
      >
        <Loader2 className="w-10 h-10 stroke-[1.5]" />
      </motion.div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
};

// -------------------------------------------------------------
// EMPTY STATE COMPONENT
// -------------------------------------------------------------
interface EmptyStateProps {
  title?: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no active or historic fiscal year periods matching the parameters.',
  actionButton,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-950/10 text-center max-w-xl mx-auto my-6">
      <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 mb-5">
        <Info className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md leading-relaxed">{description}</p>
      {actionButton}
    </div>
  );
};

// -------------------------------------------------------------
// ERROR ALERT COMPONENT
// -------------------------------------------------------------
interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'System Synchronization Error',
  message,
  onRetry,
}) => {
  return (
    <div className="p-5 border border-red-200 dark:border-red-950/50 rounded-2xl bg-red-50/60 dark:bg-red-950/10 flex items-start gap-4 max-w-2xl mx-auto my-4 shadow-sm">
      <div className="p-2 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
        <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">{title}</h4>
        <p className="text-xs text-red-700 dark:text-red-400/90 leading-relaxed mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-800 dark:text-red-400 hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// TOAST NOTIFICATION CONTAINER
// -------------------------------------------------------------
export const ToastNotificationContainer: React.FC = () => {
  const { notification, clearNotification } = useFiscalYearStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 bg-white dark:bg-slate-900 ${
              notification.type === 'success'
                ? 'border-emerald-200 dark:border-emerald-950/40 bg-emerald-50/30'
                : 'border-red-200 dark:border-red-950/40 bg-red-50/30'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg ${
                notification.type === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 stroke-[2]" />
              ) : (
                <XCircle className="w-5 h-5 stroke-[2]" />
              )}
            </div>
            
            <div className="flex-1">
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {notification.type === 'success' ? 'Operation Success' : 'System Alert'}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>

            <button
              onClick={clearNotification}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
              <span className="sr-only">Dismiss</span>
              <XCircle className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
