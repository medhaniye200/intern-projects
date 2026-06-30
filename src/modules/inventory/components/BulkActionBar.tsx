'use client'

// ── GLOBAL STATE ─────────────────────────────────────────────────
// Rendered separately from the table, but reads the SAME store
// as each row's checkbox in ItemRow.tsx.

import { useSelectionStore } from '../store/selectionStore'
import { deleteItem } from '../api/inventoryApi'
import { useQueryClient } from '@tanstack/react-query'

export function BulkActionBar() {
  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const clearSelection = useSelectionStore((s) => s.clearSelection)
  const queryClient = useQueryClient()

  if (selectedIds.length === 0) return null

  async function handleBulkDelete() {
    await Promise.all(selectedIds.map((id) => deleteItem(id)))
    clearSelection()
    queryClient.invalidateQueries({ queryKey: ['inventory'] })
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white rounded-full px-6 py-3 flex items-center gap-4 shadow-lg">
      <span>{selectedIds.length} item(s) selected</span>
      <button onClick={handleBulkDelete} className="text-red-300 font-bold">Delete selected</button>
      <button onClick={clearSelection}>Cancel</button>
    </div>
  )
}