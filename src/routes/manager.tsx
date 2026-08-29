import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Ticket, AlertTriangle, ArrowUpCircle, PhoneCall, Star } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { ConsultantStatusBadge, Pill, SlaBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  consultants,
  customerById,
  escalations,
  formatDuration,
  managerStats,
  tickets,
  TEAMS,
} from "@/data/demo";

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager Dashboard — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Team-wide view of consultant availability, ticket load, SLA risk and open escalations across Booster Hub.",
      },
      { property: "og:title", content: "Manager Dashboard — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Live team performance, SLA risk and escalation oversight for Booster Hub managers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ManagerDashboard,
});

function ManagerDashboard() {
  const openEscalations = escalations.filter((e) => e.status !== "Resolved");
  const riskTickets = tickets.filter((t) => t.slaStatus === "AT RISK" || t.slaStatus === "BREACHED");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manager Dashboard"
        description="Live oversight of team availability, workload, SLA health and escalations."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link to="/reports">View reports</Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Consultants online"
          value={`${managerStats.online}/${managerStats.totalConsultants}`}
          hint={`${managerStats.available} available · ${managerStats.onCall} on call`}
          icon={Users}
          tone="green"
        />
        <MetricCard
          label="Open tickets"
          value={managerStats.openTickets}
          hint={`${managerStats.resolvedTickets} resolved`}
          icon={Ticket}
        />
        <MetricCard
          label="SLA at risk"
          value={managerStats.slaRisk}
          hint={`${managerStats.slaBreaches} breached`}
          icon={AlertTriangle}
          tone="amber"
        />
        <MetricCard
          label="Open escalations"
          value={managerStats.escalations}
          icon={ArrowUpCircle}
          tone="red"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Calls handled" value={managerStats.calls} icon={PhoneCall} tone="info" />
        <MetricCard label="Chats handled" value={managerStats.chats} icon={Users} tone="info" />
        <MetricCard label="Emails handled" value={managerStats.emails} icon={Ticket} tone="info" />
        <MetricCard label="CSAT" value={`${managerStats.csat} / 5`} icon={Star} tone="green" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold">Team performance</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="bh-metric-label pb-2">Team</th>
                  <th className="bh-metric-label pb-2">Consultants</th>
                  <th className="bh-metric-label pb-2">Online</th>
                  <th className="bh-metric-label pb-2">Tickets</th>
                  <th className="bh-metric-label pb-2">Calls</th>
                </tr>
              </thead>
              <tbody>
                {TEAMS.map((team) => {
                  const members = consultants.filter((c) => c.team === team);
                  return (
                    <tr key={team} className="border-b border-border/60 last:border-0">
                      <td className="py-2 font-semibold">{team}</td>
                      <td className="py-2">{members.length}</td>
                      <td className="py-2">{members.filter((m) => m.status !== "OFFLINE").length}</td>
                      <td className="py-2">{members.reduce((s, m) => s + m.tickets, 0)}</td>
                      <td className="py-2">{members.reduce((s, m) => s + m.calls, 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold">Open escalations</h2>
          <div className="mt-3 space-y-2">
            {openEscalations.map((e) => (
              <Link
                key={e.id}
                to="/escalations"
                className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">{e.reference}</span>
                  <SlaBadge status={e.slaStatus} />
                </div>
                <p className="mt-1 text-sm">{e.reason}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Pill tone="navy">{e.level}</Pill>
                  <Pill tone="neutral">{customerById(e.customerId)?.name ?? "Customer"}</Pill>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold">Consultant status</h2>
          <div className="mt-3 space-y-2">
            {consultants.slice(0, 8).map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.team} · {c.currentActivity} · {formatDuration(c.loggedInMinutes)}
                  </p>
                </div>
                <ConsultantStatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold">Tickets needing attention</h2>
          <div className="mt-3 space-y-2">
            {riskTickets.map((t) => (
              <Link
                key={t.id}
                to="/tickets/$ticketId"
                params={{ ticketId: t.id }}
                className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">{t.number}</span>
                  <SlaBadge status={t.slaStatus} />
                </div>
                <p className="mt-1 truncate text-sm">{t.subject}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
