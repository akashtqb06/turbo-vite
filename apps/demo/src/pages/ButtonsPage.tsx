import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { Badge } from "@repo/ui/components/ui/badge";
import { PageHeader, SectionBlock } from "../components/PageHeader";
import { Settings, Check, Plus, Trash, Download } from "lucide-react";

export function ButtonsPage() {
  return (
    <div>
      <PageHeader
        title="Buttons"
        description="Interactive button components with multiple variants, sizes, and states."
      />
      <div className="space-y-8">

        <SectionBlock title="Variants" description="All available style variants — use default for primary actions.">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Sizes" description="Four sizes to match different UI densities.">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="outline" aria-label="Settings">
              <Settings className="size-4" />
            </Button>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="With Icons" description="Combine icons with labels for affordance.">
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2"><Plus className="size-4" /> Create new</Button>
            <Button variant="outline" className="gap-2"><Download className="size-4" /> Export</Button>
            <Button variant="destructive" className="gap-2"><Trash className="size-4" /> Delete</Button>
            <Button variant="secondary" className="gap-2"><Check className="size-4" /> Confirm</Button>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="States" description="Loading, disabled, and active states.">
          <div className="flex flex-wrap gap-2 items-center">
            <Button>Active</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>Disabled outline</Button>
            <Button className="gap-2" disabled>
              <span className="size-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Loading…
            </Button>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Button groups" description="Visually grouped related actions.">
          <div className="inline-flex rounded-lg border border-border overflow-hidden divide-x divide-border">
            <Button variant="ghost" className="rounded-none px-3 text-xs h-8">Day</Button>
            <Button variant="ghost" className="rounded-none px-3 text-xs h-8 bg-muted">Week</Button>
            <Button variant="ghost" className="rounded-none px-3 text-xs h-8">Month</Button>
            <Button variant="ghost" className="rounded-none px-3 text-xs h-8">Year</Button>
          </div>
        </SectionBlock>

        {/* Usage callout */}
        <div className="rounded-lg bg-muted/50 border border-border p-4 flex gap-3">
          <Badge variant="outline" className="shrink-0 h-fit mt-0.5">Usage</Badge>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Use{" "}
            <code className="bg-muted px-1 rounded font-mono">
              variant=&quot;default&quot;
            </code>{" "}
            for the primary CTA on each screen.
            Limit to one primary button per section to maintain visual hierarchy.
          </p>
        </div>

      </div>
    </div>
  );
}
