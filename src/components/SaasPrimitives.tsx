import type { ReactNode } from "react";

type ClassNameProps = {
  className?: string;
  children: ReactNode;
};

export function SaasSection({ className = "", children }: ClassNameProps) {
  return <section className={`saas-section ${className}`.trim()}>{children}</section>;
}

export function SaasCard({ className = "", children }: ClassNameProps) {
  return <div className={`saas-card ${className}`.trim()}>{children}</div>;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
      {centered ? (
        <div
          className="mx-auto mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 opacity-90"
          aria-hidden
        />
      ) : null}
      {subtitle ? <p className="mt-3 text-lg text-gray-600">{subtitle}</p> : null}
    </div>
  );
}

export function RatingStars({ count = 5 }: { count?: number }) {
  return <div className="mt-4 text-indigo-400 text-sm">{"★".repeat(Math.max(1, count))}</div>;
}
