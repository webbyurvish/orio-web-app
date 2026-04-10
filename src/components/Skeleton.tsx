import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
};

const roundedClass = (r: Props["rounded"]) => {
  switch (r) {
    case "sm":
      return "rounded";
    case "md":
      return "rounded-md";
    case "lg":
      return "rounded-lg";
    case "xl":
      return "rounded-xl";
    case "full":
      return "rounded-full";
    default:
      return "rounded-lg";
  }
};

export function Skeleton({ className = "", rounded, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={[
        "orio-skeleton",
        roundedClass(rounded),
        "bg-white/10",
        className,
      ].join(" ")}
      aria-hidden
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  const safe = Math.max(1, Math.min(8, Math.floor(lines)));
  return (
    <div className={["space-y-2", className].join(" ")}>
      {Array.from({ length: safe }).map((_, i) => (
        <Skeleton
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={[
            "h-3",
            i === safe - 1 ? "w-2/3" : "w-full",
            i === 0 ? "h-3.5" : "",
          ].join(" ")}
          rounded="full"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={["orio-panel rounded-2xl p-5", className].join(" ")}>
      {children ?? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" rounded="full" />
          <SkeletonText lines={3} />
        </div>
      )}
    </div>
  );
}

export function SkeletonTable({
  rows = 6,
  cols = 5,
  className = "",
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  const r = Math.max(1, Math.min(15, Math.floor(rows)));
  const c = Math.max(1, Math.min(10, Math.floor(cols)));
  return (
    <div className={["space-y-3", className].join(" ")}>
      <div className="grid grid-cols-12 gap-3">
        <Skeleton className="col-span-5 h-3.5" rounded="full" />
        <Skeleton className="col-span-3 h-3.5" rounded="full" />
        <Skeleton className="col-span-2 h-3.5" rounded="full" />
        <Skeleton className="col-span-2 h-3.5" rounded="full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: r }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="grid grid-cols-12 gap-3">
            {Array.from({ length: c }).map((__, j) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton
                key={j}
                className={[
                  "h-4",
                  j === 0 ? "col-span-4" : "col-span-2",
                ].join(" ")}
                rounded="full"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

