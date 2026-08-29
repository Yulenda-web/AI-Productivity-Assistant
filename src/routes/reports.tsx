import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Button } from "@/components/ui/button";
import { aiUsage, dailyVolume, managerStats, slaTrend } from "@/data/demo";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Booster Hub reporting: daily contact volume, SLA compliance trends, AI tool adoption and team productivity.",
      },
      { property: "og:title", content: "Reports & Analytics — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Contact volume, SLA compliance and AI adoption reporting for CRM and call centre teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const axis = { stroke: "var(--muted-foreground)", fontSize: 11 };

function ReportsPage() {
  const totalContacts = dailyVolume.reduce(
    (s, d) => s + d.tickets + d.calls + d.chats + d.emails,
    0,
  );
  const avgCompliance = Math.round(
    slaTrend.reduce((s, w) => s + w.compliance, 0) / slaTrend.length,
  );
  const aiTotal = aiUsage.reduce((s, a) => s + a.uses, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports & Analytics"
        description="Contact volume, SLA compliance, AI adoption and productivity across the operation."
        actions={
          <Button size="sm" variant="outline" onClick={() => toast.success("Report export queued")}>
            Export report
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Contacts this week" value={totalContacts} icon={BarChart3} />
        <MetricCard label="SLA compliance" value={`${avgCompliance}%`} icon={ShieldCheck} tone="green" />
        <MetricCard label="AI actions" value={aiTotal} icon={Sparkles} tone="info" />
        <MetricCard label="Open tickets" value={managerStats.openTickets} icon={Ticket} tone="amber" />
      </div>

      <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-bold">Daily contact volume</h2>
        <div className="mt-3 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" {...axis} tickLine={false} />
              <YAxis {...axis} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="tickets" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="calls" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="chats" fill="var(--info)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emails" fill="var(--warning)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold">SLA compliance trend</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slaTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" {...axis} tickLine={false} />
                <YAxis {...axis} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="compliance" stroke="var(--success)" strokeWidth={2} />
                <Line type="monotone" dataKey="breaches" stroke="var(--destructive)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold">Booster AI tool usage</h2>
          <div className="mt-3 space-y-3">
            {aiUsage.map((a) => (
              <div key={a.tool}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{a.tool}</span>
                  <span className="text-muted-foreground">{a.uses}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.round((a.uses / aiTotal) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
