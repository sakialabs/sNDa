import { Skeleton } from "@/components/ui/skeleton";

export default function CaseLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="mt-2 h-4 w-60 bg-muted rounded" />
      </div>

      <div className="rounded border p-4 space-y-4">
        <div className="aspect-[16/9] rounded bg-muted" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-20 rounded bg-muted" />
          ))}
        </div>
      </div>

      <div className="rounded border p-4 space-y-4">
        <div className="h-6 w-56 bg-muted rounded" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}
