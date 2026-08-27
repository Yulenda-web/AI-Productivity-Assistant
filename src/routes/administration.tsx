import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/StatusBadge";
import { AiDisclaimer } from "@/components/common/AiPanel";
import { aiAuditLog, consultants, MANAGEMENT_ROLES, ROLES, TEAMS } from "@/data/demo";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/administration")({
  head: () => ({
    meta: [
      { title: "Administration | Booster Hub" },
      {
        name: "description",
        content: "Manage roles, permissions, teams, SLA rules, AI governance and audit logs across the Booster Hub platform.",
      },
      { property: "og:title", content: "Administration | Booster Hub" },
      { property: "og:description", content: "Role-based access control, AI governance and audit trails." },
    ],
  }),
  component: AdministrationPage,
});

const PERMISSIONS = [
  "View own tickets",
  "View team tickets",
  "View all tickets",
  "Edit customer records",
  "Escalate tickets",
  "Manage SLA rules",
  "View workforce monitor",
  "View reports",
  "Manage users & roles",
  "Use AI tools",
  "View AI audit log",
];

function AdministrationPage() {
  const { role, isManagement } = useSession();
  const [aiEnabled, setAiEnabled] = useState(true);
  const [approvalRequired, setApprovalRequired] = useState(true);

  if (!isManagement) {
    return (
      <div className="space-y-5">
        <PageHeader title="Administration" />
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Your role ({role}) does not have access to administration settings.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Administration" description="Roles, permissions, teams, AI governance and audit trails." />

      <Tabs defaultValue="roles">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="roles">Roles & permissions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="ai">Responsible AI</TabsTrigger>
            <TabsTrigger value="audit">AI audit log</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role-based access control</CardTitle>
              <CardDescription>Permissions applied to every screen, record and action.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="bh-metric-label py-2">Permission</th>
                    {ROLES.map((r) => (
                      <th key={r} className="bh-metric-label px-2 py-2 text-center">
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS.map((p, i) => (
                    <tr key={p} className="border-b border-border/60">
                      <td className="py-2 pr-3">{p}</td>
                      {ROLES.map((r) => {
                        const management = MANAGEMENT_ROLES.includes(r);
                        const allowed = management || i < 5 || p === "Use AI tools";
                        return (
                          <td key={r} className="px-2 py-2 text-center">
                            {allowed ? <span className="text-success">●</span> : <span className="text-muted-foreground">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardContent className="space-y-2 pt-6">
              {consultants.map((c) => (
                <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.email} · {c.team}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Pill tone="navy">{c.role}</Pill>
                    <Button size="sm" variant="outline" onClick={() => toast.success(`Editing ${c.name}`)}>
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAMS.map((team) => {
              const members = consultants.filter((c) => c.team === team);
              return (
                <Card key={team}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{team}</CardTitle>
                    <CardDescription>{members.length} members</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    {members.map((m) => (
                      <p key={m.id} className="truncate text-muted-foreground">
                        {m.name} · {m.role}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-info" /> Responsible AI controls
              </CardTitle>
              <CardDescription>
                AI in Booster Hub is assistive only. It never takes automated decisions about people.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Toggle
                label="AI features enabled"
                description="Turn all Booster AI tools on or off across the platform."
                checked={aiEnabled}
                onChange={setAiEnabled}
              />
              <Toggle
                label="Human approval required"
                description="AI output must be approved by a user before it is sent, saved or applied."
                checked={approvalRequired}
                onChange={setApprovalRequired}
              />
              <ul className="space-y-1.5 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                <li>• All AI output is clearly labelled as AI generated.</li>
                <li>• AI is never used for performance scoring or disciplinary decisions.</li>
                <li>• Consultants can always reject or edit an AI recommendation.</li>
                <li>• Every AI interaction is written to the audit log below.</li>
              </ul>
              <AiDisclaimer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardContent className="space-y-2 pt-6">
              {aiAuditLog.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="green">{entry.feature}</Pill>
                    <span className="text-xs text-muted-foreground">
                      {entry.user} · {entry.timestamp}
                    </span>
                    <Pill tone={entry.decision === "Rejected" ? "red" : entry.decision === "Edited" ? "amber" : "green"}>
                      {entry.decision}
                    </Pill>
                  </div>
                  <p className="mt-1.5 text-muted-foreground">Input: {entry.input}</p>
                  <p className="text-muted-foreground">Output: {entry.output}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
