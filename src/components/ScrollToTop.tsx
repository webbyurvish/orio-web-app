import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the document to the top on route changes, except when a hash is present —
 * then scrolls to the matching element id (e.g. /#pricing → #pricing).
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const id = hash.replace(/^#/, "").trim();

    if (id) {
      let attempts = 0;
      const maxAttempts = 30;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (attempts < maxAttempts) {
          attempts += 1;
          requestAnimationFrame(tryScroll);
        }
      };
      requestAnimationFrame(tryScroll);
      return;
    }

    window.scrollTo(0, 0);
    const dashboardMain = document.getElementById("dashboard-main-scroll");
    if (dashboardMain) dashboardMain.scrollTop = 0;
    const adminMain = document.getElementById("admin-main-scroll");
    if (adminMain) adminMain.scrollTop = 0;
  }, [pathname, search, hash]);

  return null;
}
