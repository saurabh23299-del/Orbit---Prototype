import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DATA_END, DATA_START, rangeOf, validateRange, type Period } from '../data/analytics';
import { Button } from './Button';
import { Input } from './Input';
import { IconCalendar, IconCheck, IconChevronDown } from './icons';
import styles from './PeriodSelector.module.css';

export type { Period };
export { DATA_END, DATA_START, validateRange };

export const periodLabel = (p: Period): string => rangeOf(p).label;

/**
 * Per-section period state. Changing it updates the section and dims it to 45%
 * for 450ms (the loading state from DESIGN.md §5.9). `version` changes on every
 * pick so charts can replay their draw-in.
 */
export function usePeriod(initial: Period = { kind: 'weeks', n: 8 }) {
  const [period, setPeriodState] = useState<Period>(initial);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0);
  const timer = useRef<number>();
  const setPeriod = useCallback((p: Period) => {
    setPeriodState(p);
    setVersion((v) => v + 1);
    setLoading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLoading(false), 450);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { period, setPeriod, loading, version };
}

interface PeriodSelectorProps {
  value: Period;
  onChange: (p: Period) => void;
  /** Section name, used in the accessible label. */
  sectionLabel?: string;
  align?: 'left' | 'right';
}

const PRESETS: (4 | 8 | 12)[] = [4, 8, 12];

export function PeriodSelector({ value, onChange, sectionLabel, align = 'right' }: PeriodSelectorProps) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState<{ start: string; end: string; err: string } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    setCustom(null);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const pick = (p: Period) => {
    onChange(p);
    close();
  };

  const openCustom = () => {
    setCustom(
      value.kind === 'custom'
        ? { start: value.start, end: value.end, err: '' }
        : { start: rangeOf(value).start, end: DATA_END, err: '' },
    );
  };

  const apply = () => {
    if (!custom) return;
    const err = validateRange(custom.start, custom.end);
    if (err) {
      setCustom({ ...custom, err });
      return;
    }
    pick({ kind: 'custom', start: custom.start, end: custom.end });
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <Button
        ref={triggerRef}
        variant="secondary"
        size="sm"
        iconLeft={<IconCalendar size={16} />}
        iconRight={<IconChevronDown size={16} className={open ? styles.chevOpen : styles.chev} />}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${sectionLabel ? `${sectionLabel} period: ` : 'Period: '}${periodLabel(value)}`}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="num">{periodLabel(value)}</span>
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="Reporting period"
            className={`${styles.menu} ${align === 'left' ? styles.left : styles.right}`}
            onKeyDown={onMenuKey}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            {PRESETS.map((n) => {
              const on = value.kind === 'weeks' && value.n === n;
              return (
                <button
                  key={n}
                  type="button"
                  role="menuitemradio"
                  aria-checked={on}
                  className={`${styles.opt} ${on ? styles.on : ''}`}
                  onClick={() => pick({ kind: 'weeks', n })}
                >
                  Last {n} weeks
                  {on && <IconCheck size={16} />}
                </button>
              );
            })}
            <button
              type="button"
              role="menuitemradio"
              aria-checked={value.kind === 'custom'}
              aria-expanded={!!custom}
              className={`${styles.opt} ${value.kind === 'custom' ? styles.on : ''}`}
              onClick={openCustom}
            >
              Custom range…
              {value.kind === 'custom' && <IconCheck size={16} />}
            </button>
            {custom && (
              <div className={styles.custom}>
                <Input
                  label="From"
                  type="date"
                  min={DATA_START}
                  max={DATA_END}
                  value={custom.start}
                  onChange={(e) => setCustom({ ...custom, start: e.target.value, err: '' })}
                  invalid={!!custom.err}
                />
                <Input
                  label="To"
                  type="date"
                  min={DATA_START}
                  max={DATA_END}
                  value={custom.end}
                  onChange={(e) => setCustom({ ...custom, end: e.target.value, err: '' })}
                  invalid={!!custom.err}
                />
                {custom.err && <span className={styles.err} role="alert">{custom.err}</span>}
                <Button variant="primary" size="sm" onClick={apply}>
                  Apply range
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
