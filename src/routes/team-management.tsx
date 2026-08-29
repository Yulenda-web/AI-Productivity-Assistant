import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, UsersRound, Ticket, PhoneCall } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { ConsultantStatusBadge, Pill, SlaBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consultants, formatDuration, TEAMS } from "@/data/demo";
import { toast } from "sonner";

export const Route = createFileRoute("/team-management")({
  head: () => ({
    meta: [
      { title: "Team Management — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Manage Booster Hub teams and consultants: workload distribution, team assignment and reassignment of work.",
      },
      { property: "og:title", content: "Team Management — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Team structure, consultant workload and reassignment tools for Booster Hub managers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamManagementPage,
});

function TeamManagementPage() {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("All teams");

  const list = useMemo(
    () =>
      consultants.filter(
        (c) =>
          (team === "All teams" || c.team === team) &&
          (c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.role.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, team],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Team Management"
        description="Team structure, consultant workload and work reassignment."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Teams" value={TEAMS.length} icon={UsersRound} />
        <MetricCard label="Consultants" value={consultants.length} icon={Users} tone="info" />
        <MetricCard
          label="Open tickets"
          value={consultants.reduce((s, c) => s + c.tickets, 0)}
          icon={Ticket}
          tone="amber"
        />
        <MetricCard
          label="Calls today"
          value={consultants.reduce((s, c) => s + c.calls, 0)}
          icon={PhoneCall}
          tone="green"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {TEAMS.map((t) => {
          const members = consultants.filter((c) => c.team === t);
          return (
            <div key={t} className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="text-sm font-bold">{t}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {members.length} consultants · {members.filter((m) => m.status !== "OFFLINE").length} online
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Pill tone="navy">{members.reduce((s, m) => s + m.tickets, 0)} tickets</Pill>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search consultants or roles"
          className="sm:max-w-xs"
        />
        <Select value={team} onValueChange={setTeam}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All teams">All teams</SelectItem>
            {TEAMS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="bh-metric-label p-3">Consultant</th>
              <th className="bh-metric-label p-3">Role</th>
              <th className="bh-metric-label p-3">Team</th>
              <th className="bh-metric-label p-3">Status</th>
              <th className="bh-metric-label p-3">Logged in</th>
              <th className="bh-metric-label p-3">Workload</th>
              <th className="bh-metric-label p-3">SLA</th>
              <th className="bh-metric-label p-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0">
                <td className="p-3">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </td>
                <td className="p-3">{c.role}</td>
                <td className="p-3">{c.team}</td>
                <td className="p-3">
                  <ConsultantStatusBadge status={c.status} />
                </td>
                <td className="p-3">{formatDuration(c.loggedInMinutes)}</td>
                <td className="p-3 text-xs text-muted-foreground">
                  {c.tickets} tickets · {c.calls} calls · {c.chats} chats · {c.emails} emails
                </td>
                <td className="p-3">
                  <SlaBadge status={c.slaStatus} />
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Reassignment options opened for ${c.name}`)}
                  >
                    Reassign work
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
