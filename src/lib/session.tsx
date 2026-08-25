import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { currentUser, type ConsultantStatus, type Role } from "@/data/demo";

interface SessionValue {
  name: string;
  team: string;
  role: Role;
  setRole: (role: Role) => void;
  status: ConsultantStatus;
  setStatus: (status: ConsultantStatus) => void;
  loginTime: string;
  /** Minutes logged in, updating live. */
  loggedInMinutes: number;
  loggedInLabel: string;
  isManagement: boolean;
}

const SessionContext = createContext<SessionValue | null>(null);

const MANAGEMENT: Role[] = ["Team Leader", "Supervisor", "Manager", "Administrator", "Query Manager"];

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(currentUser.role);
  const [status, setStatus] = useState<ConsultantStatus>(currentUser.status);
  const [seconds, setSeconds] = useState(currentUser.loggedInMinutes * 60);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const value = useMemo<SessionValue>(() => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      name: currentUser.name,
      team: currentUser.team,
      role,
      setRole,
      status,
      setStatus,
      loginTime: currentUser.loginTime,
      loggedInMinutes: Math.floor(seconds / 60),
      loggedInLabel: `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`,
      isManagement: MANAGEMENT.includes(role),
    };
  }, [role, status, seconds]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
