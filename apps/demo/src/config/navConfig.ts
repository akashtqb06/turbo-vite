import type React from "react";

// ─── Nav types ────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface NavSection {
  group: string;
  items: NavItem[];
}
