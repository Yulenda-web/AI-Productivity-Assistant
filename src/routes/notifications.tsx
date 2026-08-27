import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/StatusBadge";
import { notifications as seed } from "@/data/demo";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | Booster Hub" },
      {
        name: "description",
        content: "Real-time Booster Hub alerts for new tickets, customer replies, SLA warnings, escalations, tasks and meetings.",
      },
      { property: "og:title", content: "Notifications | Booster Hub" },
      { property: "og:description", content: "Stay ahead of SLA warnings, escalations and reminders." },
    ],
  }),
  component: NotificationsPage,
});

const toneFor = (type: string) => {
  if (type.includes("Breach")) return "red" as const;
  if (type.includes("Warning") || type.includes("Escalation")) return "amber" as const;
  if (type.includes("AI")) return "green" as const;
  return "navy" as const;
};

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description={`${unread} unread of ${items.length} alerts.`}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setItems((prev) => prev.map((n) => ({ ...n, read: true })));
              toast.success("All notifications marked as read");
            }}
          >
            <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
          </Button>
        }
      />

      <div className="space-y-2">
        {items.map((n) => (
          <Card key={n.id} className={n.read ? "opacity-70" : "border-l-4 border-l-accent"}>
            <CardContent className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-4">
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={toneFor(n.type)}>{n.type}</Pill>
                  <span className="text-xs text-muted-foreground">{n.at}</span>
                </div>
                <p className="mt-1 text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.detail}</p>
              </div>
              {!n.read ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                >
                  Mark read
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
