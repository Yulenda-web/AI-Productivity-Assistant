import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Inbox, Send, Sparkles, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Pill } from "@/components/common/StatusBadge";
import { AiDisclaimer, AiOutputBlock, AiStepLabel } from "@/components/common/AiPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consultantById, customerById, emails } from "@/data/demo";
import { useBoosterAi } from "@/lib/use-booster-ai";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Management — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Work the shared service inbox: assign customer emails, link them to tickets and draft replies with Booster AI assistance.",
      },
      { property: "og:title", content: "Email Management — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Shared inbox with assignment, ticket linking and AI-assisted replies.",
      },
    ],
  }),
  component: EmailPage,
});

const FOLDERS = ["Inbox", "Assigned", "Unassigned", "Sent", "Drafts", "Closed"] as const;

function EmailPage() {
  const [folder, setFolder] = useState<(typeof FOLDERS)[number]>("Inbox");
  const [selectedId, setSelectedId] = useState(emails[0]?.id ?? "");
  const [reply, setReply] = useState("");
  const ai = useBoosterAi();

  const list = useMemo(
    () => emails.filter((e) => (folder === "Inbox" ? true : e.folder === folder)),
    [folder],
  );
  const selected = emails.find((e) => e.id === selectedId) ?? list[0];
  const customer = customerById(selected?.customerId);

  const unread = emails.filter((e) => e.unread).length;
  const unassigned = emails.filter((e) => e.folder === "Unassigned").length;

  const draftReply = async () => {
    if (!selected) return;
    const text = await ai.generate(
      "Email Reply Assistant",
      "You are a professional South African customer service consultant. Write a clear, polite, concise email reply. No priority labels, no sentiment analysis. Plain text only.",
      `Customer email subject: ${selected.subject}\n\nCustomer message:\n${selected.body}\n\nDraft a reply that acknowledges the issue, explains the next step and gives a realistic timeframe.`,
    );
    if (text) setReply(text);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Email Management"
        description="Shared service inbox with assignment, ticket linking and AI-assisted replies."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total emails" value={emails.length} icon={Mail} />
        <MetricCard label="Unread" value={unread} icon={Inbox} tone="info" />
        <MetricCard label="Unassigned" value={unassigned} icon={Mail} tone="amber" />
        <MetricCard
          label="Sent today"
          value={emails.filter((e) => e.folder === "Sent").length}
          icon={Send}
          tone="green"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-3">
          <Select value={folder} onValueChange={(v) => setFolder(v as typeof folder)}>
            <SelectTrigger>
              <SelectValue placeholder="Folder" />
            </SelectTrigger>
            <SelectContent>
              {FOLDERS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            {list.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setSelectedId(e.id)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  selected?.id === e.id
                    ? "border-primary/40 bg-primary/6"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold">{e.from}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{e.receivedAt}</span>
                </div>
                <p className="mt-1 truncate text-sm font-semibold">{e.subject}</p>
                <p className="truncate text-xs text-muted-foreground">{e.preview}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Pill tone="neutral">{e.folder}</Pill>
                  {e.unread ? <Pill tone="info">Unread</Pill> : null}
                  {e.ticketId ? <Pill tone="navy">Linked ticket</Pill> : null}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selected ? (
          <div className="space-y-4">
            <article className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <h2 className="text-base font-bold">{selected.subject}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                From {selected.from} · {selected.receivedAt} ·{" "}
                {consultantById(selected.consultantId)?.name ?? "Unassigned"}
                {customer ? ` · ${customer.name}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm">{selected.body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.success("Email assigned to you")}>
                  Assign to me
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Converted to a ticket")}>
                  Convert to ticket
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Email closed")}>
                  Close email
                </Button>
              </div>
            </article>

            <section className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <AiStepLabel step="INPUT">Reply draft for {selected.from}</AiStepLabel>
              <Input readOnly value={`Re: ${selected.subject}`} />
              <Textarea
                rows={8}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply, or let Booster AI draft one for you to review."
              />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={draftReply} disabled={ai.loading}>
                  {ai.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Draft with Booster AI
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (!reply.trim()) return toast.error("Nothing to send yet");
                    toast.success("Reply sent and logged on the customer record");
                    setReply("");
                  }}
                >
                  Send reply
                </Button>
              </div>
              {ai.output ? (
                <AiOutputBlock title="Suggested reply">
                  <p className="whitespace-pre-wrap">{ai.output}</p>
                </AiOutputBlock>
              ) : null}
              <AiDisclaimer short />
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
