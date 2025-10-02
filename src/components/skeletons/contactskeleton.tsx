import { Skeleton } from "../ui/skeleton";

export function ContactSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Informations de contact */}
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-2xl">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>

        {/* Formulaire de contact */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <Skeleton className="h-40 w-full rounded-xl" />

              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}