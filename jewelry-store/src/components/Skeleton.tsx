interface SkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-white rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-square bg-gray-200 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded skeleton w-3/4" />
        <div className="h-3 bg-gray-200 rounded skeleton w-1/2" />
        <div className="h-5 bg-gray-200 rounded skeleton w-1/3" />
        <div className="h-10 bg-gray-200 rounded skeleton" />
      </div>
    </div>
  );
}

export function ImageSkeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 skeleton ${className}`} />
  );
}

export function TextSkeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 rounded skeleton ${className}`} />
  );
}
