import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { Separator } from "@repo/ui/components/ui/separator";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { PageHeader, SectionBlock } from "../components/PageHeader";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { emitAppToast } from "@repo/ui/lib/toast";

export function FeedbackPage() {
  return (
    <div>
      <PageHeader
        title="Feedback"
        description="Alerts, skeletons, and status indicators to communicate state to the user."
      />
      <div className="space-y-8">

        <SectionBlock title="Alerts" description="Four semantic levels — info, warning, success, error.">
          <div className="space-y-3">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>Your session will expire in 30 minutes. Save your work.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>You have 3 unsaved changes that will be lost on refresh.</AlertDescription>
            </Alert>
            <div className="flex gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              <CheckCircle className="size-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Deployment successful</p>
                <p className="text-xs mt-0.5 opacity-80">v2.4.1 is now live in production. Zero downtime rollout completed in 42s.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <XCircle className="size-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Build failed</p>
                <p className="text-xs mt-0.5 opacity-80">TypeScript errors found in 3 files. Fix them before deploying.</p>
              </div>
            </div>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Toast Notifications" description="Sonner-based ephemeral toasts — shown top-right, respects active theme.">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => emitAppToast({ type: "success", title: "Saved!", description: "Your changes have been saved successfully." })}
            >
              Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => emitAppToast({ type: "error", title: "Error", description: "Something went wrong. Please try again." })}
            >
              Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => emitAppToast({ type: "info", title: "Info", description: "A new version is available — v2.5.0." })}
            >
              Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => emitAppToast({ type: "warning", title: "Warning", description: "Disk space is running low (92% used)." })}
            >
              Warning
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => emitAppToast({ type: "loading", title: "Deploying…", description: "Pushing v2.4.1 to production." })}
            >
              Loading
            </Button>
          </div>
        </SectionBlock>


        <Separator />

        <SectionBlock title="Skeleton Loaders" description="Placeholder shapes while content is fetching.">
          <div className="space-y-5">
            {/* Card skeleton */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-1/3 rounded" />
                  <Skeleton className="h-2.5 w-1/2 rounded" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
              <Skeleton className="h-2.5 w-full rounded" />
              <Skeleton className="h-2.5 w-5/6 rounded" />
              <Skeleton className="h-2.5 w-4/6 rounded" />
            </div>

            {/* List skeleton */}
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                  <Skeleton className="size-7 rounded-md" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-2.5 w-1/4 rounded" />
                    <Skeleton className="h-2 w-1/3 rounded" />
                  </div>
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Progress Indicators" description="Inline and spinner loaders.">
          <div className="space-y-4">
            {/* Progress bars */}
            {[
              { label: "Upload progress", pct: 75, color: "bg-primary" },
              { label: "Storage used",    pct: 45, color: "bg-yellow-500" },
              { label: "Quota reached",   pct: 92, color: "bg-destructive" },
            ].map(({ label, pct, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <Badge variant="outline" className="tabular-nums text-[10px]">{pct}%</Badge>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}

            {/* Spinners */}
            <div className="flex items-center gap-4 pt-2">
              {[
                { size: "size-4", border: "border-2" },
                { size: "size-6", border: "border-2" },
                { size: "size-8", border: "border-[3px]" },
              ].map(({ size, border }, i) => (
                <span
                  key={i}
                  className={`${size} rounded-full ${border} border-primary border-t-transparent animate-spin`}
                />
              ))}
              <span className="text-xs text-muted-foreground">Loading spinners</span>
            </div>
          </div>
        </SectionBlock>

      </div>
    </div>
  );
}
