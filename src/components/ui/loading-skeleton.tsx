import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button'
}

export const LoadingSkeleton = ({ className, variant = 'default' }: LoadingSkeletonProps) => {
  const variants = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-lg",
    text: "h-4 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg"
  }
  
  return (
    <div 
      className={cn(
        "loading-skeleton rounded-md",
        variants[variant],
        className
      )}
    />
  )
}

export const LoadingCard = () => (
  <div className="space-y-4 p-6 border rounded-lg">
    <div className="flex items-center space-x-4">
      <LoadingSkeleton variant="avatar" />
      <div className="space-y-2 flex-1">
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton variant="text" />
      </div>
    </div>
    <LoadingSkeleton variant="card" />
    <div className="flex space-x-2">
      <LoadingSkeleton variant="button" />
      <LoadingSkeleton variant="button" />
    </div>
  </div>
)

export const LoadingGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
)