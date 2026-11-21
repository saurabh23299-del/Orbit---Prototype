import { Button } from '../../components/Button';
import { EvidenceList } from '../../components/Kepler';
import { KeplerIcon } from '../../components/KeplerIcon';
import { IconChevronRight, IconTrend } from '../../components/icons';
import { insight, type Range } from '../../data/analytics';
import styles from './Analytics.module.css';

/** Kepler analysis: one prominent insight based on the workload trends section's period. */
export function KeplerAnalysis({ range, loading, onExplore, onAsk }: { range: Range; loading: boolean; onExplore: () => void; onAsk: () => void }) {
  const d = insight(range);
  return (
    <aside aria-labelledby="ka" className={`${styles.kepler} ${styles.gKepler}`}>
      <div className={styles.kHead}>
        <span className={styles.kTile}><KeplerIcon size={18} spin /></span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 id="ka" className="text-h3">Kepler analysis</h2>
          <span className={styles.caption}>Based on workload trends · {range.label}</span>
        </div>
      </div>

      {/* Re-keyed on the period so the lines fade in one by one after Kepler "thinks". */}
      <div
        key={range.label}
        className={`${styles.kBody} ${styles.kReveal} ${loading ? styles.kThinking : ''}`}
        aria-busy={loading}
        aria-live="polite"
      >
        <div className={styles.block}>
          <span className={styles.mainLabel}><IconTrend size={15} />Main insight</span>
          <span className="text-h3">{d.title}</span>
          <p className={styles.small}>{d.text}</p>
        </div>
        <div className={styles.block}>
          <span className={styles.overline}>Why it matters</span>
          <p className={`${styles.small} ${styles.secondary}`}>{d.why}</p>
        </div>
        <div className={styles.block} style={{ gap: 8 }}>
          <span className={styles.overline}>Evidence</span>
          <EvidenceList items={d.evidence} />
        </div>
        <div className={styles.suggest}>
          <span className={styles.suggestLabel}><KeplerIcon size={14} />Suggested action</span>
          <span>{d.action}</span>
        </div>
      </div>

      <div className={styles.kActions}>
        <Button variant="kepler" size="sm" iconRight={<IconChevronRight size={15} />} onClick={onExplore}>
          Explore insight
        </Button>
        <Button variant="secondary" size="sm" className={styles.kepText} iconLeft={<KeplerIcon size={15} />} onClick={onAsk}>
          Ask AI
        </Button>
      </div>
    </aside>
  );
}
