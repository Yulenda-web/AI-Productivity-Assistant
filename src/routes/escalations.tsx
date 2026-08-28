import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpCircle, AlertTriangle, CheckCircle2, Users } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Pill, SlaBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consultantById, customerById, escalations, ticketById } from "@/data/demo";
import { toast } from "sonner";

export const Route = createFileRoute("/escalations")({
  head: () => ({
    meta: [
      { title: "Escalations — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Track escalated customer queries through the Booster Hub escalation path with owner, level, SLA state and resolution notes.",
      },
      { property: "og:title", content: "Escalations — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Escalation register with ownership, escalation level, SLA state and outcomes.",
      },
    ],
  }),
  component: EscalationsPage,
});

function EscalationsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = escalations.filter((e) => {
    const q = query.trim().toLowerCase();
    const customer = customerById(e.customerId);
    const matchesQuery =
      !q ||
      e.reference.toLowerCase().includes(q) ||
      e.reason.toLowerCase().includes(q) ||
      (customer?.name.toLowerCase().includes(q) ?? false);
    const matchesStatus = status === "all" || e.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Escalations"
        description="Queries escalated beyond first line, with the full escalation path and current owner."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total escalations" value={escalations.length} icon={ArrowUpCircle} />
        <MetricCard
          label="Open"
          value={escalations.filter((e) => e.status === "Open").length}
          icon={AlertTriangle}
          tone="amber"
        />
        <MetricCard
          label="In review"
          value={escalations.filter((e) => e.status === "In Review").length}
          icon={Users}
          tone="info"
        />
        <MetricCard
          label="Resolved"
          value={escalations.filter((e) => e.status === "Resolved").length}
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search reference, customer or reason"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((e) => {
          const ticket = ticketById(e.ticketId);
          const customer = customerById(e.customerId);
          return (
            <article
              key={e.id}
              className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold">{e.reference}</span>
                    <Pill tone={e.status === "Resolved" ? "green" : e.status === "Open" ? "amber" : "info"}>
                      {e.status}
                    </Pill>
                    <SlaBadge status={e.slaStatus} />
                    <Pill tone="navy">{e.level}</Pill>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold">{e.reason}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {customer?.name} · Raised {e.raisedAt} · Owner{" "}
                    {consultantById(e.currentOwnerId)?.name ?? "Unassigned"}
                  </p>
                  {e.resolution ? (
                    <p className="mt-2 rounded-lg border border-success/25 bg-success/8 p-2 text-xs">
                      Resolution: {e.resolution}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {ticket ? (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/tickets/$ticketId" params={{ ticketId: ticket.id }}>
                        {ticket.number}
                      </Link>
                    </Button>
                  ) : null}
                  {e.status !== "Resolved" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success(`${e.reference} escalated to the next level`)}
                      >
                        Escalate further
                      </Button>
                      <Button size="sm" onClick={() => toast.success(`${e.reference} marked resolved`)}>
                        Resolve
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No escalations match your filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
