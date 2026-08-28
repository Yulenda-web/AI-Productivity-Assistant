import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, Users, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Pill } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calendarEvents, consultantById, customerById, currentUser } from "@/data/demo";
import { useSession } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar & Scheduling — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Plan consultant days in Booster Hub: meetings, callbacks, follow-ups, training and customer appointments in one schedule.",
      },
      { property: "og:title", content: "Calendar & Scheduling — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Daily consultant schedule with meetings, callbacks, follow-ups and appointments.",
      },
    ],
  }),
  component: CalendarPage,
});

const typeTone = {
  Meeting: "navy",
  Call: "info",
  "Follow-up": "amber",
  Task: "navy",
  Training: "info",
  Break: "neutral",
  Appointment: "green",
} as const;

function CalendarPage() {
  const { isManagement } = useSession();
  const [scope, setScope] = useState("mine");

  const dates = useMemo(
    () => Array.from(new Set(calendarEvents.map((e) => e.date))).sort(),
    [],
  );
  const [date, setDate] = useState(dates[0] ?? "");

  const events = calendarEvents
    .filter((e) => e.date === date)
    .filter((e) => (scope === "mine" ? e.consultantId === currentUser.id : true))
    .sort((a, b) => a.start.localeCompare(b.start));

  const todayAll = calendarEvents.filter((e) => e.date === date);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Calendar & Scheduling"
        description="Meetings, callbacks, follow-ups, training and customer appointments for the service floor."
        actions={
          <Button size="sm" onClick={() => toast.success("New event added to your schedule")}>
            <CalendarDays className="h-4 w-4" />
            New event
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Events today" value={todayAll.length} icon={CalendarDays} />
        <MetricCard
          label="My events"
          value={calendarEvents.filter((e) => e.date === date && e.consultantId === currentUser.id).length}
          icon={Clock}
          tone="info"
        />
        <MetricCard
          label="Customer appointments"
          value={todayAll.filter((e) => e.type === "Appointment" || e.type === "Call").length}
          icon={Users}
          tone="green"
        />
        <MetricCard
          label="Follow-ups"
          value={todayAll.filter((e) => e.type === "Follow-up").length}
          icon={CheckCircle2}
          tone="amber"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={date} onValueChange={setDate}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            {dates.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isManagement ? (
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mine">My calendar</SelectItem>
              <SelectItem value="team">Whole team</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        {events.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No events scheduled for this day.</p>
        ) : (
          <ul className="divide-y divide-border">
            {events.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 p-3">
                <span className="w-28 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                  {e.start} – {e.end}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{e.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {consultantById(e.consultantId)?.name}
                    {e.customerId ? ` · ${customerById(e.customerId)?.name}` : ""}
                  </span>
                </span>
                <Pill tone={typeTone[e.type]}>{e.type}</Pill>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
