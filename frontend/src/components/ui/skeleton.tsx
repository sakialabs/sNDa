import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded-md", className)}
      {...props}
    />
  )
}

// Specialized skeleton components for common patterns
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 space-y-4", className)} {...props}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

function SkeletonAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton 
      className={cn("h-10 w-10 rounded-full", className)} 
      {...props} 
    />
  )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonAvatar }
