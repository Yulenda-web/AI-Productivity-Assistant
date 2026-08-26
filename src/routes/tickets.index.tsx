import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, SlaBadge, TicketStatusBadge } from "@/components/common/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consultantById, customers, slaRemainingLabel, tickets, type TicketStatus } from "@/data/demo";
import { useSession } from "@/lib/session";
import { currentUser } from "@/data/demo";

const STATUSES: TicketStatus[] = ["NEW", "OPEN", "IN PROGRESS", "ESCALATED", "RESOLVED", "CLOSED"];

export const Route = createFileRoute("/tickets/")({
  head: () => ({
    meta: [
      { title: "Tickets | Booster Hub" },
      {
        name: "description",
        content: "Track, filter and resolve customer tickets with SLA timers, ownership and AI assistance in Booster Hub.",
      },
      { property: "og:title", content: "Tickets | Booster Hub" },
      { property: "og:description", content: "Ticket queue with SLA tracking and AI copilot support." },
    ],
  }),
  component: TicketsPage,
});

function TicketsPage() {
  const { isManagement } = useSession();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sla, setSla] = useState("all");
  const [scope, setScope] = useState(isManagement ? "all" : "mine");

  const rows = useMemo(
    () =>
      tickets.filter((t) => {
        if (scope === "mine" && t.consultantId !== currentUser.id) return false;
        if (status !== "all" && t.status !== status) return false;
        if (sla !== "all" && t.slaStatus !== sla) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const customer = customers.find((c) => c.id === t.customerId);
        return (
          t.number.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          (customer?.name.toLowerCase().includes(q) ?? false) ||
          t.category.toLowerCase().includes(q)
        );
      }),
    [query, status, sla, scope],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tickets"
        description="Every customer issue, with live SLA tracking and clear ownership."
        actions={
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> New ticket
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets, customers, categories"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sla} onValueChange={setSla}>
            <SelectTrigger>
              <SelectValue placeholder="SLA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All SLA states</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="APPROACHING">Approaching</SelectItem>
              <SelectItem value="AT RISK">At risk</SelectItem>
              <SelectItem value="BREACHED">Breached</SelectItem>
            </SelectContent>
          </Select>
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger>
              <SelectValue placeholder="Ownership" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mine">Assigned to me</SelectItem>
              <SelectItem value="all">{isManagement ? "All team tickets" : "All visible tickets"}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {rows.map((t) => {
          const customer = customers.find((c) => c.id === t.customerId);
          return (
            <Link
              key={t.id}
              to="/tickets/$ticketId"
              params={{ ticketId: t.id }}
              className="block rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/60"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    <span className="text-primary">{t.number}</span> · {t.subject}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {customer?.name} · {t.category} · {t.channel} · {consultantById(t.consultantId)?.name} · {t.team}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <Pill key={tag}>{tag}</Pill>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <TicketStatusBadge status={t.status} />
                  <SlaBadge status={t.slaStatus} />
                  <span className="text-xs text-muted-foreground">{slaRemainingLabel(t.slaRemainingMinutes)}</span>
                </div>
              </div>
            </Link>
          );
        })}
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No tickets match the current filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
