import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { Badge } from "@repo/ui/components/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import { NAV_SECTIONS } from "../config/navSections";

// ─── Sidebar component ────────────────────────────────────────────────────────
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AppSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        "flex h-14 items-center border-b border-border px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-md bg-primary transition-colors" />
            <span className="text-sm font-bold tracking-tight">UI Showcase</span>
          </div>
        )}
        {collapsed && <span className="size-6 rounded-md bg-primary transition-colors" />}
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-7 shrink-0", collapsed && "mx-auto")}
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronLeft className="size-3.5" />
          )}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.group} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70">
                {section.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map(({ label, href, icon: Icon }) => {
                const isActive = href === "/"
                  ? location.pathname === "/"
                  : location.pathname === href;
                return (
                  <li key={href}>
                    <NavLink
                      to={href}
                      onClick={onMobileClose}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                        "hover:bg-muted/70 hover:text-foreground",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <Icon className={cn("shrink-0 size-3.5", isActive && "text-primary")} />
                      {!collapsed && <span>{label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            {!collapsed && <Separator className="mt-4" />}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-2">
            <span className="size-5 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary">v1</span>
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-medium truncate">@repo/ui</p>
              <p className="text-[9px] text-muted-foreground">Component Library</p>
            </div>
            <Badge variant="secondary" className="ml-auto text-[9px] px-1 py-0">beta</Badge>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-background transition-all duration-200 ease-in-out",
          collapsed ? "w-12" : "w-52"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 h-full w-52 bg-background border-r border-border shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

// Mobile menu button
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" className="lg:hidden size-8" onClick={onClick}>
      <Menu className="size-4" />
    </Button>
  );
}
