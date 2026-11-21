import { useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Avatar } from '../../components/Misc';
import { ProgressBar } from '../../components/ProgressBar';
import { IconCalendar, IconUserSwap } from '../../components/icons';
import { fmtDate } from '../../data/format';
import { projectById } from '../../data/mockData';
import { TASK_STATUS_TONE, employeeStatus, isOverdue, type EmployeeStats } from '../../data/selectors';
import type { Task } from '../../data/types';
import { Chevron } from './parts';
import styles from './Dashboard.module.css';

interface EmployeeCardProps {
  stats: EmployeeStats;
  open: boolean;
  onToggle: () => void;
  onDetails?: () => void;
  onReassign?: (t: Task) => void;
  onDeadline?: (t: Task) => void;
}

export function EmployeeCard({ stats, open, onToggle, onDetails, onReassign, onDeadline }: EmployeeCardProps) {
  const { employee: e, util, band, assigned, tasks } = stats;
  const status = employeeStatus(util);
  const panelId = useId();

  return (
    <div className={styles.emp}>
      <div className={styles.empRow}>
        <button type="button" className={`${styles.rowbtn} ${styles.empBtn}`} onClick={onToggle} aria-expanded={open} aria-controls={panelId}>
          <span className={styles.empGroups}>
            <span className={styles.gName}>
              <Avatar initials={e.initials} size={40} />
              <span className={styles.nameText}>
                <span className={styles.name}>{e.name}</span>
                <span className={styles.role}>{e.role}</span>
              </span>
            </span>
            <span className={styles.gUtil}>
              <span className={styles.utilTop}>
                <span className={`${styles.utilPct} num`}>{util}%</span>
                <span className={`${styles.caption} num`}>{band} · {assigned}h of {e.capacity}h</span>
              </span>
              <ProgressBar value={util} tone="band" label={`${e.name} utilisation ${util}%`} />
            </span>
            <span className={styles.gCount}>
              <span className={`${styles.strong} num`} style={{ fontWeight: 600 }}>{tasks.length}</span>
              <span className={styles.caption}>active tasks</span>
            </span>
            <span className={styles.gStatus}>
              <Chip tone={status.tone} size="sm" dot>{status.text}</Chip>
              <span className={styles.caption}>{e.availability}</span>
            </span>
          </span>
          <Chevron open={open} size={18} />
        </button>
        <Button variant="ghost" size="sm" onClick={onDetails} aria-label={`Details for ${e.name}`}>
          Details
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="tasks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.taskPanel}>
              <div className={styles.tableScroll}>
                <div role="table" aria-label={`Tasks assigned to ${e.name}`} className={styles.taskTable}>
                  <div role="row" className={`${styles.taskGrid} ${styles.taskHead}`}>
                    <span role="columnheader" className={styles.label}>Assigned task</span>
                    <span role="columnheader" className={styles.label}>Status</span>
                    <span role="columnheader" className={styles.label}>Deadline</span>
                    <span role="columnheader" className={styles.label}>Left</span>
                    <span role="columnheader" className={`${styles.label} ${styles.actionsCol}`}>Actions</span>
                  </div>
                  {tasks.length === 0 && <p className={styles.empty}>No active tasks in the next 2 weeks.</p>}
                  {tasks.map((t) => {
                    const overdue = isOverdue(t);
                    return (
                      <div role="row" key={t.id} className={`${styles.taskGrid} ${styles.taskRow}`}>
                        <span role="cell" className={styles.taskName}>
                          <span className={styles.taskTitle}>{t.title}</span>
                          <span className={styles.caption}>{projectById(t.project).name}</span>
                        </span>
                        <span role="cell"><Chip tone={TASK_STATUS_TONE[t.status]} size="sm">{t.status}</Chip></span>
                        <span role="cell" className={`${styles.due} num`} data-overdue={overdue || undefined}>
                          {fmtDate(t.due)}{overdue ? ' · overdue' : ''}
                        </span>
                        <span role="cell" className={`${styles.left} num`}>{t.effort}h</span>
                        <span role="cell" className={styles.taskActions}>
                          <Button variant="ghost" size="xs" iconLeft={<IconUserSwap size={14} />} onClick={() => onReassign?.(t)} aria-label={`Reassign ${t.title}`}>
                            Reassign
                          </Button>
                          <Button variant="ghost" size="xs" iconLeft={<IconCalendar size={14} />} onClick={() => onDeadline?.(t)} aria-label={`Adjust deadline for ${t.title}`}>
                            Deadline
                          </Button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
