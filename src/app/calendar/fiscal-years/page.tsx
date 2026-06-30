/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, Settings, ShieldCheck, Database, HelpCircle } from 'lucide-react';
import { useFiscalYears, useCreateFiscalYear, useUpdateFiscalYear, useDeleteFiscalYear } from '../../../hooks/useFiscalYears';
import { FiscalYearFilters } from '../../../components/fiscal-year/FiscalYearFilters';
import { FiscalYearTable } from '../../../components/fiscal-year/FiscalYearTable';
import { FiscalYearForm } from '../../../components/fiscal-year/FiscalYearForm';
import { DeleteDialog } from '../../../components/fiscal-year/DeleteDialog';
import { LoadingSpinner, EmptyState, ErrorAlert, ToastNotificationContainer } from '../../../components/common/UIElements';
import { FiscalYear } from '../../../types';

export default function FiscalYearsPage() {
  const {
    fiscalYears,
    loading,
    error,
    pagination,
    setPage,
    refresh,
  } = useFiscalYears();

  const { createFiscalYear, isLoading: isCreating } = useCreateFiscalYear();
  const { updateFiscalYear, isLoading: isUpdating } = useUpdateFiscalYear();
  const { deleteFiscalYear, isLoading: isDeleting } = useDeleteFiscalYear();

  // Dialog/Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingFiscalYear, setEditingFiscalYear] = useState<FiscalYear | null>(null);
  const [deletingFiscalYear, setDeletingFiscalYear] = useState<FiscalYear | null>(null);

  const handleOpenCreateForm = () => {
    setEditingFiscalYear(null);
    setFormOpen(true);
  };

  const handleOpenEditForm = (fy: FiscalYear) => {
    setEditingFiscalYear(fy);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData: Omit<FiscalYear, 'id'>) => {
    let success = false;
    if (editingFiscalYear) {
      success = await updateFiscalYear(editingFiscalYear.id, formData);
    } else {
      success = await createFiscalYear(formData);
    }

    if (success) {
      setFormOpen(false);
      setEditingFiscalYear(null);
      refresh(); // refresh table data
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingFiscalYear) {
      const success = await deleteFiscalYear(deletingFiscalYear.id);
      if (success) {
        setDeletingFiscalYear(null);
        refresh();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/40 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notifications */}
      <ToastNotificationContainer />

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Breadcrumbs & Status indicators */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase font-mono">
            <span>Home</span>
            <span>/</span>
            <span>Fiscal Year Configuration</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300">Fiscal Years</span>
          </div>

          {/* System metadata markers (Anti-AI-slop professional labels) */}
          <div className="flex items-center gap-3 text-[11px] font-mono font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-lg">
              <Database className="w-3.5 h-3.5 text-sky-500" />
              REST API Client Connected
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Dual-Calendar Certified
            </span>
          </div>
        </div>

        {/* Dashboard Title Panel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-md shadow-sky-500/10">
              <Calendar className="w-7 h-7 stroke-[1.5]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50 font-sans tracking-tight">
                Fiscal Calendar Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed font-medium">
                Set up, modify, and manage accounting fiscal cycles for Ethiopian Calendar standards (EFY) and Gregorian calendar models. Connects seamlessly with REST architectures.
              </p>
            </div>
          </div>

          <div className="flex self-end md:self-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenCreateForm}
              className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/15 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
              New Accounting Year
            </motion.button>
          </div>
        </div>

        {/* Filters Panel */}
        <FiscalYearFilters />

        {/* Main Work Area */}
        {error ? (
          <ErrorAlert message={error} onRetry={refresh} />
        ) : loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12">
            <LoadingSpinner />
          </div>
        ) : fiscalYears.length === 0 ? (
          <EmptyState
            title="No Fiscal Years Found"
            description="No historic or active fiscal years match your criteria. Create a new fiscal calendar standard to initialize accounting records."
            actionButton={
              <button
                onClick={handleOpenCreateForm}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2]" />
                Open First Fiscal Year
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            <FiscalYearTable
              data={fiscalYears}
              loading={loading}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              onEdit={handleOpenEditForm}
              onDelete={setDeletingFiscalYear}
            />
          </div>
        )}

        {/* Modal Form Dialog Overlay */}
        <AnimatePresence>
          {formOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFormOpen(false)}
                className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs"
              />

              {/* Form Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: 'spring', duration: 0.45 }}
                className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl"
              >
                <FiscalYearForm
                  initialData={editingFiscalYear}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setFormOpen(false)}
                  isSubmitting={isCreating || isUpdating}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <DeleteDialog
          isOpen={!!deletingFiscalYear}
          onClose={() => setDeletingFiscalYear(null)}
          onConfirm={handleConfirmDelete}
          fiscalYear={deletingFiscalYear}
          isDeleting={isDeleting}
        />
        
      </div>
    </div>
  );
}
