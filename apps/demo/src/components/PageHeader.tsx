import * as React from "react";
import { Separator } from "@repo/ui/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
      <Separator className="mt-4" />
    </div>
  );
}

// ─── Section block within a page ──────────────────────────────────────────────
interface SectionBlockProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionBlock({ title, description, children }: SectionBlockProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}
