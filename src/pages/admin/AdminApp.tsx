import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuthStore } from "../../store/authStore";
import NotFoundPage from "../NotFoundPage";
import {
  adminPageTitleFromPath,
  formatAdminEventType,
  formatAdminProductId,
  formatAdminSentimentTags,
  humanizeAdminIdentifier,
} from "../../utils/adminLabels";
import {
  downloadAdminEventsCsv,
  getAdminAiMetrics,
  getAdminDashboard,
  getAdminFeedback,
  getAdminFunnel,
  getAdminSubscriptions,
  getAdminSystemMetrics,
  getAdminUsage,
  getAdminUsers,
  type AdminDashboardResponse,
  type AdminFeedbackRow,
  type AdminFunnel,
  type AdminSubscriptionSummary,
  type AdminUsageSummary,
  type AdminAiMetrics,
  type AdminSystemMetrics,
  type AdminPaged,
  type AdminUserRow,
} from "../../api/admin";

const ADMIN_CHART_GRID = "rgba(255,255,255,0.08)";
const adminChartTick = { fill: "#94a3b8", fontSize: 11 };
const adminChartTooltip = {
  contentStyle: {
    background: "#12121c",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    color: "#e2e8f0",
  },
  labelStyle: { color: "#e2e8f0" } as const,
  itemStyle: { color: "#94a3b8" } as const,
};

function rangePresets() {
  const to = new Date();
  const toIso = to.toISOString();
  const d7 = new Date(to);
  d7.setUTCDate(d7.getUTCDate() - 7);
  const d30 = new Date(to);
  d30.setUTCDate(d30.getUTCDate() - 30);
  return {
    toIso,
    from7: d7.toISOString(),
    from30: d30.toISOString(),
  };
}

/** `datetime-local` value from an ISO string (local timezone). */
function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="orio-panel rounded-2xl p-5 shadow-lg shadow-black/25">
      <div className="text-xs font-semibold uppercase tracking-wide text-teal-300/90">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-100">{value}</div>
      {sub ? <div className="mt-1 text-xs text-slate-400">{sub}</div> : null}
    </div>
  );
}

function IconNavOverview() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function IconNavUsers() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function IconNavCard() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
}

function IconNavChart() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function IconNavCpu() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      />
    </svg>
  );
}

function IconNavFunnel() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );
}

function IconNavChat() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function IconNavServer() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
      />
    </svg>
  );
}

function IconHome() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

const adminNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition ${
    isActive
      ? "border-l-2 border-teal-400/80 bg-teal-500/10 text-slate-100"
      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
  }`;

const ADMIN_NAV_ITEMS: {
  to: string;
  end?: boolean;
  label: string;
  Icon: () => React.JSX.Element;
}[] = [
  { to: "/admin", end: true, label: "Overview", Icon: IconNavOverview },
  { to: "/admin/users", label: "Users", Icon: IconNavUsers },
  { to: "/admin/subscriptions", label: "Subscriptions", Icon: IconNavCard },
  { to: "/admin/usage", label: "Usage", Icon: IconNavChart },
  { to: "/admin/ai", label: "AI metrics", Icon: IconNavCpu },
  { to: "/admin/funnel", label: "Funnel", Icon: IconNavFunnel },
  { to: "/admin/feedback", label: "Feedback", Icon: IconNavChat },
  { to: "/admin/system", label: "System", Icon: IconNavServer },
];

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto py-3">
      {ADMIN_NAV_ITEMS.map(({ to, end, label, Icon }) => (
        <NavLink
          key={to + (end ? "-e" : "")}
          to={to}
          end={end}
          onClick={onNavigate}
          className={adminNavLinkClass}
        >
          <span className="shrink-0 text-slate-500">
            <Icon />
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function DateRangeControl({
  from,
  to,
  onChange,
}: {
  from: string;
  to: string;
  onChange: (f: string, t: string) => void;
}) {
  const p = rangePresets();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(p.from7, p.toIso)}
        className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
      >
        Last 7 days
      </button>
      <button
        type="button"
        onClick={() => onChange(p.from30, p.toIso)}
        className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
      >
        Last 30 days
      </button>
      <label className="flex items-center gap-2 text-xs text-slate-400">
        From
        <input
          type="datetime-local"
          value={toDatetimeLocalValue(from)}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            onChange(new Date(v).toISOString(), to);
          }}
          className="rounded-lg border border-white/15 bg-[var(--orio-surface)] px-2 py-1 text-sm text-slate-200"
        />
      </label>
      <label className="flex items-center gap-2 text-xs text-slate-400">
        To
        <input
          type="datetime-local"
          value={toDatetimeLocalValue(to)}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            onChange(from, new Date(v).toISOString());
          }}
          className="rounded-lg border border-white/15 bg-[var(--orio-surface)] px-2 py-1 text-sm text-slate-200"
        />
      </label>
      <button
        type="button"
        onClick={() => downloadAdminEventsCsv(from, to)}
        className="rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-teal-500/20"
      >
        Export events CSV
      </button>
    </div>
  );
}

function DashboardPage({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let off = false;
    setErr(null);
    getAdminDashboard(from, to)
      .then((d) => {
        if (!off) setData(d);
      })
      .catch(() => {
        if (!off) setErr("Could not load dashboard.");
      });
    return () => {
      off = true;
    };
  }, [from, to]);

  const usersChart = useMemo(() => {
    if (!data) return [];
    return data.userGrowthDaily.map((u) => ({
      name: u.date.slice(5),
      users: u.value,
    }));
  }, [data]);

  if (err) return <div className="text-rose-400">{err}</div>;
  if (!data) return <div className="text-slate-400">Loading…</div>;

  const k = data.kpis;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total users"
          value={k.totalUsers}
          sub={`+${k.newUsersInRange} in range`}
        />
        <KpiCard
          label="DAU / WAU / MAU"
          value={`${k.dau} / ${k.wau} / ${k.mau}`}
        />
        <KpiCard
          label="Sessions (range)"
          value={k.sessionsInRange}
          sub={`${k.totalSessions} all time`}
        />
        <KpiCard
          label="Revenue (USD, range)"
          value={`$${k.revenueUsdInRange.toFixed(2)}`}
          sub={`MRR est. $${k.mrrUsdEstimate.toFixed(2)}`}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="orio-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/25">
          <div className="text-sm font-bold text-slate-100">Growth</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usersChart}>
                <defs>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={ADMIN_CHART_GRID} />
                <XAxis
                  dataKey="name"
                  tick={adminChartTick}
                  stroke="rgba(148,163,184,0.35)"
                />
                <YAxis
                  tick={adminChartTick}
                  stroke="rgba(148,163,184,0.35)"
                />
                <Tooltip {...adminChartTooltip} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#2dd4bf"
                  fill="url(#gUsers)"
                  name="New users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="orio-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/25">
          <div className="text-sm font-bold text-slate-100">Sessions trend</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.sessionsDaily.map((s) => ({
                  name: s.date.slice(5),
                  v: s.value,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={ADMIN_CHART_GRID} />
                <XAxis
                  dataKey="name"
                  tick={adminChartTick}
                  stroke="rgba(148,163,184,0.35)"
                />
                <YAxis
                  tick={adminChartTick}
                  stroke="rgba(148,163,184,0.35)"
                />
                <Tooltip {...adminChartTooltip} />
                <Bar
                  dataKey="v"
                  fill="#a78bfa"
                  radius={[6, 6, 0, 0]}
                  name="Sessions"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Avg session (min)"
          value={k.avgSessionMinutes.toFixed(1)}
        />
        <KpiCard label="AI answers (range)" value={k.totalAiAnswers} />
        <KpiCard
          label="Signup → paid %"
          value={`${k.signupToPaidConversionPercent.toFixed(1)}%`}
        />
      </div>
      <div className="orio-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/25">
        <div className="text-sm font-bold text-slate-100">
          Cohort (sample window)
        </div>
        <div className="mt-2 grid grid-cols-3 gap-3 text-sm text-slate-300">
          <div>
            Day 1 retention: {data.cohort.retentionDay1Percent.toFixed(1)}%
          </div>
          <div>
            Day 7 retention: {data.cohort.retentionDay7Percent.toFixed(1)}%
          </div>
          <div>
            Day 30 retention: {data.cohort.retentionDay30Percent.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersAdminPage({ from, to }: { from: string; to: string }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminPaged<AdminUserRow> | null>(null);
  useEffect(() => {
    getAdminUsers({
      fromUtc: from,
      toUtc: to,
      search: search || undefined,
      page,
      pageSize: 20,
    }).then(setData);
  }, [from, to, search, page]);
  if (!data) return <div className="text-slate-400">Loading…</div>;
  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search email / name"
        className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
      />
      <div className="orio-panel overflow-x-auto rounded-2xl border border-white/10 shadow-lg shadow-black/25">
        <table className="min-w-full text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-left text-xs font-bold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Sessions</th>
              <th className="px-4 py-3">AI usage</th>
              <th className="px-4 py-3">Last active</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((u) => (
              <tr
                key={u.id}
                className="border-t border-white/[0.06] transition hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-100">{u.email}</div>
                  <div className="text-xs text-slate-400">
                    {u.firstName} {u.lastName}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-200">{u.callCredits}</td>
                <td className="px-4 py-3 text-slate-200">{u.sessionCount}</td>
                <td className="px-4 py-3 text-slate-200">{u.totalAiUsage}</td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {u.lastActiveAtUtc
                    ? new Date(u.lastActiveAtUtc).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={page * 20 >= data.totalCount}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
        >
          Next
        </button>
        <span className="text-slate-400">
          Page {page} · {data.totalCount} total
        </span>
      </div>
    </div>
  );
}

function SubscriptionsPage({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<AdminSubscriptionSummary | null>(null);
  useEffect(() => {
    getAdminSubscriptions(from, to).then(setData);
  }, [from, to]);
  if (!data) return <div className="text-slate-400">Loading…</div>;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <KpiCard label="Paying users (range)" value={data.totalPayingUsers} />
      <KpiCard
        label="Revenue USD"
        value={`$${data.revenueUsdInRange.toFixed(2)}`}
      />
      <KpiCard
        label="Free → paid %"
        value={`${data.freeToPaidConversionPercent.toFixed(1)}%`}
      />
      <KpiCard
        label="Popular product"
        value={formatAdminProductId(data.mostPopularProductId)}
      />
      <div className="md:col-span-2 orio-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/20">
        <div className="text-sm font-bold text-slate-100">By product</div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {Object.entries(data.productPurchaseCounts).map(([k, v]) => (
            <li
              key={k}
              className="flex justify-between gap-4 border-b border-white/[0.06] pb-2 last:border-0 last:pb-0"
            >
              <span>{formatAdminProductId(k)}</span>
              <span className="shrink-0 font-semibold tabular-nums text-slate-100">
                {v}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function UsagePage({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<AdminUsageSummary | null>(null);
  useEffect(() => {
    getAdminUsage(from, to).then(setData);
  }, [from, to]);
  if (!data) return <div className="text-slate-400">Loading…</div>;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Sessions" value={data.totalSessions} />
        <KpiCard
          label="Est. minutes"
          value={Math.round(data.totalMinutesEstimated)}
        />
        <KpiCard
          label="Avg / user"
          value={data.avgSessionsPerUser.toFixed(2)}
        />
      </div>
      <div className="orio-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/25">
        <div className="text-sm font-bold text-slate-100">Top events</div>
        <ul className="mt-3 max-h-64 overflow-auto text-sm">
          {data.featureEvents.map((e) => (
            <li
              key={e.eventType}
              className="flex justify-between gap-4 border-b border-white/[0.06] py-2 last:border-0"
            >
              <span className="text-slate-300">
                {formatAdminEventType(e.eventType)}
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-slate-100">
                {e.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {data.sessionsByHourUtc.length > 0 ? (
        <div className="orio-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/25">
          <div className="text-sm font-bold text-slate-100">
            Sessions by hour (UTC)
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.sessionsByHourUtc.map((h) => ({
                  label: `${String(h.hourUtc).padStart(2, "0")}:00`,
                  count: h.count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={ADMIN_CHART_GRID} />
                <XAxis
                  dataKey="label"
                  tick={{ ...adminChartTick, fontSize: 10 }}
                  stroke="rgba(148,163,184,0.35)"
                  interval={2}
                />
                <YAxis
                  tick={adminChartTick}
                  stroke="rgba(148,163,184,0.35)"
                  allowDecimals={false}
                />
                <Tooltip {...adminChartTooltip} />
                <Bar
                  dataKey="count"
                  fill="#2dd4bf"
                  radius={[4, 4, 0, 0]}
                  name="Sessions"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AiPage({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<AdminAiMetrics | null>(null);
  useEffect(() => {
    getAdminAiMetrics(from, to).then(setData);
  }, [from, to]);
  if (!data) return <div className="text-slate-400">Loading…</div>;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Requests" value={data.totalRequests} />
        <KpiCard label="Avg latency ms" value={data.avgLatencyMs.toFixed(0)} />
        <KpiCard
          label="Error rate %"
          value={data.errorRatePercent.toFixed(2)}
        />
        <KpiCard label="Input tokens" value={data.totalInputTokens} />
        <KpiCard label="Output tokens" value={data.totalOutputTokens} />
        <KpiCard
          label="Est. cost USD"
          value={`$${data.totalCostUsdEstimate.toFixed(4)}`}
        />
      </div>
    </div>
  );
}

function FunnelPage({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<AdminFunnel | null>(null);
  useEffect(() => {
    getAdminFunnel(from, to).then(setData);
  }, [from, to]);
  if (!data) return <div className="text-slate-400">Loading…</div>;
  return (
    <div className="space-y-3">
      {data.steps.map((s) => (
        <div
          key={s.key}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--orio-surface)]/80 px-4 py-3 shadow-md shadow-black/20 backdrop-blur-sm"
        >
          <div>
            <div className="font-semibold text-slate-100">{s.label}</div>
            <div className="text-xs text-slate-400">
              {humanizeAdminIdentifier(s.key)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-violet-300">{s.count}</div>
            <div className="text-xs text-slate-400">
              {s.conversionFromPreviousPercent.toFixed(1)}% vs prev
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedbackPage({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<AdminPaged<AdminFeedbackRow> | null>(null);
  useEffect(() => {
    getAdminFeedback(from, to, 1, 50).then(setData);
  }, [from, to]);
  if (!data) return <div className="text-slate-400">Loading…</div>;
  return (
    <div className="space-y-4">
      {data.items.map((f) => (
        <div
          key={f.id}
          className="orio-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/25"
        >
          <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-400">
            <span>{f.userEmail}</span>
            <span>{new Date(f.createdAtUtc).toLocaleString()}</span>
          </div>
          {(f.rating != null || f.sentimentTags) && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-violet-300/90">
              {f.rating != null ? <span>Rating: {f.rating}/5</span> : null}
              {f.sentimentTags ? (
                <span>{formatAdminSentimentTags(f.sentimentTags)}</span>
              ) : null}
            </div>
          )}
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
            {f.message}
          </p>
        </div>
      ))}
    </div>
  );
}

function SystemPage({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<AdminSystemMetrics | null>(null);
  useEffect(() => {
    getAdminSystemMetrics(from, to).then(setData);
  }, [from, to]);
  if (!data) return <div className="text-slate-400">Loading…</div>;
  return (
    <div className="space-y-4">
      <KpiCard label="Server-tagged errors" value={data.serverErrorEvents} />
      <KpiCard label="Client-tagged errors" value={data.clientErrorEvents} />
      <KpiCard
        label="Avg AI latency (success)"
        value={data.avgServerLatencyMsFromAiLogs.toFixed(0)}
      />
      <p className="text-sm text-slate-400">{data.note}</p>
    </div>
  );
}

export default function AdminApp() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const p = rangePresets();
  const [from, setFrom] = useState(p.from30);
  const [to, setTo] = useState(p.toIso);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userEmail = user?.email ?? "";

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="orio-workspace-bg relative flex h-dvh max-h-dvh min-h-0 w-full overflow-hidden">
      {mobileSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-white/10 bg-[var(--orio-elevated)]/92 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-full lg:max-h-dvh lg:min-h-0 lg:w-64 lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex min-h-[4.75rem] items-center gap-2.5 border-b border-white/10 px-3 py-2 sm:px-4 md:px-6">
          <Link
            to="/"
            onClick={() => {
              setMobileSidebarOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex min-w-0 flex-1 items-center gap-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-teal-500/25">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8 2 6 5 6 8c0 2 1 4 2 5l-2 6h12l-2-6c1-1 2-3 2-5 0-3-2-6-6-6zm0 2c2.2 0 4 1.8 4 4 0 1.5-.8 3.2-1.5 4.5L14 18h-4l-.5-5.5C8.8 11.2 8 9.5 8 8c0-2.2 1.8-4 4-4z" />
              </svg>
            </span>
            <span className="orio-font-display min-w-0 truncate text-base font-semibold text-slate-100">
              Smeed AI
            </span>
          </Link>
          <span className="hidden min-w-0 shrink-0 truncate rounded-md border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-200 sm:inline-block">
            Admin
          </span>
          <button
            type="button"
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <AdminNav onNavigate={() => setMobileSidebarOpen(false)} />

        <div className="mt-auto space-y-1 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => {
              setMobileSidebarOpen(false);
              navigate("/dashboard");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <span className="shrink-0 text-slate-500">
              <IconHome />
            </span>
            User dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/profile")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <span className="shrink-0 text-slate-500">
              <IconUser />
            </span>
            <span className="truncate">{userEmail}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="mt-2 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex min-h-[4.75rem] shrink-0 flex-col gap-3 border-b border-white/10 bg-[var(--orio-elevated)]/88 px-3 py-2 backdrop-blur-xl sm:px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="shrink-0 rounded-lg p-2 hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex min-w-0 flex-col justify-center gap-0.5 py-0.5">
              <h1 className="orio-font-display truncate text-base font-semibold leading-tight text-slate-100 sm:text-lg">
                {adminPageTitleFromPath(location.pathname)}
              </h1>
              <p className="text-xs leading-snug text-slate-400 sm:text-sm">
                Analytics and operations · Aurora Stealth
              </p>
            </div>
          </div>
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 md:max-w-[min(100%,42rem)] lg:max-w-none">
            <DateRangeControl
              from={from}
              to={to}
              onChange={(f, t) => {
                setFrom(f);
                setTo(t);
              }}
            />
          </div>
        </header>

        <main
          id="admin-main-scroll"
          className="orio-app-scroll flex min-h-0 flex-1 flex-col overflow-auto overscroll-y-contain bg-[var(--orio-void)]/35"
        >
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6 md:pt-6">
            <Routes>
              <Route index element={<DashboardPage from={from} to={to} />} />
              <Route
                path="users"
                element={<UsersAdminPage from={from} to={to} />}
              />
              <Route
                path="subscriptions"
                element={<SubscriptionsPage from={from} to={to} />}
              />
              <Route path="usage" element={<UsagePage from={from} to={to} />} />
              <Route path="ai" element={<AiPage from={from} to={to} />} />
              <Route
                path="funnel"
                element={<FunnelPage from={from} to={to} />}
              />
              <Route
                path="feedback"
                element={<FeedbackPage from={from} to={to} />}
              />
              <Route path="system" element={<SystemPage from={from} to={to} />} />
              <Route path="*" element={<NotFoundPage scope="admin" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
