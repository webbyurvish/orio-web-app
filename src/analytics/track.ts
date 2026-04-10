import apiClient from "../api/client";

const queue: { eventType: string; metadataJson?: string; callSessionId?: string }[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushAnalytics();
  }, 1200);
}

async function flushAnalytics() {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  try {
    await apiClient.post("/analytics/events", {
      events: batch.map((e) => ({
        eventType: e.eventType,
        metadataJson: e.metadataJson,
        callSessionId: e.callSessionId,
        source: "web",
      })),
    });
  } catch {
    queue.unshift(...batch);
  }
}

export function trackWeb(
  eventType: string,
  metadata?: Record<string, unknown>,
  callSessionId?: string,
) {
  const metadataJson = metadata ? JSON.stringify(metadata) : undefined;
  queue.push({ eventType, metadataJson, callSessionId });
  scheduleFlush();
}

export const AnalyticsEvents = {
  DashboardViewed: "DASHBOARD_VIEWED",
  SessionCreateOpened: "SESSION_CREATE_OPENED",
  AnalyzeClicked: "ANALYZE_CLICKED",
} as const;
