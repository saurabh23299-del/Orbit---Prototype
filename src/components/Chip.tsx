import type { HTMLAttributes, ReactNode } from 'react';
import type { EvidenceTag, Tone } from '../data/types';
import styles from './Chip.module.css';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: 'md' | 'sm';
  dot?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

/** Status chip: tint background + dark text, never a solid block. */
export function Chip({ tone = 'neutral', size = 'md', dot = false, icon, className, children, ...rest }: ChipProps) {
  return (
    <span className={[styles.chip, styles[tone], size === 'sm' && styles.sm, className].filter(Boolean).join(' ')} {...rest}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon}
      {children}
    </span>
  );
}

export interface TagProps {
  kind: EvidenceTag;
  /** Optional confidence level for predictions, e.g. "Medium confidence". */
  confidence?: string;
  className?: string;
}

/** Kepler evidence tag. Observed = fact from data. Predicted = forecast (Kepler violet). */
export function Tag({ kind, confidence, className }: TagProps) {
  return (
    <span className={[styles.tag, kind === 'Predicted' ? styles.predicted : styles.observed, className].filter(Boolean).join(' ')}>
      {kind}
      {confidence && <span className={styles.conf}>· {confidence}</span>}
    </span>
  );
}
