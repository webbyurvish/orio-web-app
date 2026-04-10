import { Link, NavLink, useLocation } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import { useAuthStore } from "../store/authStore";

export type NotFoundScope = "public" | "dashboard" | "admin";

type Props = {
  /** Where the 404 is shown — controls layout and default links. */
  scope?: NotFoundScope;
};

export default function NotFoundPage({ scope = "public" }: Props) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const path = location.pathname || "/";

  if (scope === "dashboard") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-16 text-center">
        <p className="orio-font-display text-7xl font-black tracking-tight bg-gradient-to-r from-teal-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-sm text-gray-600">
          This dashboard URL is not valid:{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-800">
            {path}
          </code>
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="orio-btn-aurora inline-flex items-center px-5 py-2.5 text-sm shadow-lg"
          >
            Dashboard home
          </Link>
          <Link
            to="/"
            className="orio-btn-ghost inline-flex items-center px-5 py-2.5 text-sm"
          >
            Site home
          </Link>
        </div>
      </div>
    );
  }

  if (scope === "admin") {
    return (
      <div className="orio-panel mx-auto max-w-lg rounded-2xl border border-amber-400/30 px-6 py-10 text-center">
        <p className="orio-font-display text-5xl font-black text-amber-300/90">
          404
        </p>
        <h2 className="mt-3 text-lg font-bold text-gray-900">
          Admin page not found
        </h2>
        <p className="mt-2 text-sm text-gray-600 break-all">{path}</p>
        <NavLink
          to="/admin"
          className="orio-btn-aurora mt-6 inline-flex items-center justify-center px-5 py-2.5 text-sm"
        >
          Back to admin home
        </NavLink>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <LandingNavbar theme="dark" />

      <main className="saas-container flex flex-col items-center py-20 text-center">
        <p className="orio-font-display text-8xl font-black tracking-tight bg-gradient-to-r from-teal-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mt-3 max-w-lg text-sm text-gray-600">
          We couldn&apos;t find a page at{" "}
          <code className="rounded bg-white/80 px-1.5 py-0.5 text-gray-800 shadow-sm">
            {path}
          </code>
          . The link may be broken or the page may have moved.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="orio-btn-aurora inline-flex items-center px-6 py-3 text-sm shadow-lg"
          >
            Back to home
          </Link>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="orio-btn-ghost inline-flex items-center px-6 py-3 text-sm"
            >
              Go to dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="orio-btn-ghost inline-flex items-center px-6 py-3 text-sm"
            >
              Log in
            </Link>
          )}
          <Link
            to="/contact"
            className="inline-flex items-center rounded-xl text-sm font-semibold text-teal-300 underline-offset-4 hover:text-teal-200 hover:underline"
          >
            Contact support
          </Link>
        </div>
      </main>
    </div>
  );
}
