/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';
import { FiscalYear } from '../types';

export class FiscalYearService {
  private static STORAGE_KEY = 'ethio_erp_fiscal_years';

  /**
   * Helper to retrieve local storage fiscal years (acts as database fallback for UI demo/preview).
   */
  private static getLocalFiscalYears(): FiscalYear[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      // Seed high-quality, professional, realistic enterprise data
      const defaultFYs: FiscalYear[] = [
        {
          id: 'fy-2018',
          name: 'EFY 2018/2019',
          calendarType: 'ETHIOPIAN',
          startDate: '2025-07-08', // Hamle 1, 2017
          endDate: '2026-07-07',   // Sene 30, 2018
          status: 'ACTIVE',
          description: 'Standard Ethiopian Fiscal Year for current active accounts and operations.',
          startDateEth: '01 Hamle 2017',
          endDateEth: '30 Sene 2018'
        },
        {
          id: 'fy-2017',
          name: 'EFY 2017/2018',
          calendarType: 'ETHIOPIAN',
          startDate: '2024-07-07', // Hamle 1, 2016
          endDate: '2025-07-07',   // Sene 30, 2017
          status: 'INACTIVE',
          description: 'Previous fiscal year. Auditor review completed, fiscal year closed.',
          startDateEth: '01 Hamle 2016',
          endDateEth: '30 Sene 2017'
        },
        {
          id: 'gfy-2026',
          name: 'GFY 2026',
          calendarType: 'GREGORIAN',
          startDate: '2026-01-01',
          endDate: '2026-12-31',
          status: 'ACTIVE',
          description: 'Gregorian Calendar Fiscal Year for IFRS reporting compliance.',
          startDateEth: '23 Tahsas 2018',
          endDateEth: '22 Tahsas 2019'
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultFYs));
      return defaultFYs;
    }
    return JSON.parse(raw);
  }

  private static saveLocalFiscalYears(data: FiscalYear[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Checks if a response body is HTML (e.g. SPA fallback returning index.html).
   */
  private static isHtmlResponse(data: unknown): boolean {
    if (typeof data === 'string') {
      const trimmed = data.trimStart();
      return trimmed.startsWith('<') || trimmed.startsWith('<!doctype');
    }
    return false;
  }

  static async getFiscalYears(): Promise<FiscalYear[]> {
    try {
      const response = await apiClient.get<FiscalYear[]>('/fiscal-years');
      const raw = response.data;

      // If the server returned HTML (e.g. Vite SPA fallback), the API endpoint doesn't exist.
      if (this.isHtmlResponse(raw)) {
        console.warn('API endpoint not available (received HTML). Falling back to local state storage.');
        return this.getLocalFiscalYears();
      }

      if (Array.isArray(raw)) {
        return raw;
      }
      if (raw && typeof raw === 'object') {
        // Handle wrapped responses (e.g. { data: [...] } or { fiscalYears: [...] })
        const candidate = raw.data ?? raw.fiscalYears ?? raw.content ?? raw.items ?? raw.results;
        if (Array.isArray(candidate)) {
          return candidate;
        }
      }
      console.warn('API returned unexpected shape:', raw);
      return this.getLocalFiscalYears();
    } catch (err) {
      console.warn('API endpoint offline. Falling back to local state storage for preview.', err);
      return this.getLocalFiscalYears();
    }
  }

  /**
   * Create a new fiscal year.
   */
  static async createFiscalYear(fy: Omit<FiscalYear, 'id'>): Promise<FiscalYear> {
    const newFy: FiscalYear = {
      ...fy,
      id: `fy-${Date.now()}`
    };
    try {
      const response = await apiClient.post<FiscalYear>('/fiscal-years', newFy);
      return response.data;
    } catch (err) {
      console.warn('API endpoint offline. Saving to local state storage for preview.', err);
      const local = this.getLocalFiscalYears();
      local.unshift(newFy);
      this.saveLocalFiscalYears(local);
      return newFy;
    }
  }

  /**
   * Update an existing fiscal year.
   */
  static async updateFiscalYear(id: string, fy: Partial<FiscalYear>): Promise<FiscalYear> {
    try {
      const response = await apiClient.put<FiscalYear>(`/fiscal-years/${id}`, fy);
      return response.data;
    } catch (err) {
      console.warn('API endpoint offline. Updating in local state storage for preview.', err);
      const local = this.getLocalFiscalYears();
      const idx = local.findIndex(item => item.id === id);
      if (idx === -1) {
        throw new Error(`Fiscal Year with ID ${id} not found.`);
      }
      local[idx] = { ...local[idx], ...fy };
      this.saveLocalFiscalYears(local);
      return local[idx];
    }
  }

  /**
   * Delete a fiscal year.
   */
  static async deleteFiscalYear(id: string): Promise<void> {
    try {
      await apiClient.delete(`/fiscal-years/${id}`);
    } catch (err) {
      console.warn('API endpoint offline. Deleting from local state storage for preview.', err);
      const local = this.getLocalFiscalYears();
      const filtered = local.filter(item => item.id !== id);
      this.saveLocalFiscalYears(filtered);
    }
  }
}
