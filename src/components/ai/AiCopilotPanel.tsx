import { useState } from "react";
import { Sparkles, Loader2, Copy, ArrowUpCircle, ListChecks, CalendarClock, BookOpen, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AiDisclaimer, AiOutputBlock, AiStepLabel } from "@/components/common/AiPanel";
import { SlaBadge } from "@/components/common/StatusBadge";
import { useBoosterAi } from "@/lib/use-booster-ai";
import { knowledgeArticles, type SlaStatus } from "@/data/demo";

interface Props {
  contextTitle: string;
  contextSummary: string;
  slaStatus?: SlaStatus;
  previousInteractions: string[];
}

const SYSTEM =
  "You are Booster AI, the assistive copilot inside the Booster Hub CRM and call centre platform. You support consultants with concise, professional South African business English. Never invent customer data. Never make employment or disciplinary judgements. Never perform sentiment analysis. Output short, well-structured plain text with clear headings.";

export function AiCopilotPanel({ contextTitle, contextSummary, slaStatus, previousInteractions }: Props) {
  const { generate, loading, output, setOutput } = useBoosterAi();
  const [mode, setMode] = useState<string>("");

  const article = knowledgeArticles[0];

  const ask = async (label: string, instruction: string) => {
    setMode(label);
    await generate(
      `Copilot — ${label}`,
      SYSTEM,
      `${instruction}\n\nCONTEXT\nTitle: ${contextTitle}\nSummary: ${contextSummary}\nSLA status: ${slaStatus ?? "n/a"}\nPrevious interactions:\n${previousInteractions.join("\n")}`,
    );
  };

  return (
    <Card className="border-accent/40">
      <CardHeader className="flex-row items-center gap-2">
        <Sparkles className="h-4 w-4 text-success" />
        <CardTitle className="text-base">Booster AI Copilot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AiStepLabel step="INPUT">Context is taken from this record, respecting your role permissions.</AiStepLabel>

        <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-3 text-sm">
          <p>
            <span className="bh-metric-label">Customer / issue summary</span>
            <br />
            {contextSummary}
          </p>
          <p className="text-xs text-muted-foreground">
            Previous interactions: {previousInteractions.length} recorded
          </p>
          {slaStatus ? (
            <div className="flex items-center gap-2">
              <span className="bh-metric-label">SLA</span>
              <SlaBadge status={slaStatus} />
            </div>
          ) : null}
          <div className="flex items-start gap-2 text-xs">
            <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>
              Relevant knowledge article: <span className="font-medium">{article?.title ?? "—"}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => ask("Summarize", "Summarise this record for the consultant in 4 bullet points.")}>
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Summarize
          </Button>
          <Button size="sm" variant="secondary" onClick={() => ask("Generate response", "Draft a short professional response to the customer for this record.")}>
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Generate response
          </Button>
          <Button size="sm" variant="secondary" onClick={() => ask("Next action", "Recommend the single best next action and why, in 3 lines.")}>
            <ListChecks className="mr-1.5 h-3.5 w-3.5" /> Recommended next action
          </Button>
          <Button size="sm" variant="secondary" onClick={() => ask("Create task", "Propose one follow-up task with a title, owner suggestion and due time.")}>
            <CalendarClock className="mr-1.5 h-3.5 w-3.5" /> Create task / follow-up
          </Button>
          <Button size="sm" variant="secondary" onClick={() => ask("Escalation", "Prepare a concise escalation note including reason, impact and requested action.")}>
            <ArrowUpCircle className="mr-1.5 h-3.5 w-3.5" /> Prepare escalation
          </Button>
          <Button size="sm" variant="secondary" onClick={() => ask("Find knowledge", "Suggest which internal knowledge topics the consultant should read and why.")}>
            <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Find knowledge
          </Button>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Booster AI is preparing a recommendation…
          </p>
        ) : null}

        {output ? (
          <>
            <AiStepLabel step="AI RESPONSE">{mode}</AiStepLabel>
            <AiOutputBlock
              actions={
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard?.writeText(output);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                  </Button>
                  <Button size="sm" onClick={() => toast.success("Approved and applied by you — logged to the AI audit log")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setOutput(null)}>
                    Reject
                  </Button>
                </>
              }
            >
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{output}</pre>
            </AiOutputBlock>
            <AiStepLabel step="USER ACTION">Human approval is required before anything is saved or sent.</AiStepLabel>
          </>
        ) : null}

        <AiDisclaimer />
      </CardContent>
    </Card>
  );
}
