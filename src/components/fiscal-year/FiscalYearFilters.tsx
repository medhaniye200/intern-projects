/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Filter, Calendar, Info } from 'lucide-react';
import { useFiscalYearStore } from '../../store/fiscalYearStore';
import { CalendarType, FiscalYearStatus } from '../../types';

export const FiscalYearFilters: React.FC = () => {
  const { filters, setFilters } = useFiscalYearStore();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm mb-6">
      {/* Panel header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-50 dark:border-slate-800/50">
        <Filter className="w-4 h-4 text-slate-500" />
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Query Filter & Search Engine
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-6 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Search Fiscal Year name / description
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="e.g. EFY 2018/2019..."
              className="w-full bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950/20 dark:hover:bg-slate-950/45 border-0 focus:ring-2 focus:ring-sky-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Lifecycle Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as FiscalYearStatus | 'ALL' })}
            className="w-full bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950/20 dark:hover:bg-slate-950/45 border-0 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-all font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Calendar Standard Filter */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Calendar Standard
          </label>
          <select
            value={filters.calendarType}
            onChange={(e) => setFilters({ calendarType: e.target.value as CalendarType | 'ALL' })}
            className="w-full bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950/20 dark:hover:bg-slate-950/45 border-0 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-all font-medium"
          >
            <option value="ALL">All Standards</option>
            <option value="ETHIOPIAN">Ethiopian Calendar</option>
            <option value="GREGORIAN">Gregorian Calendar</option>
          </select>
        </div>
      </div>
    </div>
  );
};
