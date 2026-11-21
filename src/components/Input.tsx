import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import type { ForcedState } from './Button';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  /** Keep the label for screen readers only. */
  hideLabel?: boolean;
  helper?: string;
  /** Error message. Turns the border and helper red and sets aria-invalid. */
  error?: string;
  /** Error styling without a message (when the message is shown elsewhere). */
  invalid?: boolean;
  icon?: ReactNode;
  /** Right-aligned hint inside the field, e.g. a keyboard shortcut. */
  trailing?: ReactNode;
  forceState?: Exclude<ForcedState, 'pressed'>;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hideLabel, helper, error, invalid, icon, trailing, forceState, id, className, wrapperClassName, ...rest },
  ref,
) {
  const auto = useId();
  const hasError = !!error || !!invalid;
  const inputId = id ?? `in-${auto}`;
  const helpId = `${inputId}-help`;
  const message = error || helper;
  return (
    <div className={[styles.wrap, wrapperClassName].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={hideLabel ? 'sr-only' : styles.label}>
        {label}
      </label>
      <div className={styles.field}>
        {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          data-force={forceState}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={message ? helpId : undefined}
          className={[styles.input, icon && styles.withIcon, trailing && styles.withTrailing, hasError && styles.error, className]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {trailing && <span className={styles.trailing} aria-hidden="true">{trailing}</span>}
      </div>
      {message && (
        <span id={helpId} className={error ? styles.errorText : styles.helper} role={error ? 'alert' : undefined}>
          {message}
        </span>
      )}
    </div>
  );
});
