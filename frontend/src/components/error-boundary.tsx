"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  error: Error | null
  reset: () => void
  children: React.ReactNode
}

export default function ErrorBoundary({
  error,
  reset,
  children
}: ErrorBoundaryProps) {
  useEffect(() => {
    if (error) console.error(error)
  }, [error])

  if (!error) return children

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}