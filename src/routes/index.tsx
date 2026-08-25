import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ticket,
  AlertTriangle,
  PhoneCall,
  MessagesSquare,
  Mail,
  ListChecks,
  CalendarClock,
  ArrowUpCircle,
  Clock,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, SlaBadge, TaskStatusBadge, TicketStatusBadge, ConsultantStatusBadge } from "@/components/common/StatusBadge";
import {
  CURRENT_USER_ID,
  calendarEvents,
  calls,
  chats,
  customerById,
  emails,
  escalations,
  slaRemainingLabel,
  tasks,
  tickets,
} from "@/data/demo";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Consultant Dashboard | Booster Hub CRM" },
      {
        name: "description",
        content:
          "Booster Hub consultant dashboard: open tickets, SLA risk, calls, chats, emails, tasks, escalations and today's schedule in one workspace.",
      },
      { property: "og:title", content: "Consultant Dashboard | Booster Hub CRM" },
      {
        property: "og:description",
        content: "Smarter Service. Faster Resolution. Better Relationships.",
      },
    ],
  }),
  component: ConsultantDashboard,
});

function ConsultantDashboard() {
  const { name, status, loginTime, loggedInLabel, team, role } = useSession();

  const myTickets = tickets.filter((t) => t.consultantId === CURRENT_USER_ID);
  const openTickets = myTickets.filter((t) => !["RESOLVED", "CLOSED"].includes(t.status));
  const slaRisk = myTickets.filter((t) => ["APPROACHING", "AT RISK", "BREACHED"].includes(t.slaStatus));
  const myCalls = calls.filter((c) => c.consultantId === CURRENT_USER_ID);
  const myChats = chats.filter((c) => c.consultantId === CURRENT_USER_ID);
  const unreadEmails = emails.filter((e) => e.consultantId === CURRENT_USER_ID && e.unread);
  const myTasks = tasks.filter((t) => t.assignedToId === CURRENT_USER_ID && t.status !== "COMPLETED");
  const followUps = calls.filter((c) => c.consultantId === CURRENT_USER_ID && c.followUp);
  const myEscalations = escalations.filter((e) =>
    myTickets.some((t) => t.id === e.ticketId),
  );
  const schedule = calendarEvents.filter((e) => e.consultantId === CURRENT_USER_ID && e.date === "2026-08-25");

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Good day, ${name.split(" ")[0]}`}
        description={`${role} · ${team} — Smarter Service. Faster Resolution. Better Relationships.`}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/tickets">My tickets</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/ai-workspace">
                <Sparkles className="mr-1.5 h-4 w-4" /> Booster AI
              </Link>
            </Button>
          </>
        }
      />

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
          <div>
            <p className="bh-metric-label">Login time</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{loginTime}</p>
          </div>
          <div>
            <p className="bh-metric-label">Current status</p>
            <div className="mt-2">
              <ConsultantStatusBadge status={status} />
            </div>
          </div>
          <div>
            <p className="bh-metric-label">Logged in for</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold tabular-nums">
              <Clock className="h-5 w-5 text-success" />
              {loggedInLabel}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Open tickets" value={openTickets.length} icon={Ticket} hint="Assigned to you" />
        <MetricCard label="SLA risk" value={slaRisk.length} icon={AlertTriangle} tone="amber" hint="Approaching, at risk or breached" />
        <MetricCard label="Today's calls" value={myCalls.length} icon={PhoneCall} tone="info" />
        <MetricCard label="Today's chats" value={myChats.length} icon={MessagesSquare} tone="green" />
        <MetricCard label="Unread emails" value={unreadEmails.length} icon={Mail} tone="info" />
        <MetricCard label="Pending tasks" value={myTasks.length} icon={ListChecks} tone="amber" />
        <MetricCard label="Follow-ups" value={followUps.length} icon={CalendarClock} tone="green" />
        <MetricCard label="Escalations" value={myEscalations.length} icon={ArrowUpCircle} tone="red" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle className="text-base">My tickets & SLA</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/tickets">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {myTickets.map((t) => (
              <Link
                key={t.id}
                to="/tickets/$ticketId"
                params={{ ticketId: t.id }}
                className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/60"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      <span className="text-primary">{t.number}</span> · {t.subject}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {customerById(t.customerId)?.name} · {t.channel} · {t.category}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <TicketStatusBadge status={t.status} />
                    <SlaBadge status={t.slaStatus} />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  SLA {t.sla} · {slaRemainingLabel(t.slaRemainingMinutes)}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today's schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {schedule.map((e) => (
                <div key={e.id} className="flex items-start gap-3 rounded-lg border border-border p-2.5">
                  <span className="shrink-0 rounded bg-muted px-2 py-1 text-xs font-bold tabular-nums">{e.start}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.type} · until {e.end}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">Pending tasks</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/tasks">All tasks</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {myTasks.map((t) => (
                <div key={t.id} className="rounded-lg border border-border p-2.5">
                  <p className="text-sm font-medium">{t.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <TaskStatusBadge status={t.status} />
                    <Pill>{t.origin}</Pill>
                    <span className="text-xs text-muted-foreground">Due {t.dueDate.slice(11)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
