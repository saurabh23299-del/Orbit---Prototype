/** ISO date string, YYYY-MM-DD. */
export type ISODate = string;

export type EmployeeId = 'arjun' | 'karan' | 'rahul' | 'meera' | 'daniel' | 'priya' | 'aman' | 'neha';
export type ProjectId = 'ecom' | 'health' | 'fin';
export type AlertId = 'a1' | 'a2' | 'a3';

export type Skill =
  | 'Node' | 'Payments' | 'API' | 'Postgres' | 'React' | 'Design systems'
  | 'DevOps' | 'AWS' | 'CI/CD' | 'Python' | 'Mobile';

export interface Employee {
  id: EmployeeId;
  name: string;
  initials: string;
  role: string;
  /** Available capacity in hours over the 2-week window (after meetings, leave and other work). */
  capacity: number;
  /** Hours of leave inside the window. */
  leaveHours: number;
  /** Hours taken by other responsibilities inside the window. */
  otherHours: number;
  otherWhat: string;
  availability: string;
  /** Full days of leave inside the window. Used for reassignment eligibility. */
  leaveDays: ISODate[];
  skills: Skill[];
  email: string;
}

/** Status tone keys shared by chips, health and dependencies. */
export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'kepler';

export type EvidenceTag = 'Observed' | 'Predicted';

export interface Evidence {
  tag: EvidenceTag;
  text: string;
}

/** A Kepler message line. An empty tag means a plain line with no chip. */
export interface KeplerLine {
  tag: EvidenceTag | '';
  text: string;
}

export type ProjectHealth = 'On track' | 'At risk' | 'Off track';

export interface Dependency {
  from: string;
  to: string;
  what: string;
  status: string;
  tone: Tone;
}

export interface Project {
  id: ProjectId;
  /** External client the agency builds this for (fictional). */
  client: string;
  /** What the project is, e.g. "E-commerce Platform". */
  name: string;
  /** Client's category, e.g. "Retail and logistics". */
  sector: string;
  /** Progress percentage. Always separate from health. */
  progress: number;
  health: ProjectHealth;
  healthTone: Tone;
  lead: string;
  milestone: string;
  due: ISODate;
  summary: string;
  evidence: Evidence[];
  blockers: string[];
  deps: Dependency[];
}

export type TaskStatus = 'In progress' | 'In review' | 'To do' | 'Blocked' | 'Done';

export interface Task {
  id: string;
  title: string;
  project: ProjectId;
  assignee: EmployeeId;
  status: TaskStatus;
  due: ISODate;
  /** Remaining effort in hours. */
  effort: number;
  skills: Skill[];
}

export type Severity = 'Critical' | 'High' | 'Medium';

export type AlertAction =
  | { label: string; type: 'reassign'; task: string; pick: EmployeeId }
  | { label: string; type: 'deadline'; task: string };

export interface Alert {
  id: AlertId;
  severity: Severity;
  kind: string;
  ago: string;
  title: string;
  summary: string;
  detected: string;
  evidence: Evidence[];
  people: EmployeeId[];
  projects: ProjectId[];
  impact: string;
  recommendation: string;
  action: AlertAction;
  /** A reassignment away from any of these people marks the alert as handled. */
  resolvesByPeople?: EmployeeId[];
  /** A deadline change on any of these tasks marks the alert as handled. */
  resolvesByTasks?: string[];
}

export interface ChatQA {
  q: string;
  a: KeplerLine[];
}

export interface ChatScript {
  qs: ChatQA[];
  fallback: KeplerLine[];
}

export interface Bottleneck {
  id: string;
  title: string;
  cause: string;
  type: string;
  teams: string;
  projects: string;
  impact: string;
  impactTone: Tone;
  explain: string;
  impactLong: string;
  dates: ISODate[];
  qa: ChatQA[];
}

export interface Reminder {
  id: string;
  title: string;
  when: string;
  icon: 'video' | 'flag' | 'calendar';
  tone: 'info' | 'neutral' | 'warning';
}
