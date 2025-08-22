"use client"

import { useState } from "react"
import ErrorBoundary from "@/components/error-boundary"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [error, setError] = useState<Error | null>(null)

  return (
    <ErrorBoundary
      error={error}
      reset={() => setError(null)}
    >
      <div className="flex min-h-screen">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  )
}