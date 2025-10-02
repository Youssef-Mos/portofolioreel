import { Skeleton } from "../ui/skeleton";


// components/skeletons/ExperienceSkeleton.tsx
export function ExperienceSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Icon & Period */}
            <div className="flex items-center lg:items-start lg:flex-col gap-4 lg:gap-2">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}