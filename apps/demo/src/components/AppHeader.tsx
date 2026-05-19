import { useLocation } from "react-router-dom";
import {
  Bell,
  Settings,
  Sun,
  Moon,
  Palette,
  Check,
  LogOut,
  User,
  ChevronsUpDown,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@repo/ui/hooks/useTheme";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Separator } from "@repo/ui/components/ui/separator";
import { Switch } from "@repo/ui/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { MobileMenuButton } from "./AppSidebar";
import { NAV_SECTIONS } from "../config/navSections";
import { cn } from "@repo/ui/lib/utils";
import { emitAppToast } from "@repo/ui/lib/toast";

// ─── Swatch colours ────────────────────────────────────────────────────────────
const SWATCHES: Record<string, { light: string; dark: string }> = {
  default: { light: "#171717", dark: "#ebebeb" },
  ocean:   { light: "#2563c4", dark: "#60a5fa" },
  rose:    { light: "#be3a55", dark: "#f472b6" },
  slate:   { light: "#475569", dark: "#94a3b8" },
};

// ─── Dynamic breadcrumbs from route ───────────────────────────────────────────
function DynamicBreadcrumbs() {
  const location = useLocation();
  const allItems = NAV_SECTIONS.flatMap((s) => s.items);
  const current = allItems.find((item) =>
    item.href === "/"
      ? location.pathname === "/"
      : location.pathname === item.href
  );
  const group = NAV_SECTIONS.find((s) =>
    s.items.some((i) => i.href === (current?.href ?? "/"))
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            UI Showcase
          </BreadcrumbLink>
        </BreadcrumbItem>
        {group && group.group !== "Getting Started" && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="text-muted-foreground text-xs">{group.group}</span>
            </BreadcrumbItem>
          </>
        )}
        {current && current.href !== "/" && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium text-xs">
                {current.label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {location.pathname === "/" && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium text-xs">
                Overview
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// ─── Account settings popover ─────────────────────────────────────────────────
function AccountPopover() {
  const { themes, activeTheme, mode, setTheme, toggleMode, isLoading } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar size="sm" className="size-7">
            <AvatarFallback className="text-[10px]">AK</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-[11px] font-semibold leading-none">Akash K.</p>
            <p className="text-[9px] text-muted-foreground leading-none mt-0.5">akash@example.com</p>
          </div>
          <ChevronsUpDown className="size-3 text-muted-foreground hidden sm:block" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-0 overflow-hidden">
        {/* User info header */}
        <div className="flex items-center gap-3 bg-muted/40 px-4 py-3 border-b border-border">
          <Avatar>
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">Akash Kumar</p>
            <p className="text-xs text-muted-foreground truncate">akash@example.com</p>
          </div>
          <Badge variant="secondary" className="ml-auto text-[10px] shrink-0">Free</Badge>
        </div>

        {/* Quick actions */}
        <div className="py-1">
          {[
            { label: "Profile",  icon: User,     shortcut: "⌘P", toast: { type: "info" as const,    title: "Profile",  description: "Opening your profile settings…" } },
            { label: "Settings", icon: Settings,  shortcut: "⌘,", toast: { type: "info" as const,    title: "Settings", description: "Opening workspace settings…" } },
          ].map(({ label, icon: Icon, shortcut, toast }) => (
            <button
              key={label}
              onClick={() => emitAppToast(toast)}
              className="flex w-full items-center gap-3 px-4 py-2 text-xs hover:bg-muted/60 transition-colors"
            >
              <Icon className="size-3.5 text-muted-foreground" />
              <span className="flex-1 text-left">{label}</span>
              <span className="text-[10px] text-muted-foreground">{shortcut}</span>
            </button>
          ))}
        </div>

        <Separator />

        {/* Appearance — dark mode */}
        <div className="px-4 py-3 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Appearance
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mode === "dark"
                ? <Moon className="size-3.5 text-primary" />
                : <Sun className="size-3.5 text-primary" />}
              <span className="text-xs font-medium">
                {mode === "dark" ? "Dark mode" : "Light mode"}
              </span>
            </div>
            <Switch
              id="account-dark-mode"
              checked={mode === "dark"}
              onCheckedChange={toggleMode}
            />
          </div>
        </div>

        <Separator />

        {/* Theme picker */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="size-3 text-muted-foreground" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Colour theme
            </p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {themes.map((theme) => {
                const sw = SWATCHES[theme.id] ?? { light: "#000", dark: "#fff" };
                const isActive = activeTheme?.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={cn(
                      "relative flex items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs transition-all hover:border-primary/40 hover:bg-muted/50",
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border"
                    )}
                  >
                    <div className="flex gap-0.5">
                      <span className="size-3 rounded-full ring-1 ring-border" style={{ background: sw.light }} />
                      <span className="size-3 rounded-full ring-1 ring-border" style={{ background: sw.dark }} />
                    </div>
                    <span className="flex-1 font-medium truncate">{theme.label}</span>
                    {isActive && (
                      <Check className="size-3 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Sign out */}
        <div className="py-1">
          <button
            onClick={() => emitAppToast({ type: "warning", title: "Signed out", description: "You have been signed out of your account." })}
            className="flex w-full items-center gap-3 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Notification popover ─────────────────────────────────────────────────────
const NOTIFS = [
  { title: "New deployment", desc: "v2.4.1 shipped to production", time: "2m", unread: true },
  { title: "PR merged", desc: "feat: add theme switcher", time: "18m", unread: true },
  { title: "Build passed", desc: "CI pipeline completed in 42s", time: "1h", unread: false },
];

function NotifPopover() {
  const unreadCount = NOTIFS.filter((n) => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative size-8">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold">Notifications</p>
          <Badge variant="secondary" className="text-[10px]">{unreadCount} new</Badge>
        </div>
        <div>
          {NOTIFS.map((n, i) => (
            <div key={i}>
              <div className={cn(
                "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                n.unread && "bg-primary/5"
              )}>
                {n.unread
                  ? <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  : <span className="mt-1.5 size-1.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{n.desc}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
              </div>
              {i < NOTIFS.length - 1 && <Separator />}
            </div>
          ))}
        </div>
        <div className="border-t border-border px-4 py-2">
          <button className="text-xs text-primary hover:underline">View all notifications</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Main header ──────────────────────────────────────────────────────────────
interface AppHeaderProps {
  onMobileMenuOpen: () => void;
}

export function AppHeader({ onMobileMenuOpen }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-md px-4 gap-3">
      {/* Mobile menu trigger */}
      <MobileMenuButton onClick={onMobileMenuOpen} />

      {/* Breadcrumbs */}
      <div className="flex-1 min-w-0">
        <DynamicBreadcrumbs />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Settings className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <NotifPopover />

        <Separator orientation="vertical" className="h-6 mx-1" />

        <AccountPopover />
      </div>
    </header>
  );
}
