import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Pause, Phone, PhoneCall, PhoneOff, PhoneOutgoing, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MetricCard } from "@/components/common/MetricCard";
import { Pill } from "@/components/common/StatusBadge";
import { AiDisclaimer, AiOutputBlock, AiStepLabel } from "@/components/common/AiPanel";
import { useBoosterAi } from "@/lib/use-booster-ai";
import { calls, consultantById, customerById, formatSeconds } from "@/data/demo";

export const Route = createFileRoute("/call-centre")({
  head: () => ({
    meta: [
      { title: "Call Centre | Booster Hub" },
      {
        name: "description",
        content: "Handle incoming and outgoing calls, log outcomes, capture notes and generate AI call summaries in Booster Hub.",
      },
      { property: "og:title", content: "Call Centre | Booster Hub" },
      { property: "og:description", content: "Softphone controls, call history and AI call summaries." },
    ],
  }),
  component: CallCentre,
});

function CallCentre() {
  const [onCall, setOnCall] = useState(false);
  const [held, setHeld] = useState(false);
  const [number, setNumber] = useState("");
  const [notes, setNotes] = useState("");
  const { generate, loading, output, setOutput } = useBoosterAi();

  const incoming = calls.filter((c) => c.direction === "Incoming").length;
  const missed = calls.filter((c) => c.direction === "Missed").length;
  const avg = Math.round(calls.reduce((a, c) => a + c.durationSeconds, 0) / Math.max(calls.length, 1));

  const summarise = () =>
    generate(
      "AI Call Summary",
      "You are Booster AI. Summarise call notes for a CRM record in professional South African business English. Never perform sentiment analysis. Output: Summary, Customer request, Actions taken, Follow-up required.",
      `Call notes:\n${notes || "No notes captured yet."}`,
    );

  return (
    <div className="space-y-5">
      <PageHeader title="Call Centre" description="Softphone controls, live call handling and call history." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Calls today" value={String(calls.length)} icon={PhoneCall} />
        <MetricCard label="Incoming" value={String(incoming)} icon={Phone} />
        <MetricCard label="Missed" value={String(missed)} icon={PhoneOff} tone="warning" />
        <MetricCard label="Average handling time" value={formatSeconds(avg)} icon={PhoneOutgoing} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Softphone</CardTitle>
            <CardDescription>{onCall ? (held ? "Call on hold" : "Call in progress") : "Ready for the next call"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="+27 82 000 0000" />
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  setOnCall(true);
                  setHeld(false);
                  toast.success("Call connected");
                }}
                disabled={onCall}
              >
                <PhoneCall className="mr-1.5 h-4 w-4" /> Answer / Dial
              </Button>
              <Button variant="outline" onClick={() => setHeld((h) => !h)} disabled={!onCall}>
                <Pause className="mr-1.5 h-4 w-4" /> {held ? "Resume" : "Hold"}
              </Button>
              <Button variant="outline" onClick={() => toast.success("Call transferred to Team Leader")} disabled={!onCall}>
                Transfer
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setOnCall(false);
                  setHeld(false);
                  toast.success("Call ended — capture your wrap-up notes");
                }}
                disabled={!onCall}
              >
                <PhoneOff className="mr-1.5 h-4 w-4" /> End
              </Button>
            </div>
            <div className="space-y-1.5">
              <p className="bh-metric-label">Call notes</p>
              <Textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Capture the reason for the call, actions taken and outcome…" />
            </div>
            <Button variant="secondary" className="w-full" onClick={() => void summarise()} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate AI call summary
            </Button>
            {output ? (
              <>
                <AiStepLabel step="AI RESPONSE" />
                <AiOutputBlock
                  actions={
                    <>
                      <Button size="sm" onClick={() => toast.success("Summary saved to the customer record")}>
                        Save to record
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Call history</CardTitle>
            <CardDescription>Every call is logged against the customer record.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {calls.map((c) => (
              <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {customerById(c.customerId)?.name} — {c.reason}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.startedAt} · {consultantById(c.consultantId)?.name} · {c.outcome}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.notes}</p>
                  {c.followUp ? <p className="mt-1 text-xs text-warning">Follow-up: {c.followUp}</p> : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Pill tone={c.direction === "Missed" ? "red" : c.direction === "Incoming" ? "green" : "navy"}>
                    {c.direction}
                  </Pill>
                  <span className="text-xs text-muted-foreground">{formatSeconds(c.durationSeconds)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
