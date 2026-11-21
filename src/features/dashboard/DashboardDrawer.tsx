import { useEffect, useState, type ComponentProps } from 'react';
import { Button, IconButton } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Drawer } from '../../components/Drawer';
import {
  ChatComposer, ChatContext, ChatMessages, DrawerSection, EvidenceList, KeplerTile, useKeplerChat,
} from '../../components/Kepler';
import { KeplerIcon } from '../../components/KeplerIcon';
import { Avatar } from '../../components/Misc';
import { ProgressBar } from '../../components/ProgressBar';
import { IconBan, IconCalendar, IconCheck, IconFolder, IconSwap } from '../../components/icons';
import { fmtDate } from '../../data/format';
import {
  ALERTS, CHAT, LOADS, LOAD_ORDER, PROJECTS, TEAM_NAME, WEEK_LABELS, employeeById, projectById,
} from '../../data/mockData';
import {
  BAND_FILL, SEVERITY_TONE, TASK_STATUS_TONE, bandOf, employeeStats, employeeStatus, isOverdue,
} from '../../data/selectors';
import type { Alert, AlertId, EmployeeId, ProjectId, Task } from '../../data/types';
import { useAppStore } from '../../store/appStore';
import { projectDue } from './ProjectCard';
import styles from './Drawers.module.css';

export type DrawerView =
  | { type: 'alert'; id: AlertId }
  | { type: 'chat'; id: AlertId }
  | { type: 'emp'; id: EmployeeId }
  | { type: 'project'; id: ProjectId };

interface DashboardDrawerProps {
  view: DrawerView | null;
  onClose: () => void;
  onNavigate: (v: DrawerView) => void;
  /** Opens the manager's reassignment flow. Kepler never reassigns by itself. */
  onReassign?: (task: Task, suggested?: EmployeeId) => void;
  /** Opens the manager's deadline flow. */
  onDeadline?: (task: Task) => void;
}

const WORKING_HOURS = 80;
const MEETING_HOURS = 16;
const SPARK_WEEKS = 8;
const minus = (h: number) => (h ? `−${h}h` : '0h');

const alertById = (id: AlertId): Alert => ALERTS.find((a) => a.id === id)!;
const chatIntro = (a: Alert) =>
  `I’m looking at “${a.title}”. Ask me about the evidence, the people involved or what happens next.`;

type DrawerChrome = Omit<ComponentProps<typeof Drawer>, 'open' | 'onClose' | 'children'>;

export function DashboardDrawer({ view, onClose, onNavigate, onReassign, onDeadline }: DashboardDrawerProps) {
  const tasks = useAppStore((s) => s.tasks);
  const handled = useAppStore((s) => s.handledAlerts);
  const stats = employeeStats(tasks);

  // Chat history is kept per alert while the drawer moves between views.
  const [chatId, setChatId] = useState<AlertId | null>(null);
  useEffect(() => {
    if (view?.type === 'chat') setChatId(view.id);
  }, [view]);
  const chatAlert = chatId ? alertById(chatId) : null;
  const chat = useKeplerChat(chatId, chatId ? CHAT[chatId] : null, chatAlert ? chatIntro(chatAlert) : '');

  let chrome: DrawerChrome = { title: '' };
  let body: JSX.Element | null = null;

  if (view?.type === 'alert') {
    const a = alertById(view.id);
    const actionTask = tasks.find((t) => t.id === a.action.task)!;
    chrome = {
      title: a.title,
      contentKey: `alert-${a.id}`,
      leading: (
        <div className={styles.metaRow}>
          <Chip tone={SEVERITY_TONE[a.severity]} size="sm" dot>{a.severity}</Chip>
          <span className={styles.caption}>{a.kind} · detected {a.ago}</span>
        </div>
      ),
      footer: (
        <>
          <Button variant="secondary" className={styles.kepText} iconLeft={<KeplerIcon size={16} />} onClick={() => onNavigate({ type: 'chat', id: a.id })}>
            Ask Kepler about this
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              a.action.type === 'reassign'
                ? onReassign?.(actionTask, actionTask.assignee === a.action.pick ? undefined : a.action.pick)
                : onDeadline?.(actionTask)
            }
          >
            {a.action.label}
          </Button>
        </>
      ),
    };
    body = (
      <>
        <DrawerSection label="What Kepler detected" gap={8}>
          <p>{a.detected}</p>
        </DrawerSection>
        <DrawerSection label="Evidence">
          <EvidenceList items={a.evidence} />
        </DrawerSection>
        <DrawerSection label="Impacted">
          <div className={styles.pills}>
            {a.people.map((id) => (
              <Button key={id} variant="secondary" size="xs" onClick={() => onNavigate({ type: 'emp', id })}>
                <Avatar initials={employeeById(id).initials} size={20} />
                {employeeById(id).name} · <span className="num">{stats[id].util}%</span>
              </Button>
            ))}
            {a.projects.map((id) => (
              <Button key={id} variant="secondary" size="xs" iconLeft={<IconFolder size={13} />} onClick={() => onNavigate({ type: 'project', id })}>
                {projectById(id).name}
              </Button>
            ))}
          </div>
        </DrawerSection>
        <DrawerSection label="Potential impact" gap={8}>
          <EvidenceList items={[{ tag: 'Predicted', text: a.impact }]} />
        </DrawerSection>
        <div className={styles.recommend}>
          <span className={styles.recLabel}><KeplerIcon size={16} />Kepler recommends</span>
          <p>{a.recommendation}</p>
          <p className={styles.caption}>Advisory only. You decide, and nothing changes until you confirm.</p>
          {handled[a.id] && <Chip tone="success" icon={<IconCheck size={13} />} className={styles.selfStart}>Action taken</Chip>}
        </div>
      </>
    );
  }

  if (view?.type === 'chat' && chatAlert) {
    const a = chatAlert;
    chrome = {
      title: 'Kepler',
      ariaLabel: `Ask Kepler about: ${a.title}`,
      contentKey: `chat-${a.id}`,
      media: <KeplerTile />,
      subtitle: 'Answers use Orbit’s data for this alert',
      beforeBody: (
        <ChatContext
          title={a.title}
          chip={{ text: a.severity, tone: SEVERITY_TONE[a.severity] }}
          backLabel="View alert details"
          onBack={() => onNavigate({ type: 'alert', id: a.id })}
        />
      ),
      bodyClassName: styles.chatBody,
      footerStacked: true,
      footer: (
        <ChatComposer
          suggestions={chat.suggestions}
          input={chat.input}
          setInput={chat.setInput}
          onAsk={chat.ask}
          thinking={chat.thinking}
          placeholder="Ask a follow-up about this alert"
        />
      ),
    };
    body = <ChatMessages msgs={chat.msgs} thinking={chat.thinking} />;
  }

  if (view?.type === 'emp') {
    const s = stats[view.id];
    const e = s.employee;
    const status = employeeStatus(s.util);
    const col = LOAD_ORDER.indexOf(e.id);
    const spark = LOADS.slice(-SPARK_WEEKS).map((row, i) => ({ v: row[col], label: WEEK_LABELS[WEEK_LABELS.length - SPARK_WEEKS + i] }));
    chrome = {
      title: e.name,
      contentKey: `emp-${e.id}`,
      media: <Avatar initials={e.initials} size={48} />,
      subtitle: `${e.role} · ${TEAM_NAME}`,
    };
    body = (
      <>
        <div className={styles.pills}>
          <Chip tone={status.tone} dot>{status.text}</Chip>
          <Chip tone="neutral" icon={<IconCalendar size={13} />}>{e.availability}</Chip>
        </div>

        <DrawerSection label="Capacity · next 2 weeks">
          <div className={styles.bigRow}>
            <span className={`${styles.big} num`}>{s.util}%</span>
            <span className={styles.secondary}>{s.assigned}h assigned of {e.capacity}h available</span>
          </div>
          <ProgressBar value={s.util} tone="band" label={`${e.name} utilisation ${s.util}%`} className={styles.thickBar} />
          <dl className={styles.breakdown}>
            <div><dt>Working hours</dt><dd className="num">{WORKING_HOURS}h</dd></div>
            <div><dt>Meetings</dt><dd className="num">{minus(MEETING_HOURS)}</dd></div>
            <div><dt>Leave</dt><dd className="num">{minus(e.leaveHours)}</dd></div>
            <div><dt>{e.otherWhat}</dt><dd className="num">{minus(e.otherHours)}</dd></div>
            <div className={styles.total}><dt>Available capacity</dt><dd className="num">{e.capacity}h</dd></div>
          </dl>
          <p className={styles.caption}>A workload-planning measure, not a productivity score.</p>
        </DrawerSection>

        <DrawerSection label={`Utilisation, last ${SPARK_WEEKS} weeks`}>
          <div
            className={styles.spark}
            role="img"
            aria-label={`Weekly utilisation: ${spark.map((p) => `${p.label} ${p.v}%`).join(', ')}`}
          >
            {spark.map((p) => (
              <div
                key={p.label}
                className={styles.sparkBar}
                title={`Week of ${p.label}: ${p.v}%`}
                style={{ height: `${Math.max(8, Math.min(100, p.v))}%`, background: BAND_FILL[bandOf(p.v)] }}
              />
            ))}
          </div>
          <div className={styles.sparkAxis}>
            <span>{spark[0].label}</span>
            <span>{spark[spark.length - 1].label}</span>
          </div>
        </DrawerSection>

        <DrawerSection label="Skills" gap={8}>
          <div className={styles.pills}>
            {e.skills.map((sk) => <Chip key={sk} tone="neutral" size="sm">{sk}</Chip>)}
          </div>
        </DrawerSection>

        <DrawerSection label={`Assigned work · ${s.tasks.length} tasks`} gap={4}>
          {s.tasks.length === 0 && <p className={styles.caption}>No active tasks in the next 2 weeks.</p>}
          <ul className={styles.list}>
            {s.tasks.map((t) => {
              const overdue = isOverdue(t);
              return (
                <li key={t.id} className={styles.taskItem}>
                  <div className={styles.taskText}>
                    <span className={styles.taskTitle}>{t.title}</span>
                    <span className={styles.caption}>
                      {projectById(t.project).name} ·{' '}
                      <span className={overdue ? styles.overdue : undefined}>{fmtDate(t.due)}{overdue ? ' · overdue' : ''}</span> · {t.effort}h left
                    </span>
                  </div>
                  <Chip tone={TASK_STATUS_TONE[t.status]} size="sm">{t.status}</Chip>
                  <IconButton label={`Reassign ${t.title}`} title="Reassign" variant="plain" className={styles.smallIcb} onClick={() => onReassign?.(t)}>
                    <IconSwap size={15} />
                  </IconButton>
                  <IconButton label={`Adjust deadline for ${t.title}`} title="Adjust deadline" variant="plain" className={styles.smallIcb} onClick={() => onDeadline?.(t)}>
                    <IconCalendar size={15} />
                  </IconButton>
                </li>
              );
            })}
          </ul>
        </DrawerSection>
      </>
    );
  }

  if (view?.type === 'project') {
    const p = PROJECTS.find((x) => x.id === view.id)!;
    const due = projectDue(p);
    const ptasks = tasks.filter((t) => t.project === p.id && t.status !== 'Done').sort((a, b) => a.due.localeCompare(b.due));
    chrome = {
      title: p.client,
      contentKey: `project-${p.id}`,
      leading: <span className="text-overline" style={{ color: 'var(--text-muted)' }}>{p.sector}</span>,
      subtitle: `${p.name} · Lead: ${p.lead}`,
    };
    body = (
      <>
        <div className={styles.twoCol}>
          <div className={styles.measure}>
            <span className={styles.label}>Progress</span>
            <span className={`${styles.measureValue} num`}>{p.progress}%</span>
            <ProgressBar value={p.progress} label={`${p.name} progress ${p.progress}%`} />
            <span className={styles.caption}>Share of scoped work complete</span>
          </div>
          <div className={styles.measure} style={{ alignItems: 'flex-start' }}>
            <span className={styles.label}>Health</span>
            <Chip tone={p.healthTone} dot>{p.health}</Chip>
            <span className={styles.caption}>Based on schedule, blockers, dependencies and capacity</span>
          </div>
        </div>

        <div className={`${styles.twoCol} ${styles.milestone}`}>
          <div className={styles.tight}>
            <span className={styles.label}>Next milestone</span>
            <span className={styles.strong}>{p.milestone}</span>
          </div>
          <div className={styles.tight}>
            <span className={styles.label}>Deadline</span>
            <span className={`${styles.strong} num`} style={{ color: due.late ? 'var(--danger-text)' : undefined }}>{due.text}</span>
          </div>
        </div>

        <DrawerSection label={`Why it’s ${p.health.toLowerCase()}`}>
          <EvidenceList items={p.evidence} />
        </DrawerSection>

        <DrawerSection label="Blockers" gap={8}>
          {p.blockers.length === 0 ? (
            <p className={styles.caption}>No open blockers.</p>
          ) : (
            <ul className={styles.list}>
              {p.blockers.map((b) => (
                <li key={b} className={styles.blocker}>
                  <IconBan size={15} className={styles.blockerIcon} />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </DrawerSection>

        <DrawerSection label="Cross-team dependencies" gap={8}>
          {p.deps.map((d) => (
            <div key={d.what} className={styles.dep}>
              <div className={styles.taskText}>
                <span className={styles.depTitle}>{d.from} → {d.to}</span>
                <span className={styles.caption}>{d.what}</span>
              </div>
              <Chip tone={d.tone} size="sm">{d.status}</Chip>
            </div>
          ))}
        </DrawerSection>

        <DrawerSection label={`Tasks · ${ptasks.length}`} gap={4}>
          <ul className={styles.list}>
            {ptasks.map((t) => {
              const overdue = isOverdue(t);
              return (
                <li key={t.id} className={`${styles.taskItem} ${styles.taskItemTight}`}>
                  <div className={styles.taskText}>
                    <span className={styles.taskTitle}>{t.title}</span>
                    <span className={styles.caption}>
                      <button type="button" className={styles.inlineLink} onClick={() => onNavigate({ type: 'emp', id: t.assignee })}>
                        {employeeById(t.assignee).name}
                      </button>{' '}
                      · <span className={overdue ? styles.overdue : undefined}>{fmtDate(t.due)}{overdue ? ' · overdue' : ''}</span>
                    </span>
                  </div>
                  <Chip tone={TASK_STATUS_TONE[t.status]} size="sm">{t.status}</Chip>
                </li>
              );
            })}
          </ul>
        </DrawerSection>
      </>
    );
  }

  return (
    <Drawer open={!!view && !!body} onClose={onClose} {...chrome}>
      {body}
    </Drawer>
  );
}
