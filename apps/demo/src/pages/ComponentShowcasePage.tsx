import * as React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { useTheme } from "@repo/ui/hooks/useTheme";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { Switch } from "@repo/ui/components/ui/switch";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Slider } from "@repo/ui/components/ui/slider";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@repo/ui/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@repo/ui/components/ui/chart";
import type { ChartConfig } from "@repo/ui/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
import {
  Sun,
  Moon,
  Palette,
  Check,
  Bell,
  Settings,
  ChevronDown,
  Info,
  AlertTriangle,
  CheckCircle,
  Layers,
  BarChart2,
  MousePointerClick,
  FormInput,
  Sliders,
  MessageSquare,
} from "lucide-react";

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-3.5" />
          </span>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Buttons
// ═══════════════════════════════════════════════════════════════════════════════
function ButtonsSection() {
  return (
    <Section icon={MousePointerClick} title="Buttons">
      <div className="space-y-4">
        <div>
          <SectionLabel>Variants</SectionLabel>
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
        <div>
          <SectionLabel>Sizes</SectionLabel>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="outline">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
        <Separator />
        <div>
          <SectionLabel>States</SectionLabel>
          <div className="flex flex-wrap gap-2">
            <Button>Active</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" className="gap-2">
              <Check className="size-3.5" /> With Icon
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — Badges + Avatars
// ═══════════════════════════════════════════════════════════════════════════════
function BadgesSection() {
  const users = [
    { init: "AK", color: "bg-primary" },
    { init: "MR", color: "bg-secondary" },
    { init: "SJ", color: "bg-accent" },
    { init: "LT", color: "bg-muted" },
    { init: "+4", color: "bg-muted-foreground/20" },
  ];

  return (
    <Section icon={Layers} title="Badges & Avatars">
      <div className="space-y-4">
        <div>
          <SectionLabel>Badges</SectionLabel>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="gap-1">
              <span className="size-1.5 rounded-full bg-green-400" />
              Live
            </Badge>
          </div>
        </div>
        <Separator />
        <div>
          <SectionLabel>Avatars</SectionLabel>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {users.map(({ init }) => (
                <Avatar key={init} className="ring-2 ring-background">
                  <AvatarFallback>{init}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Team members</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — Inputs & Controls
// ═══════════════════════════════════════════════════════════════════════════════
function InputsSection() {
  const [sliderVal, setSliderVal] = React.useState([60]);
  const [checked, setChecked] = React.useState(true);
  const [toggled, setToggled] = React.useState(false);

  return (
    <Section icon={FormInput} title="Inputs & Controls">
      <div className="space-y-4">
        <div>
          <SectionLabel>Text input</SectionLabel>
          <Input placeholder="Search components…" className="max-w-xs" />
        </div>
        <div>
          <SectionLabel>Textarea</SectionLabel>
          <Textarea
            placeholder="Write something here…"
            className="max-w-xs resize-none"
            rows={3}
          />
        </div>
        <Separator />
        <div>
          <SectionLabel>Slider — {sliderVal[0]}%</SectionLabel>
          <div className="max-w-xs">
            <Slider
              min={0}
              max={100}
              value={sliderVal}
              onValueChange={setSliderVal}
            />
          </div>
        </div>
        <Separator />
        <div>
          <SectionLabel>Checkbox &amp; Switch</SectionLabel>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={checked}
                onCheckedChange={(v) => setChecked(Boolean(v))}
              />
              Accept terms
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Switch
                checked={toggled}
                onCheckedChange={setToggled}
                id="showcase-toggle"
              />
              Dark mode
            </label>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — Popover, Tooltip, Dropdown, Dialog
// ═══════════════════════════════════════════════════════════════════════════════
function OverlaysSection() {
  return (
    <Section icon={MessageSquare} title="Overlays & Popovers">
      <div className="space-y-4">
        <SectionLabel>Click to open</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {/* Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  Hover — Tooltip
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keyboard shortcut: ⌘K</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Click — Popover
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <PopoverHeader>
                <PopoverTitle>Profile settings</PopoverTitle>
                <PopoverDescription>
                  Manage your display name and avatar here.
                </PopoverDescription>
              </PopoverHeader>
              <Separator />
              <div className="mt-3 space-y-2">
                <Input placeholder="Display name" />
                <Button size="sm" className="w-full">Save changes</Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Dropdown <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Bell className="mr-2 size-3.5" /> Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-3.5" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  This will permanently delete your account. This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — Alerts & Skeleton
// ═══════════════════════════════════════════════════════════════════════════════
function FeedbackSection() {
  return (
    <Section icon={Info} title="Alerts & Skeletons">
      <div className="space-y-3">
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            Your session will expire in 30 minutes.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You have unsaved changes that will be lost.
          </AlertDescription>
        </Alert>
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm flex gap-2 items-start text-green-700 dark:text-green-400">
          <CheckCircle className="size-4 mt-0.5 shrink-0" />
          <span>Deployment completed successfully in 42s.</span>
        </div>
        <Separator />
        <div>
          <SectionLabel>Skeleton loaders</SectionLabel>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — Charts
// ═══════════════════════════════════════════════════════════════════════════════

const areaData = [
  { month: "Jan", revenue: 4200, users: 2400 },
  { month: "Feb", revenue: 5800, users: 3100 },
  { month: "Mar", revenue: 5200, users: 2900 },
  { month: "Apr", revenue: 7800, users: 4300 },
  { month: "May", revenue: 6900, users: 3800 },
  { month: "Jun", revenue: 9100, users: 5200 },
];

const barData = [
  { week: "Mon", sales: 120, returns: 18 },
  { week: "Tue", sales: 98,  returns: 11 },
  { week: "Wed", sales: 145, returns: 22 },
  { week: "Thu", sales: 87,  returns: 9  },
  { week: "Fri", sales: 178, returns: 31 },
  { week: "Sat", sales: 210, returns: 27 },
  { week: "Sun", sales: 155, returns: 14 },
];

const pieData = [
  { name: "Direct",   value: 38 },
  { name: "Organic",  value: 27 },
  { name: "Referral", value: 21 },
  { name: "Social",   value: 14 },
];

const radarData = [
  { skill: "React",      score: 90 },
  { skill: "TypeScript", score: 85 },
  { skill: "CSS",        score: 78 },
  { skill: "Testing",    score: 70 },
  { skill: "DevOps",     score: 65 },
  { skill: "Design",     score: 72 },
];

const areaConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--color-primary)" },
  users:   { label: "Users",   color: "var(--color-secondary)" },
};

const barConfig: ChartConfig = {
  sales:   { label: "Sales",   color: "var(--color-primary)" },
  returns: { label: "Returns", color: "var(--color-destructive)" },
};

const PIE_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "var(--color-muted-foreground)",
];

function ChartsSection() {
  return (
    <Section icon={BarChart2} title="Charts">
      <Tabs defaultValue="area">
        <TabsList className="mb-4">
          <TabsTrigger value="area">Area</TabsTrigger>
          <TabsTrigger value="bar">Bar</TabsTrigger>
          <TabsTrigger value="pie">Pie</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
        </TabsList>

        {/* Area chart */}
        <TabsContent value="area">
          <div className="space-y-1 mb-3">
            <p className="text-sm font-medium">Revenue vs Users</p>
            <p className="text-xs text-muted-foreground">Jan – Jun 2025</p>
          </div>
          <ChartContainer config={areaConfig} className="h-56 w-full">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-secondary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fill="url(#revGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="users"   stroke="var(--color-secondary)" fill="url(#userGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ChartContainer>
        </TabsContent>

        {/* Bar chart */}
        <TabsContent value="bar">
          <div className="space-y-1 mb-3">
            <p className="text-sm font-medium">Weekly Sales vs Returns</p>
            <p className="text-xs text-muted-foreground">Current week</p>
          </div>
          <ChartContainer config={barConfig} className="h-56 w-full">
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="sales"   fill="var(--color-primary)"     radius={[4,4,0,0]} />
              <Bar dataKey="returns" fill="var(--color-destructive)" radius={[4,4,0,0]} opacity={0.8} />
            </BarChart>
          </ChartContainer>
        </TabsContent>

        {/* Pie chart */}
        <TabsContent value="pie">
          <div className="space-y-1 mb-3">
            <p className="text-sm font-medium">Traffic Sources</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ChartContainer config={{}} className="h-52 w-full max-w-xs">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <ChartTooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ChartContainer>
            <div className="space-y-2 w-full max-w-[140px]">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="flex-1 text-muted-foreground">{item.name}</span>
                  <span className="font-medium tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Radar chart */}
        <TabsContent value="radar">
          <div className="space-y-1 mb-3">
            <p className="text-sm font-medium">Skill Matrix</p>
            <p className="text-xs text-muted-foreground">Score out of 100</p>
          </div>
          <ChartContainer config={{}} className="h-56 w-full">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <Radar dataKey="score" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: "var(--color-primary)" }} />
              <ChartTooltip formatter={(v) => [`${v}`, "Score"]} />
            </RadarChart>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — Tabs showcase (nested)
// ═══════════════════════════════════════════════════════════════════════════════
function TabsSection() {
  return (
    <Section icon={Sliders} title="Tabs & Navigation">
      <div className="space-y-4">
        <div>
          <SectionLabel>Default tabs</SectionLabel>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-3">
              <p className="text-sm text-muted-foreground">
                High-level summary of your workspace activity and metrics.
              </p>
            </TabsContent>
            <TabsContent value="analytics" className="mt-3">
              <p className="text-sm text-muted-foreground">
                Detailed analytics and conversion funnels for the current period.
              </p>
            </TabsContent>
            <TabsContent value="reports" className="mt-3">
              <p className="text-sm text-muted-foreground">
                Scheduled and on-demand reports — export as CSV or PDF.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Top Nav
// ═══════════════════════════════════════════════════════════════════════════════
function TopNav() {
  const { activeTheme, mode, toggleMode } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="size-6 rounded-md bg-primary transition-colors" />
          <span className="text-sm font-semibold">Component Showcase</span>
        </div>
        <div className="flex items-center gap-2">
          {activeTheme && (
            <Badge variant="outline" className="hidden sm:inline-flex gap-1 text-[10px]">
              <Palette className="size-2.5" />
              {activeTheme.label} · {mode === "dark" ? "Dark" : "Light"}
            </Badge>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleMode}>
                  {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle {mode === "dark" ? "light" : "dark"} mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" size="icon">
            <Bell className="size-4" />
          </Button>
          <Avatar size="sm">
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════════════
export function ComponentShowcasePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Component Showcase
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every component updates in real-time when you switch themes or toggle dark mode.
          </p>
        </div>

        {/* Masonry-style 2-col grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <ButtonsSection />
            <InputsSection />
            <FeedbackSection />
            <TabsSection />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <ChartsSection />
            <BadgesSection />
            <OverlaysSection />
          </div>
        </div>
      </main>
    </div>
  );
}
