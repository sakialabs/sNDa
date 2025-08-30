"use client";

import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonAvatar, 
  SkeletonText, 
  SkeletonProfile 
} from "@/components/ui/skeleton";

export function SkeletonShowcase() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            🎨 Beautiful Skeleton Loading Components
          </h1>
          <p className="text-muted-foreground text-lg">
            Harmonious with your warm sandy background in light mode • Sophisticated & cool in dark mode
          </p>
        </div>

        {/* Basic Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Basic Elements</h2>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Avatars & Profiles</h2>
            <div className="space-y-4">
              <SkeletonProfile />
              <div className="flex items-center gap-3">
                <SkeletonAvatar className="h-8 w-8" />
                <SkeletonAvatar className="h-10 w-10" />
                <SkeletonAvatar className="h-12 w-12" />
                <SkeletonAvatar className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Text Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Short Paragraph</h3>
              <SkeletonText lines={3} />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Long Article</h3>
              <SkeletonText lines={6} />
            </div>
          </div>
        </div>

        {/* Card Components */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Card Layouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>

        {/* Table Layout */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Tables</h2>
          <div className="bg-card rounded-lg border p-6">
            <SkeletonTable rows={6} columns={5} />
          </div>
        </div>

        {/* Story/Post Layout */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Story/Post Layout</h2>
          <div className="bg-card rounded-lg border p-6 space-y-6">
            <SkeletonProfile />
            <SkeletonText lines={4} />
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-14" />
            </div>
          </div>
        </div>

        {/* Theme Toggle Note */}
        <div className="text-center py-8 space-y-2">
          <p className="text-muted-foreground">
            💡 Toggle between light and dark mode to see the sophisticated color harmonies
          </p>
          <p className="text-sm text-muted-foreground">
            Light mode: Warm stone tones complement your sandy background • Dark mode: Cool deeper tones enhance the atmosphere
          </p>
        </div>
      </div>
    </div>
  );
}
