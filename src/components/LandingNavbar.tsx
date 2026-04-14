import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type LandingNavbarProps = {
  hideFeatures?: boolean;
  hideDesktopApp?: boolean;
  /** `dark` matches the Aurora Stealth home page; `light` for legal/contact pages. */
  theme?: "light" | "dark";
};

export default function LandingNavbar({
  hideFeatures = false,
  hideDesktopApp = false,
  theme = "light",
}: LandingNavbarProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === "dark";

  const goToTop = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    ...(!hideFeatures
      ? [
          {
            href: "/#features",
            label: "Features",
            icon: (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3v10h8V3h-8zM3 21h8v-6H3v6zm0-8h8V3H3v10zm10 0h8v-6h-8v6z" />
              </svg>
            ),
          },
          {
            href: "/#pricing-showdown",
            label: "Compare",
            icon: (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
              </svg>
            ),
          },
        ]
      : []),
    {
      href: "/#reviews",
      label: "Reviews",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ),
    },
    {
      href: "/#privacy",
      label: "FAQ",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      ),
    },
    {
      href: "/#pricing",
      label: "Pricing",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7 5.5z" />
        </svg>
      ),
    },
    ...(!hideDesktopApp
      ? [
          {
            href: "/#desktop",
            label: "Desktop",
            badge: "New",
            icon: (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2h8v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  const shellClass = isDark
    ? "rounded-2xl border border-white/[0.08] bg-[#0a0a10]/70 shadow-[0_0_0_1px_rgba(45,212,191,0.06),0_24px_80px_rgba(0,0,0,0.5)]"
    : "rounded-2xl border border-white/30 shadow-[0_4px_24px_rgba(79,70,229,0.06)]";

  const shellStyle = isDark
    ? ({
        backdropFilter: "blur(20px) saturate(1.3)",
        WebkitBackdropFilter: "blur(20px) saturate(1.3)",
      } as const)
    : ({
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      } as const);

  const linkClass = isDark
    ? "text-slate-400 hover:text-teal-300"
    : "text-gray-500 hover:text-indigo-600";

  const iconTint = isDark ? "text-teal-400/80" : "text-indigo-400";

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2">
      <div className={`saas-container relative overflow-hidden ${shellClass}`} style={shellStyle}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent opacity-80" aria-hidden />

        <div className="relative h-11 md:h-12 flex items-center justify-between px-3 sm:px-5 md:px-7 gap-2">
          <Link
            to="/"
            onClick={goToTop}
            className={`flex items-center gap-2 font-bold text-base md:text-lg ${isDark ? "text-white" : "text-indigo-800"}`}
          >
            <span className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-full" aria-hidden>
              <img
                src="/assets/smeed-logo.png"
                alt=""
                className="h-full w-full object-cover object-center scale-[1.12]"
                draggable={false}
              />
            </span>
            <span className="tracking-tight">Smeed AI</span>
          </Link>

          <nav className={`hidden md:flex items-center gap-5 lg:gap-7 text-[12px] font-medium ${linkClass}`}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="flex items-center gap-1.5 transition-colors">
                <span className={iconTint}>{link.icon}</span>
                {link.label}
                {"badge" in link && link.badge && (
                  <span
                    className={`ml-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full px-1.5 py-0.5 ${
                      isDark
                        ? "bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30"
                        : "bg-indigo-100/80 text-indigo-600"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`md:hidden p-2 rounded-lg ${isDark ? "text-slate-300 hover:bg-white/5" : "text-gray-500 hover:bg-white/50"}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className={`hidden md:inline-flex items-center gap-1.5 text-[12px] font-semibold ${isDark ? "orio-btn-aurora !py-2 !px-5" : "rounded-[10px] px-4 py-2 text-white shadow-sm transition-all"}`}
              style={
                !isDark
                  ? { background: "linear-gradient(135deg, #ff7eb3, #ff758c, #7aa2ff)" }
                  : undefined
              }
            >
              {isAuthenticated ? "Dashboard" : "Get started"}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {mobileOpen && (
          <div
            className={`md:hidden border-t px-4 py-3 space-y-1 ${isDark ? "border-white/10 bg-black/20" : "border-white/20"}`}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isDark
                    ? "text-slate-300 hover:bg-white/5 hover:text-teal-300"
                    : "text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-700"
                }`}
              >
                <span className={iconTint}>{link.icon}</span>
                {link.label}
              </a>
            ))}
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-center gap-1.5 mt-2 text-sm font-semibold ${isDark ? "orio-btn-aurora w-full" : "rounded-xl px-4 py-2.5 text-white"}`}
              style={!isDark ? { background: "linear-gradient(135deg, #ff7eb3, #ff758c, #7aa2ff)" } : undefined}
            >
              {isAuthenticated ? "Dashboard" : "Get started"}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
