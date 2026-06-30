/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { FiscalYear, CalendarType, FiscalYearFilters, PaginationState } from '../types';
import { FiscalYearService } from '../services/FiscalYearService';

interface FiscalYearStore {
  // Data State
  fiscalYears: FiscalYear[];
  loading: boolean;
  error: string | null;
  
  // Filters, Pagination, Search
  filters: FiscalYearFilters;
  pagination: PaginationState;
  
  // Calendar preferences
  selectedCalendarPreference: CalendarType;
  
  // Toast notifications
  notification: {
    type: 'success' | 'error';
    message: string;
  } | null;

  // Actions
  fetchFiscalYears: () => Promise<void>;
  addFiscalYear: (fy: Omit<FiscalYear, 'id'>) => Promise<boolean>;
  editFiscalYear: (id: string, fy: Partial<FiscalYear>) => Promise<boolean>;
  removeFiscalYear: (id: string) => Promise<boolean>;
  
  setCalendarPreference: (calendar: CalendarType) => void;
  setFilters: (filters: Partial<FiscalYearFilters>) => void;
  setPage: (page: number) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  clearNotification: () => void;
}

export const useFiscalYearStore = create<FiscalYearStore>((set, get) => ({
  fiscalYears: [],
  loading: false,
  error: null,
  
  filters: {
    search: '',
    status: 'ALL',
    calendarType: 'ALL',
  },
  
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
  },
  
  selectedCalendarPreference: 'ETHIOPIAN',
  notification: null,

  fetchFiscalYears: async () => {
    set({ loading: true, error: null });
    try {
      const data = await FiscalYearService.getFiscalYears();
      const items = Array.isArray(data) ? data : [];
      set({ 
        fiscalYears: items, 
        loading: false,
        pagination: {
          ...get().pagination,
          total: items.length
        }
      });
    } catch (err: any) {
      set({ 
        error: err.message || 'Failed to retrieve fiscal years.', 
        loading: false 
      });
      get().showNotification('error', 'Failed to load fiscal years.');
    }
  },

  addFiscalYear: async (fy) => {
    set({ loading: true, error: null });
    try {
      const created = await FiscalYearService.createFiscalYear(fy);
      const currentList = [created, ...get().fiscalYears];
      set({ 
        fiscalYears: currentList, 
        loading: false,
        pagination: {
          ...get().pagination,
          total: currentList.length
        }
      });
      get().showNotification('success', `Fiscal Year "${created.name}" created successfully.`);
      return true;
    } catch (err: any) {
      set({ loading: false });
      get().showNotification('error', err.message || 'Failed to create fiscal year.');
      return false;
    }
  },

  editFiscalYear: async (id, fy) => {
    set({ loading: true, error: null });
    try {
      const updated = await FiscalYearService.updateFiscalYear(id, fy);
      const updatedList = get().fiscalYears.map(item => item.id === id ? updated : item);
      set({ 
        fiscalYears: updatedList, 
        loading: false 
      });
      get().showNotification('success', `Fiscal Year "${updated.name}" updated successfully.`);
      return true;
    } catch (err: any) {
      set({ loading: false });
      get().showNotification('error', err.message || 'Failed to update fiscal year.');
      return false;
    }
  },

  removeFiscalYear: async (id) => {
    set({ loading: true, error: null });
    try {
      const target = get().fiscalYears.find(item => item.id === id);
      const name = target ? target.name : 'Fiscal Year';
      await FiscalYearService.deleteFiscalYear(id);
      const remainingList = get().fiscalYears.filter(item => item.id !== id);
      set({ 
        fiscalYears: remainingList, 
        loading: false,
        pagination: {
          ...get().pagination,
          total: remainingList.length
        }
      });
      get().showNotification('success', `Fiscal Year "${name}" deleted successfully.`);
      return true;
    } catch (err: any) {
      set({ loading: false });
      get().showNotification('error', err.message || 'Failed to delete fiscal year.');
      return false;
    }
  },

  setCalendarPreference: (calendar) => {
    set({ selectedCalendarPreference: calendar });
  },

  setFilters: (updatedFilters) => {
    set({ 
      filters: { ...get().filters, ...updatedFilters },
      pagination: { ...get().pagination, page: 1 } // reset to first page on filter change
    });
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, page } });
  },

  showNotification: (type, message) => {
    set({ notification: { type, message } });
    // Auto clear notification after 5 seconds
    setTimeout(() => {
      const current = get().notification;
      if (current && current.message === message) {
        set({ notification: null });
      }
    }, 5000);
  },

  clearNotification: () => {
    set({ notification: null });
  },
}));
