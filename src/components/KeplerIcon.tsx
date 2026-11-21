import type { CSSProperties } from 'react';
import styles from './KeplerIcon.module.css';

interface KeplerIconProps {
  /** Rendered size in px. */
  size?: number;
  /**
   * 3D spin. Use only on the two main Kepler icons per screen:
   * the Kepler AI nav item and the main Kepler panel header icon.
   */
  spin?: boolean;
  className?: string;
}

/** The Kepler moon, from assets/kepler-icon.svg, drawn with currentColor so it follows the theme. */
function MoonSvg({ fill, style }: { fill?: boolean; style?: CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path
        d="M8.12 1.18C10.12 1.04 12.04 2.25 13.18 4.05C14.42 6 14.4 8.45 13.22 10.42C12.08 12.33 10.04 13.62 7.82 13.66C5.55 13.7 3.48 12.42 2.55 10.4C1.59 8.31 1.91 5.78 3.31 3.88C4.46 2.32 6.23 1.31 8.12 1.18Z"
        strokeWidth={1.15}
        {...(fill ? { fill: 'currentColor', fillOpacity: 0.14 } : {})}
      />
      <path
        d="M5.06 4.2C5.53 3.85 6.12 3.92 6.43 4.35M10.33 5.16C10.82 5.01 11.26 5.27 11.39 5.7M7.28 9C7.67 8.66 8.22 8.69 8.54 9.05"
        strokeWidth={0.62}
      />
      <circle cx="4.72" cy="7.25" r=".48" strokeWidth={0.58} />
      <circle cx="10.76" cy="10.28" r=".72" strokeWidth={0.62} />
    </svg>
  );
}

export function KeplerIcon({ size = 16, spin = false, className }: KeplerIconProps) {
  if (!spin) {
    return (
      <span className={`${styles.static} ${className ?? ''}`} style={{ width: size, height: size }} aria-hidden="true">
        <MoonSvg />
      </span>
    );
  }
  // Three stacked copies in a preserve-3d wrapper; perspective = 4 × size.
  return (
    <span className={`${styles.k3d} ${className ?? ''}`} style={{ width: size, height: size, perspective: size * 4 }} aria-hidden="true">
      <span className={styles.inner}>
        <MoonSvg style={{ transform: `translateZ(${-0.1 * size}px)`, opacity: 0.25 }} />
        <MoonSvg style={{ transform: `translateZ(${-0.05 * size}px)`, opacity: 0.5 }} />
        <MoonSvg fill style={{ transform: 'translateZ(0px)' }} />
      </span>
    </span>
  );
}
