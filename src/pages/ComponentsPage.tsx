import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button, IconButton, type ButtonVariant, type ForcedState } from '../components/Button';
import { Card, KpiCard } from '../components/Card';
import { Chip, Tag } from '../components/Chip';
import { Drawer } from '../components/Drawer';
import { Input } from '../components/Input';
import { KeplerIcon } from '../components/KeplerIcon';
import { Logo } from '../components/Logo';
import { Avatar, Overline, Spinner, ThinkingDots } from '../components/Misc';
import { Modal } from '../components/Modal';
import { PeriodSelector, periodLabel, usePeriod } from '../components/PeriodSelector';
import { ProgressBar } from '../components/ProgressBar';
import { ToastCard } from '../components/Toast';
import {
  IconAlert, IconBell, IconCheck, IconChevronLeft, IconChevronRight, IconGauge, IconMoon, IconRefresh, IconSearch, IconSun, IconTrash, IconUserSwap,
} from '../components/icons';
import { ALERTS, EMPLOYEES, INITIAL_TASKS } from '../data/mockData';
import {
  BAND_LABEL, SEVERITY_TONE, TASK_STATUS_TONE, bandOf, employeeStats, employeeStatus, groupCandidates, reassignCandidates, teamKpis,
} from '../data/selectors';
import type { TaskStatus } from '../data/types';
import { useAppStore, type Theme } from '../store/appStore';
import styles from './ComponentsPage.module.css';

const VARIANTS: ButtonVariant[] = ['primary', 'kepler', 'secondary', 'ghost', 'danger'];
const STATES: (ForcedState | 'default' | 'disabled')[] = ['default', 'hover', 'pressed', 'focus', 'disabled'];
const VARIANT_LABEL: Record<ButtonVariant, string> = {
  primary: 'Assign task', kepler: 'Review reassignment', secondary: 'Export report', ghost: 'View details', danger: 'Remove',
};

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h3 className="text-h3">{title}</h3>
        {note && <p className={styles.note}>{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className={styles.row}>
      {label && <span className={styles.rowLabel}>{label}</span>}
      <div className={styles.rowItems}>{children}</div>
    </div>
  );
}

function StateLabel({ children }: { children: ReactNode }) {
  return <span className={styles.stateLabel}>{children}</span>;
}

/** Every component state, rendered inside one theme. */
function Gallery({ theme }: { theme: Theme }) {
  const tasks = INITIAL_TASKS;
  const kpi = teamKpis(tasks);
  const stats = employeeStats(tasks);
  const { period, setPeriod, loading } = usePeriod();
  const p2 = usePeriod({ kind: 'weeks', n: 12 });

  return (
    <div data-theme={theme} className={styles.gallery}>
      <div className={styles.galleryHead}>
        <span className="text-overline" style={{ color: 'var(--text-muted)' }}>{theme} theme</span>
        <Logo />
      </div>

      <Section title="Buttons" note="Pressed scales to 0.98. Focus ring shows for keyboard focus only. Disabled explains why in a tooltip.">
        <div className={styles.stateHeader}>
          <span />
          {STATES.map((s) => <StateLabel key={s}>{s}</StateLabel>)}
        </div>
        {VARIANTS.map((v) => (
          <div key={v} className={styles.stateGrid}>
            <span className={styles.rowLabel}>{v}</span>
            {STATES.map((s) => (
              <div key={s}>
                <Button
                  variant={v}
                  size="sm"
                  forceState={s === 'default' || s === 'disabled' ? undefined : s}
                  disabled={s === 'disabled'}
                  disabledReason="Select a team member first"
                  iconLeft={v === 'kepler' ? <KeplerIcon size={15} /> : undefined}
                >
                  {v === 'kepler' ? 'Review' : VARIANT_LABEL[v].split(' ')[0]}
                </Button>
              </div>
            ))}
          </div>
        ))}
        <Row label="Sizes">
          <Button variant="primary">Assign task</Button>
          <Button variant="primary" size="sm">Assign task</Button>
          <Button variant="secondary" size="xs" iconLeft={<IconUserSwap size={14} />}>Reassign</Button>
          <Button variant="ghost" size="xs" iconLeft={<IconCheck size={14} />}>Deadline</Button>
        </Row>
        <Row label="With icons">
          <Button variant="kepler" iconLeft={<KeplerIcon size={16} />}>Review reassignment</Button>
          <Button variant="secondary" iconRight={<IconChevronRight size={15} />}>Investigate</Button>
          <Button variant="ghost" size="sm" style={{ color: 'var(--kepler-text)' }} iconLeft={<KeplerIcon size={15} />}>Ask Kepler</Button>
          <Button variant="danger" iconLeft={<IconTrash size={16} />}>Remove</Button>
        </Row>
      </Section>

      <Section title="Icon buttons" note="36 × 36. Pressed scales to 0.96. Every icon button has an aria-label.">
        <Row>
          {STATES.map((s) => (
            <div key={s} className={styles.stack}>
              <IconButton
                label={`Refresh data (${s})`}
                forceState={s === 'default' || s === 'disabled' ? undefined : s}
                disabled={s === 'disabled'}
              >
                <IconRefresh size={17} />
              </IconButton>
              <StateLabel>{s}</StateLabel>
            </div>
          ))}
        </Row>
        <Row label="Variants">
          <IconButton label="Search"><IconSearch size={17} /></IconButton>
          <IconButton label="Switch to dark mode"><IconMoon size={17} /></IconButton>
          <IconButton label="Switch to light mode"><IconSun size={17} /></IconButton>
          <IconButton label="Notifications"><IconBell size={17} /></IconButton>
          <IconButton label="Back" variant="plain"><IconChevronLeft size={17} /></IconButton>
          <IconButton label="Back (hover)" variant="plain" forceState="hover"><IconChevronLeft size={17} /></IconButton>
        </Row>
      </Section>

      <Section title="Chips" note="Tint background and dark text. Never solid status blocks.">
        <Row label="Status">
          <Chip tone="success" dot>On track</Chip>
          <Chip tone="warning" dot>At risk</Chip>
          <Chip tone="danger" dot>Off track</Chip>
          <Chip tone="info" dot>Available</Chip>
          <Chip tone="neutral">Across 3 active projects</Chip>
          <Chip tone="kepler" icon={<KeplerIcon size={14} />}>2 need your attention</Chip>
        </Row>
        <Row label="Severity">
          {ALERTS.map((a) => <Chip key={a.id} tone={SEVERITY_TONE[a.severity]} size="sm" dot>{a.severity}</Chip>)}
          <Chip tone="success" size="sm" icon={<IconCheck size={12} />}>Action taken</Chip>
        </Row>
        <Row label="Task status">
          {(Object.keys(TASK_STATUS_TONE) as TaskStatus[]).map((s) => <Chip key={s} tone={TASK_STATUS_TONE[s]} size="sm">{s}</Chip>)}
        </Row>
        <Row label="Workload">
          {[45, 72, 96].map((u) => {
            const st = employeeStatus(u);
            return <Chip key={u} tone={st.tone}>{st.text}</Chip>;
          })}
        </Row>
      </Section>

      <Section title="Observed and Predicted tags" note="Every Kepler statement carries one.">
        <div className={styles.evidence}>
          {ALERTS[0].evidence.map((e) => (
            <div key={e.text} className={styles.evLine}>
              <Tag kind={e.tag} />
              <span className="text-small">{e.text}</span>
            </div>
          ))}
          <div className={styles.evLine}>
            <Tag kind="Predicted" confidence="Medium confidence" />
            <span className="text-small">Tag with an explicit confidence level.</span>
          </div>
        </div>
      </Section>

      <Section title="Cards">
        <div className={styles.cardGrid}>
          <Card>
            <span className="text-h3">Default card</span>
            <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Surface, 1px border, 12px radius, 20px padding.</p>
          </Card>
          <Card interactive forceHover>
            <span className="text-h3">Hover (clickable)</span>
            <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Border moves to border-strong.</p>
          </Card>
          <KpiCard
            label="Capacity utilisation"
            icon={<IconGauge size={16} />}
            value={`${kpi.util}%`}
            unit="of available hours"
            supporting={<ProgressBar value={kpi.util} label={`Team utilisation ${kpi.util}%`} />}
            footer="Assigned remaining effort ÷ available capacity. A workload measure, not a productivity score."
          />
          <KpiCard
            label="Overdue or blocked"
            icon={<IconAlert size={16} />}
            value={kpi.overdueOrBlocked}
            unit="tasks"
            valueTone="danger"
            supporting={<span className="text-small num" style={{ color: 'var(--text-secondary)' }}>{kpi.blocked} blocked · {kpi.overdue} overdue</span>}
            footer="Open the alerts below to see why"
          />
        </div>
        <Card kepler padding="lg" className={styles.keplerCard}>
          <div className={styles.keplerHead}>
            <span className={styles.keplerTile}><KeplerIcon size={20} spin /></span>
            <div style={{ flex: 1 }}>
              <div className="text-h2">Kepler panel</div>
              <div className="text-small" style={{ color: 'var(--text-muted)' }}>1px gradient border, the only gradient in the product.</div>
            </div>
            <Chip tone="kepler">2 need your attention</Chip>
          </div>
          <div className={styles.suggest}>
            <span style={{ color: 'var(--kepler-text)', fontWeight: 600 }}>Kepler suggests: </span>
            {ALERTS[0].recommendation}
          </div>
        </Card>
      </Section>

      <Section title="Inputs" note="Focus: primary border + 3px glow. Error: danger border and helper text.">
        <div className={styles.inputGrid}>
          <Input label="Default" placeholder="Search people or tasks" />
          <Input label="Hover" placeholder="Search people or tasks" forceState="hover" />
          <Input label="Focus" placeholder="Search people or tasks" forceState="focus" />
          <Input label="With icon" placeholder="Search people, tasks or projects" icon={<IconSearch size={16} />} />
          <Input label="New deadline" type="date" defaultValue="2026-11-20" error="The new deadline can’t be in the past." />
          <Input label="Disabled" placeholder="Not editable" disabled helper="Available after you pick a task." />
        </div>
      </Section>

      <Section title="Progress bars" note="6px. Project progress uses indigo; utilisation uses the workload scale.">
        <div className={styles.bars}>
          <div className={styles.barRow}>
            <span className={styles.rowLabel}>Progress 68%</span>
            <ProgressBar value={68} label="Progress 68%" />
          </div>
          {(['meera', 'neha', 'aman', 'priya', 'arjun'] as const).map((id) => {
            const s = stats[id];
            return (
              <div key={id} className={styles.barRow}>
                <span className={styles.rowLabel}>
                  {s.employee.name.split(' ')[0]} {s.util}% · {BAND_LABEL[bandOf(s.util)]}
                </span>
                <ProgressBar value={s.util} tone="band" label={`${s.employee.name} utilisation ${s.util}%`} />
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Kepler icon" note="Static everywhere except the Kepler AI nav item and the main Kepler panel icon, which spin in 3D.">
        <Row label="Static">
          <span style={{ color: 'var(--kepler-text)', display: 'inline-flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <KeplerIcon size={14} />
            <KeplerIcon size={16} />
            <KeplerIcon size={20} />
            <KeplerIcon size={32} />
          </span>
        </Row>
        <Row label="3D spin">
          <span className={styles.keplerTile}><KeplerIcon size={20} spin /></span>
          <span style={{ color: 'var(--text-secondary)' }}><KeplerIcon size={16} spin /></span>
          <span style={{ color: 'var(--kepler-text)' }}><KeplerIcon size={40} spin /></span>
        </Row>
      </Section>

      <Section title="Period selector" note="Each Analytics section keeps its own period. Changing it dims the section for 450ms.">
        <Row>
          <PeriodSelector value={period} onChange={setPeriod} sectionLabel="Utilisation trend" align="left" />
          <PeriodSelector value={p2.period} onChange={p2.setPeriod} sectionLabel="Delivery" align="left" />
        </Row>
        <div className={styles.loadingDemo} style={{ opacity: loading ? 0.45 : 1 }} aria-busy={loading}>
          <span className="text-small">Section A shows: <strong className="num">{periodLabel(period)}</strong></span>
          <span className="text-small">Section B shows: <strong className="num">{periodLabel(p2.period)}</strong></span>
        </div>
      </Section>

      <Section title="Feedback">
        <Row label="Toast">
          <ToastCard toast={{ title: 'Task reassigned', text: 'Refund webhook handlers is now assigned to Aman Verma. Sync simulated.' }} />
        </Row>
        <Row label="Processing">
          <Spinner label="Reassigning" />
          <span className="text-small" style={{ color: 'var(--text-secondary)' }}>Reassigning to Aman Verma…</span>
        </Row>
        <Row label="Kepler thinking">
          <ThinkingDots />
          <span className="text-small" style={{ color: 'var(--text-muted)' }}>Kepler is checking the data…</span>
        </Row>
        <Row label="Avatars">
          <Avatar initials="AM" size={40} />
          <Avatar initials="AV" />
          <Avatar initials="NR" size={32} tone="tint" />
          <Avatar initials="AM" size={32} tone="primary" />
        </Row>
      </Section>

      <Section title="Reassignment eligibility" note="From the selectors: skill match, projected utilisation ≤ 85%, available before the deadline.">
        <EligibilityPreview />
      </Section>

      <Section title="Team" note="8 engineers, utilisation derived from task effort.">
        <div className={styles.team}>
          {EMPLOYEES.map((e) => {
            const s = stats[e.id];
            const st = employeeStatus(s.util);
            return (
              <div key={e.id} className={styles.teamRow}>
                <Avatar initials={e.initials} size={32} />
                <span className={styles.teamName}>{e.name}</span>
                <span className="num text-small">{s.assigned}h / {e.capacity}h</span>
                <span className="num" style={{ fontWeight: 600 }}>{s.util}%</span>
                <Chip tone={st.tone} size="sm">{st.text}</Chip>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function EligibilityPreview() {
  const task = INITIAL_TASKS.find((t) => t.id === 't2')!;
  const { recommended, others } = groupCandidates(reassignCandidates(task, INITIAL_TASKS));
  return (
    <div className={styles.elig}>
      <span className="text-small" style={{ color: 'var(--text-secondary)' }}>
        {task.title} · {task.effort}h · needs {task.skills.join(', ')}
      </span>
      <Overline>Recommended · eligible</Overline>
      {recommended.map((c) => (
        <div key={c.employee.id} className={`${styles.eligRow} ${styles.rec}`}>
          <span className={styles.teamName}>{c.employee.name}</span>
          <span className="num text-small">{c.currentUtil}% → {c.projectedUtil}%</span>
          <Chip tone="success" size="sm">{c.label}</Chip>
        </div>
      ))}
      <Overline>Other team members</Overline>
      {others.map((c) => (
        <div key={c.employee.id} className={styles.eligRow}>
          <span className={styles.teamName}>{c.employee.name}</span>
          <span className="num text-small" style={{ color: c.projectedUtil > 85 ? 'var(--danger-text)' : undefined }}>
            {c.currentUtil}% → {c.projectedUtil}%
          </span>
          <Chip tone={c.tone} size="sm">{c.label}</Chip>
        </div>
      ))}
    </div>
  );
}

type ModalStep = 'confirm' | 'processing' | 'success' | 'error';

export default function ComponentsPage() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const pushToast = useAppStore((s) => s.pushToast);
  const failNextSync = useAppStore((s) => s.failNextSync);
  const setFailNextSync = useAppStore((s) => s.setFailNextSync);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep | null>(null);

  useEffect(() => {
    document.title = 'Orbit · Components';
    return () => {
      document.title = 'Orbit';
    };
  }, []);

  const runModal = (fail: boolean) => {
    setModalStep('processing');
    window.setTimeout(() => setModalStep(fail ? 'error' : 'success'), 1300);
  };

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <div>
          <h1 className="text-h1">Components</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Every base component and state, in light and dark side by side.</p>
        </div>
        <div className={styles.topActions}>
          <Link to="/dashboard">Back to Dashboard</Link>
          <IconButton label={theme === 'dark' ? 'Switch app to light mode' : 'Switch app to dark mode'} onClick={toggleTheme}>
            {theme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
          </IconButton>
        </div>
      </header>

      <Card className={styles.overlays}>
        <div>
          <span className="text-h3">Overlays</span>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>
            Drawers, modals and toasts follow the app theme (currently {theme}). Esc closes; focus returns to the trigger.
          </p>
        </div>
        <div className={styles.rowItems}>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <Button variant="secondary" onClick={() => setModalStep('confirm')}>Open modal</Button>
          <Button variant="secondary" onClick={() => pushToast({ title: 'Deadline updated', text: 'Account settings UI is now due Nov 28. Sync simulated.' })}>
            Show toast
          </Button>
          <label className={styles.demoSwitch}>
            <input type="checkbox" checked={failNextSync} onChange={(e) => setFailNextSync(e.target.checked)} />
            Fail the next simulated sync
          </label>
        </div>
      </Card>

      <div className={styles.columns}>
        <Gallery theme="light" />
        <Gallery theme="dark" />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Arjun Mehta"
        subtitle="Backend developer · Engineering"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Close</Button>
            <Button variant="kepler" iconLeft={<KeplerIcon size={16} />}>Ask Kepler</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Overline>Capacity</Overline>
          <span className="num" style={{ fontSize: 16, fontWeight: 600 }}>96% · 48h of 50h</span>
          <ProgressBar value={96} tone="band" label="Utilisation 96%" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Overline>Evidence</Overline>
          {ALERTS[0].evidence.map((e) => (
            <div key={e.text} className={styles.evLine}>
              <Tag kind={e.tag} />
              <span className="text-small">{e.text}</span>
            </div>
          ))}
        </div>
      </Drawer>

      <Modal
        open={modalStep !== null}
        onClose={() => setModalStep(null)}
        closable={modalStep !== 'processing'}
        stepKey={modalStep ?? undefined}
        title="Reassign task"
        subtitle="Choose who should take this task"
        footer={
          modalStep === 'confirm' ? (
            <>
              <Button variant="secondary" onClick={() => setModalStep(null)}>Cancel</Button>
              <Button variant="secondary" onClick={() => runModal(true)}>Simulate error</Button>
              <Button variant="primary" onClick={() => runModal(false)}>Confirm reassignment</Button>
            </>
          ) : modalStep === 'error' ? (
            <>
              <Button variant="secondary" onClick={() => setModalStep(null)}>Cancel</Button>
              <Button variant="primary" iconLeft={<IconRefresh size={16} />} onClick={() => runModal(false)}>Try again</Button>
            </>
          ) : modalStep === 'success' ? (
            <Button variant="primary" onClick={() => setModalStep(null)}>Done</Button>
          ) : undefined
        }
      >
        {modalStep === 'confirm' && (
          <p className="text-body">
            Move <strong>Refund webhook handlers</strong> from Arjun Mehta (96% → 76%) to Aman Verma (52% → 72%)?
          </p>
        )}
        {modalStep === 'processing' && (
          <div className={styles.modalState}>
            <Spinner label="Reassigning" />
            <span>Reassigning to Aman Verma…</span>
          </div>
        )}
        {modalStep === 'success' && (
          <div className={styles.modalState}>
            <span className={styles.successCircle}><IconCheck size={24} /></span>
            <span className="text-h3">Task reassigned</span>
            <span className="text-small" style={{ color: 'var(--text-secondary)' }}>Arjun moves to 76% and Aman to 72%.</span>
            <Chip tone="success" dot>Synced to Jira just now (simulated)</Chip>
          </div>
        )}
        {modalStep === 'error' && (
          <div className={styles.errorBox} role="alert">
            <IconAlert size={18} />
            <div>
              <strong>The reassignment didn’t go through.</strong>
              <p className="text-small">Refund webhook handlers is still assigned to Arjun Mehta. Nothing changed.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
