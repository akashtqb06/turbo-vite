import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { PageHeader } from "../components/PageHeader";
import { NAV_SECTIONS } from "../config/navSections";
import { TrendingUp, Users, Star, ShoppingCart } from "lucide-react";

const stats = [
  { label: "Components", value: "48", delta: "8 new", icon: Star },
  { label: "Downloads",  value: "12.4k", delta: "+34% MoM", icon: TrendingUp },
  { label: "Contributors", value: "14", delta: "Active", icon: Users },
  { label: "Packages", value: "5", delta: "Monorepo", icon: ShoppingCart },
];

export function OverviewPage() {
  const components = NAV_SECTIONS.find((s) => s.group === "Components")?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A comprehensive React component library built with Tailwind CSS and Radix UI — fully theme-aware."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        {stats.map(({ label, value, delta, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">{label}</CardDescription>
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-3" />
                </span>
              </div>
              <CardTitle className="text-xl">{value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-[10px]">{delta}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links to all sections */}
      <h2 className="text-sm font-semibold mb-3">Browse Components</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {components.map(({ label, href, icon: Icon }) => (
          <Link key={href} to={href}>
            <Card className="group hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer">
              <CardHeader className="py-4">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-4" />
                </span>
                <CardTitle className="text-xs mt-2">{label}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Callout */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
        <p className="text-sm font-semibold text-primary">💡 Theme-aware by default</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Every component reacts to the active colour palette and light/dark mode in real time.
          Use the account menu in the top-right corner to switch themes.
        </p>
      </div>
    </div>
  );
}
