import { KpiCard } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionHeader } from './parts';
import { IconAlert, IconCheckCircle, IconGauge, IconTeam } from '../../components/icons';
import { useCountUp } from '../../components/useCountUp';
import { EMPLOYEES } from '../../data/mockData';
import { teamKpis } from '../../data/selectors';
import type { Task } from '../../data/types';
import styles from './Dashboard.module.css';

/**
 * Counts per designation, using the full role titles shown in Team workload:
 * "2 Senior developers · 2 Backend developers · 1 Full-stack developer · …".
 */
const ROLE_ORDER = ['Senior developer', 'Backend developer', 'Full-stack developer', 'Frontend developer', 'DevOps engineer'];
const roleMix = () => {
  const roles = [...ROLE_ORDER, ...EMPLOYEES.map((e) => e.role).filter((r) => !ROLE_ORDER.includes(r))];
  return [...new Set(roles)]
    .map((role) => ({ role, n: EMPLOYEES.filter((e) => e.role === role).length }))
    .filter((x) => x.n > 0)
    .map(({ role, n }) => `${n} ${role.charAt(0).toUpperCase()}${role.slice(1)}${n > 1 ? 's' : ''}`);
};

export function KpiRow({ tasks }: { tasks: Task[] }) {
  const k = teamKpis(tasks);
  const util = useCountUp(k.util);
  const active = useCountUp(k.active);
  const ob = useCountUp(k.overdueOrBlocked);
  const size = useCountUp(k.size);

  return (
    <section aria-labelledby="ov" className={styles.section}>
      <SectionHeader id="ov" title="Team overview" />
      <div className={styles.kpiGrid}>
        <KpiCard
          label="Team size"
          icon={<IconTeam size={16} />}
          value={size}
          unit="members"
          supporting={<div><Chip tone="neutral">Across {k.activeProjects} active projects</Chip></div>}
          footer={
            <ul className={styles.roleList} aria-label="Team by designation">
              {roleMix().map((line) => <li key={line}>{line}</li>)}
            </ul>
          }
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
          supporting={<span className={`${styles.kpiLine} num`}>{k.inProgress} in progress · {k.inReview} in review · {k.todo} to do</span>}
          footer="Synced from Jira and Linear (simulated)"
        />
        <KpiCard
          label="Overdue or blocked"
          icon={<IconAlert size={16} />}
          value={ob}
          unit="tasks"
          valueTone={k.overdueOrBlocked > 0 ? 'danger' : 'default'}
          supporting={<span className={`${styles.kpiLine} num`}>{k.blocked} blocked · {k.overdue} overdue</span>}
          footer="Check the alerts in Kepler insights below"
        />
      </div>
    </section>
  );
}
