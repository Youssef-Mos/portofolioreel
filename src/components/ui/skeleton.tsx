// components/ui/skeleton.tsx
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
        "dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
        className
      )}
      style={{
        animation: "shimmer 2s infinite linear"
      }}
      {...props}
    />
  )
}