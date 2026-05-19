import { Badge } from "@repo/ui/components/ui/badge";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Separator } from "@repo/ui/components/ui/separator";
import { PageHeader, SectionBlock } from "../components/PageHeader";

const MEMBERS = [
  { init: "AK", name: "Akash Kumar",   role: "Admin",  status: "online" },
  { init: "MR", name: "Mira Rashid",   role: "Editor", status: "online" },
  { init: "SJ", name: "Sam Johnson",   role: "Viewer", status: "away" },
  { init: "LT", name: "Lily Torres",   role: "Editor", status: "offline" },
  { init: "PW", name: "Pete Walsh",    role: "Viewer", status: "online" },
];

const STATUS_COLORS: Record<string, string> = {
  online:  "bg-green-400",
  away:    "bg-yellow-400",
  offline: "bg-muted-foreground/40",
};

export function BadgesPage() {
  return (
    <div>
      <PageHeader
        title="Badges & Avatars"
        description="Status indicators, labels, and user representations."
      />
      <div className="space-y-8">

        <SectionBlock title="Badge Variants" description="Four visual styles for different semantic meanings.">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Status Badges" description="With live status indicators.">
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1.5">
              <span className="size-1.5 rounded-full bg-green-400 animate-pulse" /> Live
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <span className="size-1.5 rounded-full bg-yellow-400" /> Away
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <span className="size-1.5 rounded-full bg-muted-foreground/50" /> Offline
            </Badge>
            <Badge variant="destructive" className="gap-1.5">
              <span className="size-1.5 rounded-full bg-white" /> Critical
            </Badge>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Count Badges" description="Numeric notification indicators.">
          <div className="flex items-center gap-4">
            {[2, 8, 14, 99].map((n) => (
              <div key={n} className="relative inline-flex">
                <div className="size-8 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  Icon
                </div>
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {n > 99 ? "99+" : n}
                </span>
              </div>
            ))}
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Avatars" description="Single and stacked avatar groups.">
          <div className="space-y-4">
            {/* Stack */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Stacked group</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {MEMBERS.slice(0, 5).map(({ init }) => (
                    <Avatar key={init} className="ring-2 ring-background size-8">
                      <AvatarFallback className="text-[10px]">{init}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">+4 more</span>
              </div>
            </div>

            {/* Team list */}
            <div className="rounded-lg border border-border overflow-hidden">
              {MEMBERS.map(({ init, name, role, status }, i) => (
                <div key={init}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
                    <div className="relative">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-[10px]">{init}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 size-2 rounded-full ring-1 ring-background ${STATUS_COLORS[status]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{name}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{status}</p>
                    </div>
                    <Badge variant={role === "Admin" ? "default" : "outline"} className="text-[10px]">
                      {role}
                    </Badge>
                  </div>
                  {i < MEMBERS.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>
        </SectionBlock>

      </div>
    </div>
  );
}
