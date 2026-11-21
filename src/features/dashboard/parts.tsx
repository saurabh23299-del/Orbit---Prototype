import type { ReactNode } from 'react';
import { IconChevronDownLg } from '../../components/icons';
import styles from './Dashboard.module.css';

/** Section title (H3) + muted description, with an optional right-hand slot (legend). */
export function SectionHeader({ id, title, description, aside }: { id: string; title: string; description?: ReactNode; aside?: ReactNode }) {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.sectionTitle}>
        <h2 id={id} className="text-h3">{title}</h2>
        {description && <p className={styles.sectionDesc}>{description}</p>}
      </div>
      {aside}
    </div>
  );
}

/** 28px expander chevron. Fills on parent-row hover, rotates 180° when open. */
export function Chevron({ open, size = 20 }: { open: boolean; size?: number }) {
  return (
    <span className={`${styles.chev} ${open ? styles.chevOpen : ''}`} aria-hidden="true">
      <IconChevronDownLg size={size} />
    </span>
  );
}
