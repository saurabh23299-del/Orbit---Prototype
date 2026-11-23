import { Fragment } from 'react';
import { KpiCard } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionHeader } from './parts';
import { IconAlert, IconCheckCircle, IconGauge, IconTeam } from '../../components/icons';
import { useCountUp } from '../../components/useCountUp';
import { EMPLOYEES, TEAM_NAME, WINDOW } from '../../data/mockData';
import { teamKpis } from '../../data/selectors';
import type { Task } from '../../data/types';
import styles from './Dashboard.module.css';

/**
 * Counts per designation on one line, as in the reference:
 * "2 senior · 2 backend · 1 full-stack · 2 frontend · 1 DevOps".
 */
const ROLE_ORDER = ['Senior developer', 'Backend developer', 'Full-stack developer', 'Frontend developer', 'DevOps engineer'];
const ROLE_SHORT: Record<string, string> = {
  'Senior developer': 'senior',
  'Backend developer': 'backend',
  'Full-stack developer': 'full-stack',
  'Frontend developer': 'frontend',
  'DevOps engineer': 'DevOps',
};
const roleMix = () => {
  const roles = [...ROLE_ORDER, ...EMPLOYEES.map((e) => e.role).filter((r) => !ROLE_ORDER.includes(r))];
  return [...new Set(roles)]
    .map((role) => ({ role, n: EMPLOYEES.filter((e) => e.role === role).length }))
    .filter((x) => x.n > 0)
    .map(({ role, n }) => `${n} ${ROLE_SHORT[role] ?? role.toLowerCase()}`);
};

/** Keeps each "13 in progress" segment whole, so a line never ends on a bare number. */
const Segments = ({ parts }: { parts: string[] }) => (
  <>
    {parts.map((p, i) => (
      <Fragment key={p}>
        {i > 0 && ' · '}
        <span className={styles.nowrap}>{p}</span>
      </Fragment>
    ))}
  </>
);

export function KpiRow({ tasks }: { tasks: Task[] }) {
  const k = teamKpis(tasks);
  const util = useCountUp(k.util);
  const active = useCountUp(k.active);
  const ob = useCountUp(k.overdueOrBlocked);
  const size = useCountUp(k.size);

  return (
    <section aria-labelledby="ov" className={styles.section}>
      <SectionHeader id="ov" title="Team overview" description={`${TEAM_NAME} · next 2 weeks (${WINDOW.label})`} />
      <div className={styles.kpiGrid}>
        <KpiCard
          label="Team size"
          icon={<IconTeam size={16} />}
          value={size}
          unit="members"
          supporting={<div><Chip tone="neutral">Across {k.activeProjects} active projects</Chip></div>}
          footer={<Segments parts={roleMix()} />}
        />
        <KpiCard
          label="Capacity utilisation"
          icon={<IconGauge size={16} />}
          value={`${util}%`}
          unit="of available hours"
          supporting={<ProgressBar value={k.util} label={`Team capacity utilisation ${k.util}%`} />}
          footer="Assigned remaining effort ÷ available capacity. A workload measure, not a productivity score."
        />
        <KpiCard
          label="Active tasks"
          icon={<IconCheckCircle size={16} />}
          value={active}
          unit="tasks"
          supporting={<span className={`${styles.kpiLine} num`}><Segments parts={[`${k.inProgress} in progress`, `${k.inReview} in review`, `${k.todo} to do`]} /></span>}
          footer="Synced from Jira and Linear (simulated)"
        />
        <KpiCard
          label="Overdue or blocked"
          icon={<IconAlert size={16} />}
          value={ob}
          unit="tasks"
          valueTone={k.overdueOrBlocked > 0 ? 'danger' : 'default'}
          supporting={<span className={`${styles.kpiLine} num`}><Segments parts={[`${k.blocked} blocked`, `${k.overdue} overdue`]} /></span>}
          footer="Check the alerts in Kepler insights below"
        />
      </div>
    </section>
  );
}
