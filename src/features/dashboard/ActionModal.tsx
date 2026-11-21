import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Chip, Tag } from '../../components/Chip';
import { Input } from '../../components/Input';
import { KeplerIcon } from '../../components/KeplerIcon';
import { Modal } from '../../components/Modal';
import { Avatar, Spinner } from '../../components/Misc';
import { IconAlert, IconArrowRight, IconCheck, IconInfo, IconRefresh, IconSearch } from '../../components/icons';
import { fmtDate, fmtDateYear } from '../../data/format';
import { TODAY, employeeById, projectById } from '../../data/mockData';
import {
  employeeStats, groupCandidates, isOverdue, matchesCandidateQuery, reassignCandidates, utilisation, type Candidate,
} from '../../data/selectors';
import type { EmployeeId, ISODate, Task } from '../../data/types';
import { useAppStore } from '../../store/appStore';
import styles from './ActionModal.module.css';

export type ModalRequest =
  | { type: 'reassign'; taskId: string; suggested?: EmployeeId }
  | { type: 'deadline'; taskId: string };

type Step = 'select' | 'confirm' | 'processing' | 'success' | 'error';

const PROCESSING_MS = 1300;

/** Predicted effect of a new deadline on the task's milestone (from the reference logic). */
const deadlineImpact = (task: Task, date: ISODate): string => {
  const p = projectById(task.project);
  if (task.project === 'fin') {
    return date > '2026-12-01'
      ? 'This leaves less than 2 days before the Dec 3 release. The release is likely to slip. Medium confidence.'
      : 'The Dec 3 Fintech release can likely still hold with this date. Medium confidence.';
  }
  if (task.project === 'health') {
    return date > '2026-11-25'
      ? 'This cuts into QA’s buffer before UAT on Nov 28. Medium risk.'
      : 'UAT on Nov 28 keeps its buffer with this date. Low risk.';
  }
  return date > p.due
    ? `This falls after the ${p.milestone} milestone on ${fmtDate(p.due)} and may delay it.`
    : `This stays inside the ${p.milestone} milestone on ${fmtDate(p.due)}.`;
};

function TaskSummary({ task }: { task: Task }) {
  const tasks = useAppStore((s) => s.tasks);
  const who = employeeById(task.assignee);
  const util = employeeStats(tasks)[who.id].util;
  const overdue = isOverdue(task);
  return (
    <div className={styles.summary}>
      <div className={styles.col} style={{ gap: 'var(--space-0-5)' }}>
        <span className={styles.strong}>{task.title}</span>
        <span className={styles.caption}>{projectById(task.project).name}</span>
      </div>
      <div className={styles.facts}>
        <span>Assigned to <span className={styles.ink}>{who.name}</span> · <span className="num">{util}%</span></span>
        <span className="num">{task.effort}h left</span>
        <span>Due <span className={`num ${overdue ? styles.danger : ''}`}>{fmtDate(task.due)}{overdue ? ' · overdue' : ''}</span></span>
      </div>
      <div className={styles.needs}>
        <span className={styles.caption}>Needs</span>
        {task.skills.map((s) => <span key={s} className={styles.skill}>{s}</span>)}
      </div>
    </div>
  );
}

function CandidateRow({ c, recommended, selected, onPick }: { c: Candidate; recommended: boolean; selected: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={[styles.pick, recommended && styles.rec, selected && styles.on].filter(Boolean).join(' ')}
      onClick={onPick}
      onKeyDown={(e) => {
        // Arrow keys move through both groups as one list and select, like native radios.
        if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
        const all = Array.from(e.currentTarget.closest('[role="dialog"]')?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? []);
        const i = all.indexOf(e.currentTarget);
        const next = all[(i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length];
        e.preventDefault();
        next?.focus();
        next?.click();
      }}
    >
      <span className={styles.radio} aria-hidden="true" />
      <Avatar initials={c.employee.initials} size={32} tone="tint" />
      <span className={styles.pickText}>
        <span className={styles.medium}>{c.employee.name}</span>
        <span className={styles.caption}>{c.employee.role} · {c.employee.availability}</span>
      </span>
      <span className={styles.pickRight}>
        <span className="num" style={{ fontSize: 13 }}>
          {c.currentUtil}% → <span className={c.projectedUtil > 85 ? styles.danger : styles.semibold}>{c.projectedUtil}%</span>
        </span>
        <Chip tone={recommended ? 'success' : c.tone} size="sm">{c.label}</Chip>
      </span>
    </button>
  );
}

export function ActionModal({ request, onClose }: { request: ModalRequest | null; onClose: () => void }) {
  const tasks = useAppStore((s) => s.tasks);
  const reassignTask = useAppStore((s) => s.reassignTask);
  const adjustDeadline = useAppStore((s) => s.adjustDeadline);
  const pushToast = useAppStore((s) => s.pushToast);
  const consumeSyncFailure = useAppStore((s) => s.consumeSyncFailure);

  // The parent re-keys this component for each new request, so state starts fresh from the request.
  const task = request ? tasks.find((t) => t.id === request.taskId) ?? null : null;
  const [step, setStep] = useState<Step>('select');
  const [pick, setPick] = useState<EmployeeId | null>(() =>
    request?.type === 'reassign' && request.suggested && request.suggested !== task?.assignee ? request.suggested : null,
  );
  const [query, setQuery] = useState('');
  const [invalid, setInvalid] = useState('');
  const [date, setDate] = useState(task?.due ?? '');
  const [dateErr, setDateErr] = useState('');
  // Captured when the action is confirmed, so the success step can describe the change.
  const [result, setResult] = useState<{ title: string; text: string } | null>(null);
  // The assignee at the moment the modal opened (the task's assignee changes on success).
  const fromRef = useRef<EmployeeId | null>(task?.assignee ?? null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!request || !task) {
    return <Modal open={false} onClose={onClose} title="">{null}</Modal>;
  }

  const stats = employeeStats(tasks);
  const isReassign = request.type === 'reassign';
  const fromId = fromRef.current ?? task.assignee;

  // ---------- Reassign data ----------
  const all = isReassign ? reassignCandidates({ ...task, assignee: fromId }, tasks) : [];
  const { recommended, others } = groupCandidates(all.filter((c) => matchesCandidateQuery(c, query)));
  const picked = all.find((c) => c.employee.id === pick) ?? null;
  const from = employeeById(fromId);
  const fromUtil = stats[fromId].util;
  const fromAfter = utilisation(stats[fromId].assigned - task.effort, from.capacity);

  // ---------- Run the action ----------
  const run = () => {
    setStep('processing');
    timer.current = window.setTimeout(() => {
      if (consumeSyncFailure()) {
        setStep('error');
        return;
      }
      if (isReassign && picked) {
        const to = picked.employee;
        const toAfter = picked.projectedUtil;
        reassignTask(task.id, to.id);
        setResult({
          title: 'Task reassigned',
          text: `${task.title} is now assigned to ${to.name}. ${from.name} moves to ${fromAfter}% and ${to.name} to ${toAfter}%.`,
        });
        pushToast({ title: 'Task reassigned', text: `${task.title} is now assigned to ${to.name}. Sync simulated.` });
      } else if (!isReassign) {
        const old = task.due;
        adjustDeadline(task.id, date);
        setResult({ title: 'Deadline updated', text: `${task.title} is now due ${fmtDateYear(date)} (was ${fmtDate(old)}).` });
        pushToast({ title: 'Deadline updated', text: `${task.title} is now due ${fmtDate(date)}. Sync simulated.` });
      }
      setStep('success');
    }, PROCESSING_MS);
  };

  const continueToConfirm = () => {
    if (!pick) {
      setInvalid('Select a team member to continue.');
      return;
    }
    setStep('confirm');
  };

  const confirmDeadline = () => {
    let err = '';
    if (!date) err = 'Choose a new deadline.';
    else if (date === task.due) err = 'Choose a date that differs from the current deadline.';
    else if (date < TODAY) err = 'The new deadline can’t be in the past.';
    if (err) {
      setDateErr(err);
      return;
    }
    run();
  };

  // ---------- Steps ----------
  let body: JSX.Element;
  let footer: JSX.Element | undefined;

  if (step === 'processing') {
    body = (
      <div className={styles.state} role="status" aria-live="polite">
        <Spinner label="Processing" />
        <span className={styles.semibold}>{isReassign ? `Reassigning to ${picked?.employee.name}…` : 'Updating the deadline…'}</span>
        <span className={styles.caption}>Updating Orbit and syncing to Jira (simulated)</span>
      </div>
    );
  } else if (step === 'success' && result) {
    body = (
      <div className={`${styles.state} ${styles.fade}`} role="status" aria-live="polite">
        <span className={styles.successCircle}><IconCheck size={24} /></span>
        <span className="text-h2">{result.title}</span>
        <span className={styles.okText}>{result.text}</span>
        <Chip tone="success" dot>Synced to Jira just now (simulated)</Chip>
      </div>
    );
    footer = <Button variant="primary" onClick={onClose} data-autofocus>Done</Button>;
  } else if (step === 'error') {
    const still = isReassign ? `${task.title} is still assigned to ${from.name}.` : `The deadline is still ${fmtDateYear(task.due)}.`;
    body = (
      <div className={`${styles.errorBox} ${styles.fade}`} role="alert">
        <IconAlert size={20} className={styles.dangerIcon} />
        <div className={styles.col} style={{ gap: 4 }}>
          <span className={`${styles.semibold} ${styles.danger}`}>Couldn’t sync this change</span>
          <span className={styles.small}>Jira didn’t respond in time (simulated). {still} Nothing changed.</span>
        </div>
      </div>
    );
    footer = (
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" iconLeft={<IconRefresh size={15} />} onClick={run} data-autofocus>Try again</Button>
      </>
    );
  } else if (isReassign && step === 'confirm' && picked) {
    const to = picked.employee;
    body = (
      <>
        <p>You’re about to move <strong>{task.title}</strong> ({task.effort}h) to a new assignee.</p>
        <div className={styles.compare}>
          <div className={styles.side}>
            <span className={styles.label}>Current assignee</span>
            <span className={styles.semibold}>{from.name}</span>
            <span className={`${styles.small} ${styles.secondary} num`}>
              {fromUtil}% → <span className={styles.okText2}>{fromAfter}%</span>
            </span>
          </div>
          <span className={styles.arrow} aria-hidden="true"><IconArrowRight size={18} /></span>
          <div className={`${styles.side} ${styles.sideTo}`}>
            <span className={styles.label}>Proposed assignee</span>
            <span className={styles.semibold}>{to.name}</span>
            <span className={`${styles.small} ${styles.secondary} num`}>
              {picked.currentUtil}% → <span className={picked.projectedUtil > 85 ? styles.danger : styles.okText2}>{picked.projectedUtil}%</span>
            </span>
          </div>
        </div>
        {!picked.eligible && (
          <div className={styles.warn}>
            <IconInfo size={16} />
            <span>{to.name} isn’t a recommended match ({picked.label.toLowerCase()}). You can still go ahead.</span>
          </div>
        )}
        <p className={styles.caption}>This updates the task’s assignee in Orbit and syncs it to Jira. In this prototype the sync is simulated.</p>
      </>
    );
    footer = (
      <>
        <Button variant="secondary" onClick={() => setStep('select')}>Back</Button>
        <Button variant="primary" onClick={run} data-autofocus>Confirm reassignment</Button>
      </>
    );
  } else if (isReassign) {
    body = (
      <>
        <TaskSummary task={task} />
        <Input
          label="Search team members"
          hideLabel
          type="search"
          placeholder="Search by name, role or skill"
          icon={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.group} role="radiogroup" aria-labelledby="rec-h">
          <span id="rec-h" className={styles.recHead}><KeplerIcon size={15} />Recommended · eligible</span>
          {recommended.length === 0 && <span className={styles.muted13}>No eligible matches for this search.</span>}
          {recommended.map((c) => (
            <CandidateRow key={c.employee.id} c={c} recommended selected={pick === c.employee.id} onPick={() => { setPick(c.employee.id); setInvalid(''); }} />
          ))}
        </div>
        <div className={styles.group} role="radiogroup" aria-labelledby="oth-h">
          <span id="oth-h" className={styles.otherHead}>Other team members</span>
          {others.length === 0 && <span className={styles.muted13}>No other team members match.</span>}
          {others.map((c) => (
            <CandidateRow key={c.employee.id} c={c} recommended={false} selected={pick === c.employee.id} onPick={() => { setPick(c.employee.id); setInvalid(''); }} />
          ))}
        </div>
        <p className={styles.caption}>
          Kepler recommends people based on required skills, role, projected capacity and availability, not just the lowest utilisation.
        </p>
      </>
    );
    footer = (
      <div className={styles.footSplit}>
        <span className={styles.invalid} role="alert">{invalid}</span>
        <div className={styles.row}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={continueToConfirm}>Continue</Button>
        </div>
      </div>
    );
  } else {
    const showImpact = !!date && date !== task.due && date >= TODAY && !dateErr;
    body = (
      <>
        <TaskSummary task={task} />
        <div className={styles.dates}>
          <div className={styles.col} style={{ gap: 6 }}>
            <span className={styles.label}>Current deadline</span>
            <span className={`${styles.curDate} num`}>{fmtDateYear(task.due)}</span>
          </div>
          <Input
            label="New deadline"
            type="date"
            min={TODAY}
            value={date}
            data-autofocus
            onChange={(e) => {
              setDate(e.target.value);
              setDateErr('');
            }}
            error={dateErr || undefined}
          />
        </div>
        {showImpact && (
          <div className={styles.impact}>
            <Tag kind="Predicted" className={styles.impactTag} />
            <span>{deadlineImpact(task, date)}</span>
          </div>
        )}
        <p className={styles.caption}>This updates the deadline in Orbit and syncs it to Jira. In this prototype the sync is simulated.</p>
      </>
    );
    footer = (
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={confirmDeadline}>Confirm new deadline</Button>
      </>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      closable={step !== 'processing'}
      stepKey={step}
      title={isReassign ? 'Reassign task' : 'Adjust deadline'}
      subtitle={isReassign ? (step === 'confirm' ? 'Check the change before you confirm' : 'Choose who should take this task') : 'Changes need your confirmation'}
      footer={footer}
    >
      {body}
    </Modal>
  );
}
