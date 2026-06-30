'use client'

// This is the "wiring" component — it calls the hook, then passes
// pieces of state down to children as props (SearchBar, ItemRow),
// while CategoryFilter and BulkActionBar grab GLOBAL state on their own.

import { useInventory } from '../hooks/useInventory'
import { SearchBar } from './SearchBar'
import { CategoryFilter } from './CategoryFilter'
import { ItemRow } from './ItemRow'
import { BulkActionBar } from './BulkActionBar'

export function InventoryTable() {
  const { items, isLoading, isError, search, setSearch, removeItem } = useInventory()

  if (isLoading) return <p>Loading inventory...</p>
  if (isError) return <p>Something went wrong. <button onClick={() => location.reload()}>Retry</button></p>

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {/* LOCAL STATE lives in the hook, passed down as props */}
        <SearchBar value={search} onChange={setSearch} />
        {/* GLOBAL STATE — no props needed */}
        <CategoryFilter />
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b font-semibold">
            <th className="p-2"></th>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onDelete={removeItem} />
          ))}
        </tbody>
      </table>

      {items.length === 0 && <p className="mt-4 text-gray-500">No items found.</p>}

      <BulkActionBar />
    </div>
  )
}