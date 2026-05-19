import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { PageHeader, SectionBlock } from "../components/PageHeader";
import { ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@repo/ui/components/ui/dropdown-menu";

const COLUMNS = ["Name", "Status", "Role", "Projects", "Joined", ""];
const ROWS = [
  { name: "Akash Kumar",   init: "AK", status: "active",   role: "Admin",   projects: 12, joined: "Jan 2024" },
  { name: "Mira Rashid",  init: "MR", status: "active",   role: "Editor",  projects: 8,  joined: "Mar 2024" },
  { name: "Sam Johnson",  init: "SJ", status: "away",     role: "Viewer",  projects: 3,  joined: "Jun 2024" },
  { name: "Lily Torres",  init: "LT", status: "offline",  role: "Editor",  projects: 6,  joined: "Sep 2024" },
  { name: "Pete Walsh",   init: "PW", status: "active",   role: "Admin",   projects: 15, joined: "Feb 2024" },
  { name: "Zara Ahmed",   init: "ZA", status: "inactive", role: "Viewer",  projects: 1,  joined: "Nov 2024" },
];

const STATUS_BADGE: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
  active:   { variant: "default",     label: "Active" },
  away:     { variant: "secondary",   label: "Away" },
  offline:  { variant: "outline",     label: "Offline" },
  inactive: { variant: "destructive", label: "Inactive" },
};

export function TablePage() {
  return (
    <div>
      <PageHeader
        title="Table"
        description="Data tables with sortable columns, row actions, and pagination."
      />
      <div className="space-y-8">

        <SectionBlock title="Team members" description="Sortable table with contextual row actions.">
          <div className="rounded-lg border border-border overflow-hidden">
            {/* Table header */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {COLUMNS.map((col) => (
                      <th key={col} className="px-4 py-2.5 text-left font-semibold text-muted-foreground">
                        {col && (
                          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                            {col}
                            {col && col !== "" && <ArrowUpDown className="size-3 opacity-50" />}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => {
                    const s = STATUS_BADGE[row.status];
                    return (
                      <tr key={row.init} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-6">
                              <AvatarFallback className="text-[9px]">{row.init}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{row.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={s.variant} className="text-[10px]">{s.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{row.role}</td>
                        <td className="px-4 py-3 tabular-nums text-muted-foreground">{row.projects}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.joined}</td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-6">
                                <MoreHorizontal className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem>View profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit role</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium">1–{ROWS.length}</span> of <span className="font-medium">{ROWS.length}</span> members
              </p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-7" disabled>
                  <ChevronLeft className="size-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="size-7 text-xs">1</Button>
                <Button variant="ghost" size="icon" className="size-7" disabled>
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Simple list" description="Compact read-only data list.">
          <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
            {[
              { label: "Plan",        value: "Pro ($12/mo)" },
              { label: "Billing",     value: "Monthly — next charge Apr 1" },
              { label: "Members",     value: "6 / 20 seats used" },
              { label: "Storage",     value: "12 GB / 50 GB used" },
              { label: "API calls",   value: "48,200 / 100,000 this month" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3 text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </SectionBlock>

      </div>
    </div>
  );
}
