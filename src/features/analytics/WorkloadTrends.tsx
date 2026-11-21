import { useState } from 'react';
import { Card } from '../../components/Card';
import { PeriodSelector, type Period } from '../../components/PeriodSelector';
import {
  BAND_LABEL, TEAM, TEAM_UTIL, distribution, segmentNote, segmentSummary, trendBand, trendNote, weekBounds, weekRangeLabel, type Range,
} from '../../data/analytics';
import { WEEK_LABELS } from '../../data/mockData';
import { BAND_FILL, type Band } from '../../data/selectors';
import { SectionHeader } from '../dashboard/parts';
import styles from './Analytics.module.css';

const PLOT_H = 220;
const PX_PER_PCT = 4.4; // 50%–100% maps to 220px
const STACK_H = 180;
const GRID = [100, 90, 80, 70, 60, 50];
const BANDS_TOP_DOWN: Band[] = ['High', 'Moderate', 'Low'];
const SEG_CLASS: Record<Band, string> = { High: styles.segHigh, Moderate: styles.segMod, Low: styles.segLow };

const y = (v: number) => (100 - v) * PX_PER_PCT;

interface Props {
  period: Period;
  setPeriod: (p: Period) => void;
  range: Range;
  loading: boolean;
  version: number;
}

export function WorkloadTrends({ period, setPeriod, range, loading, version }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const [seg, setSeg] = useState<{ col: number; band: Band } | null>(null);

  const idx = range.idx;
  const n = idx.length;
  const x = (j: number) => (n === 1 ? 50 : 3 + j * (94 / (n - 1)));
  const values = idx.map((i) => TEAM_UTIL[i]);
  const line = 'M' + values.map((v, j) => `${x(j).toFixed(2)},${y(v).toFixed(1)}`).join(' L');
  const area = `${line} L${x(n - 1).toFixed(2)},${PLOT_H} L${x(0).toFixed(2)},${PLOT_H} Z`;
  const chartLabel = `Average team utilisation ${range.phrase}, from ${values[0]}% to ${values[n - 1]}%`;

  // Stacked bars
  const weeks = idx.map((i) => ({ i, d: distribution(i) }));
  let segTip: JSX.Element | null = null;
  if (seg && seg.col < n) {
    const { i, d } = weeks[seg.col];
    const people = d[seg.band];
    const top =
      seg.band === 'High' ? 0 : seg.band === 'Moderate' ? d.High.length * (STACK_H / TEAM) : (d.High.length + d.Moderate.length) * (STACK_H / TEAM);
    const left = Math.min(76, Math.max(24, ((seg.col + 0.5) / n) * 100));
    const note = segmentNote(seg.band, i);
    if (people.length) {
      segTip = (
        <div className={`${styles.tip} ${styles.segTip}`} role="tooltip" style={{ left: `${left}%`, top }}>
          <div className={styles.tipTitle}>Week of {WEEK_LABELS[i]} · {BAND_LABEL[seg.band]}</div>
          <div className={styles.tipSub} style={{ marginTop: 2 }}>{segmentSummary(seg.band, people.length)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {people.map((p) => (
              <div key={p.name} className={styles.tipRow}>
                <span>{p.name}</span>
                <span className="num" style={{ fontWeight: 600 }}>{p.util}%</span>
              </div>
            ))}
          </div>
          {note && (
            <>
              <div className={styles.tipRule} />
              <div style={{ opacity: 0.85 }}>{note}</div>
            </>
          )}
        </div>
      );
    }
  }

  return (
    <Card as="section" aria-labelledby="wt" padding="none" className={`${styles.trends} ${styles.gTrends}`}>
      <SectionHeader
        id="wt"
        title="Workload and capacity trends"
        description="How capacity use has changed, and how it’s spread across the team."
        aside={<PeriodSelector value={period} onChange={setPeriod} sectionLabel="Workload and capacity trends" />}
      />

      <div className={`${styles.trendBody} ${styles.body} ${loading ? styles.loading : ''}`} aria-busy={loading}>
        {/* Team utilisation trend */}
        <div className={styles.chartBlock}>
          <div className={styles.chartHead}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className={styles.h3}>Team utilisation trend</h3>
              <span className={styles.caption}>Average team capacity utilisation per week</span>
            </div>
            <div className={styles.legend}>
              <span className={styles.legendItem}><span className={styles.lineSwatch} />Average utilisation</span>
              <span className={styles.legendItem}><span className={styles.targetSwatch} />Target 70–85%</span>
            </div>
          </div>
          <div className={styles.lineWrap}>
            <div className={styles.plot} role="img" aria-label={chartLabel}>
              {GRID.map((g) => (
                <div key={g} aria-hidden="true">
                  <div className={styles.grid} style={{ top: y(g) }} />
                  <span className={`${styles.yLabel} num`} style={{ top: y(g) - 8 }}>{g}%</span>
                </div>
              ))}
              <div className={styles.targetBand} aria-hidden="true" />
              <svg key={version} aria-hidden="true" viewBox={`0 0 100 ${PLOT_H}`} preserveAspectRatio="none" className={styles.lineSvg}>
                <path d={area} className={styles.area} />
                <path d={line} fill="none" className={styles.line} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              {values.map((v, j) => (
                <div key={`${version}-${j}`}>
                  <div className={`${styles.pt} ${hover === j ? styles.ptHot : ''}`} style={{ left: `${x(j)}%`, top: y(v), animationDelay: `${j * 40}ms` }} />
                  <button
                    type="button"
                    className={styles.hit}
                    style={{ left: `${x(j)}%`, top: y(v) }}
                    aria-label={`${weekRangeLabel(idx[j])}: ${v}% average, ${trendBand(v).toLowerCase()}. ${trendNote(idx[j])}.`}
                    onMouseEnter={() => setHover(j)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(j)}
                    onBlur={() => setHover(null)}
                  />
                </div>
              ))}
              {hover !== null && hover < n && (
                <div
                  className={styles.tip}
                  role="tooltip"
                  style={{ left: `${Math.min(86, Math.max(14, x(hover)))}%`, top: y(values[hover]), whiteSpace: 'nowrap' }}
                >
                  <div className={styles.tipTitle}>{weekRangeLabel(idx[hover])} · {values[hover]}% average</div>
                  <div className={styles.tipSub}>{trendBand(values[hover])} · {trendNote(idx[hover])}</div>
                </div>
              )}
            </div>
            <div className={styles.xAxis} aria-hidden="true">
              {idx.map((i, j) => (
                <span
                  key={i}
                  className={[
                    styles.xLabel,
                    j === n - 1 && styles.xLabelLast,
                    // Thin every other label on phones so they don't run together.
                    n > 5 && (n - 1 - j) % 2 === 1 && styles.xLabelAlt,
                    'num',
                  ].filter(Boolean).join(' ')}
                  style={{ left: `${x(j)}%` }}
                >
                  <span>{weekBounds(i).start}</span>
                  <span className={styles.xLabelTo}>to</span>
                  <span>{weekBounds(i).end}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Workload distribution */}
        <div className={`${styles.chartBlock} ${styles.divided}`}>
          <div className={styles.chartHead}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 id="dist" className={styles.h3}>Workload distribution</h3>
              <span className={styles.caption}>Share of team members in each utilisation band. Hover a segment to see who.</span>
            </div>
            <div className={styles.legend}>
              {(['Low', 'Moderate', 'High'] as Band[]).map((b) => (
                <span key={b} className={styles.legendItem}>
                  <span className={styles.swatch} style={{ background: BAND_FILL[b] }} />
                  {BAND_LABEL[b]}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.bars} role="group" aria-labelledby="dist">
            {weeks.map(({ i, d }, j) => (
              <div
                key={`${version}-${i}`}
                className={`${styles.col} ${seg && seg.col !== j ? styles.dim : ''}`}
                onMouseLeave={() => setSeg(null)}
              >
                <div className={styles.stack} style={{ animationDelay: `${j * 40}ms` }}>
                  {BANDS_TOP_DOWN.map((b) => {
                    const count = d[b].length;
                    const pct = Math.round((count / TEAM) * 100);
                    return (
                      <button
                        key={b}
                        type="button"
                        tabIndex={count ? 0 : -1}
                        className={`${styles.seg} ${SEG_CLASS[b]} ${seg?.col === j && seg.band === b ? styles.segOn : ''}`}
                        style={{ height: `${(count / TEAM) * 100}%` }}
                        aria-label={`Week of ${WEEK_LABELS[i]}, ${BAND_LABEL[b]}: ${segmentSummary(b, count)}`}
                        onMouseEnter={() => setSeg({ col: j, band: b })}
                        onFocus={() => setSeg({ col: j, band: b })}
                        onBlur={() => setSeg(null)}
                      >
                        {count ? `${pct}%` : ''}
                      </button>
                    );
                  })}
                </div>
                <span className={`${styles.barLabel} num`} style={j === n - 1 ? { color: 'var(--primary-text)', fontWeight: 600 } : undefined}>
                  {WEEK_LABELS[i]}
                </span>
              </div>
            ))}
            {segTip}
          </div>
        </div>
      </div>
    </Card>
  );
}
