import { Skeleton } from "../ui/skeleton"

// components/skeletons/ProjectsSkeleton.tsx
export function ProjectsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Filter Panel Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-4 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid lg:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}







// Ajouter au fichier global.css pour l'animation shimmer
/* 
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
*/