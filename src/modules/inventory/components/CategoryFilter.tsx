'use client'

// ── GLOBAL STATE ─────────────────────────────────────────────────
// Reads and writes the Zustand store DIRECTLY. No props needed —
// any component anywhere can use this store the same way.

import { useInventoryFilterStore } from '../store/inventoryFilterStore'

const CATEGORIES = ['Stationery', 'Electronics', 'Furniture', 'Other']

export function CategoryFilter() {
  const selectedCategory = useInventoryFilterStore((s) => s.selectedCategory)
  const setCategory = useInventoryFilterStore((s) => s.setCategory)

  return (
    <select
      value={selectedCategory ?? ''}
      onChange={(e) => setCategory(e.target.value || null)}
      className="border rounded px-3 py-2"
    >
      <option value="">All categories</option>
      {CATEGORIES.map((category) => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  )
}