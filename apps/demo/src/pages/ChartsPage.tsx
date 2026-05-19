import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
} from "@repo/ui/components/ui/chart";
import type { ChartConfig } from "@repo/ui/components/ui/chart";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import { PageHeader, SectionBlock } from "../components/PageHeader";

// ─── Data ─────────────────────────────────────────────────────────────────────
const areaData = [
  { month: "Jan", revenue: 4200, users: 2400 },
  { month: "Feb", revenue: 5800, users: 3100 },
  { month: "Mar", revenue: 5200, users: 2900 },
  { month: "Apr", revenue: 7800, users: 4300 },
  { month: "May", revenue: 6900, users: 3800 },
  { month: "Jun", revenue: 9100, users: 5200 },
];
const areaConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--color-primary)" },
  users:   { label: "Users",   color: "var(--color-secondary)" },
};

const barData = [
  { week: "Mon", sales: 120, returns: 18 },
  { week: "Tue", sales: 98,  returns: 11 },
  { week: "Wed", sales: 145, returns: 22 },
  { week: "Thu", sales: 87,  returns: 9  },
  { week: "Fri", sales: 178, returns: 31 },
  { week: "Sat", sales: 210, returns: 27 },
  { week: "Sun", sales: 155, returns: 14 },
];
const barConfig: ChartConfig = {
  sales:   { label: "Sales",   color: "var(--color-primary)" },
  returns: { label: "Returns", color: "var(--color-destructive)" },
};

const lineData = [
  { month: "Jan", a: 65, b: 40 },
  { month: "Feb", a: 72, b: 55 },
  { month: "Mar", a: 68, b: 61 },
  { month: "Apr", a: 85, b: 70 },
  { month: "May", a: 79, b: 74 },
  { month: "Jun", a: 95, b: 82 },
];
const lineConfig: ChartConfig = {
  a: { label: "Product A", color: "var(--color-primary)" },
  b: { label: "Product B", color: "var(--color-accent)" },
};

const pieData = [
  { name: "Direct",   value: 38 },
  { name: "Organic",  value: 27 },
  { name: "Referral", value: 21 },
  { name: "Social",   value: 14 },
];
const PIE_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "var(--color-muted-foreground)",
];

const radarData = [
  { skill: "React",      score: 90 },
  { skill: "TypeScript", score: 85 },
  { skill: "CSS",        score: 78 },
  { skill: "Testing",    score: 70 },
  { skill: "DevOps",     score: 65 },
  { skill: "Design",     score: 72 },
];

const AXIS_STYLE = { fontSize: 11, fill: "var(--color-muted-foreground)" };
const GRID_STYLE = { stroke: "var(--color-border)", strokeDasharray: "3 3" };

export function ChartsPage() {
  return (
    <div>
      <PageHeader
        title="Charts"
        description="Recharts-based data visualisations — all colours follow the active theme."
      />
      <div className="space-y-8">

        {/* Area chart */}
        <SectionBlock title="Area Chart" description="Useful for time-series trends with shaded fill.">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Revenue vs Users</p>
              <p className="text-xs text-muted-foreground">Jan – Jun 2025</p>
            </div>
            <Badge variant="secondary" className="text-[10px]">6-month</Badge>
          </div>
          <ChartContainer config={areaConfig} className="h-56 w-full">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="userG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fill="url(#revG)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="users" stroke="var(--color-secondary)" fill="url(#userG)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ChartContainer>
        </SectionBlock>

        <Separator />

        {/* Bar chart */}
        <SectionBlock title="Bar Chart" description="Compare discrete categories side-by-side.">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Weekly Sales vs Returns</p>
              <p className="text-xs text-muted-foreground">Current week</p>
            </div>
          </div>
          <ChartContainer config={barConfig} className="h-52 w-full">
            <BarChart data={barData} barGap={3}>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis dataKey="week" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="sales"   fill="var(--color-primary)"     radius={[4,4,0,0]} />
              <Bar dataKey="returns" fill="var(--color-destructive)" radius={[4,4,0,0]} opacity={0.75} />
            </BarChart>
          </ChartContainer>
        </SectionBlock>

        <Separator />

        {/* Line chart */}
        <SectionBlock title="Line Chart" description="Smooth lines to compare multiple series over time.">
          <div className="mb-3">
            <p className="text-sm font-medium">Product performance</p>
            <p className="text-xs text-muted-foreground">Jan – Jun 2025 · Score out of 100</p>
          </div>
          <ChartContainer config={lineConfig} className="h-52 w-full">
            <LineChart data={lineData}>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[30, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="a" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-primary)" }} />
              <Line type="monotone" dataKey="b" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-accent)" }} strokeDasharray="5 3" />
            </LineChart>
          </ChartContainer>
        </SectionBlock>

        <Separator />

        {/* Pie + Radar side-by-side */}
        <SectionBlock title="Pie & Radar" description="Distribution and multi-axis skill charts.">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pie */}
            <div>
              <p className="text-sm font-medium mb-1">Traffic Sources</p>
              <p className="text-xs text-muted-foreground mb-3">Last 30 days</p>
              <div className="flex items-center gap-4">
                <ChartContainer config={{}} className="h-44 flex-1">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(v, n) => [`${v}%`, n]} />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-1.5 shrink-0">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <span className="size-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground w-16 truncate">{item.name}</span>
                      <span className="font-medium tabular-nums">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar */}
            <div>
              <p className="text-sm font-medium mb-1">Skill Matrix</p>
              <p className="text-xs text-muted-foreground mb-3">Score out of 100</p>
              <ChartContainer config={{}} className="h-44 w-full">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="68%">
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                  <Radar dataKey="score" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} strokeWidth={2} dot={{ r: 2.5, fill: "var(--color-primary)" }} />
                  <ChartTooltip formatter={(v) => [`${v}`, "Score"]} />
                </RadarChart>
              </ChartContainer>
            </div>
          </div>
        </SectionBlock>

      </div>
    </div>
  );
}
