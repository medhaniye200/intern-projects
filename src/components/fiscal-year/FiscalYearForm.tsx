/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Save, ArrowLeft, ArrowRight, Settings, Info, CalendarClock } from 'lucide-react';
import { CalendarType, FiscalYear, FiscalYearStatus } from '../../types';
import { CalendarSelector } from './CalendarSelector';
import { EthDatePicker, GregorianDatePicker } from '../calendar/DatePickers';
import { 
  getEthiopianFiscalYearSuggestions, 
  convertGregorianToEthiopian, 
  formatGregorianDisplay 
} from '../../utils/ethiopianDate';

// -------------------------------------------------------------
// ZOD VALIDATION SCHEMA
// -------------------------------------------------------------
const fiscalYearFormSchema = z.object({
  calendarType: z.enum(['ETHIOPIAN', 'GREGORIAN'], {
    message: 'Calendar selection is required.',
  }),
  name: z.string().min(3, 'Name must be at least 3 characters long.').max(50, 'Name must be less than 50 characters.'),
  startDate: z.string().nonempty('Start date is required.'),
  endDate: z.string().nonempty('End date is required.'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  description: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
  }
  return true;
}, {
  message: 'Fiscal End Date must be chronologically after the Start Date.',
  path: ['endDate'],
});

type FiscalYearFormValues = z.infer<typeof fiscalYearFormSchema>;

interface FiscalYearFormProps {
  initialData: FiscalYear | null;
  onSubmit: (data: Omit<FiscalYear, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FiscalYearForm: React.FC<FiscalYearFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditMode = !!initialData;
  
  // Step 1: Calendar Standard selection. Step 2: Fiscal Year Details
  const [step, setStep] = useState<1 | 2>(isEditMode ? 2 : 1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FiscalYearFormValues>({
    resolver: zodResolver(fiscalYearFormSchema),
    defaultValues: {
      calendarType: initialData?.calendarType || undefined,
      name: initialData?.name || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      status: initialData?.status || 'ACTIVE',
      description: initialData?.description || '',
    },
  });

  const selectedCalendar = watch('calendarType');
  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  // Automatically suggest standard dates when Ethiopian Calendar is selected (Create Mode only)
  useEffect(() => {
    if (selectedCalendar === 'ETHIOPIAN' && !isEditMode && !watchStartDate) {
      const suggestions = getEthiopianFiscalYearSuggestions();
      setValue('startDate', suggestions.start.gregISO);
      setValue('endDate', suggestions.end.gregISO);
      setValue('name', suggestions.suggestedName);
    } else if (selectedCalendar === 'GREGORIAN' && !isEditMode && !watchStartDate) {
      // Suggest standard Gregorian calendar boundaries (Jan 1 to Dec 31 of current year)
      const currentYear = new Date().getFullYear();
      setValue('startDate', `${currentYear}-01-01`);
      setValue('endDate', `${currentYear}-12-31`);
      setValue('name', `GFY ${currentYear}`);
    }
  }, [selectedCalendar, setValue, isEditMode, watchStartDate]);

  // Handle advancing from Step 1 to Step 2
  const handleNextStep = async () => {
    const isCalendarValid = await trigger('calendarType');
    if (isCalendarValid && selectedCalendar) {
      setStep(2);
    }
  };

  const handleFormSubmit = async (values: FiscalYearFormValues) => {
    // Generate Ethiopian displays on-the-fly for database-safety
    let startDateEth = undefined;
    let endDateEth = undefined;

    if (values.calendarType === 'ETHIOPIAN') {
      const startEth = convertGregorianToEthiopian(values.startDate);
      const endEth = convertGregorianToEthiopian(values.endDate);
      startDateEth = startEth.formatted;
      endDateEth = endEth.formatted;
    }

    await onSubmit({
      name: values.name,
      calendarType: values.calendarType,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
      description: values.description,
      startDateEth,
      endDateEth,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl max-w-2xl mx-auto">
      {/* Form header */}
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-50 dark:border-slate-800">
        <div className="p-2.5 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 rounded-xl">
          <CalendarClock className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">
            {isEditMode ? 'Modify Fiscal Accounting Year' : 'Open New Fiscal Accounting Year'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create or edit fiscal year details, boundaries, and calendar configurations.
          </p>
        </div>
      </div>

      {/* Steps Indicator (Only for Create Mode) */}
      {!isEditMode && (
        <div className="flex items-center justify-center gap-2 mb-8 max-w-sm mx-auto">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 1
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/10'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-bold ${step === 1 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
              Standard Selection
            </span>
          </div>
          <span className="w-10 h-0.5 bg-slate-100 dark:bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 2
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/10'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-bold ${step === 2 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
              Fiscal Year Configuration
            </span>
          </div>
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: CALENDAR SELECTION */}
          {step === 1 && !isEditMode && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <Controller
                name="calendarType"
                control={control}
                render={({ field }) => (
                  <CalendarSelector
                    selected={field.value}
                    onSelect={field.onChange}
                    error={errors.calendarType?.message}
                  />
                )}
              />

              {/* Step 1 Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-sm shadow-sky-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Configure Fiscal Year
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: FORM SPECIFICATIONS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Informational suggestion banner when Ethiopian Calendar selected */}
              {selectedCalendar === 'ETHIOPIAN' && (
                <div className="p-4 bg-emerald-50/55 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex gap-3 items-start">
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-lg">
                    <Info className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      Ethiopian Accounting Business Rules Suggested
                    </h5>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 leading-relaxed mt-0.5">
                      Standard Ethiopian fiscal periods default automatically from <strong>Hamle 1</strong> to <strong>Sene 30</strong>. Pagume (13th Month) and Leap years are fully managed.
                    </p>
                  </div>
                </div>
              )}

              {/* Fiscal Year Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Fiscal Year Label / Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. EFY 2018/2019"
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 border border-transparent focus:border-slate-200 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none transition-all font-medium shadow-inner"
                />
                {errors.name && (
                  <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Date Pickers Group (Based on Selected Calendar Type) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    selectedCalendar === 'ETHIOPIAN' ? (
                      <EthDatePicker
                        label="Fiscal Start Date"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.startDate?.message}
                      />
                    ) : (
                      <GregorianDatePicker
                        label="Fiscal Start Date"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.startDate?.message}
                      />
                    )
                  )}
                />

                {/* End Date */}
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    selectedCalendar === 'ETHIOPIAN' ? (
                      <EthDatePicker
                        label="Fiscal End Date"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.endDate?.message}
                      />
                    ) : (
                      <GregorianDatePicker
                        label="Fiscal End Date"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.endDate?.message}
                      />
                    )
                  )}
                />
              </div>

              {/* Status and Calendar Preference locked display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Lifecycle Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('status')}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 border border-transparent focus:border-slate-200 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-all font-medium shadow-inner"
                  >
                    <option value="ACTIVE">Active (Accept Transactions)</option>
                    <option value="INACTIVE">Inactive (Locked / Auditing)</option>
                  </select>
                </div>

                {/* Calendar Standard display (Locked) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Selected Calendar standard (Immutable)
                  </label>
                  <div className="w-full bg-slate-100/50 dark:bg-slate-950/45 border border-slate-100 dark:border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 font-semibold select-none flex items-center gap-1.5">
                    <Settings className="w-4 h-4 animate-spin-slow text-slate-400" />
                    {selectedCalendar === 'ETHIOPIAN' ? 'Ethiopian Calendar Standards' : 'Gregorian Standard (IFRS)'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Description / Auditing Notes
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Enter optional organizational details, reference keys, or auditor constraints..."
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 border border-transparent focus:border-slate-200 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none transition-all font-medium shadow-inner resize-none leading-relaxed"
                />
              </div>

              {/* STEP 2 ACTIONS */}
              <div className="flex justify-between items-center pt-5 border-t border-slate-50 dark:border-slate-800">
                {/* Back Button (only in Create mode) */}
                {!isEditMode ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Standard Selector
                  </button>
                ) : (
                  <div /> // placeholder for layout
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-sm shadow-sky-500/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isEditMode ? 'Apply Fiscal Year Modifications' : 'Create Fiscal Year'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
