'use client'

// Sets up React Query for the whole app. Wraps everything in
// app/layout.tsx so any hook can call useQuery / useMutation.

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}