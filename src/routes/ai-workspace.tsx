import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, Copy, FileText, Loader2, Mail, Search, Sparkles, ListTodo } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiDisclaimer, AiOutputBlock, AiStepLabel } from "@/components/common/AiPanel";
import { useBoosterAi } from "@/lib/use-booster-ai";

export const Route = createFileRoute("/ai-workspace")({
  head: () => ({
    meta: [
      { title: "AI Workspace | Booster Hub" },
      {
        name: "description",
        content:
          "Booster Hub AI Workspace: smart email writer, meeting summarizer, task planner, research assistant and internal chatbot for consultants.",
      },
      { property: "og:title", content: "AI Workspace | Booster Hub" },
      { property: "og:description", content: "Five assistive AI tools for consultants and managers." },
    ],
  }),
  component: AiWorkspace,
});

const SYSTEM =
  "You are Booster AI inside the Booster Hub CRM and call centre platform. Write concise, professional South African business English. Never invent customer facts, never perform sentiment analysis, never make employment judgements. Output clear plain text with short headings and bullets.";

const TOOLS = [
  { id: "email", label: "Smart Email Writer", icon: Mail, blurb: "Draft professional customer emails from a short brief." },
  { id: "meeting", label: "Meeting Summarizer", icon: FileText, blurb: "Turn meeting notes into a summary with action items." },
  { id: "planner", label: "Task Planner", icon: ListTodo, blurb: "Break a goal into an ordered, realistic task plan." },
  { id: "research", label: "Research Assistant", icon: Search, blurb: "Summarise internal knowledge and policy questions." },
  { id: "chatbot", label: "Booster Chatbot", icon: Bot, blurb: "Ask questions about processes, tools and next steps." },
] as const;

export default function AiWorkspace() {
  const [tab, setTab] = useState<string>("email");

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Workspace"
        description="Assistive tools for consultants and managers. Every output is a recommendation you review before use."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TOOLS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className="text-left">
            <Card className={tab === t.id ? "h-full border-accent bg-accent/8" : "h-full transition-colors hover:bg-muted/60"}>
              <CardHeader className="space-y-1.5 pb-3">
                <t.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm">{t.label}</CardTitle>
                <CardDescription className="text-xs">{t.blurb}</CardDescription>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto">
          <TabsList>
            {TOOLS.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="email">
          <ToolPanel
            title="Smart Email Writer"
            fields={[
              { key: "recipient", label: "Recipient / customer", placeholder: "Thandi Mokoena — premium client" },
              { key: "purpose", label: "Purpose of the email", placeholder: "Confirm the debit order reversal timeline" },
              { key: "tone", label: "Tone", placeholder: "Professional and reassuring" },
            ]}
            bodyLabel="Key points to include"
            buildPrompt={(f, body) =>
              `Write a customer email.\nRecipient: ${f['recipient']}\nPurpose: ${f['purpose']}\nTone: ${f['tone']}\nKey points:\n${body}\nInclude a subject line and a professional sign-off from a Booster Hub consultant.`
            }
          />
        </TabsContent>

        <TabsContent value="meeting">
          <ToolPanel
            title="Meeting Summarizer"
            fields={[
              { key: "title", label: "Meeting title", placeholder: "Weekly Billing team sync" },
              { key: "attendees", label: "Attendees", placeholder: "Yulenda, Sipho, Naledi" },
            ]}
            bodyLabel="Meeting notes or transcript"
            buildPrompt={(f, body) =>
              `Summarise this meeting.\nTitle: ${f['title']}\nAttendees: ${f['attendees']}\nNotes:\n${body}\nReturn: Summary, Key decisions, Action items with owners, Follow-up dates.`
            }
          />
        </TabsContent>

        <TabsContent value="planner">
          <ToolPanel
            title="Task Planner"
            fields={[
              { key: "goal", label: "Goal", placeholder: "Clear the escalation backlog before Friday" },
              { key: "deadline", label: "Deadline", placeholder: "Friday 16:00" },
            ]}
            bodyLabel="Constraints, workload or context"
            buildPrompt={(f, body) =>
              `Create a practical task plan.\nGoal: ${f['goal']}\nDeadline: ${f['deadline']}\nContext:\n${body}\nReturn an ordered task list with suggested time blocks and dependencies. Do not use priority labels.`
            }
          />
        </TabsContent>

        <TabsContent value="research">
          <ToolPanel
            title="Research Assistant"
            fields={[{ key: "topic", label: "Question or topic", placeholder: "What is our debit order reversal process?" }]}
            bodyLabel="Any internal notes or policy extracts to consider"
            buildPrompt={(f, body) =>
              `Answer this internal question for a consultant.\nQuestion: ${f['topic']}\nSupporting notes:\n${body}\nReturn a short explanation, the recommended steps, and what to confirm with a supervisor. State clearly when information is not verified.`
            }
          />
        </TabsContent>

        <TabsContent value="chatbot">
          <ChatbotPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface Field {
  key: string;
  label: string;
  placeholder: string;
}

function ToolPanel({
  title,
  fields,
  bodyLabel,
  buildPrompt,
}: {
  title: string;
  fields: Field[];
  bodyLabel: string;
  buildPrompt: (fields: Record<string, string>, body: string) => string;
}) {
  const { generate, loading, output, setOutput } = useBoosterAi();
  const [values, setValues] = useState<Record<string, string>>({});
  const [body, setBody] = useState("");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>Provide the input, then review the AI recommendation before using it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <AiStepLabel step="INPUT" />
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label className="bh-metric-label" htmlFor={f.key}>
                {f.label}
              </label>
              <Input
                id={f.key}
                placeholder={f.placeholder}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="bh-metric-label" htmlFor="body">
              {bodyLabel}
            </label>
            <Textarea id="body" rows={7} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={() => generate(title, SYSTEM, buildPrompt(values, body))}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate with Booster AI
          </Button>
          <AiDisclaimer />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <AiStepLabel step="AI RESPONSE" />
        {output ? (
          <AiOutputBlock
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard?.writeText(output);
                    toast.success("Copied");
                  }}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                </Button>
                <Button size="sm" onClick={() => toast.success("Saved to your workspace")}>
                  Accept
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setOutput(null)}>
                  Discard
                </Button>
              </>
            }
          >
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{output}</pre>
          </AiOutputBlock>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            {loading ? "Booster AI is working…" : "The AI recommendation will appear here."}
          </p>
        )}
        <AiStepLabel step="USER ACTION">Nothing is sent or saved until you accept it.</AiStepLabel>
      </div>
    </div>
  );
}

function ChatbotPanel() {
  const { generate, loading } = useBoosterAi();
  const [input, setInput] = useState("");
  const [thread, setThread] = useState<{ role: "you" | "ai"; text: string }[]>([
    { role: "ai", text: "Hello. Ask me about Booster Hub processes, tickets, SLAs or the tools available to you." },
  ]);

  const send = async () => {
    const q = input.trim();
    if (!q) return;
    setThread((t) => [...t, { role: "you", text: q }]);
    setInput("");
    const history = thread.map((m) => `${m.role === "you" ? "User" : "Booster AI"}: ${m.text}`).join("\n");
    const answer = await generate("Booster Chatbot", SYSTEM, `${history}\nUser: ${q}\nAnswer helpfully and briefly.`);
    if (answer) setThread((t) => [...t, { role: "ai", text: answer }]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Booster Chatbot</CardTitle>
        <CardDescription>An internal assistant for process and platform questions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/40 p-3">
          {thread.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "you"
                  ? "ml-auto max-w-[85%] rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                  : "mr-auto max-w-[85%] rounded-xl border border-accent/40 bg-card px-3 py-2 text-sm"
              }
            >
              {m.role === "ai" ? (
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-success">AI generated</span>
              ) : null}
              <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
            </div>
          ))}
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void send();
            }}
            placeholder="Ask Booster AI a question…"
          />
          <Button onClick={() => void send()} disabled={loading}>
            Send
          </Button>
        </div>
        <AiDisclaimer short />
      </CardContent>
    </Card>
  );
}
