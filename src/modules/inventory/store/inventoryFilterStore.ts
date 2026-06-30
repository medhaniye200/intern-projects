// ── GLOBAL STATE (Zustand) ───────────────────────────────────────
// Shared between the Inventory page (CategoryFilter) and the
// Dashboard page (CategorySummary) — two components with NO
// parent/child relationship. Props can't connect them; a store can.

import { create } from 'zustand'

interface InventoryFilterState {
  selectedCategory: string | null
  setCategory: (category: string | null) => void
}

export const useInventoryFilterStore = create<InventoryFilterState>((set) => ({
  selectedCategory: null,
  setCategory: (category) => set({ selectedCategory: category }),
}))