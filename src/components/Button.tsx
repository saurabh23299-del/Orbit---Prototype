import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'kepler' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm' | 'xs';
/** Forces a visual state. Only for the /components preview. */
export type ForcedState = 'hover' | 'pressed' | 'focus';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Shown as a tooltip when disabled. DESIGN.md: always explain why a button is disabled. */
  disabledReason?: string;
  forceState?: ForcedState;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', iconLeft, iconRight, disabledReason, forceState, className, children, type = 'button', disabled, ...rest },
  ref,
) {
  const btn = (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      data-force={forceState}
      className={[styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
  if (disabled && disabledReason) {
    // Disabled buttons don't receive pointer events, so the tooltip lives on a wrapper.
    return (
      <span className={styles.disabledWrap} title={disabledReason}>
        {btn}
      </span>
    );
  }
  return btn;
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible name. */
  label: string;
  variant?: 'default' | 'plain';
  forceState?: ForcedState;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'default', forceState, className, children, type = 'button', title, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={title ?? label}
      data-force={forceState}
      className={[styles.icb, variant === 'plain' && styles.plain, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
});
