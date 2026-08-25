import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Ticket,
  FolderKanban,
  PhoneCall,
  MessagesSquare,
  Mail,
  ListChecks,
  CalendarDays,
  ArrowUpCircle,
  BookOpen,
  Sparkles,
  Workflow,
  UsersRound,
  MonitorDot,
  BarChart3,
  Bell,
  Settings,
  Gauge,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useSession } from "@/lib/session";

const workspace = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Tickets", url: "/tickets", icon: Ticket },
  { title: "Cases", url: "/cases", icon: FolderKanban },
];

const channels = [
  { title: "Call Centre", url: "/call-centre", icon: PhoneCall },
  { title: "Live Chat", url: "/live-chat", icon: MessagesSquare },
  { title: "Email", url: "/email", icon: Mail },
];

const productivity = [
  { title: "Tasks", url: "/tasks", icon: ListChecks },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Escalations", url: "/escalations", icon: ArrowUpCircle },
  { title: "Knowledge Base", url: "/knowledge-base", icon: BookOpen },
];

const ai = [
  { title: "AI Workspace", url: "/ai-workspace", icon: Sparkles },
  { title: "AI Automation", url: "/ai-automation", icon: Workflow },
];

const management = [
  { title: "Manager Dashboard", url: "/manager", icon: Gauge, managementOnly: true },
  { title: "Team Management", url: "/team-management", icon: UsersRound, managementOnly: true },
  { title: "Workforce Monitor", url: "/workforce-monitor", icon: MonitorDot, managementOnly: true },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

const system = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Administration", url: "/administration", icon: Settings, adminOnly: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role, isManagement } = useSession();

  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  const renderGroup = (
    label: string,
    items: { title: string; url: string; icon: typeof Users; managementOnly?: boolean; adminOnly?: boolean }[],
  ) => {
    const visible = items.filter(
      (i) => (!i.managementOnly || isManagement) && (!i.adminOnly || role === "Administrator"),
    );
    if (visible.length === 0) return null;
    return (
      <SidebarGroup key={label}>
        {!collapsed ? (
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/50">
            {label}
          </SidebarGroupLabel>
        ) : null}
        <SidebarGroupContent>
          <SidebarMenu>
            {visible.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 px-1">
          <BrandLogo size={32} showWordmark={!collapsed} wordmarkClassName="text-sidebar-foreground" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Workspace", workspace)}
        {renderGroup("Channels", channels)}
        {renderGroup("Productivity", productivity)}
        {renderGroup("Booster AI", ai)}
        {renderGroup("Management", management)}
        {renderGroup("System", system)}
      </SidebarContent>
    </Sidebar>
  );
}
