import { useTheme } from "@repo/ui/hooks/useTheme";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { Switch } from "@repo/ui/components/ui/switch";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { Input } from "@repo/ui/components/ui/input";
import {
  Sun,
  Moon,
  Palette,
  Check,
  Bell,
  Settings,
  Search,
  Star,
  TrendingUp,
  Users,
  ShoppingCart,
} from "lucide-react";

// ─── Theme palette swatch colours (one per theme) ────────────────────────────
const THEME_SWATCHES: Record<string, { light: string; dark: string }> = {
  default: { light: "#171717", dark: "#ebebeb" },
  ocean:   { light: "#2563c4", dark: "#60a5fa" },
  rose:    { light: "#be3a55", dark: "#f472b6" },
  slate:   { light: "#475569", dark: "#94a3b8" },
};

// ─── Theme Switcher Panel ─────────────────────────────────────────────────────
function ThemeSwitcher() {
  const { themes, activeTheme, mode, setTheme, toggleMode, isLoading } = useTheme();

  const swatch = activeTheme
    ? (THEME_SWATCHES[activeTheme.id] ?? { light: "#000", dark: "#fff" })
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-primary" />
            <CardTitle>Theme</CardTitle>
          </div>
          {activeTheme && (
            <Badge variant="outline">{activeTheme.label}</Badge>
          )}
        </div>
        <CardDescription>
          Choose a colour palette and toggle light / dark mode.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dark mode toggle */}
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            {mode === "dark" ? (
              <Moon className="size-3.5 text-primary" />
            ) : (
              <Sun className="size-3.5 text-primary" />
            )}
            {mode === "dark" ? "Dark mode" : "Light mode"}
          </div>
          <Switch
            id="dark-mode-toggle"
            checked={mode === "dark"}
            onCheckedChange={toggleMode}
          />
        </div>

        <Separator />

        {/* Theme palette grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => {
              const sw = THEME_SWATCHES[theme.id] ?? { light: "#000", dark: "#fff" };
              const isActive = activeTheme?.id === theme.id;
              return (
                <button
                  key={theme.id}
                  id={`theme-btn-${theme.id}`}
                  onClick={() => setTheme(theme.id)}
                  className={[
                    "group relative flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-all",
                    "hover:border-primary/50 hover:bg-muted/50",
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border",
                  ].join(" ")}
                >
                  {/* Colour swatch */}
                  <div className="flex gap-1">
                    <span
                      className="size-4 rounded-full ring-1 ring-border"
                      style={{ background: sw.light }}
                    />
                    <span
                      className="size-4 rounded-full ring-1 ring-border"
                      style={{ background: sw.dark }}
                    />
                  </div>

                  <span className="text-xs font-medium">{theme.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {theme.description}
                  </span>

                  {/* Active check */}
                  {isActive && (
                    <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Live swatch preview */}
        {swatch && (
          <>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Colour preview</p>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: "Primary",     bg: "bg-primary",     fg: "text-primary-foreground" },
                  { label: "Secondary",   bg: "bg-secondary",   fg: "text-secondary-foreground" },
                  { label: "Accent",      bg: "bg-accent",      fg: "text-accent-foreground" },
                  { label: "Muted",       bg: "bg-muted",       fg: "text-muted-foreground" },
                  { label: "Destructive", bg: "bg-destructive/20", fg: "text-destructive" },
                ].map(({ label, bg, fg }) => (
                  <span
                    key={label}
                    className={`${bg} ${fg} rounded px-2 py-0.5 text-[10px] font-medium`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Stats cards ─────────────────────────────────────────────────────────────
function StatsRow() {
  const stats = [
    { label: "Total Users",    value: "24,521",  delta: "+12%",  icon: Users,        trend: "up" },
    { label: "Revenue",        value: "$84,200",  delta: "+8.3%", icon: TrendingUp,   trend: "up" },
    { label: "Orders",         value: "1,340",    delta: "+5.1%", icon: ShoppingCart, trend: "up" },
    { label: "Rating",         value: "4.9 / 5",  delta: "+0.2",  icon: Star,         trend: "up" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map(({ label, value, delta, icon: Icon }) => (
        <Card key={label}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>{label}</CardDescription>
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-3.5" />
              </span>
            </div>
            <CardTitle className="text-xl">{value}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="size-2.5" />
              {delta} this month
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Component showcase ───────────────────────────────────────────────────────
function ComponentShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Showcase</CardTitle>
        <CardDescription>
          All components automatically reflect the active theme.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buttons</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <Separator />

        {/* Badges */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Badges</p>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>

        <Separator />

        {/* Input */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Input</p>
          <Input
            prefix={<Search className="size-3.5" />}
            placeholder="Search anything…"
          />
        </div>

        <Separator />

        {/* Avatars */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avatars</p>
          <div className="flex gap-2 items-center">
            {["AK", "MR", "SJ", "LT"].map((init) => (
              <Avatar key={init}>
                <AvatarFallback>{init}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

// ─── Notification sample card ─────────────────────────────────────────────────
function NotificationsCard() {
  const notifications = [
    { title: "New deployment",     desc: "v2.4.1 shipped to production",  time: "2m ago",  read: false },
    { title: "Pull request merged", desc: "feat: add theme switcher",      time: "18m ago", read: false },
    { title: "Build passed",       desc: "CI pipeline completed in 42s",  time: "1h ago",  read: true  },
    { title: "New comment",        desc: "Alice commented on your issue", time: "3h ago",  read: true  },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-primary" />
          <CardTitle>Notifications</CardTitle>
          <Badge className="ml-auto">2</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 p-0">
        {notifications.map(({ title, desc, time, read }, i) => (
          <div key={i}>
            <div
              className={[
                "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                !read && "bg-primary/5",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {!read && (
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              )}
              {read && <span className="mt-1.5 size-1.5 shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">{title}</p>
                <p className="text-[11px] text-muted-foreground truncate">{desc}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">{time}</span>
            </div>
            {i < notifications.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ThemePage() {
  const { activeTheme, mode } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Top nav */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-6 rounded-md bg-primary" />
            <span className="text-sm font-semibold">Acme Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            {activeTheme && (
              <Badge variant="outline" className="hidden sm:inline-flex gap-1">
                <Palette className="size-2.5" />
                {activeTheme.label}
                {" · "}
                {mode === "dark" ? "Dark" : "Light"}
              </Badge>
            )}
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="size-4" />
            </Button>
            <Avatar size="sm">
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">

        {/* Heading */}
        <div>
          <h1 className="text-lg font-semibold font-heading">Theme Demo</h1>
          <p className="text-xs text-muted-foreground">
            Switch themes and modes — every component updates in real time.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

          {/* Left column */}
          <div className="space-y-6">
            <StatsRow />

            <Tabs defaultValue="components">
              <TabsList>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="components" className="mt-4">
                <ComponentShowcase />
              </TabsContent>

              <TabsContent value="notifications" className="mt-4">
                <NotificationsCard />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column — theme switcher */}
          <aside className="space-y-4">
            <ThemeSwitcher />
          </aside>
        </div>
      </main>
    </div>
  );
}
