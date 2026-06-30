// Shared shape used by every file in this module — the single source of truth.
export interface InventoryItem {
    id: string
    name: string
    sku: string
    category: 'Stationery' | 'Electronics' | 'Furniture' | 'Other'
    quantity: number
    unit: 'pcs' | 'box' | 'kg' | 'liter'
    price: number
    reorderLevel: number   // quantity below this = "low stock"
    status: 'active' | 'inactive'
    updatedAt: string
}

// Used by the form — id/status/updatedAt are set by the "backend", not the user.
export type InventoryFormValues = Omit<InventoryItem, 'id' | 'status' | 'updatedAt'>