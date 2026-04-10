/**
 * Minimal fallback for lazy-loaded routes (no CSS animation — respects global reduced-motion rules).
 */
import { Skeleton, SkeletonText } from "./Skeleton";

export function AppRouteFallback() {
  return (
    <div
      className="mx-auto flex min-h-[55dvh] w-full max-w-5xl flex-col justify-center px-4 py-10"
      role="progressbar"
      aria-label="Loading page"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <div className="orio-panel rounded-2xl p-5">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" rounded="full" />
              <SkeletonText lines={4} />
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="orio-panel rounded-2xl p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-44" rounded="full" />
                <Skeleton className="h-9 w-28" rounded="full" />
              </div>
              <Skeleton className="h-44 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
