import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Ticket as TicketIcon } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pill, SlaBadge, TaskStatusBadge, TicketStatusBadge } from "@/components/common/StatusBadge";
import { AiCopilotPanel } from "@/components/ai/AiCopilotPanel";
import {
  calls,
  chats,
  consultantById,
  customers,
  emails,
  escalations,
  formatSeconds,
  tasks,
  tickets,
} from "@/data/demo";

export const Route = createFileRoute("/customers/$customerId")({
  loader: ({ params }) => {
    const customer = customers.find((c) => c.id === params.customerId);
    if (!customer) throw notFound();
    return { customer };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Customer not found | Booster Hub CRM" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.customer.name} | Booster Hub CRM`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Customer profile for ${loaderData.customer.name} including tickets, calls, chats, emails, tasks, escalations and interaction history.`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Booster Hub single customer view." },
      ],
    };
  },
  component: CustomerDetail,
});

function CustomerDetail() {
  const { customer } = Route.useLoaderData();

  const custTickets = tickets.filter((t) => t.customerId === customer.id);
  const custCalls = calls.filter((c) => c.customerId === customer.id);
  const custEmails = emails.filter((e) => e.customerId === customer.id);
  const custChats = chats.filter((c) => c.customerId === customer.id);
  const custTasks = tasks.filter((t) => t.customerId === customer.id);
  const custEsc = escalations.filter((e) => e.customerId === customer.id);

  const timeline = [
    ...custCalls.map((c) => ({ at: c.startedAt, kind: "Call", text: `${c.direction} call — ${c.reason} (${c.outcome})` })),
    ...custEmails.map((e) => ({ at: e.receivedAt, kind: "Email", text: e.subject })),
    ...custChats.map((c) => ({ at: c.startedAt, kind: "Chat", text: `${c.state} chat session` })),
    ...custTickets.map((t) => ({ at: t.created, kind: "Ticket", text: `${t.number} — ${t.subject}` })),
    ...custEsc.map((e) => ({ at: e.raisedAt, kind: "Escalation", text: `${e.reference} — ${e.reason}` })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <div className="space-y-5">
      <PageHeader
        title={customer.name}
        description={`${customer.customerNumber} · Assigned to ${consultantById(customer.assignedConsultantId)?.name}`}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/customers">Back to customers</Link>
            </Button>
            <Button size="sm">
              <TicketIcon className="mr-1.5 h-4 w-4" /> Create ticket
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Customer details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="Contact number" value={customer.contactNumber} icon={Phone} />
            <Detail label="Email" value={customer.email} icon={Mail} />
            <Detail label="Address" value={customer.address} icon={MapPin} />
            <div>
              <p className="bh-metric-label">Account status</p>
              <div className="mt-1.5">
                <Pill tone={customer.accountStatus === "Active" ? "green" : customer.accountStatus === "Suspended" ? "red" : "amber"}>
                  {customer.accountStatus}
                </Pill>
              </div>
            </div>
            <Detail label="Assigned consultant" value={consultantById(customer.assignedConsultantId)?.name ?? "—"} />
            <Detail label="Preferred contact method" value={customer.preferredContact} />
          </CardContent>
        </Card>

        <AiCopilotPanel
          contextTitle={`Customer ${customer.name}`}
          contextSummary={`${customer.name} (${customer.customerNumber}), account ${customer.accountStatus}, preferred contact ${customer.preferredContact}. ${custTickets.length} tickets, ${custEsc.length} escalations.`}
          previousInteractions={timeline.slice(0, 5).map((t) => `${t.at} ${t.kind}: ${t.text}`)}
        />
      </div>

      <Tabs defaultValue="tickets">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="tickets">Tickets ({custTickets.length})</TabsTrigger>
            <TabsTrigger value="calls">Calls ({custCalls.length})</TabsTrigger>
            <TabsTrigger value="emails">Emails ({custEmails.length})</TabsTrigger>
            <TabsTrigger value="chats">Chats ({custChats.length})</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({custTasks.length})</TabsTrigger>
            <TabsTrigger value="escalations">Escalations ({custEsc.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="timeline">Interaction history</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tickets" className="space-y-2">
          {custTickets.map((t) => (
            <Link
              key={t.id}
              to="/tickets/$ticketId"
              params={{ ticketId: t.id }}
              className="block rounded-lg border border-border bg-card p-3 hover:bg-muted/60"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    <span className="text-primary">{t.number}</span> · {t.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.category} · {t.channel} · created {t.created}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <TicketStatusBadge status={t.status} />
                  <SlaBadge status={t.slaStatus} />
                </div>
              </div>
            </Link>
          ))}
          {custTickets.length === 0 ? <Empty text="No tickets for this customer." /> : null}
        </TabsContent>

        <TabsContent value="calls" className="space-y-2">
          {custCalls.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-semibold">
                {c.direction} · {c.reason}
              </p>
              <p className="text-xs text-muted-foreground">
                {c.startedAt} · {formatSeconds(c.durationSeconds)} · {consultantById(c.consultantId)?.name} · {c.outcome}
              </p>
              <p className="mt-1.5 text-sm">{c.notes}</p>
            </div>
          ))}
          {custCalls.length === 0 ? <Empty text="No calls recorded." /> : null}
        </TabsContent>

        <TabsContent value="emails" className="space-y-2">
          {custEmails.map((e) => (
            <div key={e.id} className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-semibold">{e.subject}</p>
              <p className="text-xs text-muted-foreground">
                {e.folder} · {e.from} · {e.receivedAt}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">{e.preview}</p>
            </div>
          ))}
          {custEmails.length === 0 ? <Empty text="No emails recorded." /> : null}
        </TabsContent>

        <TabsContent value="chats" className="space-y-2">
          {custChats.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <Pill tone={c.state === "Active" ? "green" : c.state === "Waiting" ? "amber" : "neutral"}>{c.state}</Pill>
                <span className="text-xs text-muted-foreground">{c.startedAt}</span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                {c.messages.map((m, i) => (
                  <p key={i}>
                    <span className="font-semibold">{m.from}:</span> {m.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {custChats.length === 0 ? <Empty text="No chat sessions." /> : null}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-2">
          {custTasks.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.title}</span>
              <Pill>{t.origin}</Pill>
              <TaskStatusBadge status={t.status} />
              <span className="text-xs text-muted-foreground">Due {t.dueDate}</span>
            </div>
          ))}
          {custTasks.length === 0 ? <Empty text="No tasks." /> : null}
        </TabsContent>

        <TabsContent value="escalations" className="space-y-2">
          {custEsc.map((e) => (
            <div key={e.id} className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-semibold">
                {e.reference} · {e.level}
              </p>
              <p className="text-xs text-muted-foreground">
                Owner {consultantById(e.currentOwnerId)?.name} · raised {e.raisedAt}
              </p>
              <p className="mt-1.5 text-sm">{e.reason}</p>
              <div className="mt-2 flex items-center gap-2">
                <SlaBadge status={e.slaStatus} />
                <Pill tone={e.status === "Resolved" ? "green" : "amber"}>{e.status}</Pill>
              </div>
            </div>
          ))}
          {custEsc.length === 0 ? <Empty text="No escalations." /> : null}
        </TabsContent>

        <TabsContent value="notes" className="space-y-2">
          {customer.notes.map((n, i) => (
            <p key={i} className="rounded-lg border border-border bg-card p-3 text-sm">
              {n}
            </p>
          ))}
          {customer.notes.length === 0 ? <Empty text="No notes captured." /> : null}
        </TabsContent>

        <TabsContent value="timeline">
          <ol className="space-y-2">
            {timeline.map((item, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">{item.at}</span>
                <div className="min-w-0">
                  <Pill tone="navy">{item.kind}</Pill>
                  <p className="mt-1 text-sm">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Detail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Mail;
}) {
  return (
    <div className="min-w-0">
      <p className="bh-metric-label">{label}</p>
      <p className="mt-1 flex items-start gap-1.5 text-sm">
        {Icon ? <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : null}
        <span className="min-w-0 break-words">{value}</span>
      </p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}
