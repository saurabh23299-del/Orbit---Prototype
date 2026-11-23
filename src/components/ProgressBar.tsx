import { BAND_MARK, bandOf } from '../data/selectors';
import styles from './ProgressBar.module.css';

/** Where the High band starts (DESIGN.md §2.6: High is above 85%). */
const HIGH_THRESHOLD = 85;

export interface ProgressBarProps {
  /** 0–100+. Values above 100 fill the bar. */
  value: number;
  /** "primary" for project progress and KPIs, "band" for utilisation (workload scale). */
  tone?: 'primary' | 'band';
  /** Accessible label, e.g. "Utilisation 96%". */
  label: string;
  className?: string;
}

export function ProgressBar({ value, tone = 'primary', label, className }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));
  const band = tone === 'band';
  const fill = band ? BAND_MARK[bandOf(value)] : 'var(--primary)';
  return (
    <div
      className={[styles.track, className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.fill} style={{ width: `${width}%`, background: fill }} />
      {/* Utilisation bars mark the 85% line, so "close to High" reads without colour. */}
      {band && <span className={styles.threshold} style={{ left: `${HIGH_THRESHOLD}%` }} aria-hidden="true" />}
    </div>
  );
}
