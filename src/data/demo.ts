/**
 * Booster Hub demo dataset.
 * Deterministic, in-memory demo data used across dashboards, tables and reports.
 */

export type Role =
  | "Consultant"
  | "Senior Consultant"
  | "Query Manager"
  | "Team Leader"
  | "Supervisor"
  | "Manager"
  | "Administrator";

export const ROLES: Role[] = [
  "Consultant",
  "Senior Consultant",
  "Query Manager",
  "Team Leader",
  "Supervisor",
  "Manager",
  "Administrator",
];

export const MANAGEMENT_ROLES: Role[] = [
  "Team Leader",
  "Supervisor",
  "Manager",
  "Administrator",
];

export type ConsultantStatus =
  | "AVAILABLE"
  | "ON CALL"
  | "AFTER CALL WORK"
  | "BUSY"
  | "BREAK"
  | "LUNCH"
  | "TRAINING"
  | "MEETING"
  | "OFFLINE";

export const CONSULTANT_STATUSES: ConsultantStatus[] = [
  "AVAILABLE",
  "ON CALL",
  "AFTER CALL WORK",
  "BUSY",
  "BREAK",
  "LUNCH",
  "TRAINING",
  "MEETING",
  "OFFLINE",
];

export type TicketStatus = "NEW" | "OPEN" | "IN PROGRESS" | "ESCALATED" | "RESOLVED" | "CLOSED";
export const TICKET_STATUSES: TicketStatus[] = [
  "NEW",
  "OPEN",
  "IN PROGRESS",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
];

export type SlaStatus = "NORMAL" | "APPROACHING" | "AT RISK" | "BREACHED";
export const SLA_STATUSES: SlaStatus[] = ["NORMAL", "APPROACHING", "AT RISK", "BREACHED"];

export type TaskStatus = "TO DO" | "IN PROGRESS" | "COMPLETED" | "OVERDUE";
export const TASK_STATUSES: TaskStatus[] = ["TO DO", "IN PROGRESS", "COMPLETED", "OVERDUE"];

export type Channel = "Phone" | "Email" | "Live Chat" | "Portal" | "WhatsApp";

export interface Consultant {
  id: string;
  name: string;
  role: Role;
  team: string;
  email: string;
  status: ConsultantStatus;
  loginTime: string;
  loggedInMinutes: number;
  currentActivity: string;
  tickets: number;
  calls: number;
  chats: number;
  emails: number;
  slaStatus: SlaStatus;
  availableMinutes: number;
  breakMinutes: number;
  lunchMinutes: number;
  callMinutes: number;
  acwMinutes: number;
  trainingMinutes: number;
  meetingMinutes: number;
}

export interface Customer {
  id: string;
  name: string;
  customerNumber: string;
  contactNumber: string;
  email: string;
  address: string;
  accountStatus: "Active" | "Suspended" | "Pending" | "Closed";
  assignedConsultantId: string;
  preferredContact: Channel;
  notes: string[];
}

export interface Ticket {
  id: string;
  number: string;
  customerId: string;
  subject: string;
  description: string;
  category: string;
  status: TicketStatus;
  consultantId: string;
  team: string;
  channel: Channel;
  created: string;
  updated: string;
  sla: string;
  slaDeadline: string;
  slaStatus: SlaStatus;
  slaRemainingMinutes: number;
  tags: string[];
  notes: { author: string; at: string; text: string }[];
  attachments: string[];
  resolution?: string;
}

export interface CallRecord {
  id: string;
  direction: "Incoming" | "Outgoing" | "Missed";
  customerId: string;
  consultantId: string;
  startedAt: string;
  durationSeconds: number;
  reason: string;
  outcome: string;
  notes: string;
  followUp?: string;
  ticketId?: string;
}

export interface ChatSessionRecord {
  id: string;
  customerId: string;
  consultantId?: string;
  state: "Active" | "Waiting" | "Closed";
  waitingSeconds: number;
  startedAt: string;
  ticketId?: string;
  messages: { from: "Customer" | "Consultant"; at: string; text: string }[];
  internalNotes: string[];
}

export interface EmailRecord {
  id: string;
  folder: "Inbox" | "Assigned" | "Unassigned" | "Sent" | "Drafts" | "Closed";
  from: string;
  customerId?: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  unread: boolean;
  consultantId?: string;
  ticketId?: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  origin: "Ticket" | "Call" | "Email" | "Chat" | "Meeting" | "AI Assistant" | "AI Task Planner" | "Escalation";
  assignedToId: string;
  customerId?: string;
  ticketId?: string;
  dueDate: string;
  status: TaskStatus;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: "Meeting" | "Call" | "Follow-up" | "Task" | "Training" | "Break" | "Appointment";
  date: string;
  start: string;
  end: string;
  consultantId: string;
  customerId?: string;
}

export interface Escalation {
  id: string;
  reference: string;
  customerId: string;
  ticketId: string;
  reason: string;
  currentOwnerId: string;
  level: "Consultant" | "Senior Consultant" | "Query Manager" | "Team Leader" | "Manager";
  slaStatus: SlaStatus;
  status: "Open" | "In Review" | "Resolved";
  resolution?: string;
  raisedAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  steps: string[];
  keywords: string[];
  ownerId: string;
  lastUpdated: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  lastRun: string;
}

export interface NotificationItem {
  id: string;
  type:
    | "New Ticket"
    | "Assigned Ticket"
    | "Customer Reply"
    | "SLA Warning"
    | "SLA Breach"
    | "Escalation"
    | "Task Due"
    | "Meeting Reminder"
    | "AI Recommendation"
    | "Manager Message"
    | "Missed Call"
    | "New Chat";
  title: string;
  detail: string;
  at: string;
  read: boolean;
}

export interface AiAuditEntry {
  id: string;
  feature: string;
  user: string;
  input: string;
  output: string;
  timestamp: string;
  decision: "Accepted" | "Edited" | "Rejected";
}

export const TEAMS = ["Retentions", "Technical Support", "Claims", "Billing", "Onboarding"];

export const AI_DISCLAIMER =
  "AI-generated content is provided as an assistive recommendation and should be reviewed and validated by an authorised user before use.";

export const consultants: Consultant[] = [
  {
    id: "c1",
    name: "Yulenda Khoza",
    role: "Consultant",
    team: "Technical Support",
    email: "yulenda.khoza@boosterhub.co.za",
    status: "AVAILABLE",
    loginTime: "07:45",
    loggedInMinutes: 327,
    currentActivity: "Reviewing ticket BH-1042",
    tickets: 14,
    calls: 18,
    chats: 9,
    emails: 23,
    slaStatus: "APPROACHING",
    availableMinutes: 142,
    breakMinutes: 15,
    lunchMinutes: 30,
    callMinutes: 96,
    acwMinutes: 24,
    trainingMinutes: 0,
    meetingMinutes: 20,
  },
  {
    id: "c2",
    name: "Sipho Ndlovu",
    role: "Senior Consultant",
    team: "Technical Support",
    email: "sipho.ndlovu@boosterhub.co.za",
    status: "ON CALL",
    loginTime: "07:30",
    loggedInMinutes: 342,
    currentActivity: "Call with Thandeka Mbeki",
    tickets: 11,
    calls: 24,
    chats: 4,
    emails: 15,
    slaStatus: "NORMAL",
    availableMinutes: 118,
    breakMinutes: 20,
    lunchMinutes: 30,
    callMinutes: 132,
    acwMinutes: 28,
    trainingMinutes: 0,
    meetingMinutes: 14,
  },
  {
    id: "c3",
    name: "Ayesha Patel",
    role: "Consultant",
    team: "Billing",
    email: "ayesha.patel@boosterhub.co.za",
    status: "AFTER CALL WORK",
    loginTime: "08:00",
    loggedInMinutes: 312,
    currentActivity: "Capturing call notes",
    tickets: 17,
    calls: 21,
    chats: 12,
    emails: 31,
    slaStatus: "AT RISK",
    availableMinutes: 104,
    breakMinutes: 15,
    lunchMinutes: 30,
    callMinutes: 118,
    acwMinutes: 45,
    trainingMinutes: 0,
    meetingMinutes: 0,
  },
  {
    id: "c4",
    name: "Johan van Wyk",
    role: "Consultant",
    team: "Claims",
    email: "johan.vanwyk@boosterhub.co.za",
    status: "BREAK",
    loginTime: "07:15",
    loggedInMinutes: 357,
    currentActivity: "On a 15 minute break",
    tickets: 9,
    calls: 16,
    chats: 6,
    emails: 12,
    slaStatus: "NORMAL",
    availableMinutes: 156,
    breakMinutes: 22,
    lunchMinutes: 30,
    callMinutes: 88,
    acwMinutes: 18,
    trainingMinutes: 30,
    meetingMinutes: 0,
  },
  {
    id: "c5",
    name: "Lerato Mokoena",
    role: "Query Manager",
    team: "Claims",
    email: "lerato.mokoena@boosterhub.co.za",
    status: "MEETING",
    loginTime: "07:50",
    loggedInMinutes: 322,
    currentActivity: "Escalation review meeting",
    tickets: 8,
    calls: 7,
    chats: 2,
    emails: 26,
    slaStatus: "APPROACHING",
    availableMinutes: 92,
    breakMinutes: 15,
    lunchMinutes: 30,
    callMinutes: 42,
    acwMinutes: 12,
    trainingMinutes: 0,
    meetingMinutes: 75,
  },
  {
    id: "c6",
    name: "Nomsa Dube",
    role: "Team Leader",
    team: "Retentions",
    email: "nomsa.dube@boosterhub.co.za",
    status: "BUSY",
    loginTime: "07:00",
    loggedInMinutes: 372,
    currentActivity: "Coaching session prep",
    tickets: 5,
    calls: 4,
    chats: 1,
    emails: 34,
    slaStatus: "NORMAL",
    availableMinutes: 84,
    breakMinutes: 18,
    lunchMinutes: 30,
    callMinutes: 36,
    acwMinutes: 8,
    trainingMinutes: 45,
    meetingMinutes: 90,
  },
  {
    id: "c7",
    name: "Kabelo Sithole",
    role: "Consultant",
    team: "Retentions",
    email: "kabelo.sithole@boosterhub.co.za",
    status: "LUNCH",
    loginTime: "08:10",
    loggedInMinutes: 302,
    currentActivity: "Lunch",
    tickets: 12,
    calls: 19,
    chats: 14,
    emails: 9,
    slaStatus: "NORMAL",
    availableMinutes: 128,
    breakMinutes: 15,
    lunchMinutes: 38,
    callMinutes: 92,
    acwMinutes: 22,
    trainingMinutes: 0,
    meetingMinutes: 0,
  },
  {
    id: "c8",
    name: "Chantal Adams",
    role: "Consultant",
    team: "Onboarding",
    email: "chantal.adams@boosterhub.co.za",
    status: "TRAINING",
    loginTime: "08:30",
    loggedInMinutes: 282,
    currentActivity: "Product training — Booster Care",
    tickets: 6,
    calls: 8,
    chats: 5,
    emails: 11,
    slaStatus: "NORMAL",
    availableMinutes: 64,
    breakMinutes: 12,
    lunchMinutes: 30,
    callMinutes: 44,
    acwMinutes: 10,
    trainingMinutes: 120,
    meetingMinutes: 0,
  },
  {
    id: "c9",
    name: "Pieter Botha",
    role: "Supervisor",
    team: "Billing",
    email: "pieter.botha@boosterhub.co.za",
    status: "AVAILABLE",
    loginTime: "06:55",
    loggedInMinutes: 377,
    currentActivity: "Monitoring SLA queue",
    tickets: 4,
    calls: 3,
    chats: 0,
    emails: 41,
    slaStatus: "NORMAL",
    availableMinutes: 188,
    breakMinutes: 20,
    lunchMinutes: 30,
    callMinutes: 24,
    acwMinutes: 6,
    trainingMinutes: 0,
    meetingMinutes: 60,
  },
  {
    id: "c10",
    name: "Zanele Mahlangu",
    role: "Manager",
    team: "Technical Support",
    email: "zanele.mahlangu@boosterhub.co.za",
    status: "OFFLINE",
    loginTime: "—",
    loggedInMinutes: 0,
    currentActivity: "Not logged in",
    tickets: 0,
    calls: 0,
    chats: 0,
    emails: 0,
    slaStatus: "NORMAL",
    availableMinutes: 0,
    breakMinutes: 0,
    lunchMinutes: 0,
    callMinutes: 0,
    acwMinutes: 0,
    trainingMinutes: 0,
    meetingMinutes: 0,
  },
  {
    id: "c11",
    name: "Andile Zulu",
    role: "Consultant",
    team: "Billing",
    email: "andile.zulu@boosterhub.co.za",
    status: "ON CALL",
    loginTime: "07:40",
    loggedInMinutes: 332,
    currentActivity: "Call with Bright Retail CC",
    tickets: 15,
    calls: 26,
    chats: 7,
    emails: 18,
    slaStatus: "AT RISK",
    availableMinutes: 96,
    breakMinutes: 15,
    lunchMinutes: 30,
    callMinutes: 148,
    acwMinutes: 32,
    trainingMinutes: 0,
    meetingMinutes: 0,
  },
  {
    id: "c12",
    name: "Refilwe Motaung",
    role: "Administrator",
    team: "Onboarding",
    email: "refilwe.motaung@boosterhub.co.za",
    status: "AVAILABLE",
    loginTime: "08:05",
    loggedInMinutes: 307,
    currentActivity: "User access review",
    tickets: 2,
    calls: 1,
    chats: 0,
    emails: 22,
    slaStatus: "NORMAL",
    availableMinutes: 202,
    breakMinutes: 15,
    lunchMinutes: 30,
    callMinutes: 8,
    acwMinutes: 4,
    trainingMinutes: 0,
    meetingMinutes: 45,
  },
];

export const CURRENT_USER_ID = "c1";

export const customers: Customer[] = [
  {
    id: "cu1",
    name: "Thandeka Mbeki",
    customerNumber: "BH-CUS-10241",
    contactNumber: "+27 82 445 1178",
    email: "thandeka.mbeki@example.co.za",
    address: "14 Rivonia Road, Sandton, Johannesburg, 2196",
    accountStatus: "Active",
    assignedConsultantId: "c1",
    preferredContact: "Phone",
    notes: ["Prefers to be contacted after 15:00.", "Long-standing premium account since 2019."],
  },
  {
    id: "cu2",
    name: "Bright Retail CC",
    customerNumber: "BH-CUS-10388",
    contactNumber: "+27 11 902 7741",
    email: "accounts@brightretail.co.za",
    address: "Unit 6, Northgate Park, Randburg, 2188",
    accountStatus: "Active",
    assignedConsultantId: "c11",
    preferredContact: "Email",
    notes: ["Billing queries must be copied to their finance manager."],
  },
  {
    id: "cu3",
    name: "Sarah de Villiers",
    customerNumber: "BH-CUS-10455",
    contactNumber: "+27 83 771 2290",
    email: "sarah.dv@example.com",
    address: "27 Beach Road, Sea Point, Cape Town, 8005",
    accountStatus: "Pending",
    assignedConsultantId: "c3",
    preferredContact: "Live Chat",
    notes: ["Onboarding in progress — awaiting proof of residence."],
  },
  {
    id: "cu4",
    name: "Mpho Legodi",
    customerNumber: "BH-CUS-10502",
    contactNumber: "+27 76 334 8812",
    email: "mpho.legodi@example.co.za",
    address: "88 Church Street, Pretoria Central, 0002",
    accountStatus: "Active",
    assignedConsultantId: "c4",
    preferredContact: "WhatsApp",
    notes: ["Claim submitted 3 weeks ago, requires weekly feedback."],
  },
  {
    id: "cu5",
    name: "Coastal Logistics (Pty) Ltd",
    customerNumber: "BH-CUS-10577",
    contactNumber: "+27 31 556 0091",
    email: "ops@coastallogistics.co.za",
    address: "Berth 4, Maydon Wharf, Durban, 4001",
    accountStatus: "Suspended",
    assignedConsultantId: "c7",
    preferredContact: "Phone",
    notes: ["Account suspended pending payment arrangement."],
  },
  {
    id: "cu6",
    name: "Nadia Cassim",
    customerNumber: "BH-CUS-10613",
    contactNumber: "+27 84 220 9917",
    email: "nadia.cassim@example.com",
    address: "5 Fairview Avenue, Bloemfontein, 9301",
    accountStatus: "Active",
    assignedConsultantId: "c2",
    preferredContact: "Email",
    notes: [],
  },
  {
    id: "cu7",
    name: "Grant Peterson",
    customerNumber: "BH-CUS-10744",
    contactNumber: "+27 82 118 3345",
    email: "grant.peterson@example.com",
    address: "12 Loop Street, Port Elizabeth, 6001",
    accountStatus: "Active",
    assignedConsultantId: "c1",
    preferredContact: "Portal",
    notes: ["Escalated twice in the last quarter — handle with care."],
  },
  {
    id: "cu8",
    name: "Sunrise Academy NPC",
    customerNumber: "BH-CUS-10820",
    contactNumber: "+27 12 447 5520",
    email: "admin@sunriseacademy.org.za",
    address: "3 Learner Way, Centurion, 0157",
    accountStatus: "Active",
    assignedConsultantId: "c8",
    preferredContact: "Email",
    notes: [],
  },
];

export const tickets: Ticket[] = [
  {
    id: "t1",
    number: "BH-1042",
    customerId: "cu1",
    subject: "Unable to log into the customer portal after password reset",
    description:
      "Customer completed a password reset but the portal still returns 'invalid credentials'. She has attempted on both mobile and desktop.",
    category: "Access & Authentication",
    status: "IN PROGRESS",
    consultantId: "c1",
    team: "Technical Support",
    channel: "Phone",
    created: "2026-08-25 08:12",
    updated: "2026-08-25 11:40",
    sla: "4 hour resolution",
    slaDeadline: "2026-08-25 12:12",
    slaStatus: "AT RISK",
    slaRemainingMinutes: 32,
    tags: ["portal", "password-reset", "premium"],
    notes: [
      { author: "Yulenda Khoza", at: "08:20", text: "Verified identity, reset MFA token." },
      { author: "Sipho Ndlovu", at: "10:05", text: "Account lock flag still present on auth service." },
    ],
    attachments: ["portal-error-screenshot.png"],
  },
  {
    id: "t2",
    number: "BH-1043",
    customerId: "cu2",
    subject: "Duplicate debit order processed for August",
    description: "Two debit orders of R4 320 each were processed on 24 August. Customer requests reversal.",
    category: "Billing",
    status: "ESCALATED",
    consultantId: "c11",
    team: "Billing",
    channel: "Email",
    created: "2026-08-24 14:02",
    updated: "2026-08-25 09:15",
    sla: "8 hour response",
    slaDeadline: "2026-08-25 10:02",
    slaStatus: "BREACHED",
    slaRemainingMinutes: -95,
    tags: ["debit-order", "reversal"],
    notes: [{ author: "Andile Zulu", at: "09:15", text: "Escalated to Query Manager for reversal approval." }],
    attachments: ["bank-statement-aug.pdf"],
  },
  {
    id: "t3",
    number: "BH-1044",
    customerId: "cu3",
    subject: "Onboarding documents not uploading",
    description: "Proof of residence upload fails at 80% on the onboarding wizard.",
    category: "Onboarding",
    status: "OPEN",
    consultantId: "c3",
    team: "Onboarding",
    channel: "Live Chat",
    created: "2026-08-25 09:45",
    updated: "2026-08-25 10:20",
    sla: "24 hour resolution",
    slaDeadline: "2026-08-26 09:45",
    slaStatus: "NORMAL",
    slaRemainingMinutes: 1290,
    tags: ["upload", "onboarding"],
    notes: [],
    attachments: [],
  },
  {
    id: "t4",
    number: "BH-1045",
    customerId: "cu4",
    subject: "Claim BH-CL-8821 feedback outstanding",
    description: "Customer has not received feedback on his claim for 8 working days.",
    category: "Claims",
    status: "ESCALATED",
    consultantId: "c4",
    team: "Claims",
    channel: "Phone",
    created: "2026-08-22 11:30",
    updated: "2026-08-25 08:05",
    sla: "48 hour response",
    slaDeadline: "2026-08-25 11:30",
    slaStatus: "APPROACHING",
    slaRemainingMinutes: 118,
    tags: ["claims", "feedback"],
    notes: [{ author: "Lerato Mokoena", at: "08:05", text: "Assessor report requested from Claims Ops." }],
    attachments: ["claim-form-8821.pdf"],
  },
  {
    id: "t5",
    number: "BH-1046",
    customerId: "cu5",
    subject: "Account suspended — payment arrangement request",
    description: "Customer requests a 3-month payment arrangement to lift suspension.",
    category: "Collections",
    status: "NEW",
    consultantId: "c7",
    team: "Retentions",
    channel: "Email",
    created: "2026-08-25 10:55",
    updated: "2026-08-25 10:55",
    sla: "8 hour response",
    slaDeadline: "2026-08-25 18:55",
    slaStatus: "NORMAL",
    slaRemainingMinutes: 420,
    tags: ["collections", "arrangement"],
    notes: [],
    attachments: [],
  },
  {
    id: "t6",
    number: "BH-1047",
    customerId: "cu6",
    subject: "Statement email not received",
    description: "Monthly statement not delivered for the last two cycles.",
    category: "Billing",
    status: "RESOLVED",
    consultantId: "c2",
    team: "Billing",
    channel: "Email",
    created: "2026-08-21 08:20",
    updated: "2026-08-23 15:12",
    sla: "24 hour resolution",
    slaDeadline: "2026-08-22 08:20",
    slaStatus: "NORMAL",
    slaRemainingMinutes: 0,
    tags: ["statements"],
    notes: [],
    attachments: [],
    resolution: "Mailbox bounce cleared and statements re-issued for July and August.",
  },
  {
    id: "t7",
    number: "BH-1048",
    customerId: "cu7",
    subject: "Repeat service interruption in Port Elizabeth",
    description: "Third interruption in 30 days. Customer requesting permanent resolution and credit.",
    category: "Network",
    status: "OPEN",
    consultantId: "c1",
    team: "Technical Support",
    channel: "Portal",
    created: "2026-08-24 16:41",
    updated: "2026-08-25 07:58",
    sla: "12 hour resolution",
    slaDeadline: "2026-08-25 13:41",
    slaStatus: "APPROACHING",
    slaRemainingMinutes: 168,
    tags: ["network", "repeat-issue"],
    notes: [{ author: "Yulenda Khoza", at: "07:58", text: "Field team dispatched to the PE node." }],
    attachments: [],
  },
  {
    id: "t8",
    number: "BH-1049",
    customerId: "cu8",
    subject: "Bulk user provisioning for 40 new staff",
    description: "School requires 40 additional user licences provisioned before the new term.",
    category: "Provisioning",
    status: "IN PROGRESS",
    consultantId: "c8",
    team: "Onboarding",
    channel: "Email",
    created: "2026-08-23 12:10",
    updated: "2026-08-25 09:33",
    sla: "72 hour resolution",
    slaDeadline: "2026-08-26 12:10",
    slaStatus: "NORMAL",
    slaRemainingMinutes: 1470,
    tags: ["provisioning", "bulk"],
    notes: [],
    attachments: ["staff-list.xlsx"],
  },
  {
    id: "t9",
    number: "BH-1050",
    customerId: "cu1",
    subject: "Request for itemised billing history",
    description: "Customer requests 12 months of itemised billing for audit purposes.",
    category: "Billing",
    status: "CLOSED",
    consultantId: "c1",
    team: "Technical Support",
    channel: "Phone",
    created: "2026-08-14 09:02",
    updated: "2026-08-15 11:44",
    sla: "48 hour resolution",
    slaDeadline: "2026-08-16 09:02",
    slaStatus: "NORMAL",
    slaRemainingMinutes: 0,
    tags: ["billing", "audit"],
    notes: [],
    attachments: [],
    resolution: "12 month itemised statement pack emailed and confirmed received.",
  },
  {
    id: "t10",
    number: "BH-1051",
    customerId: "cu2",
    subject: "New site connectivity quote required",
    description: "Customer opening a new branch and requires a connectivity quote.",
    category: "Sales Support",
    status: "OPEN",
    consultantId: "c7",
    team: "Retentions",
    channel: "Phone",
    created: "2026-08-25 07:20",
    updated: "2026-08-25 08:40",
    sla: "24 hour response",
    slaDeadline: "2026-08-26 07:20",
    slaStatus: "NORMAL",
    slaRemainingMinutes: 1140,
    tags: ["quote", "expansion"],
    notes: [],
    attachments: [],
  },
];

export const calls: CallRecord[] = [
  {
    id: "call1",
    direction: "Incoming",
    customerId: "cu1",
    consultantId: "c1",
    startedAt: "2026-08-25 08:08",
    durationSeconds: 412,
    reason: "Cannot access portal",
    outcome: "Ticket created",
    notes: "Customer verified. Password reset completed on the call but login still failing.",
    followUp: "2026-08-25 15:00",
    ticketId: "t1",
  },
  {
    id: "call2",
    direction: "Incoming",
    customerId: "cu2",
    consultantId: "c11",
    startedAt: "2026-08-25 09:02",
    durationSeconds: 733,
    reason: "Duplicate debit order",
    outcome: "Escalated",
    notes: "Confirmed two debits on statement. Reversal requires Query Manager approval.",
    ticketId: "t2",
  },
  {
    id: "call3",
    direction: "Outgoing",
    customerId: "cu4",
    consultantId: "c4",
    startedAt: "2026-08-25 10:15",
    durationSeconds: 288,
    reason: "Claim feedback",
    outcome: "Follow-up scheduled",
    notes: "Advised customer that the assessor report is outstanding.",
    followUp: "2026-08-26 10:00",
    ticketId: "t4",
  },
  {
    id: "call4",
    direction: "Missed",
    customerId: "cu5",
    consultantId: "c7",
    startedAt: "2026-08-25 10:48",
    durationSeconds: 0,
    reason: "Unknown",
    outcome: "Callback required",
    notes: "Missed while consultant was on another call.",
  },
  {
    id: "call5",
    direction: "Incoming",
    customerId: "cu7",
    consultantId: "c1",
    startedAt: "2026-08-25 11:12",
    durationSeconds: 655,
    reason: "Repeat service interruption",
    outcome: "In progress",
    notes: "Customer frustrated by repeat outage. Field dispatch confirmed.",
    ticketId: "t7",
  },
  {
    id: "call6",
    direction: "Outgoing",
    customerId: "cu6",
    consultantId: "c2",
    startedAt: "2026-08-25 09:40",
    durationSeconds: 175,
    reason: "Statement confirmation",
    outcome: "Resolved",
    notes: "Confirmed statements received after mailbox fix.",
    ticketId: "t6",
  },
];

export const chats: ChatSessionRecord[] = [
  {
    id: "ch1",
    customerId: "cu3",
    consultantId: "c3",
    state: "Active",
    waitingSeconds: 0,
    startedAt: "2026-08-25 11:35",
    ticketId: "t3",
    messages: [
      { from: "Customer", at: "11:35", text: "Hi, my document upload keeps failing at 80%." },
      { from: "Consultant", at: "11:36", text: "Thanks Sarah — let me check the upload log on your profile." },
      { from: "Customer", at: "11:38", text: "It is a 9MB PDF, could that be the problem?" },
    ],
    internalNotes: ["Upload limit is 8MB — advise compression."],
  },
  {
    id: "ch2",
    customerId: "cu8",
    consultantId: "c8",
    state: "Active",
    waitingSeconds: 0,
    startedAt: "2026-08-25 11:20",
    messages: [
      { from: "Customer", at: "11:20", text: "Any update on our 40 new licences?" },
      { from: "Consultant", at: "11:22", text: "Provisioning is 60% complete, expected today." },
    ],
    internalNotes: [],
  },
  {
    id: "ch3",
    customerId: "cu5",
    state: "Waiting",
    waitingSeconds: 184,
    startedAt: "2026-08-25 11:44",
    messages: [{ from: "Customer", at: "11:44", text: "I need to discuss a payment arrangement." }],
    internalNotes: [],
  },
  {
    id: "ch4",
    customerId: "cu6",
    state: "Waiting",
    waitingSeconds: 47,
    startedAt: "2026-08-25 11:46",
    messages: [{ from: "Customer", at: "11:46", text: "Good day, quick billing question." }],
    internalNotes: [],
  },
  {
    id: "ch5",
    customerId: "cu7",
    consultantId: "c1",
    state: "Closed",
    waitingSeconds: 0,
    startedAt: "2026-08-24 15:02",
    ticketId: "t7",
    messages: [
      { from: "Customer", at: "15:02", text: "The line dropped again this morning." },
      { from: "Consultant", at: "15:04", text: "Logged as BH-1048 and dispatched to the field team." },
    ],
    internalNotes: ["Third interruption — flag for credit consideration."],
  },
];

export const emails: EmailRecord[] = [
  {
    id: "e1",
    folder: "Inbox",
    from: "thandeka.mbeki@example.co.za",
    customerId: "cu1",
    subject: "RE: Portal access still failing",
    preview: "I tried again this morning and it still says invalid credentials...",
    body: "Good morning,\n\nI tried again this morning and it still says invalid credentials. I really need access before the end of day for our audit.\n\nRegards\nThandeka",
    receivedAt: "2026-08-25 09:12",
    unread: true,
    consultantId: "c1",
    ticketId: "t1",
  },
  {
    id: "e2",
    folder: "Inbox",
    from: "accounts@brightretail.co.za",
    customerId: "cu2",
    subject: "Duplicate debit order — urgent reversal",
    preview: "Please see attached statement showing two debits of R4 320...",
    body: "Hi Team,\n\nPlease see attached statement showing two debits of R4 320 on 24 August. Kindly reverse the duplicate.\n\nThank you\nFinance Department",
    receivedAt: "2026-08-25 08:02",
    unread: true,
    consultantId: "c11",
    ticketId: "t2",
  },
  {
    id: "e3",
    folder: "Unassigned",
    from: "info@newprospect.co.za",
    subject: "Enquiry about business packages",
    preview: "We are a 30 seat operation looking for a service provider...",
    body: "Hello,\n\nWe are a 30 seat operation looking for a new service provider. Could someone contact us?\n\nRegards\nOperations",
    receivedAt: "2026-08-25 10:31",
    unread: true,
  },
  {
    id: "e4",
    folder: "Assigned",
    from: "mpho.legodi@example.co.za",
    customerId: "cu4",
    subject: "Claim BH-CL-8821 — still waiting",
    preview: "It has been 8 working days without feedback...",
    body: "Good day,\n\nIt has been 8 working days without feedback on my claim. Please advise urgently.\n\nMpho",
    receivedAt: "2026-08-25 07:44",
    unread: false,
    consultantId: "c4",
    ticketId: "t4",
  },
  {
    id: "e5",
    folder: "Sent",
    from: "yulenda.khoza@boosterhub.co.za",
    customerId: "cu7",
    subject: "Port Elizabeth interruption — field team dispatched",
    preview: "Our field team has been dispatched to the PE node...",
    body: "Dear Grant,\n\nOur field team has been dispatched to the Port Elizabeth node and we will confirm restoration today.\n\nKind regards\nYulenda Khoza",
    receivedAt: "2026-08-25 08:01",
    unread: false,
    consultantId: "c1",
    ticketId: "t7",
  },
  {
    id: "e6",
    folder: "Drafts",
    from: "yulenda.khoza@boosterhub.co.za",
    customerId: "cu1",
    subject: "Portal access — next steps",
    preview: "Draft awaiting review before sending...",
    body: "Dear Thandeka,\n\n(Draft) Confirming the auth lock has been cleared and requesting you retry.\n\nKind regards\nYulenda",
    receivedAt: "2026-08-25 11:05",
    unread: false,
    consultantId: "c1",
    ticketId: "t1",
  },
  {
    id: "e7",
    folder: "Closed",
    from: "nadia.cassim@example.com",
    customerId: "cu6",
    subject: "Statements received, thank you",
    preview: "Both statements came through, thanks for the help...",
    body: "Hi,\n\nBoth statements came through, thanks for the help.\n\nNadia",
    receivedAt: "2026-08-23 15:20",
    unread: false,
    consultantId: "c2",
    ticketId: "t6",
  },
  {
    id: "e8",
    folder: "Inbox",
    from: "admin@sunriseacademy.org.za",
    customerId: "cu8",
    subject: "Licence provisioning progress",
    preview: "Could you confirm all 40 licences will be ready today?",
    body: "Hello,\n\nCould you confirm all 40 licences will be ready today? Term starts Monday.\n\nRegards\nAdmin Office",
    receivedAt: "2026-08-25 10:58",
    unread: true,
    consultantId: "c8",
    ticketId: "t8",
  },
];

export const tasks: TaskRecord[] = [
  {
    id: "tk1",
    title: "Confirm auth lock cleared with platform team",
    origin: "Ticket",
    assignedToId: "c1",
    customerId: "cu1",
    ticketId: "t1",
    dueDate: "2026-08-25 13:00",
    status: "IN PROGRESS",
  },
  {
    id: "tk2",
    title: "Call Thandeka Mbeki to confirm portal access",
    origin: "Call",
    assignedToId: "c1",
    customerId: "cu1",
    ticketId: "t1",
    dueDate: "2026-08-25 15:00",
    status: "TO DO",
  },
  {
    id: "tk3",
    title: "Submit debit order reversal for approval",
    origin: "Escalation",
    assignedToId: "c11",
    customerId: "cu2",
    ticketId: "t2",
    dueDate: "2026-08-25 10:00",
    status: "OVERDUE",
  },
  {
    id: "tk4",
    title: "Request assessor report from Claims Ops",
    origin: "Ticket",
    assignedToId: "c4",
    customerId: "cu4",
    ticketId: "t4",
    dueDate: "2026-08-25 14:30",
    status: "TO DO",
  },
  {
    id: "tk5",
    title: "Send compressed upload instructions to Sarah",
    origin: "Chat",
    assignedToId: "c3",
    customerId: "cu3",
    ticketId: "t3",
    dueDate: "2026-08-25 12:30",
    status: "TO DO",
  },
  {
    id: "tk6",
    title: "Prepare payment arrangement proposal",
    origin: "Email",
    assignedToId: "c7",
    customerId: "cu5",
    ticketId: "t5",
    dueDate: "2026-08-26 09:00",
    status: "TO DO",
  },
  {
    id: "tk7",
    title: "Action items from SLA review meeting",
    origin: "Meeting",
    assignedToId: "c6",
    dueDate: "2026-08-26 11:00",
    status: "TO DO",
  },
  {
    id: "tk8",
    title: "Draft follow-up email for Port Elizabeth credit request",
    origin: "AI Assistant",
    assignedToId: "c1",
    customerId: "cu7",
    ticketId: "t7",
    dueDate: "2026-08-25 16:30",
    status: "TO DO",
  },
  {
    id: "tk9",
    title: "Complete provisioning batch 2 of 3",
    origin: "Ticket",
    assignedToId: "c8",
    customerId: "cu8",
    ticketId: "t8",
    dueDate: "2026-08-25 17:00",
    status: "IN PROGRESS",
  },
  {
    id: "tk10",
    title: "Close off itemised billing request",
    origin: "Ticket",
    assignedToId: "c1",
    customerId: "cu1",
    ticketId: "t9",
    dueDate: "2026-08-15 12:00",
    status: "COMPLETED",
  },
  {
    id: "tk11",
    title: "Schedule quarterly review with Coastal Logistics",
    origin: "AI Task Planner",
    assignedToId: "c7",
    customerId: "cu5",
    dueDate: "2026-08-27 10:00",
    status: "TO DO",
  },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Team stand-up", type: "Meeting", date: "2026-08-25", start: "08:00", end: "08:15", consultantId: "c1" },
  { id: "ev2", title: "Callback — Thandeka Mbeki", type: "Call", date: "2026-08-25", start: "15:00", end: "15:20", consultantId: "c1", customerId: "cu1" },
  { id: "ev3", title: "Follow-up — Port Elizabeth credit", type: "Follow-up", date: "2026-08-25", start: "16:30", end: "16:50", consultantId: "c1", customerId: "cu7" },
  { id: "ev4", title: "Lunch", type: "Break", date: "2026-08-25", start: "12:30", end: "13:00", consultantId: "c1" },
  { id: "ev5", title: "SLA review with Team Leader", type: "Meeting", date: "2026-08-25", start: "14:00", end: "14:30", consultantId: "c1" },
  { id: "ev6", title: "Booster Care product training", type: "Training", date: "2026-08-26", start: "09:00", end: "11:00", consultantId: "c1" },
  { id: "ev7", title: "Task — confirm auth lock cleared", type: "Task", date: "2026-08-25", start: "13:00", end: "13:30", consultantId: "c1", customerId: "cu1" },
  { id: "ev8", title: "Appointment — Sunrise Academy onboarding", type: "Appointment", date: "2026-08-27", start: "10:00", end: "11:00", consultantId: "c1", customerId: "cu8" },
];

export const escalations: Escalation[] = [
  {
    id: "es1",
    reference: "ESC-2201",
    customerId: "cu2",
    ticketId: "t2",
    reason: "Duplicate debit order requires financial reversal approval",
    currentOwnerId: "c5",
    level: "Query Manager",
    slaStatus: "BREACHED",
    status: "In Review",
    raisedAt: "2026-08-25 09:15",
  },
  {
    id: "es2",
    reference: "ESC-2202",
    customerId: "cu4",
    ticketId: "t4",
    reason: "Claim feedback outstanding beyond agreed turnaround",
    currentOwnerId: "c6",
    level: "Team Leader",
    slaStatus: "APPROACHING",
    status: "Open",
    raisedAt: "2026-08-25 08:05",
  },
  {
    id: "es3",
    reference: "ESC-2203",
    customerId: "cu7",
    ticketId: "t7",
    reason: "Third service interruption in 30 days, customer requesting credit",
    currentOwnerId: "c2",
    level: "Senior Consultant",
    slaStatus: "AT RISK",
    status: "Open",
    raisedAt: "2026-08-25 07:58",
  },
  {
    id: "es4",
    reference: "ESC-2198",
    customerId: "cu5",
    ticketId: "t5",
    reason: "Suspension dispute — customer requested manager involvement",
    currentOwnerId: "c10",
    level: "Manager",
    slaStatus: "NORMAL",
    status: "Resolved",
    resolution: "Payment arrangement approved over 3 months, suspension lifted.",
    raisedAt: "2026-08-20 13:40",
  },
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "kb1",
    title: "Resolving portal login failures after a password reset",
    category: "Access & Authentication",
    problem: "Customer cannot log in after completing a password reset; portal returns invalid credentials.",
    solution: "Clear the auth service account lock flag, then force an MFA re-enrolment.",
    steps: [
      "Confirm customer identity using two verification points.",
      "Open Admin > Identity > Account Locks and search the customer number.",
      "Clear the lock flag and save.",
      "Trigger MFA re-enrolment email.",
      "Ask the customer to retry within 10 minutes and confirm.",
    ],
    keywords: ["portal", "login", "password", "lock", "mfa"],
    ownerId: "c2",
    lastUpdated: "2026-08-18",
  },
  {
    id: "kb2",
    title: "Duplicate debit order reversal process",
    category: "Billing",
    problem: "A customer was debited twice in the same billing cycle.",
    solution: "Validate the duplicate on the bank file, then submit a reversal for Query Manager approval.",
    steps: [
      "Obtain the customer bank statement or reference numbers.",
      "Verify both transactions on the collections file.",
      "Complete the reversal request form.",
      "Route to Query Manager for approval.",
      "Confirm reversal date with the customer in writing.",
    ],
    keywords: ["debit order", "reversal", "duplicate", "billing"],
    ownerId: "c5",
    lastUpdated: "2026-08-11",
  },
  {
    id: "kb3",
    title: "Document upload failures on the onboarding wizard",
    category: "Onboarding",
    problem: "Uploads fail near completion when documents exceed the size limit.",
    solution: "Advise compression below 8MB or use the secure upload link.",
    steps: [
      "Check the file size reported in the upload log.",
      "If above 8MB, send the compression guide.",
      "Alternatively issue a secure upload link valid for 24 hours.",
      "Confirm the document appears on the customer profile.",
    ],
    keywords: ["upload", "document", "onboarding", "size limit"],
    ownerId: "c8",
    lastUpdated: "2026-08-20",
  },
  {
    id: "kb4",
    title: "Handling repeat service interruptions and credit requests",
    category: "Network",
    problem: "Customer experiences repeated outages and requests account credit.",
    solution: "Log the incident chain, dispatch field support and route credit requests to the Team Leader.",
    steps: [
      "Confirm outage history over the last 30 days.",
      "Dispatch field support and record the reference.",
      "Log an escalation with the incident chain attached.",
      "Route the credit request to the Team Leader for approval.",
    ],
    keywords: ["outage", "interruption", "credit", "network"],
    ownerId: "c6",
    lastUpdated: "2026-08-22",
  },
  {
    id: "kb5",
    title: "Payment arrangement guidelines for suspended accounts",
    category: "Collections",
    problem: "Customer requests a payment arrangement to lift a suspension.",
    solution: "Arrangements up to 3 months may be approved by a Supervisor; longer terms require a Manager.",
    steps: [
      "Confirm outstanding balance and arrears age.",
      "Capture the proposed instalment plan.",
      "Obtain the correct approval level.",
      "Load the arrangement and lift the suspension.",
    ],
    keywords: ["payment", "arrangement", "suspension", "collections"],
    ownerId: "c9",
    lastUpdated: "2026-08-09",
  },
];

export const automationRules: AutomationRule[] = [
  {
    id: "au1",
    name: "Notify consultant on new ticket",
    trigger: "WHEN a new ticket is created",
    condition: "IF the ticket has an assigned consultant",
    action: "THEN notify the assigned consultant",
    enabled: true,
    lastRun: "2026-08-25 10:55",
  },
  {
    id: "au2",
    name: "SLA approaching warning",
    trigger: "WHEN an SLA is approaching",
    condition: "IF less than 60 minutes remain",
    action: "THEN notify the consultant and Team Leader",
    enabled: true,
    lastRun: "2026-08-25 11:40",
  },
  {
    id: "au3",
    name: "Recommend escalation on stalled ticket",
    trigger: "WHEN a ticket remains unresolved",
    condition: "IF no update for 24 hours",
    action: "THEN recommend escalation to the Query Manager",
    enabled: true,
    lastRun: "2026-08-25 06:00",
  },
  {
    id: "au4",
    name: "Create follow-up task on customer request",
    trigger: "WHEN a customer requests follow-up",
    condition: "IF the request comes from call or email",
    action: "THEN create a follow-up task for the owning consultant",
    enabled: true,
    lastRun: "2026-08-25 10:20",
  },
  {
    id: "au5",
    name: "Route unassigned email after 30 minutes",
    trigger: "WHEN an email remains unassigned",
    condition: "IF older than 30 minutes",
    action: "THEN assign to the next available consultant in the team",
    enabled: false,
    lastRun: "2026-08-22 14:10",
  },
];

export const notifications: NotificationItem[] = [
  { id: "n1", type: "SLA Warning", title: "BH-1042 SLA at risk", detail: "32 minutes remaining on Thandeka Mbeki's portal access ticket.", at: "11:40", read: false },
  { id: "n2", type: "SLA Breach", title: "BH-1043 SLA breached", detail: "Duplicate debit order response overdue by 1h 35m.", at: "10:02", read: false },
  { id: "n3", type: "Escalation", title: "ESC-2203 raised", detail: "Repeat interruption escalated to Senior Consultant.", at: "07:58", read: false },
  { id: "n4", type: "New Chat", title: "Chat waiting in queue", detail: "Coastal Logistics waiting 3m 04s.", at: "11:44", read: false },
  { id: "n5", type: "Missed Call", title: "Missed call", detail: "Coastal Logistics — callback required.", at: "10:48", read: true },
  { id: "n6", type: "Task Due", title: "Task due at 13:00", detail: "Confirm auth lock cleared with platform team.", at: "09:00", read: true },
  { id: "n7", type: "AI Recommendation", title: "Booster AI suggestion", detail: "Recommended knowledge article for BH-1042.", at: "08:25", read: true },
  { id: "n8", type: "Meeting Reminder", title: "SLA review at 14:00", detail: "With Nomsa Dube (Team Leader).", at: "07:30", read: true },
  { id: "n9", type: "Assigned Ticket", title: "BH-1048 assigned to you", detail: "Repeat service interruption in Port Elizabeth.", at: "07:20", read: true },
  { id: "n10", type: "Customer Reply", title: "Reply on BH-1042", detail: "Thandeka Mbeki replied to your email.", at: "09:12", read: true },
  { id: "n11", type: "Manager Message", title: "Message from Zanele Mahlangu", detail: "Please prioritise breached SLA items today.", at: "08:05", read: true },
  { id: "n12", type: "New Ticket", title: "BH-1046 created", detail: "Payment arrangement request from Coastal Logistics.", at: "10:55", read: true },
];

export const aiAuditLog: AiAuditEntry[] = [
  {
    id: "ai1",
    feature: "Smart Email Generator",
    user: "Yulenda Khoza",
    input: "Portal access update, empathetic tone, ticket BH-1042",
    output: "Draft email confirming auth lock cleared with retry instructions.",
    timestamp: "2026-08-25 11:06",
    decision: "Edited",
  },
  {
    id: "ai2",
    feature: "AI Customer Service Copilot",
    user: "Yulenda Khoza",
    input: "Summarise ticket BH-1042",
    output: "Issue summary plus recommended next action and knowledge article KB1.",
    timestamp: "2026-08-25 08:25",
    decision: "Accepted",
  },
  {
    id: "ai3",
    feature: "AI Call Summary",
    user: "Andile Zulu",
    input: "Call notes for duplicate debit order call",
    output: "Call summary with reversal action and 24h follow-up.",
    timestamp: "2026-08-25 09:20",
    decision: "Accepted",
  },
  {
    id: "ai4",
    feature: "Meeting Notes Summarizer",
    user: "Nomsa Dube",
    input: "SLA review meeting notes",
    output: "Summary, 4 decisions and 5 action items.",
    timestamp: "2026-08-24 16:10",
    decision: "Edited",
  },
  {
    id: "ai5",
    feature: "AI Research Assistant",
    user: "Lerato Mokoena",
    input: "Best practice for claims turnaround communication",
    output: "Key findings and 3 recommendations.",
    timestamp: "2026-08-24 11:45",
    decision: "Rejected",
  },
];

/* ---------- Reporting series ---------- */

export const dailyVolume = [
  { label: "Mon", tickets: 128, calls: 214, chats: 96, emails: 173 },
  { label: "Tue", tickets: 142, calls: 232, chats: 104, emails: 188 },
  { label: "Wed", tickets: 119, calls: 198, chats: 88, emails: 165 },
  { label: "Thu", tickets: 151, calls: 245, chats: 112, emails: 201 },
  { label: "Fri", tickets: 163, calls: 261, chats: 121, emails: 214 },
  { label: "Sat", tickets: 74, calls: 96, chats: 41, emails: 62 },
  { label: "Sun", tickets: 38, calls: 44, chats: 22, emails: 31 },
];

export const slaTrend = [
  { label: "Week 1", compliance: 92, breaches: 8 },
  { label: "Week 2", compliance: 94, breaches: 6 },
  { label: "Week 3", compliance: 89, breaches: 11 },
  { label: "Week 4", compliance: 96, breaches: 4 },
];

export const aiUsage = [
  { tool: "Smart Email Generator", uses: 312 },
  { tool: "Meeting Notes Summarizer", uses: 96 },
  { tool: "AI Task Planner", uses: 178 },
  { tool: "AI Research Assistant", uses: 64 },
  { tool: "Booster AI Chatbot", uses: 421 },
];

/* ---------- Lookups & helpers ---------- */

export const consultantById = (id?: string) => consultants.find((c) => c.id === id);
export const customerById = (id?: string) => customers.find((c) => c.id === id);
export const ticketById = (id?: string) => tickets.find((t) => t.id === id);
export const ticketByNumber = (n?: string) => tickets.find((t) => t.number === n);

export const currentUser = consultants.find((c) => c.id === CURRENT_USER_ID)!;

export function formatDuration(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

export function formatSeconds(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function slaRemainingLabel(minutes: number) {
  if (minutes === 0) return "Met";
  if (minutes < 0) return `Overdue by ${formatDuration(Math.abs(minutes))}`;
  return `${formatDuration(minutes)} remaining`;
}

export const managerStats = {
  totalConsultants: consultants.length,
  online: consultants.filter((c) => c.status !== "OFFLINE").length,
  offline: consultants.filter((c) => c.status === "OFFLINE").length,
  available: consultants.filter((c) => c.status === "AVAILABLE").length,
  onCall: consultants.filter((c) => c.status === "ON CALL").length,
  onBreak: consultants.filter((c) => c.status === "BREAK" || c.status === "LUNCH").length,
  openTickets: tickets.filter((t) => ["NEW", "OPEN", "IN PROGRESS", "ESCALATED"].includes(t.status)).length,
  resolvedTickets: tickets.filter((t) => ["RESOLVED", "CLOSED"].includes(t.status)).length,
  slaRisk: tickets.filter((t) => t.slaStatus === "AT RISK" || t.slaStatus === "APPROACHING").length,
  slaBreaches: tickets.filter((t) => t.slaStatus === "BREACHED").length,
  escalations: escalations.filter((e) => e.status !== "Resolved").length,
  calls: calls.length,
  chats: chats.length,
  emails: emails.length,
  csat: 4.4,
};
