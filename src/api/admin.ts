import apiClient from "./client";

/** Downloads CSV using the current auth token (Authorization header). */
export async function downloadAdminEventsCsv(fromUtc: string, toUtc: string, filename = "orio-events.csv") {
  const res = await apiClient.get("/admin/export/events.csv", {
    params: { fromUtc, toUtc },
    responseType: "blob",
  });
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function getAdminDashboard(fromUtc?: string, toUtc?: string) {
  const { data } = await apiClient.get<AdminDashboardResponse>("/admin/dashboard", {
    params: { fromUtc, toUtc },
  });
  return data;
}

export async function getAdminUsers(params: {
  fromUtc?: string;
  toUtc?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const { data } = await apiClient.get<AdminPaged<AdminUserRow>>("/admin/users", { params });
  return data;
}

export async function getAdminSubscriptions(fromUtc?: string, toUtc?: string) {
  const { data } = await apiClient.get<AdminSubscriptionSummary>("/admin/subscriptions", {
    params: { fromUtc, toUtc },
  });
  return data;
}

export async function getAdminUsage(fromUtc?: string, toUtc?: string) {
  const { data } = await apiClient.get<AdminUsageSummary>("/admin/usage", {
    params: { fromUtc, toUtc },
  });
  return data;
}

export async function getAdminAiMetrics(fromUtc?: string, toUtc?: string) {
  const { data } = await apiClient.get<AdminAiMetrics>("/admin/ai-metrics", {
    params: { fromUtc, toUtc },
  });
  return data;
}

export async function getAdminFunnel(fromUtc?: string, toUtc?: string) {
  const { data } = await apiClient.get<AdminFunnel>("/admin/funnel", {
    params: { fromUtc, toUtc },
  });
  return data;
}

export async function getAdminFeedback(
  fromUtc?: string,
  toUtc?: string,
  page = 1,
  pageSize = 25,
) {
  const { data } = await apiClient.get<AdminPaged<AdminFeedbackRow>>("/admin/feedback", {
    params: { fromUtc, toUtc, page, pageSize },
  });
  return data;
}

export async function getAdminSystemMetrics(fromUtc?: string, toUtc?: string) {
  const { data } = await apiClient.get<AdminSystemMetrics>("/admin/system-metrics", {
    params: { fromUtc, toUtc },
  });
  return data;
}

export interface AdminTimePoint {
  date: string;
  value: number;
}

export interface AdminDashboardResponse {
  kpis: {
    totalUsers: number;
    newUsersInRange: number;
    dau: number;
    wau: number;
    mau: number;
    totalSessions: number;
    sessionsInRange: number;
    avgSessionMinutes: number;
    totalAiAnswers: number;
    revenueUsdInRange: number;
    mrrUsdEstimate: number;
    signupToPaidConversionPercent: number;
  };
  userGrowthDaily: AdminTimePoint[];
  sessionsDaily: AdminTimePoint[];
  revenueDailyUsd: AdminTimePoint[];
  cohort: {
    retentionDay1Percent: number;
    retentionDay7Percent: number;
    retentionDay30Percent: number;
    churnRateMonthlyPercent: number;
  };
}

export interface AdminPaged<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface AdminUserRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastActiveAtUtc?: string | null;
  callCredits: number;
  sessionCount: number;
  totalAiUsage: number;
}

export interface AdminSubscriptionSummary {
  totalPayingUsers: number;
  productPurchaseCounts: Record<string, number>;
  mostPopularProductId?: string | null;
  revenueUsdInRange: number;
  mrrUsdEstimate: number;
  freeToPaidConversionPercent: number;
  cancellationsInRange: number;
  renewalsInRange: number;
}

export interface AdminUsageSummary {
  totalSessions: number;
  totalMinutesEstimated: number;
  avgSessionMinutes: number;
  avgSessionsPerUser: number;
  sessionsByHourUtc: { hourUtc: number; count: number }[];
  featureEvents: { eventType: string; count: number }[];
}

export interface AdminAiMetrics {
  totalRequests: number;
  avgLatencyMs: number;
  errorRatePercent: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsdEstimate: number;
  avgCostPerUserUsd: number;
  latencyDailyAvgMs: AdminTimePoint[];
}

export interface AdminFunnel {
  steps: {
    key: string;
    label: string;
    count: number;
    conversionFromPreviousPercent: number;
  }[];
}

export interface AdminFeedbackRow {
  id: string;
  userId: string;
  userEmail: string;
  message: string;
  rating?: number | null;
  sentimentTags?: string | null;
  createdAtUtc: string;
}

export interface AdminSystemMetrics {
  serverErrorEvents: number;
  clientErrorEvents: number;
  avgServerLatencyMsFromAiLogs: number;
  note: string;
}
