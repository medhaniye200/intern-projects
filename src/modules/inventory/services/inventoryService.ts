// ── BUSINESS LOGIC ───────────────────────────────────────────────
// Sits between components and api/. Validation and calculations live
// here so they're reusable and testable without React.

import { InventoryFormValues, InventoryItem } from '../types'

export function validateItem(values: InventoryFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.name.trim()) errors.name = 'Name is required'
  if (!values.sku.trim()) errors.sku = 'SKU is required'
  if (values.quantity < 0) errors.quantity = 'Quantity cannot be negative'
  if (values.price < 0) errors.price = 'Price cannot be negative'
  if (values.reorderLevel < 0) errors.reorderLevel = 'Reorder level cannot be negative'
  return errors
}

// Used by the navbar badge — counts items that need reordering
export function countLowStock(items: InventoryItem[]): number {
  return items.filter((item) => item.quantity < item.reorderLevel).length
}