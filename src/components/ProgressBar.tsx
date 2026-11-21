import { BAND_FILL, bandOf } from '../data/selectors';
import styles from './ProgressBar.module.css';

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
  const fill = tone === 'band' ? BAND_FILL[bandOf(value)] : 'var(--primary)';
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
    </div>
  );
}
