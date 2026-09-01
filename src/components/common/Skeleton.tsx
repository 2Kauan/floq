import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        clsx(
          'animate-pulse bg-ink/10 rounded-md',
          className
        )
      )}
    />
  );
}

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="w-full aspect-2/3 rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function HighlightCardSkeleton() {
  return (
    <div className="p-5 bg-surface border border-border rounded-xl space-y-3">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
