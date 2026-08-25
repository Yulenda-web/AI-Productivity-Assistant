import { cn } from "@/lib/utils";
import type { ConsultantStatus, SlaStatus, TaskStatus, TicketStatus } from "@/data/demo";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap";

const tones = {
  neutral: "border-border bg-muted text-muted-foreground",
  navy: "border-primary/20 bg-primary/10 text-primary",
  green: "border-success/30 bg-success/12 text-success",
  amber: "border-warning/40 bg-warning/15 text-[oklch(0.5_0.13_70)]",
  red: "border-destructive/30 bg-destructive/12 text-destructive",
  info: "border-info/30 bg-info/12 text-info",
} as const;

type Tone = keyof typeof tones;

export function Pill({
  tone = "neutral",
  children,
  className,
  dot,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span className={cn(base, tones[tone], className)}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

const consultantTone: Record<ConsultantStatus, Tone> = {
  AVAILABLE: "green",
  "ON CALL": "info",
  "AFTER CALL WORK": "navy",
  BUSY: "amber",
  BREAK: "amber",
  LUNCH: "amber",
  TRAINING: "info",
  MEETING: "navy",
  OFFLINE: "neutral",
};

export function ConsultantStatusBadge({ status }: { status: ConsultantStatus }) {
  return (
    <Pill tone={consultantTone[status]} dot>
      {status}
    </Pill>
  );
}

const ticketTone: Record<TicketStatus, Tone> = {
  NEW: "info",
  OPEN: "navy",
  "IN PROGRESS": "amber",
  ESCALATED: "red",
  RESOLVED: "green",
  CLOSED: "neutral",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return <Pill tone={ticketTone[status]}>{status}</Pill>;
}

const slaTone: Record<SlaStatus, Tone> = {
  NORMAL: "green",
  APPROACHING: "amber",
  "AT RISK": "amber",
  BREACHED: "red",
};

export function SlaBadge({ status }: { status: SlaStatus }) {
  return (
    <Pill tone={slaTone[status]} dot>
      {status}
    </Pill>
  );
}

const taskTone: Record<TaskStatus, Tone> = {
  "TO DO": "navy",
  "IN PROGRESS": "amber",
  COMPLETED: "green",
  OVERDUE: "red",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Pill tone={taskTone[status]}>{status}</Pill>;
}
