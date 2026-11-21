import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'section';
  /** Adds the hover border for clickable cards. */
  interactive?: boolean;
  /** Kepler gradient border (the only gradient in the product). */
  kepler?: boolean;
  padding?: 'none' | 'md' | 'lg';
  forceHover?: boolean;
  children: ReactNode;
}

export function Card({ as: Tag = 'div', interactive, kepler, padding = 'md', forceHover, className, children, ...rest }: CardProps) {
  return (
    <Tag
      data-force={forceHover ? 'hover' : undefined}
      className={[
        styles.card,
        interactive && styles.interactive,
        kepler && styles.kepler,
        padding === 'md' && styles.padMd,
        padding === 'lg' && styles.padLg,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export interface KpiCardProps {
  label: string;
  icon: ReactNode;
  value: ReactNode;
  unit?: string;
  valueTone?: 'default' | 'danger';
  supporting?: ReactNode;
  footer?: ReactNode;
}

/** KPI card: label + icon tile → value → supporting line → footer. */
export function KpiCard({ label, icon, value, unit, valueTone = 'default', supporting, footer }: KpiCardProps) {
  return (
    <Card interactive className={styles.kpi}>
      <div className={styles.kpiHead}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.tile} aria-hidden="true">{icon}</span>
      </div>
      <div className={styles.kpiValueRow}>
        <span className={`text-display ${valueTone === 'danger' ? styles.danger : ''}`}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {supporting}
      {footer && <div className={styles.footer}>{footer}</div>}
    </Card>
  );
}
