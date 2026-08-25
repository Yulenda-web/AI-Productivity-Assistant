import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { customers, tickets, knowledgeArticles, consultants, customerById } from "@/data/demo";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const items = useMemo(
    () => ({
      tickets: tickets.map((t) => ({
        id: t.id,
        label: `${t.number} — ${t.subject}`,
        sub: customerById(t.customerId)?.name ?? "",
      })),
      customers: customers.map((c) => ({ id: c.id, label: c.name, sub: c.customerNumber })),
      articles: knowledgeArticles.map((a) => ({ id: a.id, label: a.title, sub: a.category })),
      people: consultants.map((c) => ({ id: c.id, label: c.name, sub: `${c.role} · ${c.team}` })),
    }),
    [],
  );

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/10 md:w-72 lg:w-96"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate">Search tickets, customers, articles…</span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search Booster Hub…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tickets">
            {items.tickets.map((t) => (
              <CommandItem key={t.id} value={t.label} onSelect={() => go(`/tickets/${t.id}`)}>
                <span className="truncate">{t.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{t.sub}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Customers">
            {items.customers.map((c) => (
              <CommandItem key={c.id} value={c.label} onSelect={() => go(`/customers/${c.id}`)}>
                <span className="truncate">{c.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{c.sub}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Knowledge Base">
            {items.articles.map((a) => (
              <CommandItem key={a.id} value={a.label} onSelect={() => go("/knowledge-base")}>
                <span className="truncate">{a.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{a.sub}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="People">
            {items.people.map((p) => (
              <CommandItem key={p.id} value={p.label} onSelect={() => go("/team-management")}>
                <span className="truncate">{p.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{p.sub}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
