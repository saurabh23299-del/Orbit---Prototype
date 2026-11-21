import type { ReactNode } from 'react';
import { Card } from '../../components/Card';
import { PeriodSelector, type Period } from '../../components/PeriodSelector';
import { ProgressBar } from '../../components/ProgressBar';
import { IconAlert, IconCheckCircle, IconClock, IconGauge } from '../../components/icons';
import { useCountUp } from '../../components/useCountUp';
import { overview, rangeOf, type Delta } from '../../data/analytics';
import { SectionHeader } from '../dashboard/parts';
import styles from './Analytics.module.css';

function HistKpi({ label, icon, value, suffix = '', delta, children }: { label: string; icon: ReactNode; value: number; suffix?: string; delta: Delta; children: ReactNode }) {
  const v = useCountUp(value);
  return (
    <Card interactive className={styles.kpi}>
      <div className={styles.kpiHead}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.tile} aria-hidden="true">{icon}</span>
      </div>
      <div className={styles.kpiValue}>
        <span className="text-display">{v}{suffix}</span>
        <span className={`${styles.delta} ${styles[delta.tone]} num`}>{delta.text}</span>
      </div>
      {children}
    </Card>
  );
}

export function OverviewKpis({ period, setPeriod, loading }: { period: Period; setPeriod: (p: Period) => void; loading: boolean }) {
  const o = overview(rangeOf(period));
  return (
    <section aria-labelledby="po" className={styles.section}>
      <SectionHeader
        id="po"
        title="Performance overview"
        aside={<PeriodSelector value={period} onChange={setPeriod} sectionLabel="Performance overview" />}
      />
      <div className={`${styles.kpiGrid} ${styles.body} ${loading ? styles.loading : ''}`} aria-busy={loading}>
        <HistKpi label="Average team utilisation" icon={<IconGauge size={16} />} value={o.util} suffix="%" delta={o.dUtil}>
          <ProgressBar value={o.util} label={`Average team utilisation ${o.util}%`} />
          <span className={styles.caption}>Target 70–85%. A workload measure, not a productivity score.</span>
        </HistKpi>
        <HistKpi label="Tasks completed" icon={<IconCheckCircle size={16} />} value={o.done} delta={o.dDone}>
          <span className={styles.caption}>Completed tasks synced from Jira and Linear (simulated)</span>
        </HistKpi>
        <HistKpi label="On-time delivery" icon={<IconClock size={16} />} value={o.onTimePct} suffix="%" delta={o.dOnTime}>
          <ProgressBar value={o.onTimePct} label={`On-time delivery ${o.onTimePct}%`} />
          <span className={`${styles.caption} num`}>{o.onTime} of {o.done} completed tasks met their deadline</span>
        </HistKpi>
        <HistKpi label="Overdue tasks" icon={<IconAlert size={16} />} value={o.over} delta={o.dOver}>
          <span className={styles.caption}>Tasks that passed their deadline during the period</span>
        </HistKpi>
      </div>
    </section>
  );
}
