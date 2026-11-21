import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { KeplerIcon } from '../../components/KeplerIcon';
import { PeriodSelector, type Period } from '../../components/PeriodSelector';
import { IconChevronDownLg, IconLink } from '../../components/icons';
import { bottleneckSuggestion, bottlenecks, type Range } from '../../data/analytics';
import { fmtDate } from '../../data/format';
import { SectionHeader } from '../dashboard/parts';
import styles from './Analytics.module.css';

interface Props {
  period: Period;
  setPeriod: (p: Period) => void;
  range: Range;
  loading: boolean;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onAsk: (id: string) => void;
}

export function Bottlenecks({ period, setPeriod, range, loading, openId, setOpenId, onAsk }: Props) {
  const rows = bottlenecks(range);
  const suggestion = bottleneckSuggestion(rows);

  return (
    <section aria-labelledby="bn" className={styles.section}>
      <SectionHeader
        id="bn"
        title="Bottlenecks and dependencies"
        description="Recurring issues and cross-team handoffs that slowed delivery. Select a row for details."
        aside={<PeriodSelector value={period} onChange={setPeriod} sectionLabel="Bottlenecks and dependencies" />}
      />
      <Card padding="none" className={`${styles.bnCard} ${styles.body} ${loading ? styles.loading : ''}`} aria-busy={loading}>
        <div className={styles.bnScroll}>
          <div className={styles.bnTable}>
            <div className={`${styles.bnGrid} ${styles.bnHead}`} aria-hidden="true">
              <span className={styles.label}>Issue and root cause</span>
              <span className={styles.label}>Teams</span>
              <span className={styles.label}>Frequency</span>
              <span className={styles.label}>Projects affected</span>
              <span className={styles.label}>Delivery impact</span>
              <span />
            </div>
            {rows.length === 0 && <p className={styles.empty}>No recurring bottlenecks in this period.</p>}
            {rows.map(({ b, dates }) => {
              const open = openId === b.id;
              const panelId = `bn-${b.id}`;
              return (
                <div key={b.id} className={styles.bnItem}>
                  <button
                    type="button"
                    className={`${styles.bnRow} ${styles.bnGrid}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : b.id)}
                  >
                    <span className={styles.bnIssue}>
                      <span className={styles.tile} aria-hidden="true"><IconLink size={16} /></span>
                      <span className={styles.bnIssueText}>
                        <span className={styles.medium}>{b.title}</span>
                        <span className={styles.caption}>{b.cause}</span>
                        <span><Chip tone="neutral" size="sm">{b.type}</Chip></span>
                      </span>
                    </span>
                    <span className={`${styles.small} ${styles.secondary}`}>{b.teams}</span>
                    <span className={styles.freq}>
                      <span className="num" style={{ fontWeight: 600 }}>{dates.length}×</span>
                      <span className={styles.freqSub}>in period</span>
                    </span>
                    <span className={`${styles.small} ${styles.secondary}`}>{b.projects}</span>
                    <span><Chip tone={b.impactTone} size="sm" dot>{b.impact}</Chip></span>
                    <span className={`${styles.chev} ${open ? styles.chevOpen : ''}`} aria-hidden="true"><IconChevronDownLg size={18} /></span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={panelId}
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className={styles.bnDetail}>
                          <div className={styles.block}>
                            <span className={styles.overline}>What happens</span>
                            <p className={styles.small}>{b.explain}</p>
                          </div>
                          <div className={styles.block}>
                            <span className={styles.overline}>Affected</span>
                            <p className={styles.small}>Teams: {b.teams}<br />Projects: {b.projects}</p>
                            <span className={styles.overline} style={{ marginTop: 6 }}>Delivery impact</span>
                            <p className={styles.small}>{b.impactLong}</p>
                          </div>
                          <div className={styles.block}>
                            <span className={styles.overline}>Occurrences · {range.label}</span>
                            <div className={styles.dates}>
                              {dates.map((d) => <Chip key={d} tone="neutral" size="sm">{fmtDate(d)}</Chip>)}
                            </div>
                            <Button variant="secondary" size="xs" className={`${styles.kepText} ${styles.selfStart}`} iconLeft={<KeplerIcon size={13} />} onClick={() => onAsk(b.id)}>
                              Ask AI about this
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
        {suggestion && (
          <div className={styles.bnFoot}>
            <span className={styles.bnSuggest}>
              <KeplerIcon size={16} />
              <span style={{ color: 'inherit', marginTop: 0 }}>
                <span style={{ color: 'var(--kepler-text)', fontWeight: 600 }}>Kepler suggests: </span>
                {suggestion}
              </span>
            </span>
            <Button variant="secondary" size="sm" className={styles.kepText} onClick={() => onAsk(rows[0].b.id)}>
              Ask AI
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}
