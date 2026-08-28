import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Search, Sparkles, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Pill } from "@/components/common/StatusBadge";
import { AiDisclaimer, AiOutputBlock, AiStepLabel } from "@/components/common/AiPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consultantById, knowledgeArticles } from "@/data/demo";
import { useBoosterAi } from "@/lib/use-booster-ai";

export const Route = createFileRoute("/knowledge-base")({
  head: () => ({
    meta: [
      { title: "Knowledge Base — Booster Hub CRM" },
      {
        name: "description",
        content:
          "Search Booster Hub troubleshooting guides, resolution steps and internal process articles, with an AI summary for faster answers.",
      },
      { property: "og:title", content: "Knowledge Base — Booster Hub CRM" },
      {
        property: "og:description",
        content: "Searchable resolution guides and process articles with AI-assisted summaries.",
      },
    ],
  }),
  component: KnowledgeBasePage,
});

function KnowledgeBasePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState(knowledgeArticles[0]?.id ?? "");
  const ai = useBoosterAi();

  const categories = useMemo(
    () => Array.from(new Set(knowledgeArticles.map((a) => a.category))),
    [],
  );

  const filtered = knowledgeArticles.filter((a) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.problem.toLowerCase().includes(q) ||
      a.keywords.some((k) => k.includes(q));
    return matchesQuery && (category === "all" || a.category === category);
  });

  const open = knowledgeArticles.find((a) => a.id === openId) ?? filtered[0];

  const summarise = async () => {
    if (!open) return;
    await ai.generate(
      "Knowledge Base Summary",
      "You summarise internal support knowledge articles for consultants. Be brief and practical. No priority labels, no sentiment analysis.",
      `Article: ${open.title}\nProblem: ${open.problem}\nSolution: ${open.solution}\nSteps: ${open.steps.join(" | ")}\n\nGive a 3-line summary a consultant can read while on a call.`,
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Knowledge Base"
        description="Troubleshooting guides, resolution steps and internal processes for the service team."
      />

      <div className="flex flex-wrap gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search articles or keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-2">
          {filtered.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setOpenId(a.id)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                open?.id === a.id ? "border-primary/40 bg-primary/6" : "border-border bg-card hover:bg-muted"
              }`}
            >
              <p className="text-sm font-semibold">{a.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.category}</p>
            </button>
          ))}
          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No articles found.
            </p>
          ) : null}
        </div>

        {open ? (
          <div className="space-y-4">
            <article className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <Pill tone="navy">{open.category}</Pill>
                <span className="text-xs text-muted-foreground">Updated {open.lastUpdated}</span>
              </div>
              <h2 className="mt-2 text-lg font-bold">{open.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{open.problem}</p>

              <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">Solution</h3>
              <p className="mt-1 text-sm">{open.solution}</p>

              <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">Steps</h3>
              <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
                {open.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {open.keywords.map((k) => (
                  <Pill key={k} tone="neutral">
                    {k}
                  </Pill>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Owner: {consultantById(open.ownerId)?.name ?? "Knowledge team"}
              </p>
            </article>

            <section className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <AiStepLabel step="INPUT">Summarise this article for a live call</AiStepLabel>
              <Button size="sm" onClick={summarise} disabled={ai.loading}>
                {ai.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Summarise with Booster AI
              </Button>
              {ai.output ? (
                <AiOutputBlock title="Article summary">
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
