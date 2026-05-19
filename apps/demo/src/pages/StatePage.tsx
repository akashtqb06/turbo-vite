/**
 * StatePage — live showcase for @repo/store Redux slices.
 *
 * Demonstrates:
 * - auth slice: setCredentials / clearAuth
 * - notifications slice: addNotification, markAsRead, clearNotifications
 * - ui slice: setGlobalLoading, setPageTitle
 */

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { PageHeader } from "../components/PageHeader";

import {
  useAppSelector,
  setCredentials, clearAuth,
  addNotification, markAsRead, clearNotifications,
  setGlobalLoading, setPageTitle,
} from "@repo/store";
import type { NewNotification } from "@repo/store";

// ── Auth section ──────────────────────────────────────────────────────────────

function AuthSection() {
  const dispatch = useDispatch();
  const auth     = useAppSelector((s) => s.auth);
  const [email, setEmail]       = useState("demo@example.com");
  const [password, setPassword] = useState("secret");

  const handleLogin = () => {
    dispatch(setCredentials({
      user:         { id: "1", name: "Demo User", email },
      accessToken:  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-token",
      refreshToken: "demo-refresh-token",
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">auth slice</Badge>
          <CardTitle className="text-base">Authentication State</CardTitle>
        </div>
        <CardDescription>JWT token stored in sessionStorage, cleared on logout</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {auth.status === "authenticated" ? (
          <div className="space-y-3">
            <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm font-mono">
              <p><span className="text-muted-foreground">user:</span> {auth.user?.name}</p>
              <p><span className="text-muted-foreground">email:</span> {auth.user?.email}</p>
              <p className="truncate"><span className="text-muted-foreground">token:</span> {auth.token?.slice(0, 36)}…</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => dispatch(clearAuth())} aria-label="Log out">
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input value={email}    onChange={(e) => setEmail(e.target.value)}    aria-label="Email"    placeholder="Email" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Password" type="password" placeholder="Password" />
            <Button size="sm" onClick={handleLogin} aria-label="Log in">Login (mock)</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Notifications section ─────────────────────────────────────────────────────

function NotificationsSection() {
  const dispatch      = useDispatch();
  // Use the normalised entity map from the store
  const notifications = useAppSelector((s) => s.notifications);
  const items         = useAppSelector((s) =>
    s.notifications.ids.map((id) => s.notifications.entities[id]).filter(Boolean)
  );
  const unread = items.filter((n) => n && !n.read).length;

  const add = (type: NewNotification["type"]) => {
    dispatch(addNotification({
      type,
      title:   `${type.charAt(0).toUpperCase() + type.slice(1)} notification`,
      message: `A ${type} event occurred at ${new Date().toLocaleTimeString()}`,
    }));
  };

  // Silence unused variable warning — the normalised state is used via items above
  void notifications;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">notifications slice</Badge>
          <CardTitle className="text-base">Notification Center</CardTitle>
          {unread > 0 && <Badge>{unread} unread</Badge>}
        </div>
        <CardDescription>EntityAdapter-based — O(1) lookups, sorted newest-first, auto UUID</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["info", "success", "warning", "error"] as const).map((type) => (
            <Button key={type} size="sm" variant="outline"
              onClick={() => add(type)} aria-label={`Add ${type} notification`}>
              + {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
          <Button size="sm" variant="ghost"
            onClick={() => dispatch(clearNotifications())} aria-label="Clear all notifications">
            Clear all
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications yet. Add some above.</p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {items.map((n) => n && (
              <div key={n.id}
                className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm transition-opacity ${n.read ? "opacity-50" : ""}`}>
                <Badge
                  variant={n.type === "error" ? "destructive" : "secondary"}
                  className="mt-0.5 shrink-0 text-[10px]">
                  {n.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-muted-foreground truncate text-xs">{n.message}</p>
                </div>
                {!n.read && (
                  <Button size="sm" variant="ghost" className="text-xs h-6 px-2 shrink-0"
                    onClick={() => dispatch(markAsRead(n.id))}
                    aria-label={`Mark "${n.title}" as read`}>
                    Mark read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── UI slice section ──────────────────────────────────────────────────────────

function UISliceSection() {
  const dispatch    = useDispatch();
  const isLoading   = useAppSelector((s) => s.ui.globalLoading);
  const pageTitle   = useAppSelector((s) => s.ui.pageTitle);
  const [title, setTitle] = useState("State Management Demo");

  const triggerLoad = () => {
    dispatch(setGlobalLoading(true));
    setTimeout(() => dispatch(setGlobalLoading(false)), 1500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">ui slice</Badge>
          <CardTitle className="text-base">Global UI State</CardTitle>
        </div>
        <CardDescription>globalLoading, pageTitle, breadcrumbs — managed from any component</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Page title input"
            className="max-w-xs"
            placeholder="Page title…"
          />
          <Button size="sm" variant="outline"
            onClick={() => dispatch(setPageTitle(title))} aria-label="Set page title">
            Set Title
          </Button>
        </div>
        {pageTitle && (
          <p className="text-sm text-muted-foreground">
            Active title in Redux: <strong className="text-foreground">{pageTitle}</strong>
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={triggerLoad} disabled={isLoading} aria-label="Trigger global loading">
            {isLoading ? "Loading…" : "Trigger globalLoading (1.5s)"}
          </Button>
          {isLoading && (
            <Badge variant="secondary" className="animate-pulse">Loading active</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function StatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="State Management"
        description="Live demos of the Redux slices in @repo/store — auth, notifications, and global UI state, all managed centrally and shareable across every app in the monorepo."
      />
      <AuthSection />
      <NotificationsSection />
      <UISliceSection />
    </div>
  );
}
