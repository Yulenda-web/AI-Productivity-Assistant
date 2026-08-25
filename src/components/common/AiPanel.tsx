import type { ReactNode } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { AI_DISCLAIMER } from "@/data/demo";
import { cn } from "@/lib/utils";

export function AiDisclaimer({ short = false, className }: { short?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg border border-info/25 bg-info/8 p-2.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
      <span>{short ? "AI-generated content should be reviewed before sending." : AI_DISCLAIMER}</span>
    </p>
  );
}

export function AiOutputBlock({
  title = "AI response",
  children,
  actions,
}: {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-accent/40 bg-accent/6">
      <div className="flex items-center gap-2 border-b border-accent/30 px-3 py-2">
        <Sparkles className="h-4 w-4 text-success" />
        <span className="text-xs font-bold uppercase tracking-wide text-success">{title}</span>
        <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
          AI generated
        </span>
      </div>
      <div className="space-y-3 p-3 text-sm">{children}</div>
      {actions ? (
        <div className="flex flex-wrap gap-2 border-t border-accent/30 px-3 py-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function AiStepLabel({ step, children }: { step: "INPUT" | "AI RESPONSE" | "USER ACTION"; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-primary">
        {step}
      </span>
      {children ? <span className="text-xs text-muted-foreground">{children}</span> : null}
    </div>
  );
}
