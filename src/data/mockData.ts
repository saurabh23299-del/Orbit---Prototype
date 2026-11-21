// Orbit mock dataset, ported from design/reference/mock-data.js.
// Today in the prototype is Fri, Nov 21, 2026. The capacity window is the next 2 weeks (Nov 21 – Dec 4).
// Utilisation is derived in selectors.ts: sum(remaining effort) / capacity * 100.

import type {
  Alert, AlertId, Bottleneck, ChatScript, Employee, EmployeeId, ISODate, Project, Reminder, Task,
} from './types';

export const TODAY: ISODate = '2026-11-21';
export const WINDOW = { start: '2026-11-21', end: '2026-12-04', label: 'Nov 21 – Dec 4' } as const;

export const ORGANISATION = 'Apex Digital Solution';
export const TEAM_NAME = 'Engineering team';
export const CURRENT_USER = { name: 'Alex Morgan', initials: 'AM', role: 'Engineering lead' } as const;

// ---------- Employees ----------
export const EMPLOYEES: Employee[] = [
  { id: 'arjun', name: 'Arjun Mehta', initials: 'AM', role: 'Backend developer', capacity: 50, leaveHours: 0, otherHours: 14, otherWhat: 'Support rotation', availability: 'Available', leaveDays: [], skills: ['Node', 'Payments', 'API'], email: 'arjun@apexdigital.dev' },
  { id: 'karan', name: 'Karan Iyer', initials: 'KI', role: 'Senior developer', capacity: 50, leaveHours: 0, otherHours: 14, otherWhat: 'Architecture reviews', availability: 'Available', leaveDays: [], skills: ['Node', 'Postgres', 'API'], email: 'karan@apexdigital.dev' },
  { id: 'rahul', name: 'Rahul Sharma', initials: 'RS', role: 'Full-stack developer', capacity: 50, leaveHours: 4, otherHours: 10, otherWhat: 'Hiring interviews', availability: 'Half day off Nov 24', leaveDays: [], skills: ['React', 'Node'], email: 'rahul@apexdigital.dev' },
  { id: 'meera', name: 'Meera Pillai', initials: 'MP', role: 'Frontend developer', capacity: 40, leaveHours: 0, otherHours: 24, otherWhat: 'Design system guild', availability: 'Available', leaveDays: [], skills: ['React', 'Design systems'], email: 'meera@apexdigital.dev' },
  { id: 'daniel', name: 'Daniel Cho', initials: 'DC', role: 'DevOps engineer', capacity: 45, leaveHours: 0, otherHours: 19, otherWhat: 'On-call this week', availability: 'On call this week', leaveDays: [], skills: ['DevOps', 'AWS', 'CI/CD'], email: 'daniel@apexdigital.dev' },
  { id: 'priya', name: 'Priya Nair', initials: 'PN', role: 'Senior developer', capacity: 50, leaveHours: 0, otherHours: 14, otherWhat: 'Code reviews and mentoring', availability: 'Available', leaveDays: [], skills: ['Python', 'Postgres', 'API'], email: 'priya@apexdigital.dev' },
  { id: 'aman', name: 'Aman Verma', initials: 'AV', role: 'Backend developer', capacity: 50, leaveHours: 0, otherHours: 14, otherWhat: 'Support rotation', availability: 'Available', leaveDays: [], skills: ['Node', 'Payments', 'API'], email: 'aman@apexdigital.dev' },
  { id: 'neha', name: 'Neha Rao', initials: 'NR', role: 'Frontend developer', capacity: 40, leaveHours: 16, otherHours: 8, otherWhat: 'Accessibility audits', availability: 'On leave Nov 27–28', leaveDays: ['2026-11-27', '2026-11-28'], skills: ['React', 'Node', 'Mobile'], email: 'neha@apexdigital.dev' },
];

export const employeeById = (id: EmployeeId): Employee => {
  const e = EMPLOYEES.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown employee ${id}`);
  return e;
};

// ---------- Projects ----------
export const PROJECTS: Project[] = [
  {
    id: 'ecom', client: 'Lumen Outfitters', name: 'E-commerce Platform', sector: 'Retail and logistics', progress: 68, health: 'At risk', healthTone: 'warning', lead: 'Rahul Sharma',
    milestone: 'Backend integration', due: '2026-11-24',
    summary: 'Payment API latency and two people above 90% put the Nov 24 milestone at risk.',
    evidence: [
      { tag: 'Observed', text: 'Checkout load tests show payment API latency of 1.8s, against a 600ms target.' },
      { tag: 'Observed', text: 'Arjun Mehta (96%) and Karan Iyer (92%) own 4 of the 6 tasks due before the milestone.' },
      { tag: 'Observed', text: 'Schedule: 68% complete with 3 days left; the plan expected 80% by now.' },
      { tag: 'Predicted', text: 'Backend integration is likely to slip by about 2 days without a change. Medium confidence.' },
    ],
    blockers: ['Payment provider sandbox rate-limits auth calls during load tests'],
    deps: [
      { from: 'Payment provider (external)', to: 'Engineering', what: 'Sandbox rate limit increase requested Nov 18', status: 'Waiting', tone: 'warning' },
      { from: 'Engineering', to: 'QA', what: 'Checkout build for regression testing', status: 'On track', tone: 'success' },
    ],
  },
  {
    id: 'health', client: 'Cedarbrook Clinics', name: 'Healthcare Application', sector: 'Medtech · HIPAA', progress: 45, health: 'On track', healthTone: 'success', lead: 'Priya Nair',
    milestone: 'User acceptance testing', due: '2026-11-28',
    summary: 'Velocity is steady and dependencies are cleared. One small DevOps task is overdue.',
    evidence: [
      { tag: 'Observed', text: 'Velocity has been steady for 3 sprints (34–37 points).' },
      { tag: 'Observed', text: 'All cross-team dependencies for UAT are cleared.' },
      { tag: 'Observed', text: 'Staging pipeline fixes is 2 days overdue, with 12h of work left.' },
      { tag: 'Predicted', text: 'UAT on Nov 28 still has about 3 days of buffer. Low risk.' },
    ],
    blockers: [],
    deps: [{ from: 'Engineering', to: 'QA', what: 'UAT build handoff on Nov 26', status: 'On track', tone: 'success' }],
  },
  {
    id: 'fin', client: 'Fernway Capital', name: 'Fintech Dashboard', sector: 'Financial services', progress: 32, health: 'Off track', healthTone: 'danger', lead: 'Arjun Mehta',
    milestone: 'Design handoff', due: '2026-11-19',
    summary: 'The design handoff is 2 days late and 3 engineering tasks are blocked.',
    evidence: [
      { tag: 'Observed', text: 'Design handoff for the account and transactions screens was due Nov 19 and is not delivered.' },
      { tag: 'Observed', text: '3 engineering tasks are blocked on approved Figma specs (Meera ×2, Arjun ×1).' },
      { tag: 'Observed', text: 'Client sign-off on designs has taken 4 days on average, against 1 day in the plan.' },
      { tag: 'Predicted', text: 'The Dec 3 release milestone is likely to slip by 3–4 days if specs arrive after Nov 24. Medium confidence.' },
    ],
    blockers: ['Approved Figma specs for account settings and transactions', 'Client sign-off on authentication flow'],
    deps: [
      { from: 'Design (Marcus Vance)', to: 'Engineering', what: 'Account and transactions specs', status: '2 days late', tone: 'danger' },
      { from: 'Client', to: 'Design', what: 'Sign-off on authentication flow', status: 'Waiting', tone: 'warning' },
    ],
  },
];

export const projectById = (id: string): Project => {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown project ${id}`);
  return p;
};

// ---------- Tasks (mutable through the store) ----------
export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Payment gateway integration', project: 'ecom', assignee: 'arjun', status: 'In progress', due: '2026-11-24', effort: 16, skills: ['Payments', 'Node'] },
  { id: 't2', title: 'Refund webhook handlers', project: 'ecom', assignee: 'arjun', status: 'To do', due: '2026-11-26', effort: 10, skills: ['Payments', 'Node'] },
  { id: 't3', title: 'Auth token service', project: 'fin', assignee: 'arjun', status: 'Blocked', due: '2026-11-25', effort: 8, skills: ['Node', 'API'] },
  { id: 't4', title: 'Checkout API load tests', project: 'ecom', assignee: 'arjun', status: 'In review', due: '2026-11-23', effort: 4, skills: ['Node', 'API'] },
  { id: 't5', title: 'Ledger export endpoint', project: 'fin', assignee: 'arjun', status: 'To do', due: '2026-11-28', effort: 6, skills: ['Node', 'API'] },
  { id: 't6', title: 'Order status API', project: 'ecom', assignee: 'arjun', status: 'In progress', due: '2026-11-27', effort: 4, skills: ['Node', 'API'] },
  { id: 't7', title: 'Patient records API', project: 'health', assignee: 'karan', status: 'In progress', due: '2026-11-26', effort: 14, skills: ['Postgres', 'API'] },
  { id: 't8', title: 'Database migration scripts', project: 'health', assignee: 'karan', status: 'In progress', due: '2026-11-24', effort: 10, skills: ['Postgres'] },
  { id: 't9', title: 'Inventory sync service', project: 'ecom', assignee: 'karan', status: 'To do', due: '2026-11-27', effort: 12, skills: ['Node', 'API'] },
  { id: 't10', title: 'Audit log service', project: 'health', assignee: 'karan', status: 'To do', due: '2026-11-28', effort: 10, skills: ['Node', 'Postgres'] },
  { id: 't11', title: 'Admin dashboard UI', project: 'ecom', assignee: 'rahul', status: 'In progress', due: '2026-11-25', effort: 12, skills: ['React'] },
  { id: 't12', title: 'Search API', project: 'ecom', assignee: 'rahul', status: 'In progress', due: '2026-11-26', effort: 10, skills: ['Node', 'API'] },
  { id: 't13', title: 'Order history page', project: 'ecom', assignee: 'rahul', status: 'To do', due: '2026-11-27', effort: 8, skills: ['React'] },
  { id: 't14', title: 'Cart service refactor', project: 'ecom', assignee: 'rahul', status: 'In review', due: '2026-11-20', effort: 6, skills: ['Node'] },
  { id: 't15', title: 'Promo codes API', project: 'ecom', assignee: 'rahul', status: 'To do', due: '2026-11-28', effort: 8, skills: ['Node', 'API'] },
  { id: 't16', title: 'Account settings UI', project: 'fin', assignee: 'meera', status: 'Blocked', due: '2026-11-25', effort: 12, skills: ['React'] },
  { id: 't17', title: 'Transactions table', project: 'fin', assignee: 'meera', status: 'Blocked', due: '2026-11-26', effort: 10, skills: ['React'] },
  { id: 't18', title: 'Dashboard charts', project: 'fin', assignee: 'meera', status: 'In progress', due: '2026-11-24', effort: 12, skills: ['React'] },
  { id: 't19', title: 'Staging pipeline fixes', project: 'health', assignee: 'daniel', status: 'In progress', due: '2026-11-19', effort: 12, skills: ['DevOps', 'CI/CD'] },
  { id: 't20', title: 'HIPAA logging setup', project: 'health', assignee: 'daniel', status: 'In progress', due: '2026-11-26', effort: 14, skills: ['DevOps', 'AWS'] },
  { id: 't21', title: 'Load test environment', project: 'ecom', assignee: 'daniel', status: 'To do', due: '2026-11-27', effort: 9, skills: ['DevOps', 'AWS'] },
  { id: 't22', title: 'FHIR integration', project: 'health', assignee: 'priya', status: 'In progress', due: '2026-11-26', effort: 16, skills: ['Python', 'API'] },
  { id: 't23', title: 'Healthcare code reviews', project: 'health', assignee: 'priya', status: 'In progress', due: '2026-11-28', effort: 8, skills: ['Python'] },
  { id: 't24', title: 'UAT bug fixes', project: 'health', assignee: 'priya', status: 'To do', due: '2026-11-27', effort: 12, skills: ['Python', 'API'] },
  { id: 't25', title: 'Payment retry logic', project: 'ecom', assignee: 'aman', status: 'In progress', due: '2026-11-25', effort: 10, skills: ['Payments', 'Node'] },
  { id: 't26', title: 'Webhook monitoring', project: 'ecom', assignee: 'aman', status: 'To do', due: '2026-11-27', effort: 8, skills: ['Node'] },
  { id: 't27', title: 'Ledger API docs', project: 'fin', assignee: 'aman', status: 'To do', due: '2026-11-28', effort: 8, skills: ['API'] },
  { id: 't28', title: 'Mobile checkout screens', project: 'ecom', assignee: 'neha', status: 'In progress', due: '2026-11-26', effort: 10, skills: ['React', 'Mobile'] },
  { id: 't29', title: 'Patient portal UI fixes', project: 'health', assignee: 'neha', status: 'To do', due: '2026-11-25', effort: 8, skills: ['React'] },
];

// ---------- Dashboard: Kepler alerts ----------
export const ALERTS: Alert[] = [
  {
    id: 'a1', severity: 'Critical', kind: 'Workload conflict', ago: '12m ago', title: 'Arjun and Karan are above 90% capacity',
    summary: 'Overlapping E-commerce and Healthcare deadlines between Nov 24 and Nov 27.',
    detected: 'Two engineers have more work assigned over the next 2 weeks than they can sustainably finish, and their deadlines cluster in the same 4 days.',
    evidence: [
      { tag: 'Observed', text: 'Arjun Mehta has 48h of work assigned against 50h available (96%).' },
      { tag: 'Observed', text: 'Karan Iyer has 46h assigned against 50h available (92%).' },
      { tag: 'Observed', text: '4 of their tasks are due between Nov 24 and Nov 27.' },
      { tag: 'Predicted', text: 'Backend integration (E-commerce, Nov 24) is likely to slip by about 2 days. Medium confidence.' },
    ],
    people: ['arjun', 'karan'], projects: ['ecom', 'health'],
    impact: "Arjun's Fintech work will also start late once the design handoff lands, adding to his load in the week of Nov 24.",
    recommendation: 'Reassign Refund webhook handlers (10h) from Arjun to Aman Verma. Aman has payments experience and would move from 52% to 72%.',
    action: { label: 'Review reassignment', type: 'reassign', task: 't2', pick: 'aman' },
    resolvesByPeople: ['arjun', 'karan'],
  },
  {
    id: 'a2', severity: 'High', kind: 'Cross-team blocker', ago: '35m ago', title: 'Fintech design handoff is 2 days late',
    summary: '3 engineering tasks are blocked waiting on approved Figma specs from Design.',
    detected: 'The Design team has not delivered the account and transactions specs that 3 Engineering tasks depend on.',
    evidence: [
      { tag: 'Observed', text: 'The handoff was due Nov 19 and has not been delivered (owner: Marcus Vance, Design).' },
      { tag: 'Observed', text: 'Blocked: Account settings UI and Transactions table (Meera), Auth token service (Arjun).' },
      { tag: 'Observed', text: 'Client sign-off on designs has averaged 4 days this quarter, against 1 day in the plan.' },
      { tag: 'Predicted', text: 'The Dec 3 release milestone is likely to slip 3–4 days if specs arrive after Nov 24. Medium confidence.' },
    ],
    people: ['meera', 'arjun'], projects: ['fin'],
    impact: 'Meera has 22h of blocked work and may be partly idle next week unless she picks up other tasks.',
    recommendation: 'Agree a new handoff date with Marcus Vance, then move the deadline for Account settings UI to match it.',
    action: { label: 'Adjust deadline', type: 'deadline', task: 't16' },
    resolvesByTasks: ['t16', 't17', 't3'],
  },
  {
    id: 'a3', severity: 'Medium', kind: 'Delivery risk', ago: '1h ago', title: 'Staging pipeline fixes is 2 days overdue',
    summary: "Healthcare UAT still has buffer, but QA can't run full test suites until it lands.",
    detected: 'An overdue DevOps task sits on the path to Healthcare user acceptance testing.',
    evidence: [
      { tag: 'Observed', text: 'Due Nov 19, with 12h of work left (Daniel Cho).' },
      { tag: 'Observed', text: 'Daniel is on call this week, which takes 19h of his capacity.' },
      { tag: 'Predicted', text: 'UAT on Nov 28 keeps about 3 days of buffer if this lands by Nov 24. Low risk.' },
    ],
    people: ['daniel'], projects: ['health'],
    impact: 'If it slips past Nov 25, QA loses the buffer before UAT and the Nov 28 milestone becomes at risk.',
    recommendation: 'Check in with Daniel and set a realistic deadline, such as Nov 24.',
    action: { label: 'Adjust deadline', type: 'deadline', task: 't19' },
    resolvesByTasks: ['t19'],
  },
];

export const CHAT: Record<AlertId, ChatScript> = {
  a1: {
    qs: [
      { q: 'Why Aman and not Neha?', a: [
        { tag: 'Observed', text: 'Aman has Payments and Node skills, both of which this task needs, and he built the payment retry logic. He would move from 52% to 72%.' },
        { tag: 'Observed', text: "Neha knows Node but not Payments. She'd move from 45% to 70%, so she's a reasonable second option." },
        { tag: '', text: "The decision is yours. I won't change any assignment." },
      ] },
      { q: "What if we don't reassign?", a: [
        { tag: 'Predicted', text: 'Arjun stays at 96% through Nov 27, and Backend integration on Nov 24 is likely to slip by about 2 days. Medium confidence.' },
        { tag: 'Observed', text: 'His Auth token service is waiting on the Fintech design handoff, so his load could rise further when it unblocks.' },
      ] },
      { q: 'Which deadlines overlap?', a: [
        { tag: 'Observed', text: 'Nov 24: Payment gateway integration (Arjun), Database migration scripts (Karan).' },
        { tag: 'Observed', text: 'Nov 26: Refund webhook handlers (Arjun), Patient records API (Karan).' },
        { tag: 'Observed', text: 'Nov 27: Order status API (Arjun), Inventory sync service (Karan).' },
      ] },
    ],
    fallback: [
      { tag: 'Observed', text: 'This alert covers Arjun Mehta (96%) and Karan Iyer (92%) over the next 2 weeks.' },
      { tag: '', text: 'I can explain the evidence, the overlapping deadlines, or who could take some of their work.' },
    ],
  },
  a2: {
    qs: [
      { q: 'Who is blocked by the handoff?', a: [
        { tag: 'Observed', text: 'Meera Pillai: Account settings UI (12h) and Transactions table (10h).' },
        { tag: 'Observed', text: 'Arjun Mehta: Auth token service (8h).' },
      ] },
      { q: 'How late could the release be?', a: [
        { tag: 'Predicted', text: 'If specs arrive by Nov 24, the Dec 3 release can likely hold. Each extra day of delay after that pushes it by about a day. Medium confidence.' },
      ] },
      { q: 'Who should I talk to?', a: [
        { tag: 'Observed', text: 'Marcus Vance leads the Fintech designs. The handoff is waiting on client sign-off for the authentication flow.' },
      ] },
    ],
    fallback: [
      { tag: 'Observed', text: 'This alert covers the Fintech design handoff, due Nov 19, and the 3 Engineering tasks waiting on it.' },
      { tag: '', text: 'Ask me about who is blocked, the likely delay, or who to contact.' },
    ],
  },
  a3: {
    qs: [
      { q: 'Does this affect UAT?', a: [
        { tag: 'Predicted', text: 'Not yet. If the fix lands by Nov 24, UAT on Nov 28 keeps about 3 days of buffer. Low risk.' },
      ] },
      { q: "What's left on the task?", a: [
        { tag: 'Observed', text: '12h remain: fixing the migration step and adding a rollback job. Daniel is also on call this week (19h).' },
      ] },
    ],
    fallback: [
      { tag: 'Observed', text: 'This alert covers the overdue Staging pipeline fixes task on the Healthcare project.' },
      { tag: '', text: 'Ask me about its effect on UAT or the work that remains.' },
    ],
  },
};

// ---------- Analytics: 12 weeks of history (Aug 31 – Nov 22) ----------
export const HISTORY_END: ISODate = '2026-11-22';
export const WEEK_STARTS: ISODate[] = ['2026-08-31', '2026-09-07', '2026-09-14', '2026-09-21', '2026-09-28', '2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26', '2026-11-02', '2026-11-09', '2026-11-16'];
export const WEEK_LABELS = ['Aug 31', 'Sep 7', 'Sep 14', 'Sep 21', 'Sep 28', 'Oct 5', 'Oct 12', 'Oct 19', 'Oct 26', 'Nov 2', 'Nov 9', 'Nov 16'];
/** Employee order for the LOADS rows. */
export const LOAD_ORDER: EmployeeId[] = ['arjun', 'karan', 'rahul', 'meera', 'daniel', 'priya', 'aman', 'neha'];
/** Weekly utilisation per employee (rows = weeks, columns = LOAD_ORDER). */
export const LOADS: number[][] = [
  [82, 92, 76, 47, 69, 83, 39, 40], [66, 80, 76, 47, 64, 96, 44, 39], [51, 92, 86, 46, 62, 69, 40, 43], [69, 86, 96, 54, 61, 62, 38, 38],
  [67, 93, 91, 62, 44, 63, 39, 43], [97, 96, 67, 66, 61, 62, 54, 41], [94, 85, 93, 79, 68, 72, 40, 61], [97, 94, 95, 82, 76, 78, 69, 65],
  [99, 92, 86, 84, 67, 74, 65, 48], [95, 84, 92, 70, 67, 63, 51, 46], [99, 71, 94, 77, 65, 61, 43, 42], [96, 92, 88, 85, 78, 72, 52, 45],
];
export const WEEK_NOTES = ['Steady sprint', 'Priya leading the Healthcare audit', 'Quieter week', 'Rahul on release duty', 'Sprint 10 kickoff, two estimates ran over', 'E-commerce scope grew', 'Fintech kickoff', 'Two client releases overlapped', 'Release follow-ups', 'Sprint 13 start', 'Holiday week, fewer people', 'Sprint 14 mid-point'];

/** Previous-period average utilisation, per week (for comparisons). */
export const PREV_UTIL = [60, 62, 61, 59, 63, 64, 62, 60, 61, 63, 62, 64];
/** Completed tasks per week, and how many of those were completed late. */
export const DONE = [16, 15, 14, 17, 17, 18, 19, 16, 17, 18, 14, 20];
export const LATE = [2, 1, 2, 1, 2, 2, 3, 3, 2, 2, 1, 2];
export const PREV_DONE = [14, 15, 13, 16, 15, 14, 16, 15, 13, 15, 16, 15];
export const PREV_LATE = [2, 3, 2, 2, 3, 2, 2, 3, 2, 2, 3, 2];
export const OVERDUE = [1, 0, 1, 1, 2, 1, 2, 3, 1, 1, 0, 2];
export const PREV_OVERDUE = [1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1];
/** Average delay in days for late tasks, per week. */
export const DELAY_DAYS = [1.5, 1, 2, 1, 2.5, 2, 3, 3.5, 2, 2, 1, 2.5];
export const MILESTONES_ON_TIME = [1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1];
/** Delayed milestones, keyed by week index. */
export const MILESTONES_LATE: Record<number, string[]> = {
  2: ['Healthcare data model sign-off (Sep 16)'],
  6: ['E-commerce checkout beta (Oct 14)'],
  7: ['Fintech kickoff deliverables (Oct 21)'],
  11: ['Fintech design handoff (Nov 19)'],
};

export const BOTTLENECKS: Bottleneck[] = [
  {
    id: 'b1', title: 'Waiting on design sign-off', cause: 'Frontend work waits for client-approved Figma specs.', type: 'Cross-team handoff', teams: 'Design → Engineering', projects: 'Fintech, E-commerce', impact: '+4–6 days', impactTone: 'danger',
    explain: "Engineering can't start frontend tasks until Design delivers approved specs. Client sign-off has taken 3–5 days, while plans allow 1 day.",
    impactLong: 'Each occurrence delayed the dependent frontend work by 4–6 days and pushed 2 milestones.',
    dates: ['2026-09-03', '2026-09-17', '2026-10-08', '2026-10-15', '2026-10-22', '2026-11-05', '2026-11-12', '2026-11-19'],
    qa: [
      { q: 'Which projects did this delay most?', a: [{ tag: 'Observed', text: 'Fintech Dashboard, 5 of the occurrences, including the Nov 19 handoff that is still open. E-commerce had 3, all on checkout screens.' }] },
      { q: 'How could we prevent it?', a: [{ tag: 'Observed', text: 'Sign-off averaged 4 days against a 1-day plan.' }, { tag: 'Predicted', text: 'Planning 3 days for client sign-off, or reviewing designs in smaller batches, would likely remove most of the delay. Medium confidence.' }] },
    ],
  },
  {
    id: 'b2', title: 'Staging environment delays', cause: 'Database migrations on staging run longer than the planned buffer.', type: 'Process bottleneck', teams: 'Engineering (DevOps) → QA', projects: 'Healthcare', impact: '+2–3 days', impactTone: 'warning',
    explain: "QA can't run full test suites until staging is migrated. Migrations have taken 6–10 hours, against 2 hours in the plan.",
    impactLong: 'Each occurrence held QA for 2–3 days before release testing.',
    dates: ['2026-09-10', '2026-10-02', '2026-10-20', '2026-11-03', '2026-11-17'],
    qa: [{ q: 'Why do migrations run long?', a: [{ tag: 'Observed', text: 'The Healthcare database grew 4× since August, and migrations still run on a single small staging instance.' }] }],
  },
  {
    id: 'b3', title: 'Third-party API rate limits', cause: "The payment provider's sandbox rate-limits auth calls during load tests.", type: 'External dependency', teams: 'Engineering → QA', projects: 'E-commerce', impact: '+3–5 days', impactTone: 'danger',
    explain: 'Load and regression tests against the payment sandbox fail once the rate limit is hit, so test runs are repeated over several days.',
    impactLong: 'Each occurrence pushed checkout testing by 3–5 days.',
    dates: ['2026-09-24', '2026-10-14', '2026-10-29', '2026-11-13'],
    qa: [{ q: 'Is a fix in progress?', a: [{ tag: 'Observed', text: 'A rate limit increase was requested from the provider on Nov 18 and is still waiting.' }] }],
  },
  {
    id: 'b4', title: 'QA handoff waits', cause: 'Builds reach QA late in the sprint, leaving little time to test.', type: 'Cross-team handoff', teams: 'Engineering → QA', projects: 'Healthcare, E-commerce', impact: '+1–2 days', impactTone: 'warning',
    explain: 'Most builds are handed to QA in the last 2 days of a sprint, so testing spills into the next sprint.',
    impactLong: 'Each occurrence delayed release sign-off by 1–2 days.',
    dates: ['2026-09-08', '2026-09-22', '2026-10-21', '2026-11-10', '2026-11-18'],
    qa: [{ q: 'Which builds were late?', a: [{ tag: 'Observed', text: 'Healthcare sprint builds on Oct 21 and Nov 18, and the E-commerce checkout build on Nov 10.' }] }],
  },
];

// ---------- Shell ----------
export const REMINDERS: Reminder[] = [
  { id: 'r1', title: '1:1 with Meera Pillai', when: 'Today · 4:00 PM', icon: 'video', tone: 'info' },
  { id: 'r2', title: 'Sprint 14 review', when: 'Mon, Nov 24 · 11:00 AM', icon: 'flag', tone: 'neutral' },
  { id: 'r3', title: 'Capacity plan due to founder', when: 'Wed, Nov 26', icon: 'calendar', tone: 'warning' },
];
