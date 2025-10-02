import { Skeleton } from "../ui/skeleton";

// components/skeletons/ProjectDetailSkeleton.tsx
export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Skeleton */}
      <div className="relative h-96 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center space-y-6">
            <Skeleton className="w-24 h-24 mx-auto rounded-2xl" />
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-8 w-32 mx-auto rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Key Points */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <Skeleton className="h-8 w-56 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Skeleton className="h-7 w-32 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="w-5 h-5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}