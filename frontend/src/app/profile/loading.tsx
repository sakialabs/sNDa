import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="mt-2 h-4 w-56 bg-muted rounded" />
      </div>

      <div className="rounded border p-4 grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    </div>
  );
}
