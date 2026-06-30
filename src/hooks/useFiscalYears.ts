/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useCallback } from 'react';
import { useFiscalYearStore } from '../store/fiscalYearStore';
import { FiscalYear, CalendarType, FiscalYearFilters } from '../types';

/**
 * Custom hook to manage fetching and filtering fiscal years
 */
export function useFiscalYears() {
  const {
    fiscalYears,
    loading,
    error,
    filters,
    pagination,
    fetchFiscalYears,
    setFilters,
    setPage,
  } = useFiscalYearStore();

  useEffect(() => {
    fetchFiscalYears();
  }, [fetchFiscalYears]);

  // Apply searching and filtering client-side
  const filteredFiscalYears = (Array.isArray(fiscalYears) ? fiscalYears : []).filter((fy) => {
    const matchesSearch = fy.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (fy.description && fy.description.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesStatus = filters.status === 'ALL' || fy.status === filters.status;
    const matchesCalendar = filters.calendarType === 'ALL' || fy.calendarType === filters.calendarType;

    return matchesSearch && matchesStatus && matchesCalendar;
  });

  // Apply Pagination
  const totalItems = filteredFiscalYears.length;
  const totalPages = Math.ceil(totalItems / pagination.limit) || 1;
  const currentPage = Math.min(pagination.page, totalPages);
  
  const paginatedFiscalYears = filteredFiscalYears.slice(
    (currentPage - 1) * pagination.limit,
    currentPage * pagination.limit
  );

  const setFiltersCallback = useCallback((newFilters: Partial<FiscalYearFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const setPageCallback = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  return {
    fiscalYears: paginatedFiscalYears,
    allFiscalYears: fiscalYears,
    loading,
    error,
    filters,
    pagination: {
      currentPage,
      totalPages,
      limit: pagination.limit,
      total: totalItems,
    },
    setFilters: setFiltersCallback,
    setPage: setPageCallback,
    refresh: fetchFiscalYears,
  };
}

/**
 * Custom hook to handle Fiscal Year creation
 */
export function useCreateFiscalYear() {
  const { addFiscalYear, loading } = useFiscalYearStore();

  const createFY = useCallback(async (fy: Omit<FiscalYear, 'id'>) => {
    return await addFiscalYear(fy);
  }, [addFiscalYear]);

  return {
    createFiscalYear: createFY,
    isLoading: loading,
  };
}

/**
 * Custom hook to handle Fiscal Year updates
 */
export function useUpdateFiscalYear() {
  const { editFiscalYear, loading } = useFiscalYearStore();

  const updateFY = useCallback(async (id: string, fy: Partial<FiscalYear>) => {
    return await editFiscalYear(id, fy);
  }, [editFiscalYear]);

  return {
    updateFiscalYear: updateFY,
    isLoading: loading,
  };
}

/**
 * Custom hook to handle Fiscal Year deletion
 */
export function useDeleteFiscalYear() {
  const { removeFiscalYear, loading } = useFiscalYearStore();

  const deleteFY = useCallback(async (id: string) => {
    return await removeFiscalYear(id);
  }, [removeFiscalYear]);

  return {
    deleteFiscalYear: deleteFY,
    isLoading: loading,
  };
}

/**
 * Custom hook for calendar preferences
 */
export function useCalendarPreference() {
  const { selectedCalendarPreference, setCalendarPreference } = useFiscalYearStore();

  const setPreference = useCallback((calendar: CalendarType) => {
    setCalendarPreference(calendar);
  }, [setCalendarPreference]);

  return {
    selectedCalendarPreference,
    setCalendarPreference: setPreference,
  };
}
