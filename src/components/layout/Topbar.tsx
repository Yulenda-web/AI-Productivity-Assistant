import { Link } from "@tanstack/react-router";
import { Bell, Clock, LogOut, Settings, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { ConsultantStatusBadge } from "@/components/common/StatusBadge";
import { CONSULTANT_STATUSES, ROLES, notifications } from "@/data/demo";
import { useSession } from "@/lib/session";
import type { ConsultantStatus, Role } from "@/data/demo";

export function Topbar() {
  const { name, role, setRole, status, setStatus, loggedInLabel, loginTime } = useSession();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <SidebarTrigger className="shrink-0" />
        <div className="hidden min-w-0 flex-1 md:block">
          <GlobalSearch />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="hidden items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs font-semibold lg:flex">
            <Clock className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">In since {loginTime} ·</span>
            <span className="tabular-nums">{loggedInLabel}</span>
          </span>

          <Select value={status} onValueChange={(v) => setStatus(v as ConsultantStatus)}>
            <SelectTrigger className="hidden h-9 w-[168px] text-xs font-semibold sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONSULTANT_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="text-xs font-semibold">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/notifications" aria-label="Notifications">
              <Bell className="h-4.5 w-4.5" />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              ) : null}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span className="hidden min-w-0 text-left leading-tight sm:block">
                  <span className="block truncate text-xs font-semibold">{name}</span>
                  <span className="block truncate text-[10px] text-muted-foreground">{role}</span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="space-y-2">
                <p className="text-sm font-semibold">{name}</p>
                <ConsultantStatusBadge status={status} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="bh-metric-label mb-1.5">Demo role</p>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/notifications">
                  <User className="mr-2 h-4 w-4" /> My profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/administration">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setStatus("OFFLINE")}>
                <LogOut className="mr-2 h-4 w-4" /> Set offline
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="border-t border-border px-3 py-2 md:hidden">
        <GlobalSearch />
      </div>
    </header>
  );
}
