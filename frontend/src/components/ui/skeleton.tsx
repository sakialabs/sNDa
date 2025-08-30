import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Light mode: darker than warm sandy background for professional depth
        "bg-gradient-to-r from-stone-300/70 via-stone-200/50 to-stone-300/70",
        // Dark mode: darker than ink background for sophisticated cool vibe
        "dark:from-stone-900/60 dark:via-stone-800/50 dark:to-stone-900/60",
        "animate-shimmer bg-[length:200%_100%] rounded-md",
        className
      )}
      {...props}
    />
  )
}

// Specialized skeleton components for common patterns
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(
      "rounded-lg border bg-card/50 backdrop-blur-sm p-6 space-y-4",
      // Light mode: deeper warm shadows for professional depth
      "shadow-sm shadow-stone-300/50", 
      // Dark mode: darker, cooler shadows for sophisticated feel
      "dark:shadow-stone-950/40",
      className
    )} {...props}>
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

// New premium skeleton variants for your warm theme
function SkeletonText({ lines = 3, className, ...props }: { lines?: number } & React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full" // Last line is shorter
          )} 
        />
      ))}
    </div>
  )
}

function SkeletonProfile({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center space-x-4", className)} {...props}>
      <SkeletonAvatar className="h-12 w-12" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonAvatar, SkeletonText, SkeletonProfile }
