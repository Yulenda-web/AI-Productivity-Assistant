import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpCircle, Paperclip, Send } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Pill, SlaBadge, TicketStatusBadge } from "@/components/common/StatusBadge";
import { AiCopilotPanel } from "@/components/ai/AiCopilotPanel";
import { consultantById, customers, slaRemainingLabel, tickets } from "@/data/demo";

export const Route = createFileRoute("/tickets/$ticketId")({
  loader: ({ params }) => {
    const ticket = tickets.find((t) => t.id === params.ticketId);
    if (!ticket) throw notFound();
    return { ticket };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Ticket not found | Booster Hub" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.ticket.number} — ${loaderData.ticket.subject} | Booster Hub`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.ticket.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: "Ticket detail with SLA timer, history and Booster AI copilot." },
      ],
    };
  },
  component: TicketDetail,
});

function TicketDetail() {
  const { ticket } = Route.useLoaderData();
  const customer = customers.find((c) => c.id === ticket.customerId);
  const owner = consultantById(ticket.consultantId);

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${ticket.number} · ${ticket.subject}`}
        description={`${ticket.category} · ${ticket.channel} · ${ticket.team}`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/tickets">Back to tickets</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Escalation prepared for review")}>
              <ArrowUpCircle className="mr-1.5 h-4 w-4" /> Escalate
            </Button>
            <Button size="sm" onClick={() => toast.success("Ticket updated")}>
              Update status
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row flex-wrap items-center gap-2">
              <TicketStatusBadge status={ticket.status} />
              <SlaBadge status={ticket.slaStatus} />
              <span className="text-xs text-muted-foreground">
                {ticket.sla} · deadline {ticket.slaDeadline} · {slaRemainingLabel(ticket.slaRemainingMinutes)}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{ticket.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {ticket.tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
              {ticket.attachments.length ? (
                <div className="space-y-1">
                  <p className="bh-metric-label">Attachments</p>
                  {ticket.attachments.map((a) => (
                    <p key={a} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Paperclip className="h-3.5 w-3.5" /> {a}
                    </p>
                  ))}
                </div>
              ) : null}
              {ticket.resolution ? (
                <>
                  <Separator />
                  <div>
                    <p className="bh-metric-label">Resolution</p>
                    <p className="mt-1 text-sm">{ticket.resolution}</p>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity & internal notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="space-y-3">
                <li className="rounded-lg border border-border p-3 text-sm">
                  <p className="bh-metric-label">Created {ticket.created}</p>
                  <p className="mt-1">Ticket logged via {ticket.channel} and routed to {ticket.team}.</p>
                </li>
                {ticket.notes.map((n, i) => (
                  <li key={i} className="rounded-lg border border-border p-3 text-sm">
                    <p className="bh-metric-label">
                      {n.author} · {n.at}
                    </p>
                    <p className="mt-1">{n.text}</p>
                  </li>
                ))}
                <li className="rounded-lg border border-border p-3 text-sm">
                  <p className="bh-metric-label">Last updated {ticket.updated}</p>
                </li>
              </ol>
              <Separator />
              <Textarea placeholder="Add an internal note or customer update…" rows={3} />
              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Note added to the ticket")}>
                  <Send className="mr-1.5 h-4 w-4" /> Add note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Customer">
                {customer ? (
                  <Link to="/customers/$customerId" params={{ customerId: customer.id }} className="text-primary underline-offset-2 hover:underline">
                    {customer.name}
                  </Link>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="Assigned consultant">{owner?.name ?? "Unassigned"}</Row>
              <Row label="Team">{ticket.team}</Row>
              <Row label="Channel">{ticket.channel}</Row>
              <Row label="Category">{ticket.category}</Row>
              <Row label="Created">{ticket.created}</Row>
              <Row label="Last updated">{ticket.updated}</Row>
            </CardContent>
          </Card>

          <AiCopilotPanel
            contextTitle={`${ticket.number} — ${ticket.subject}`}
            contextSummary={`${ticket.description} Category ${ticket.category}, status ${ticket.status}, customer ${customer?.name ?? "unknown"}.`}
            slaStatus={ticket.slaStatus}
            previousInteractions={ticket.notes.map((n) => `${n.at} ${n.author}: ${n.text}`)}
          />
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <span className="bh-metric-label">{label}</span>
      <span className="min-w-0 text-right">{children}</span>
    </div>
  );
}
