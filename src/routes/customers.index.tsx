import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, UserPlus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pill } from "@/components/common/StatusBadge";
import { consultantById, customers, tickets } from "@/data/demo";

export const Route = createFileRoute("/customers/")({
  head: () => ({
    meta: [
      { title: "Customers | Booster Hub CRM" },
      {
        name: "description",
        content:
          "Search and manage Booster Hub customers, account status, assigned consultants and preferred contact methods.",
      },
      { property: "og:title", content: "Customers | Booster Hub CRM" },
      { property: "og:description", content: "Complete customer management for service teams." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(
    () =>
      customers.filter((c) => {
        const q = query.toLowerCase();
        const matches =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.customerNumber.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.contactNumber.includes(q);
        return matches && (status === "all" || c.accountStatus === status);
      }),
    [query, status],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        description="Single customer view across tickets, calls, chats, emails, tasks and escalations."
        actions={
          <Button size="sm">
            <UserPlus className="mr-1.5 h-4 w-4" /> New customer
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px]">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, customer number, email or phone"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Account status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {rows.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No customers match your search.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Customer number</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Account status</TableHead>
                    <TableHead>Assigned consultant</TableHead>
                    <TableHead>Preferred contact</TableHead>
                    <TableHead className="text-right">Open tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((c) => {
                    const open = tickets.filter(
                      (t) => t.customerId === c.id && !["RESOLVED", "CLOSED"].includes(t.status),
                    ).length;
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <Link
                            to="/customers/$customerId"
                            params={{ customerId: c.id }}
                            className="font-semibold text-primary hover:underline"
                          >
                            {c.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </TableCell>
                        <TableCell className="tabular-nums">{c.customerNumber}</TableCell>
                        <TableCell className="whitespace-nowrap">{c.contactNumber}</TableCell>
                        <TableCell>
                          <Pill
                            tone={
                              c.accountStatus === "Active"
                                ? "green"
                                : c.accountStatus === "Suspended"
                                  ? "red"
                                  : c.accountStatus === "Pending"
                                    ? "amber"
                                    : "neutral"
                            }
                          >
                            {c.accountStatus}
                          </Pill>
                        </TableCell>
                        <TableCell>{consultantById(c.assignedConsultantId)?.name}</TableCell>
                        <TableCell>{c.preferredContact}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">{open}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
