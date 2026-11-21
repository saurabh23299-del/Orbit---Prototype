import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ProgressBar } from '../../components/ProgressBar';
import { IconChevronRight } from '../../components/icons';
import { daysBetween, fmtDate, fmtDateYear, plural } from '../../data/format';
import { TODAY } from '../../data/mockData';
import type { Project } from '../../data/types';
import styles from './Dashboard.module.css';

/** Due text for a project milestone: "Nov 19 · 2 days overdue" or "Nov 24, 2026". */
export const projectDue = (p: Project) => {
  const late = p.due < TODAY;
  return {
    late,
    text: late ? `${fmtDate(p.due)} · ${plural(daysBetween(p.due, TODAY), 'day')} overdue` : fmtDateYear(p.due),
  };
};

/** Progress and health are always shown as separate measures. */
export function ProjectCard({ project: p, onOpen }: { project: Project; onOpen?: (p: Project) => void }) {
  const due = projectDue(p);
  return (
    <Card as="article" interactive className={styles.project}>
      {/* Category (top left) → client name (title) → what the project is */}
      <div className={styles.projectHead}>
        <span className={styles.projectSector}>{p.sector}</span>
        <h3 className="text-h3">{p.client}</h3>
        <span className={styles.projectName}>
          <span className={styles.projectDot} aria-hidden="true" />
          {p.name}
        </span>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.metric}>
          <span className={styles.label}>Progress</span>
          <span className={`${styles.metricValue} num`}>{p.progress}%</span>
          <ProgressBar value={p.progress} label={`${p.client} ${p.name} progress ${p.progress}%`} />
        </div>
        <div className={styles.metric} style={{ alignItems: 'flex-start' }}>
          <span className={styles.label}>Health</span>
          <Chip tone={p.healthTone} dot className={styles.healthChip}>{p.health}</Chip>
        </div>
      </div>

      <div className={`${styles.twoCol} ${styles.milestoneBox}`}>
        <div className={styles.metricTight}>
          <span className={styles.label}>Next milestone</span>
          <span className={styles.strong}>{p.milestone}</span>
        </div>
        <div className={styles.metricTight}>
          <span className={styles.label}>Deadline</span>
          <span className={`${styles.strong} num`} style={{ color: due.late ? 'var(--danger-text)' : undefined }}>{due.text}</span>
        </div>
      </div>

      <p className={styles.projectSummary}>{p.summary}</p>

      <div className={styles.projectFoot}>
        <span>
          Lead: <span className={styles.leadName}>{p.lead}</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          iconRight={<IconChevronRight size={15} />}
          onClick={() => onOpen?.(p)}
          aria-label={`View details for ${p.client}, ${p.name}`}
        >
          View details
        </Button>
      </div>
    </Card>
  );
}
