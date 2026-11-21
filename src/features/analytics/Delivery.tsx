import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { PeriodSelector, type Period } from '../../components/PeriodSelector';
import { IconClock, IconFlag } from '../../components/icons';
import { delivery, type Range } from '../../data/analytics';
import { SectionHeader } from '../dashboard/parts';
import styles from './Analytics.module.css';

const R = 60;
const C = 2 * Math.PI * R; // ≈ 376.99

type Part = 'on' | 'late';

interface Props {
  period: Period;
  setPeriod: (p: Period) => void;
  range: Range;
  loading: boolean;
  version: number;
}

export function Delivery({ period, setPeriod, range, loading, version }: Props) {
  const d = delivery(range);
  const [dh, setDh] = useState<Part | null>(null);
  const [mh, setMh] = useState<Part | null>(null);
  // Draw the donut in from 0 on mount and whenever the period changes.
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    setDrawn(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    return () => cancelAnimationFrame(raf);
  }, [version]);

  const onLen = drawn ? (C * d.onTimePct) / 100 : 0;
  const lateLen = C - (C * d.onTimePct) / 100;

  const hoverProps = (part: Part) => ({
    onMouseEnter: () => setDh(part),
    onMouseLeave: () => setDh(null),
    onFocus: () => setDh(part),
    onBlur: () => setDh(null),
  });
  const msProps = (part: Part) => ({
    onMouseEnter: () => setMh(part),
    onMouseLeave: () => setMh(null),
    onFocus: () => setMh(part),
    onBlur: () => setMh(null),
  });

  const msTip =
    mh === 'on'
      ? { x: Math.max(30, d.msPct / 2), title: `${d.msOn} milestones on time (${d.msPct}%)`, items: [`${range.label} · ${range.span}`] }
      : mh === 'late'
        ? {
            x: Math.min(70, d.msPct + (100 - d.msPct) / 2),
            title: `${d.msLate} delayed (${100 - d.msPct}%)`,
            items: d.lateNames.length ? d.lateNames : ['None in this period'],
          }
        : null;

  return (
    <section aria-labelledby="dp" className={styles.section}>
      <SectionHeader
        id="dp"
        title="Delivery performance"
        description="How reliably completed work and milestones met their deadlines."
        aside={<PeriodSelector value={period} onChange={setPeriod} sectionLabel="Delivery performance" />}
      />
      <div className={`${styles.deliveryGrid} ${styles.body} ${loading ? styles.loading : ''}`} aria-busy={loading}>
        {/* On-time vs delayed (completed tasks only) */}
        <Card as="article" className={styles.dCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <h3 className={styles.h3}>On-time vs delayed delivery</h3>
            <span className={styles.caption}>Completed tasks only. Open overdue work is tracked on the Dashboard.</span>
          </div>
          <div className={styles.donutRow}>
            <div className={styles.donut} role="img" aria-label={`${d.onTimePct} percent of ${d.done} completed tasks delivered on time, ${d.latePct} percent late`}>
              <svg aria-hidden="true" width="148" height="148" viewBox="0 0 148 148">
                {/* Hover outlines: a 16px lighter arc behind the 14px arc */}
                <circle cx="74" cy="74" r={R} fill="none" className={`${styles.ring} ${dh === 'late' ? styles.ringOn : ''}`} style={{ stroke: 'var(--donut-late-ring)' }} strokeWidth={16} strokeDasharray={`0 ${(C * d.onTimePct) / 100} ${lateLen} 400`} pointerEvents="none" />
                <circle cx="74" cy="74" r={R} fill="none" className={`${styles.ring} ${dh === 'on' ? styles.ringOn : ''}`} style={{ stroke: 'var(--donut-on-ring)' }} strokeWidth={16} strokeDasharray={`${(C * d.onTimePct) / 100} 400`} pointerEvents="none" />
                <circle cx="74" cy="74" r={R} fill="none" className={styles.donutHit} style={{ stroke: 'var(--chart-4)' }} strokeWidth={14} strokeDasharray={`${C} ${C}`} onMouseEnter={() => setDh('late')} onMouseLeave={() => setDh(null)} />
                <circle cx="74" cy="74" r={R} fill="none" className={styles.donutHit} style={{ stroke: 'var(--primary)' }} strokeWidth={14} strokeDasharray={`${onLen.toFixed(1)} ${C}`} onMouseEnter={() => setDh('on')} onMouseLeave={() => setDh(null)} />
              </svg>
              <div className={styles.donutCenter} aria-live="polite">
                <span className={`${styles.donutValue} num`}>{dh === 'late' ? d.latePct : d.onTimePct}%</span>
                <span className={styles.caption}>{dh === 'late' ? 'delivered late' : 'on time'}</span>
              </div>
            </div>
            <div className={styles.donutLegend}>
              <button type="button" className={`${styles.legendRow} ${dh === 'on' ? styles.outlineOn : ''}`} {...hoverProps('on')} aria-label={`On time: ${d.onTimePct}%, ${d.onTime} tasks`}>
                <span className={styles.legendName}><span className={styles.dot10} style={{ background: 'var(--primary)' }} />On time</span>
                <span className={styles.legendVals}>
                  <span className="num" style={{ fontWeight: 600 }}>{d.onTimePct}%</span>
                  <span className={`${styles.caption} num`}>{d.onTime} tasks</span>
                </span>
              </button>
              <button type="button" className={`${styles.legendRow} ${dh === 'late' ? styles.outlineLate : ''}`} {...hoverProps('late')} aria-label={`Delivered late: ${d.latePct}%, ${d.late} tasks`}>
                <span className={styles.legendName}><span className={styles.dot10} style={{ background: 'var(--chart-4)' }} />Delivered late</span>
                <span className={styles.legendVals}>
                  <span className="num" style={{ fontWeight: 600 }}>{d.latePct}%</span>
                  <span className={`${styles.caption} num`}>{d.late} tasks</span>
                </span>
              </button>
              <span className={styles.avgDelay}>
                <IconClock size={14} />
                <span>Late tasks were delivered <span className={`${styles.ink} num`}>{d.avgDelay} days</span> late on average</span>
              </span>
            </div>
          </div>
        </Card>

        {/* Milestone performance */}
        <Card as="article" className={`${styles.dCard} ${styles.dCardTight}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <h3 className={styles.h3}>Project milestone performance</h3>
            <span className={styles.caption}>Milestones due in the period, on time vs delayed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className={`${styles.bigPct} num`}>{d.msPct}%</span>
            <span className={styles.secondary}>of {d.msTotal} milestones met on time</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div className={styles.msBar} role="group" aria-label={`${d.msOn} on time, ${d.msLate} delayed`}>
              <button type="button" className={`${styles.mseg} ${mh === 'on' ? styles.msegOn : ''}`} style={{ width: `${d.msPct}%`, background: 'var(--primary)' }} aria-label={`${d.msOn} milestones on time`} {...msProps('on')} />
              <button type="button" className={`${styles.mseg} ${mh === 'late' ? styles.msegOn : ''}`} style={{ flex: 1, background: 'var(--chart-4)' }} aria-label={`${d.msLate} milestones delayed: ${d.lateNames.join('; ') || 'none'}`} {...msProps('late')} />
            </div>
            {msTip && (
              <div className={`${styles.tip} ${styles.msTip}`} role="tooltip" style={{ left: `${msTip.x}%` }}>
                <div className={styles.tipTitle}>{msTip.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                  {msTip.items.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            )}
          </div>
          <div className={`${styles.caption} num`} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{d.msOn} on time</span>
            <span>{d.msLate} delayed</span>
          </div>
          <div className={styles.lateBox}>
            <span className={styles.label}>Delayed milestones in this period</span>
            {d.lateNames.length === 0 && <span className={styles.caption} style={{ fontSize: 13 }}>None. Every milestone landed on time.</span>}
            {d.lateNames.map((t) => (
              <div key={t} className={styles.lateItem}>
                <span className={styles.flag}><IconFlag size={14} /></span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
