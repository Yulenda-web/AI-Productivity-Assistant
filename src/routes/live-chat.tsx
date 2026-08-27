import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/common/StatusBadge";
import { AiDisclaimer, AiOutputBlock, AiStepLabel } from "@/components/common/AiPanel";
import { useBoosterAi } from "@/lib/use-booster-ai";
import { chats, consultantById, customerById, formatSeconds } from "@/data/demo";

export const Route = createFileRoute("/live-chat")({
  head: () => ({
    meta: [
      { title: "Live Chat | Booster Hub" },
      {
        name: "description",
        content: "Manage waiting and active customer chat sessions, capture internal notes and use AI suggested replies in Booster Hub.",
      },
      { property: "og:title", content: "Live Chat | Booster Hub" },
      { property: "og:description", content: "Real-time chat queue with AI suggested replies." },
    ],
  }),
  component: LiveChat,
});

function LiveChat() {
  const [activeId, setActiveId] = useState(chats[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const { generate, loading, output, setOutput } = useBoosterAi();
  const active = chats.find((c) => c.id === activeId);

  const suggest = () => {
    if (!active) return;
    const transcript = active.messages.map((m) => `${m.from}: ${m.text}`).join("\n");
    void generate(
      "AI Suggested Reply",
      "You are Booster AI supporting a live chat consultant. Suggest one short, professional reply in South African business English. Never perform sentiment analysis. Never promise anything not supported by the transcript.",
      `Chat transcript:\n${transcript}\nSuggest the next consultant reply.`,
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Live Chat" description="Waiting, active and closed customer chat sessions." />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Chat queue</CardTitle>
            <CardDescription>{chats.filter((c) => c.state === "Waiting").length} customers waiting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {chats.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveId(c.id);
                  setOutput(null);
                }}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  c.id === activeId ? "border-accent bg-accent/8" : "border-border hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{customerById(c.customerId)?.name}</span>
                  <Pill tone={c.state === "Active" ? "green" : c.state === "Waiting" ? "amber" : "navy"}>{c.state}</Pill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.state === "Waiting" ? `Waiting ${formatSeconds(c.waitingSeconds)}` : `Started ${c.startedAt}`}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {active ? customerById(active.customerId)?.name : "No chat selected"}
              </CardTitle>
              <CardDescription>
                {active?.consultantId ? `Handled by ${consultantById(active.consultantId)?.name}` : "Unassigned — accept to start"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-[360px] space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/40 p-3">
                {active?.messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.from === "Consultant"
                        ? "ml-auto max-w-[80%] rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                        : "mr-auto max-w-[80%] rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    }
                  >
                    <p>{m.text}</p>
                    <p className="mt-0.5 text-[10px] opacity-70">{m.at}</p>
                  </div>
                ))}
                {!active?.messages.length ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No messages yet.</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type your reply…" />
                <Button
                  onClick={() => {
                    setDraft("");
                    toast.success("Message sent");
                  }}
                >
                  <Send className="mr-1.5 h-4 w-4" /> Send
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={suggest} disabled={loading || !active}>
                  {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
                  AI suggested reply
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Ticket created from this chat")}>
                  Create ticket
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Chat transferred")}>
                  Transfer
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Chat closed")}>
                  Close chat
                </Button>
              </div>
              {output ? (
                <>
                  <AiStepLabel step="AI RESPONSE" />
                  <AiOutputBlock
                    actions={
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            setDraft(output);
                            toast.success("Inserted into your reply box for review");
                          }}
                        >
                          Use reply
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setOutput(null)}>
                          Discard
                        </Button>
                      </>
                    }
                  >
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{output}</pre>
                  </AiOutputBlock>
                </>
              ) : null}
              <AiDisclaimer short />
            </CardContent>
          </Card>

          {active?.internalNotes.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Internal notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm text-muted-foreground">
                {active.internalNotes.map((n, i) => (
                  <p key={i}>• {n}</p>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
