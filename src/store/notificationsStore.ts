import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationKind =
  | "summary"
  | "credits"
  | "billing"
  | "session"
  | "system";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  /** If set, a second add with the same key is ignored (deduplication). */
  dedupeKey?: string;
  href?: string;
};

const MAX_ITEMS = 50;

function randomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

type NotificationsState = {
  items: AppNotification[];
  add: (input: {
    kind: NotificationKind;
    title: string;
    body: string;
    dedupeKey?: string;
    href?: string;
  }) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (input) => {
        const { dedupeKey } = input;
        if (dedupeKey) {
          const exists = get().items.some((i) => i.dedupeKey === dedupeKey);
          if (exists) return;
        }
        const n: AppNotification = {
          id: randomId(),
          kind: input.kind,
          title: input.title,
          body: input.body,
          createdAt: Date.now(),
          read: false,
          dedupeKey,
          href: input.href,
        };
        set((s) => ({
          items: [n, ...s.items].slice(0, MAX_ITEMS),
        }));
      },
      markRead: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
        })),
      markAllRead: () =>
        set((s) => ({
          items: s.items.map((i) => ({ ...i, read: true })),
        })),
      dismiss: (id) =>
        set((s) => ({
          items: s.items.filter((i) => i.id !== id),
        })),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: "smeed-app-notifications",
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export function selectUnreadCount(items: AppNotification[]) {
  return items.filter((i) => !i.read).length;
}
