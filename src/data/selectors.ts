// Derived data. Everything the UI shows about workload is computed here from tasks,
// so a reassignment or deadline change updates every view at once.

import { ALERTS, EMPLOYEES, TODAY } from './mockData';
import type { Alert, AlertId, Employee, EmployeeId, Severity, Task, TaskStatus, Tone } from './types';

// ---------- Utilisation and bands ----------

export type Band = 'Low' | 'Moderate' | 'High';

/** Assigned remaining effort ÷ available capacity × 100, rounded. A workload measure, never a productivity score. */
export const utilisation = (assignedHours: number, capacityHours: number): number =>
  capacityHours <= 0 ? 0 : Math.round((assignedHours / capacityHours) * 100);

/** Low under 60%, Moderate 60–85%, High above 85%. */
export const bandOf = (u: number): Band => (u > 85 ? 'High' : u >= 60 ? 'Moderate' : 'Low');

export const BAND_FILL: Record<Band, string> = {
  Low: 'var(--load-under)',
  Moderate: 'var(--load-healthy)',
  High: 'var(--load-overloaded)',
};

/** Deeper band colours for thin marks (bars, legend swatches) that must read at 3:1. */
export const BAND_MARK: Record<Band, string> = {
  Low: 'var(--load-under-mark)',
  Moderate: 'var(--load-healthy-mark)',
  High: 'var(--load-overloaded-mark)',
};

export const BAND_LABEL: Record<Band, string> = {
  Low: 'Low, under 60%',
  Moderate: 'Moderate, 60–85%',
  High: 'High, above 85%',
};

/** Employee status chip derived from the band (DESIGN.md §2.6). */
export const employeeStatus = (u: number): { text: string; tone: Tone } => {
  const b = bandOf(u);
  if (b === 'High') return { text: 'High utilisation', tone: 'danger' };
  if (b === 'Moderate') return { text: 'Balanced', tone: 'success' };
  return { text: 'Has capacity', tone: 'info' };
};

// ---------- Tasks ----------

export const isOpen = (t: Task): boolean => t.status !== 'Done';
export const isOverdue = (t: Task, today = TODAY): boolean => isOpen(t) && t.due < today;

export const TASK_STATUS_TONE: Record<TaskStatus, Tone> = {
  'In progress': 'info',
  'In review': 'kepler',
  'To do': 'neutral',
  Blocked: 'danger',
  Done: 'success',
};

export const SEVERITY_TONE: Record<Severity, Tone> = { Critical: 'danger', High: 'warning', Medium: 'neutral' };

// ---------- Employees ----------

export interface EmployeeStats {
  employee: Employee;
  tasks: Task[];
  assigned: number;
  util: number;
  band: Band;
}

export const employeeStats = (tasks: Task[]): Record<EmployeeId, EmployeeStats> => {
  const out = {} as Record<EmployeeId, EmployeeStats>;
  for (const e of EMPLOYEES) {
    const mine = tasks.filter((t) => t.assignee === e.id && isOpen(t));
    const assigned = mine.reduce((sum, t) => sum + t.effort, 0);
    const util = utilisation(assigned, e.capacity);
    out[e.id] = { employee: e, tasks: mine, assigned, util, band: bandOf(util) };
  }
  return out;
};

// ---------- Team KPIs (Dashboard: Team overview) ----------

export interface TeamKpis {
  size: number;
  util: number;
  active: number;
  inProgress: number;
  inReview: number;
  todo: number;
  blocked: number;
  /** Overdue and not blocked, so a task is never counted twice. */
  overdue: number;
  overdueOrBlocked: number;
  activeProjects: number;
}

export const teamKpis = (tasks: Task[]): TeamKpis => {
  const stats = employeeStats(tasks);
  const utils = EMPLOYEES.map((e) => stats[e.id].util);
  const open = tasks.filter(isOpen);
  const blocked = open.filter((t) => t.status === 'Blocked').length;
  const overdue = open.filter((t) => isOverdue(t) && t.status !== 'Blocked').length;
  return {
    size: EMPLOYEES.length,
    util: Math.round(utils.reduce((a, b) => a + b, 0) / utils.length),
    active: open.length,
    inProgress: open.filter((t) => t.status === 'In progress').length,
    inReview: open.filter((t) => t.status === 'In review').length,
    todo: open.filter((t) => t.status === 'To do').length,
    blocked,
    overdue,
    overdueOrBlocked: blocked + overdue,
    activeProjects: new Set(open.map((t) => t.project)).size,
  };
};

// ---------- Reassignment eligibility ----------

export type EligibilityKind = 'match' | 'partial' | 'missing-skill' | 'leave' | 'over-capacity';

export interface Candidate {
  employee: Employee;
  currentUtil: number;
  projectedUtil: number;
  matchedSkills: string[];
  fullMatch: boolean;
  eligible: boolean;
  kind: EligibilityKind;
  /** Chip label, e.g. "Skills match", "Partial match: Node", "Missing Payments", "Would reach 108%". */
  label: string;
  tone: Tone;
}

const onLeaveBefore = (e: Employee, due: string, today = TODAY): boolean =>
  e.leaveDays.some((d) => d >= today && d <= due);

/**
 * Eligibility = has at least one required skill AND projected utilisation ≤ 85% AND available before the deadline.
 * Never based on lowest utilisation alone.
 */
export const reassignCandidates = (task: Task, tasks: Task[]): Candidate[] => {
  const stats = employeeStats(tasks);
  return EMPLOYEES.filter((e) => e.id !== task.assignee).map((e) => {
    const matchedSkills = task.skills.filter((s) => e.skills.includes(s));
    const fullMatch = matchedSkills.length === task.skills.length;
    const projectedUtil = utilisation(stats[e.id].assigned + task.effort, e.capacity);
    const leave = onLeaveBefore(e, task.due);

    let kind: EligibilityKind;
    let label: string;
    if (!matchedSkills.length) { kind = 'missing-skill'; label = `Missing ${task.skills.join(', ')}`; }
    else if (leave) { kind = 'leave'; label = 'On leave before deadline'; }
    else if (projectedUtil > 85) { kind = 'over-capacity'; label = `Would reach ${projectedUtil}%`; }
    else if (fullMatch) { kind = 'match'; label = 'Skills match'; }
    else { kind = 'partial'; label = `Partial match: ${matchedSkills.join(', ')}`; }

    const eligible = kind === 'match' || kind === 'partial';
    const tone: Tone = eligible ? 'success' : kind === 'missing-skill' ? 'neutral' : 'warning';
    return { employee: e, currentUtil: stats[e.id].util, projectedUtil, matchedSkills, fullMatch, eligible, kind, label, tone };
  });
};

/** Recommended (eligible) first: full skill match, then lowest projected utilisation. Others by projected utilisation. */
export const groupCandidates = (cands: Candidate[]): { recommended: Candidate[]; others: Candidate[] } => ({
  recommended: cands
    .filter((c) => c.eligible)
    .sort((a, b) => Number(b.fullMatch) - Number(a.fullMatch) || a.projectedUtil - b.projectedUtil),
  others: cands.filter((c) => !c.eligible).sort((a, b) => a.projectedUtil - b.projectedUtil),
});

export const matchesCandidateQuery = (c: Candidate, q: string): boolean => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = `${c.employee.name} ${c.employee.role} ${c.employee.skills.join(' ')}`.toLowerCase();
  return hay.includes(needle);
};

// ---------- Alerts ----------

export const liveAlerts = (handled: Partial<Record<AlertId, boolean>>): Alert[] => ALERTS.filter((a) => !handled[a.id]);

export const SEVERITY_RANK: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2 };

/** Each person's most severe open alert (the alert lists who it covers). */
export const alertByPerson = (handled: Partial<Record<AlertId, boolean>>): Partial<Record<EmployeeId, Alert>> => {
  const out: Partial<Record<EmployeeId, Alert>> = {};
  for (const a of [...liveAlerts(handled)].sort((x, y) => SEVERITY_RANK[x.severity] - SEVERITY_RANK[y.severity])) {
    for (const id of a.people) out[id] ??= a;
  }
  return out;
};

export const alertCountChips = (handled: Partial<Record<AlertId, boolean>>): { text: string; tone: Tone }[] => {
  const live = liveAlerts(handled);
  if (!live.length) return [{ text: 'All handled', tone: 'success' }];
  return (['Critical', 'High', 'Medium'] as Severity[])
    .map((sev) => ({ sev, n: live.filter((a) => a.severity === sev).length }))
    .filter((x) => x.n > 0)
    .map((x) => ({ text: `${x.n} ${x.sev.toLowerCase()}`, tone: SEVERITY_TONE[x.sev] }));
};

/** Alerts that a successful reassignment away from `fromId` resolves. */
export const alertsResolvedByReassign = (fromId: EmployeeId): AlertId[] =>
  ALERTS.filter((a) => a.resolvesByPeople?.includes(fromId)).map((a) => a.id);

/** Alerts that a successful deadline change on `taskId` resolves. */
export const alertsResolvedByDeadline = (taskId: string): AlertId[] =>
  ALERTS.filter((a) => a.resolvesByTasks?.includes(taskId)).map((a) => a.id);

// Analytics history selectors live in analytics.ts.
