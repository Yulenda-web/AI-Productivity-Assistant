import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Workflow, Zap, ShieldCheck, Play } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Pill } from "@/components/common/StatusBadge";
import { AiDisclaimer } from "@/components/common/AiPanel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { automationRules } from "@/data/demo";
import { toast } from "sonner";

export const Route = createFileRoute("/ai-automation")({
  head: () => ({
    meta: [
      { title: "AI Automation — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Manage Booster Hub automation rules: ticket notifications, SLA warnings, escalation routing and follow-up reminders.",
      },
      { property: "og:title", content: "AI Automation — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Trigger, condition and action rules that keep tickets, SLAs and escalations moving.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiAutomationPage,
});

function AiAutomationPage() {
  const [rules, setRules] = useState(automationRules);

  const toggle = (id: string) =>
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        toast.success(`${r.name} ${r.enabled ? "disabled" : "enabled"}`);
        return { ...r, enabled: !r.enabled };
      }),
    );

  const active = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Automation"
        description="Rule-based automation for notifications, SLA warnings, escalation routing and follow-ups."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total rules" value={rules.length} icon={Workflow} />
        <MetricCard label="Active rules" value={active} icon={Zap} tone="green" />
        <MetricCard label="Paused" value={rules.length - active} icon={Play} tone="amber" />
        <MetricCard label="Human approval" value="Required" icon={ShieldCheck} tone="info" />
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <article
            key={rule.id}
            className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-bold">{rule.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Last run {rule.lastRun}</p>
              </div>
              <div className="flex items-center gap-3">
                <Pill tone={rule.enabled ? "green" : "neutral"}>{rule.enabled ? "Active" : "Paused"}</Pill>
                <Switch checked={rule.enabled} onCheckedChange={() => toggle(rule.id)} />
              </div>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="bh-metric-label">Trigger</p>
                <p className="mt-1 text-sm">{rule.trigger}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="bh-metric-label">Condition</p>
                <p className="mt-1 text-sm">{rule.condition}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="bh-metric-label">Action</p>
                <p className="mt-1 text-sm">{rule.action}</p>
              </div>
            </div>

            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={() => toast.success(`${rule.name} test run queued`)}>
                Test rule
              </Button>
            </div>
          </article>
        ))}
      </div>

      <AiDisclaimer />
    </div>
  );
}
