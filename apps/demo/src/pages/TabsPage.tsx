import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { PageHeader, SectionBlock } from "../components/PageHeader";

export function TabsPage() {
  return (
    <div>
      <PageHeader
        title="Tabs & Navigation"
        description="Tab groups for switching between related views or content categories."
      />
      <div className="space-y-8">

        <SectionBlock title="Default tabs" description="Standard horizontal tab group.">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <p className="text-sm text-muted-foreground">High-level summary of your workspace activity and metrics for the current period.</p>
            </TabsContent>
            <TabsContent value="analytics" className="mt-4">
              <p className="text-sm text-muted-foreground">Detailed analytics, conversion funnels, and cohort retention charts.</p>
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
              <p className="text-sm text-muted-foreground">Scheduled and on-demand reports — export as CSV or PDF.</p>
            </TabsContent>
          </Tabs>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Tabs with badges" description="Indicate counts or status within a tab label.">
          <Tabs defaultValue="inbox">
            <TabsList>
              <TabsTrigger value="inbox" className="gap-1.5">
                Inbox
                <Badge className="px-1.5 py-0 text-[9px] h-4 rounded-full">5</Badge>
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-1.5">
                Sent
              </TabsTrigger>
              <TabsTrigger value="drafts" className="gap-1.5">
                Drafts
                <Badge variant="secondary" className="px-1.5 py-0 text-[9px] h-4 rounded-full">2</Badge>
              </TabsTrigger>
              <TabsTrigger value="trash">
                Trash
              </TabsTrigger>
            </TabsList>
            <TabsContent value="inbox" className="mt-4">
              <div className="space-y-2">
                {["Alice: Project update", "Bob: Invoice attached", "CI/CD: Build passed", "Team: Sprint review", "Product: Roadmap v2"].map((msg, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs border border-border ${i < 2 ? "bg-primary/5 font-medium" : "text-muted-foreground"}`}>
                    {i < 2 && <span className="size-1.5 rounded-full bg-primary shrink-0" />}
                    {i >= 2 && <span className="size-1.5 shrink-0" />}
                    {msg}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="sent" className="mt-4">
              <p className="text-sm text-muted-foreground">No sent messages in this view.</p>
            </TabsContent>
            <TabsContent value="drafts" className="mt-4">
              <p className="text-sm text-muted-foreground">2 draft messages waiting to be sent.</p>
            </TabsContent>
            <TabsContent value="trash" className="mt-4">
              <p className="text-sm text-muted-foreground">Trash is empty.</p>
            </TabsContent>
          </Tabs>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Tabs with cards" description="Each tab contains a rich content panel.">
          <Tabs defaultValue="plan">
            <TabsList>
              <TabsTrigger value="plan">Free</TabsTrigger>
              <TabsTrigger value="pro">Pro</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            {[
              {
                id: "plan",
                title: "Free Plan",
                price: "$0/mo",
                desc: "Perfect for individuals and small projects.",
                features: ["5 projects", "2 GB storage", "Community support", "Basic analytics"],
              },
              {
                id: "pro",
                title: "Pro Plan",
                price: "$12/mo",
                desc: "Everything in Free, plus advanced tooling.",
                features: ["Unlimited projects", "50 GB storage", "Priority support", "Advanced analytics", "Custom domains"],
              },
              {
                id: "team",
                title: "Team Plan",
                price: "$39/mo",
                desc: "For growing teams that need collaboration.",
                features: ["Unlimited projects", "500 GB storage", "24/7 support", "SSO + SAML", "Audit logs", "SLA guarantee"],
              },
            ].map(({ id, title, price, desc, features }) => (
              <TabsContent key={id} value={id} className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-baseline justify-between">
                      <CardTitle className="text-base">{title}</CardTitle>
                      <span className="text-xl font-bold tabular-nums">{price}</span>
                    </div>
                    <CardDescription>{desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="size-3.5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[8px]">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </SectionBlock>

      </div>
    </div>
  );
}
