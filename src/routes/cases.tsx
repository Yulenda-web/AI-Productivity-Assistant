import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Ticket as TicketIcon, AlertTriangle, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Pill, SlaBadge, TicketStatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consultantById, customers, tickets } from "@/data/demo";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "Cases — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Group related tickets into customer cases, track case ownership, SLA health and resolution progress in Booster Hub.",
      },
      { property: "og:title", content: "Cases — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Customer case view grouping related tickets with SLA and ownership tracking.",
      },
    ],
  }),
  component: CasesPage,
});

const OPEN_STATUSES = ["NEW", "OPEN", "IN PROGRESS", "ESCALATED"];

function CasesPage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("all");

  const cases = useMemo(() => {
    return customers
      .map((customer, index) => {
        const related = tickets.filter((t) => t.customerId === customer.id);
        const open = related.filter((t) => OPEN_STATUSES.includes(t.status));
        const breached = related.some((t) => t.slaStatus === "BREACHED");
        const atRisk = related.some((t) => t.slaStatus === "AT RISK" || t.slaStatus === "APPROACHING");
        return {
          reference: `CASE-31${String(index + 10).padStart(2, "0")}`,
          customer,
          tickets: related,
          openCount: open.length,
          owner: consultantById(related[0]?.consultantId ?? customer.assignedConsultantId),
          sla: breached ? ("BREACHED" as const) : atRisk ? ("AT RISK" as const) : ("NORMAL" as const),
          state: open.length > 0 ? "Open" : related.length > 0 ? "Resolved" : "No activity",
          category: related[0]?.category ?? "General enquiry",
        };
      })
      .filter((c) => c.tickets.length > 0);
  }, []);

  const filtered = cases.filter((c) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      c.reference.toLowerCase().includes(q) ||
      c.customer.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    const matchesState = state === "all" || c.state.toLowerCase() === state;
    return matchesQuery && matchesState;
  });

  const openCases = cases.filter((c) => c.state === "Open").length;
  const riskCases = cases.filter((c) => c.sla !== "NORMAL").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cases"
        description="Related tickets grouped into a single customer case with shared ownership and SLA health."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total cases" value={cases.length} icon={FolderKanban} />
        <MetricCard label="Open cases" value={openCases} icon={TicketIcon} tone="info" />
        <MetricCard label="Cases at SLA risk" value={riskCases} icon={AlertTriangle} tone="amber" />
        <MetricCard
          label="Resolved cases"
          value={cases.length - openCases}
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search case, customer or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Case state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <article
            key={c.reference}
            className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold">{c.reference}</span>
                  <Pill tone={c.state === "Open" ? "navy" : "green"}>{c.state}</Pill>
                  <SlaBadge status={c.sla} />
                </div>
                <Link
                  to="/customers/$customerId"
                  params={{ customerId: c.customer.id }}
                  className="mt-1 block truncate text-sm font-semibold text-primary hover:underline"
                >
                  {c.customer.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {c.category} · Owner {c.owner?.name ?? "Unassigned"} · {c.tickets.length} linked ticket
                  {c.tickets.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {c.tickets.map((t) => (
                <Link
                  key={t.id}
                  to="/tickets/$ticketId"
                  params={{ ticketId: t.id }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 transition-colors hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold">{t.number}</span>
                    <span className="block truncate text-xs text-muted-foreground">{t.subject}</span>
                  </span>
                  <TicketStatusBadge status={t.status} />
                </Link>
              ))}
            </div>
          </article>
        ))}
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No cases match your filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
