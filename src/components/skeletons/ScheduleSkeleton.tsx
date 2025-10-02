import { Skeleton } from "../ui/skeleton";

export function ScheduleSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-[500px] mx-auto" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendrier */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
          {/* Navigation du mois */}
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-3">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}