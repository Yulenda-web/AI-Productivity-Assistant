import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill, TaskStatusBadge } from "@/components/common/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consultantById, currentUser, customerById, tasks, TASK_STATUSES, type TaskStatus } from "@/data/demo";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks | Booster Hub" },
      {
        name: "description",
        content: "Personal and team task management in Booster Hub, with tasks created from tickets, calls, emails, meetings and AI suggestions.",
      },
      { property: "og:title", content: "Tasks | Booster Hub" },
      { property: "og:description", content: "Track every follow-up in one place." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { isManagement } = useSession();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState(isManagement ? "all" : "mine");

  const grouped = useMemo(() => {
    const filtered = tasks.filter((t) => {
      if (scope === "mine" && t.assignedToId !== currentUser.id) return false;
      const q = query.trim().toLowerCase();
      return !q || t.title.toLowerCase().includes(q);
    });
    return TASK_STATUSES.map((status) => ({ status, items: filtered.filter((t) => t.status === status) }));
  }, [query, scope]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tasks"
        description="Follow-ups created from tickets, calls, emails, chats, meetings and AI suggestions."
        actions={
          <Button size="sm" onClick={() => toast.success("New task created")}>
            <Plus className="mr-1.5 h-4 w-4" /> New task
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" />
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mine">My tasks</SelectItem>
            <SelectItem value="all">Team tasks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {grouped.map((column) => (
          <Card key={column.status}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <TaskStatusBadge status={column.status as TaskStatus} />
                <span className="text-xs text-muted-foreground">{column.items.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {column.items.map((t) => (
                <div key={t.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Due {t.dueDate} · {consultantById(t.assignedToId)?.name}
                  </p>
                  {t.customerId ? (
                    <p className="text-xs text-muted-foreground">{customerById(t.customerId)?.name}</p>
                  ) : null}
                  <div className="mt-2">
                    <Pill tone={t.origin.startsWith("AI") ? "green" : "navy"}>{t.origin}</Pill>
                  </div>
                </div>
              ))}
              {column.items.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  Nothing here
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
