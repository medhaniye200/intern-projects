'use client'

// ── LOCAL STATE + PROPS + GLOBAL STATE, all in one component ──────
// - `item` and `onDelete` come in as PROPS from the parent.
// - `isExpanded` and `confirmOpen` are LOCAL — only this row cares.
// - `selectedIds` comes from GLOBAL state, shared with BulkActionBar.

import { useState } from 'react'
import { InventoryItem } from '../types'
import { useSelectionStore } from '../store/selectionStore'
import { ItemDetailPanel } from './ItemDetailPanel'

interface ItemRowProps {
  item: InventoryItem
  onDelete: (id: string) => void
}

export function ItemRow({ item, onDelete }: ItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const toggleId = useSelectionStore((s) => s.toggleId)
  const isSelected = selectedIds.includes(item.id)
  const isLowStock = item.quantity < item.reorderLevel

  return (
    <>
      <tr
        className={`border-b cursor-pointer ${isLowStock ? 'bg-red-50' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="p-2" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={() => toggleId(item.id)} />
        </td>
        <td className="p-2">{item.name}</td>
        <td className="p-2">{item.category}</td>
        <td className="p-2">{item.quantity} {item.unit}</td>
        <td className="p-2">${item.price.toFixed(2)}</td>
        <td className="p-2" onClick={(e) => e.stopPropagation()}>
          {confirmOpen ? (
            <span className="space-x-2">
              <button onClick={() => onDelete(item.id)} className="text-red-600">Confirm</button>
              <button onClick={() => setConfirmOpen(false)}>Cancel</button>
            </span>
          ) : (
            <button onClick={() => setConfirmOpen(true)} className="text-red-600">Delete</button>
          )}
        </td>
      </tr>

      {/* PROPS: item is passed down — the child decides how to display it */}
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <ItemDetailPanel item={item} />
          </td>
        </tr>
      )}
    </>
  )
}