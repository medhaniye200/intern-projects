'use client'

// This hook is the bridge: it calls the API layer, manages LOCAL state
// (search text), and reads/writes GLOBAL state (category filter, stats).

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchItems, deleteItem as apiDeleteItem } from '../api/inventoryApi'
import { useInventoryFilterStore } from '../store/inventoryFilterStore'
import { useInventoryStatsStore } from '@/shared/store/inventoryStatsStore'
import { countLowStock } from '../services/inventoryService'

export function useInventory() {
  const queryClient = useQueryClient()

  // LOCAL STATE — only this hook/component cares about the search text
  const [search, setSearch] = useState('')

  // GLOBAL STATE — category filter is shared with /dashboard
  const selectedCategory = useInventoryFilterStore((s) => s.selectedCategory)

  // GLOBAL STATE — write the low-stock count for the Navbar badge
  const setLowStockCount = useInventoryStatsStore((s) => s.setLowStockCount)

  // SERVER STATE — React Query handles fetching, caching, refetching
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const result = await fetchItems()
      setLowStockCount(countLowStock(result)) // side-effect: update global stat
      return result
    },
  })

  // Combine local search + global category filter on the fetched data
  const filtered = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => !selectedCategory || item.category === selectedCategory)

  async function removeItem(id: string) {
    await apiDeleteItem(id)
    queryClient.invalidateQueries({ queryKey: ['inventory'] }) // refetch list
  }

  return { items: filtered, isLoading, isError, search, setSearch, removeItem }
}