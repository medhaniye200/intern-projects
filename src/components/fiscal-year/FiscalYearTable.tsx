/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2, Calendar, Globe, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { FiscalYear } from '../../types';
import { StatusBadge } from '../common/UIElements';
import { formatGregorianDisplay } from '../../utils/ethiopianDate';

interface FiscalYearTableProps {
  data: FiscalYear[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (fy: FiscalYear) => void;
  onDelete: (fy: FiscalYear) => void;
}

export const FiscalYearTable: React.FC<FiscalYearTableProps> = ({
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  // Simple local state to track column sorting (by Name or Start Date)
  const [sortField, setSortField] = useState<'name' | 'startDate'>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'startDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Table container for desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/60 text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Fiscal Year Name
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="px-6 py-4">Calendar Standard</th>
              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => handleSort('startDate')}
                  className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Accounting Boundaries
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="px-6 py-4">Lifecycle Status</th>
              <th className="px-6 py-4">Description / Audit Notes</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-sm text-slate-700 dark:text-slate-300">
            {sortedData.map((fy) => (
              <tr
                key={fy.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
              >
                {/* Name */}
                <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-slate-100">
                  {fy.name}
                </td>

                {/* Calendar Standard Badge */}
                <td className="px-6 py-4.5">
                  {fy.calendarType === 'ETHIOPIAN' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/10">
                      <Calendar className="w-3.5 h-3.5" />
                      Ethiopian
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400 border border-sky-100 dark:border-sky-900/10">
                      <Globe className="w-3.5 h-3.5" />
                      Gregorian
                    </span>
                  )}
                </td>

                {/* Date Boundaries */}
                <td className="px-6 py-4.5 font-medium text-xs leading-normal">
                  <div className="flex flex-col gap-0.5">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-bold mr-1">Start:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatGregorianDisplay(fy.startDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-bold mr-1">End:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatGregorianDisplay(fy.endDate)}
                      </span>
                    </div>
                    {fy.calendarType === 'ETHIOPIAN' && fy.startDateEth && fy.endDateEth && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400/90 font-bold font-mono mt-0.5">
                        {fy.startDateEth} ➔ {fy.endDateEth}
                      </span>
                    )}
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4.5">
                  <StatusBadge status={fy.status} />
                </td>

                {/* Description */}
                <td className="px-6 py-4.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate leading-relaxed">
                  {fy.description || <span className="italic text-slate-300 dark:text-slate-600">No notes entered</span>}
                </td>

                {/* Actions row */}
                <td className="px-6 py-4.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(fy)}
                      className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-colors"
                      title="Edit Fiscal Year"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(fy)}
                      className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors"
                      title="Delete Fiscal Year"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid container for mobile/tablet responsive layouts */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/40">
        {sortedData.map((fy) => (
          <div key={fy.id} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{fy.name}</h4>
                {fy.calendarType === 'ETHIOPIAN' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 mt-1">
                    Ethiopian Standards
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400 mt-1">
                    Gregorian Standard
                  </span>
                )}
              </div>
              <StatusBadge status={fy.status} />
            </div>

            {/* Boundaries detail */}
            <div className="bg-slate-50/50 dark:bg-slate-950/10 rounded-xl p-3 text-xs leading-normal flex flex-col gap-1">
              <div>
                <span className="text-slate-400 font-bold mr-1">Start Date:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {formatGregorianDisplay(fy.startDate)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold mr-1">End Date:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {formatGregorianDisplay(fy.endDate)}
                </span>
              </div>
              {fy.calendarType === 'ETHIOPIAN' && fy.startDateEth && fy.endDateEth && (
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  {fy.startDateEth} ➔ {fy.endDateEth}
                </div>
              )}
            </div>

            {fy.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {fy.description}
              </p>
            )}

            {/* Mobile Actions row */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/40">
              <button
                onClick={() => onEdit(fy)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => onDelete(fy)}
                className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-950/10 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
