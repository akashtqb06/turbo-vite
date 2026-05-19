import {
  LayoutGrid,
  MousePointerClick,
  FormInput,
  MessageSquare,
  BarChart2,
  Layers,
  Info,
  Sliders,
  Table2,
  Package,
  Database,
  Languages,
} from "lucide-react";
import type { NavSection } from "./navConfig";

export const NAV_SECTIONS: NavSection[] = [
  {
    group: "Getting Started",
    items: [
      { label: "Overview", href: "/", icon: LayoutGrid },
    ],
  },
  {
    group: "Components",
    items: [
      { label: "Buttons",          href: "/buttons",  icon: MousePointerClick },
      { label: "Inputs",           href: "/inputs",   icon: FormInput },
      { label: "Badges & Avatars", href: "/badges",   icon: Layers },
      { label: "Overlays",         href: "/overlays", icon: MessageSquare },
      { label: "Feedback",         href: "/feedback", icon: Info },
      { label: "Tabs",             href: "/tabs",     icon: Sliders },
      { label: "Table",            href: "/table",    icon: Table2 },
      { label: "Charts",           href: "/charts",   icon: BarChart2 },
    ],
  },
  {
    group: "Packages",
    items: [
      { label: "Hooks & Utils",    href: "/packages", icon: Package },
      { label: "State (Redux)",    href: "/state",    icon: Database },
      { label: "i18n",             href: "/i18n",     icon: Languages },
    ],
  },
];
