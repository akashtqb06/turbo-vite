/**
 * PackagesPage — live showcase for @repo/hooks, @repo/utils, @repo/logger, @repo/query.
 *
 * Each section demonstrates a package with interactive, working examples
 * so developers can see the APIs in action immediately.
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { PageHeader } from "../components/PageHeader";

// @repo/hooks
import { useDebounce }        from "@repo/hooks/useDebounce";
import { useToggle }          from "@repo/hooks/useToggle";
import { useCopyToClipboard } from "@repo/hooks/useCopyToClipboard";
import { useLocalStorage }    from "@repo/hooks/useLocalStorage";
import { useMediaQuery }      from "@repo/hooks/useMediaQuery";
import { useInterval }        from "@repo/hooks/useInterval";

// @repo/utils
import { truncate, slugify, initials } from "@repo/utils/string";
import { groupBy, uniqueBy, chunk }    from "@repo/utils/array";
import { formatDate }                  from "@repo/utils/date";

// @repo/logger
import { logger } from "@repo/logger";

// ── Demo data ──────────────────────────────────────────────────────────────────

const SAMPLE_ITEMS = [
  { id: 1, category: "fruit",  name: "Apple" },
  { id: 2, category: "veggie", name: "Carrot" },
  { id: 3, category: "fruit",  name: "Banana" },
  { id: 4, category: "veggie", name: "Broccoli" },
  { id: 5, category: "fruit",  name: "Mango" },
  { id: 1, category: "fruit",  name: "Apple" }, // duplicate id for uniqueBy demo
];

const CODE_SNIPPET = `import { useDebounce } from "@repo/hooks/useDebounce";

const debouncedQuery = useDebounce(query, 400);`;

// ── Sections ──────────────────────────────────────────────────────────────────

function HooksSection() {
  const [query, setQuery]               = useState("");
  const debouncedQuery                  = useDebounce(query, 500);
  const { value: isOn, toggle }         = useToggle(false);
  const { isCopied, copy }              = useCopyToClipboard();
  const [storedName, setStoredName]     = useLocalStorage("demo.name", "");
  const isMobile                        = useMediaQuery("(max-width: 768px)");
  const [ticks, setTicks]               = useState(0);

  useInterval(() => setTicks((t) => t + 1), isOn ? 800 : null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">@repo/hooks</Badge>
          <CardTitle className="text-base">Shared React Hooks</CardTitle>
        </div>
        <CardDescription>6 hooks — no Redux dependency, SSR-safe, stable references</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* useDebounce */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">useDebounce(500ms)</p>
          <Input
            placeholder="Type to filter (debounced)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Debounce demo input"
          />
          <p className="text-sm font-mono bg-muted px-3 py-1 rounded">
            Debounced: <span className="text-primary">{debouncedQuery || "—"}</span>
          </p>
        </div>

        {/* useToggle + useInterval */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">useToggle + useInterval</p>
          <div className="flex items-center gap-3">
            <Button size="sm" variant={isOn ? "default" : "outline"} onClick={toggle}
              aria-label={isOn ? "Stop counter" : "Start counter"}>
              {isOn ? "Stop" : "Start"} Counter
            </Button>
            <span className="font-mono text-2xl font-bold tabular-nums text-primary">{ticks}</span>
          </div>
        </div>

        {/* useCopyToClipboard */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">useCopyToClipboard</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-muted text-xs px-3 py-2 rounded font-mono truncate">{CODE_SNIPPET.split("\n")[0]}</code>
            <Button size="sm" variant="outline" onClick={() => copy(CODE_SNIPPET)} aria-label="Copy code snippet">
              {isCopied ? "✓ Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        {/* useLocalStorage */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">useLocalStorage (persists across reloads)</p>
          <div className="flex gap-2">
            <Input
              placeholder="Your name…"
              value={storedName}
              onChange={(e) => setStoredName(e.target.value)}
              aria-label="Persistent name input"
            />
            {storedName && (
              <Button size="sm" variant="ghost" onClick={() => setStoredName("")} aria-label="Clear stored name">Clear</Button>
            )}
          </div>
          {storedName && <p className="text-sm text-muted-foreground">Stored: <strong>{storedName}</strong> (reload to verify)</p>}
        </div>

        {/* useMediaQuery */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">useMediaQuery</span>
          <Badge variant={isMobile ? "destructive" : "secondary"}>{isMobile ? "Mobile" : "Desktop"} viewport</Badge>
          <span className="text-xs text-muted-foreground">(resize window to see it change)</span>
        </div>
      </CardContent>
    </Card>
  );
}

function UtilsSection() {
  const grouped  = groupBy(SAMPLE_ITEMS, (i) => i.category);
  const unique   = uniqueBy(SAMPLE_ITEMS, (i) => i.id);
  const chunks   = chunk([1, 2, 3, 4, 5, 6, 7], 3);
  const now      = formatDate(new Date(), "PPP");

  const handleLogDemo = () => {
    logger.info("PackagesPage demo button clicked", { timestamp: new Date().toISOString() });
    logger.warn("This is a warning from @repo/logger", { level: "warn" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">@repo/utils</Badge>
          <CardTitle className="text-base">Pure TypeScript Utilities</CardTitle>
        </div>
        <CardDescription>No React, no side effects — safe for use anywhere in the stack</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* String utils */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">String utilities</p>
          <div className="grid grid-cols-1 gap-1 font-mono text-xs sm:grid-cols-2">
            <span>truncate(&apos;Hello world&apos;, 7) → <strong className="text-primary">&quot;{truncate("Hello world", 7)}&quot;</strong></span>
            <span>slugify(&apos;Hello World!&apos;) → <strong className="text-primary">&quot;{slugify("Hello World!")}&quot;</strong></span>
            <span>initials(&apos;Jane Doe&apos;) → <strong className="text-primary">&quot;{initials("Jane Doe")}&quot;</strong></span>
            <span>formatDate(now, &apos;PPP&apos;) → <strong className="text-primary">&quot;{now}&quot;</strong></span>
          </div>
        </div>

        {/* Array utils */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Array utilities</p>
          <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
            <div className="rounded bg-muted p-2">
              <p className="font-semibold mb-1">groupBy(items, category)</p>
              {Array.from(grouped.entries()).map(([k, v]) => (
                <p key={k}><span className="text-primary">{k}</span>: {v.map(i => i.name).join(", ")}</p>
              ))}
            </div>
            <div className="rounded bg-muted p-2">
              <p className="font-semibold mb-1">uniqueBy(items, id) — {unique.length} unique</p>
              {unique.map((i) => <p key={i.id}>{i.name}</p>)}
            </div>
            <div className="rounded bg-muted p-2">
              <p className="font-semibold mb-1">chunk([1..7], 3)</p>
              {chunks.map((c, i) => <p key={i}>[{c.join(", ")}]</p>)}
            </div>
          </div>
        </div>

        {/* Logger */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">@repo/logger (open DevTools console)</p>
          <Button size="sm" variant="outline" onClick={handleLogDemo} aria-label="Trigger logger demo">
            Fire logger.info + logger.warn
          </Button>
          <p className="text-xs text-muted-foreground">Level-gated, prefix-tagged, test-mode silenced.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function PackagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hooks & Utilities"
        description="Live interactive demos of @repo/hooks, @repo/utils, and @repo/logger — the shared foundation used across every app in this monorepo."
      />
      <HooksSection />
      <UtilsSection />
    </div>
  );
}
