import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MonitorDot, Coffee, PhoneCall, Clock } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { ConsultantStatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONSULTANT_STATUSES, consultants, formatDuration, managerStats } from "@/data/demo";

export const Route = createFileRoute("/workforce-monitor")({
  head: () => ({
    meta: [
      { title: "Workforce Monitor — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Live workforce monitoring: consultant availability, break and lunch time, call time, after call work and training.",
      },
      { property: "og:title", content: "Workforce Monitor — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Real-time consultant status and time-in-state tracking across the Booster Hub floor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkforceMonitorPage,
});

function WorkforceMonitorPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");

  const list = useMemo(
    () =>
      consultants.filter(
        (c) =>
          (status === "All statuses" || c.status === status) &&
          c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, status],
  );

  const totalBreak = consultants.reduce((s, c) => s + c.breakMinutes + c.lunchMinutes, 0);
  const totalCall = consultants.reduce((s, c) => s + c.callMinutes, 0);
  const totalAvailable = consultants.reduce((s, c) => s + c.availableMinutes, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Workforce Monitor"
        description="Live consultant availability and time spent in each working state."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Online now"
          value={`${managerStats.online}/${managerStats.totalConsultants}`}
          icon={MonitorDot}
          tone="green"
        />
        <MetricCard label="On break or lunch" value={managerStats.onBreak} icon={Coffee} tone="amber" />
        <MetricCard label="On call" value={managerStats.onCall} icon={PhoneCall} tone="info" />
        <MetricCard label="Total available time" value={formatDuration(totalAvailable)} icon={Clock} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search consultants"
          className="sm:max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All statuses">All statuses</SelectItem>
            {CONSULTANT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="bh-metric-label p-3">Consultant</th>
              <th className="bh-metric-label p-3">Status</th>
              <th className="bh-metric-label p-3">Activity</th>
              <th className="bh-metric-label p-3">Logged in</th>
              <th className="bh-metric-label p-3">Available</th>
              <th className="bh-metric-label p-3">Call</th>
              <th className="bh-metric-label p-3">ACW</th>
              <th className="bh-metric-label p-3">Break</th>
              <th className="bh-metric-label p-3">Lunch</th>
              <th className="bh-metric-label p-3">Training</th>
              <th className="bh-metric-label p-3">Meeting</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0">
                <td className="p-3">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.team} · since {c.loginTime}
                  </p>
                </td>
                <td className="p-3">
                  <ConsultantStatusBadge status={c.status} />
                </td>
                <td className="p-3 text-xs text-muted-foreground">{c.currentActivity}</td>
                <td className="p-3">{formatDuration(c.loggedInMinutes)}</td>
                <td className="p-3">{formatDuration(c.availableMinutes)}</td>
                <td className="p-3">{formatDuration(c.callMinutes)}</td>
                <td className="p-3">{formatDuration(c.acwMinutes)}</td>
                <td className="p-3">{formatDuration(c.breakMinutes)}</td>
                <td className="p-3">{formatDuration(c.lunchMinutes)}</td>
                <td className="p-3">{formatDuration(c.trainingMinutes)}</td>
                <td className="p-3">{formatDuration(c.meetingMinutes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Total call time" value={formatDuration(totalCall)} icon={PhoneCall} tone="info" />
        <MetricCard label="Total break time" value={formatDuration(totalBreak)} icon={Coffee} tone="amber" />
        <MetricCard
          label="Average logged in"
          value={formatDuration(
            Math.round(consultants.reduce((s, c) => s + c.loggedInMinutes, 0) / consultants.length),
          )}
          icon={Clock}
        />
      </div>
    </div>
  );
}
