// ── PROPS ────────────────────────────────────────────────────────
// Pure presentational component. Everything it needs comes from `item`.

import { InventoryItem } from '../types'

interface ItemDetailPanelProps {
  item: InventoryItem
}

export function ItemDetailPanel({ item }: ItemDetailPanelProps) {
  return (
    <div className="bg-gray-50 p-4 text-sm">
      <p><strong>SKU:</strong> {item.sku}</p>
      <p><strong>Reorder level:</strong> {item.reorderLevel} {item.unit}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Last updated:</strong> {new Date(item.updatedAt).toLocaleString()}</p>
    </div>
  )
}