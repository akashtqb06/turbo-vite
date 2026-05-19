/**
 * @module @repo/store/slices/notifications
 *
 * Redux slice for the in-app notification center.
 *
 * Responsibilities:
 * - Maintains an ordered list of notifications with read/unread state.
 * - Provides actions to add, dismiss, and bulk-clear notifications.
 * - Exposes `unreadCount` for badge indicators in the UI.
 *
 * Note: Notifications are in-memory only — they reset on page reload.
 * For persistent notifications, integrate with a backend endpoint via RTK Query.
 */

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ── Types ─────────────────────────────────────────────────────────────────────

export type NotificationType = "info" | "success" | "warning" | "error";

/** A single in-app notification entry. */
export interface Notification {
  /** Auto-generated UUID — set by the slice, not the caller. */
  id: string;
  /** Visual style of the notification. */
  type: NotificationType;
  /** Short notification title shown in the notification center. */
  title: string;
  /** Optional longer description. */
  message?: string;
  /** Whether the user has acknowledged (read) this notification. */
  read: boolean;
  /** ISO 8601 timestamp of when the notification was added. */
  createdAt: string;
}

/** Input payload for adding a new notification. The `id`, `read`, and `createdAt` are auto-assigned. */
export type NewNotification = Pick<Notification, "type" | "title" | "message">;

// ── Entity adapter ────────────────────────────────────────────────────────────

/**
 * EntityAdapter normalises notifications by `id` for O(1) lookups.
 * Sorted newest-first so the notification panel shows the latest at the top.
 */
const notificationsAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

/** Helper for constructing state with adapter defaults. */
export type NotificationsState = ReturnType<typeof notificationsAdapter.getInitialState>;

// ── Slice ─────────────────────────────────────────────────────────────────────

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    /**
     * Adds a new notification to the store with an auto-generated id and timestamp.
     *
     * @example
     * dispatch(addNotification({ type: "success", title: "Saved!", message: "Changes saved." }));
     */
    addNotification(state, action: PayloadAction<NewNotification>) {
      const notification: Notification = {
        id:        crypto.randomUUID(),
        type:      action.payload.type,
        title:     action.payload.title,
        message:   action.payload.message,
        read:      false,
        createdAt: new Date().toISOString(),
      };
      notificationsAdapter.addOne(state, notification);
    },

    /**
     * Marks a single notification as read by its ID.
     */
    markAsRead(state, action: PayloadAction<string>) {
      notificationsAdapter.updateOne(state, { id: action.payload, changes: { read: true } });
    },

    /**
     * Marks ALL notifications as read.
     * Useful for a "Mark all as read" action in the notification panel.
     */
    markAllAsRead(state) {
      const updates = state.ids.map((id) => ({ id, changes: { read: true } }));
      notificationsAdapter.updateMany(state, updates);
    },

    /**
     * Removes a single notification by its ID.
     */
    removeNotification(state, action: PayloadAction<string>) {
      notificationsAdapter.removeOne(state, action.payload);
    },

    /**
     * Removes all notifications from the store.
     */
    clearNotifications(state) {
      notificationsAdapter.removeAll(state);
    },
  },
});

// ── Exports ───────────────────────────────────────────────────────────────────

export const notificationsActions = notificationsSlice.actions;
export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
} = notificationsSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export interface RootStateWithNotifications {
  notifications: NotificationsState;
}

/** Base selectors from the entity adapter (selectAll, selectById, selectTotal, etc.) */
export const notificationsSelectors = notificationsAdapter.getSelectors(
  (state: RootStateWithNotifications) => state.notifications,
);

/** All notifications, sorted newest-first. */
export const selectNotifications = notificationsSelectors.selectAll;

/** Total notification count. */
export const selectNotificationCount = notificationsSelectors.selectTotal;

/** Count of unread notifications — used for badge indicators. */
export const selectUnreadCount = (state: RootStateWithNotifications): number =>
  notificationsSelectors.selectAll(state).filter((n) => !n.read).length;

/** All unread notifications only. */
export const selectUnreadNotifications = (state: RootStateWithNotifications): Notification[] =>
  notificationsSelectors.selectAll(state).filter((n) => !n.read);

export default notificationsSlice.reducer;
