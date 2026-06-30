/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Globe } from 'lucide-react';
import { CalendarType } from '../../types';

interface CalendarSelectorProps {
  selected: CalendarType | null;
  onSelect: (calendar: CalendarType) => void;
  error?: string;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  selected,
  onSelect,
  error,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Accounting Standard Calendar Preference
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Select the core calendar standard. This determines date formats, period configurations, and fiscal year reporting periods.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ethiopian Calendar Option Card */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onSelect('ETHIOPIAN')}
          className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
            selected === 'ETHIOPIAN'
              ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10'
              : 'border-slate-100 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
          }`}
        >
          <div
            className={`p-3 rounded-xl transition-colors ${
              selected === 'ETHIOPIAN'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
              Ethiopian Calendar
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-normal">
              13 Months (Pagume included)
              <br />
              EFY Accounting Standards
            </span>
          </div>
          {selected === 'ETHIOPIAN' && (
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-0.5 rounded-full mt-1">
              Active Selection
            </span>
          )}
        </motion.button>

        {/* Gregorian Calendar Option Card */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onSelect('GREGORIAN')}
          className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
            selected === 'GREGORIAN'
              ? 'border-sky-500 bg-sky-50/20 dark:bg-sky-950/10'
              : 'border-slate-100 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
          }`}
        >
          <div
            className={`p-3 rounded-xl transition-colors ${
              selected === 'GREGORIAN'
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Globe className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
              Gregorian Calendar
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-normal">
              Standard 12 Months
              <br />
              International Standard (IFRS)
            </span>
          </div>
          {selected === 'GREGORIAN' && (
            <span className="text-[11px] font-bold text-sky-600 bg-sky-100 dark:bg-sky-950/50 dark:text-sky-400 px-2.5 py-0.5 rounded-full mt-1">
              Active Selection
            </span>
          )}
        </motion.button>
      </div>

      {error && (
        <span className="text-xs font-semibold text-red-600 dark:text-red-400 text-center mt-2">
          {error}
        </span>
      )}
    </div>
  );
};
