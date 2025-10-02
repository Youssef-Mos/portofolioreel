import { Skeleton } from "../ui/skeleton";


 // components/skeletons/AboutSkeleton.tsx
export function AboutSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-16">
      {/* Left Column */}
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-blue-50 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-12 w-64 rounded-xl" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}