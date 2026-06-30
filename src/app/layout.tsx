// ── ROUTING ──────────────────────────────────────────────────────
// Wraps EVERY page. This is where global providers and the Navbar live.

import { QueryProvider } from '@/providers/QueryProvider'
import { Navbar } from '@/shared/components/layout/Navbar'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}