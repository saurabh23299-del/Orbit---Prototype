import type { ReactNode } from 'react';
import styles from './Misc.module.css';

/** 28px processing spinner. */
export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <span className={styles.spinner} role="status" aria-label={label} />;
}

/** Initials avatar. "subtle" for team members, "primary" for the signed-in user. */
export function Avatar({ initials, size = 36, tone = 'subtle' }: { initials: string; size?: number; tone?: 'subtle' | 'tint' | 'primary' }) {
  return (
    <span
      className={`${styles.avatar} ${styles[tone]}`}
      style={{ width: size, height: size, fontSize: size >= 36 ? 13 : 12 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/** Kepler "thinking": three pulsing violet dots. */
export function ThinkingDots() {
  return (
    <span className={styles.dots} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

/** Overline section label. */
export function Overline({ children }: { children: ReactNode }) {
  return <span className="text-overline" style={{ color: 'var(--text-muted)' }}>{children}</span>;
}
