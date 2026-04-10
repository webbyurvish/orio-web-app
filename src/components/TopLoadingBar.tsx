import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { topLoaderSubscribe } from "../utils/topLoaderBus";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function TopLoadingBar() {
  const location = useLocation();
  const [activeCount, setActiveCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const isActive = activeCount > 0;

  useEffect(() => {
    return topLoaderSubscribe(setActiveCount);
  }, []);

  // Small loading pulse on route changes (even if no API call fires).
  useEffect(() => {
    setVisible(true);
    setProgress(0.2);
    const t1 = window.setTimeout(() => setProgress(0.55), 120);
    const t2 = window.setTimeout(() => setProgress(0.75), 260);
    const t3 = window.setTimeout(() => {
      if (!isActive) {
        setProgress(1);
        window.setTimeout(() => setVisible(false), 200);
      }
    }, 520);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
      setProgress((p) => (p < 0.15 ? 0.15 : p));
      return;
    }
    // finish animation
    setProgress(1);
    const t = window.setTimeout(() => setVisible(false), 220);
    return () => window.clearTimeout(t);
  }, [isActive]);

  // When active, slowly creep but never reach 100%.
  useEffect(() => {
    if (!isActive) return;
    const t = window.setInterval(() => {
      setProgress((p) => clamp(p + (1 - p) * 0.035, 0, 0.92));
    }, 140);
    return () => window.clearInterval(t);
  }, [isActive]);

  const widthPct = useMemo(() => `${Math.round(progress * 1000) / 10}%`, [progress]);

  if (!visible) return null;

  return (
    <div className="orio-top-loader" aria-hidden>
      <div className="orio-top-loader__bar" style={{ width: widthPct }} />
    </div>
  );
}

