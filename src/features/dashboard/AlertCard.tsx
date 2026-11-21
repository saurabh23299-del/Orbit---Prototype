import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { KeplerIcon } from '../../components/KeplerIcon';
import { IconCheck, IconChevronRight } from '../../components/icons';
import { ALERTS } from '../../data/mockData';
import { SEVERITY_TONE, alertCountChips, liveAlerts } from '../../data/selectors';
import type { Alert, AlertId } from '../../data/types';
import { Chevron } from './parts';
import styles from './Dashboard.module.css';

interface AlertCardProps {
  handled: Partial<Record<AlertId, boolean>>;
  onAsk?: (a: Alert) => void;
  onInvestigate?: (a: Alert) => void;
}

/** Kepler insights and priority alerts: one compact card, collapsed by default. */
export function AlertCard({ handled, onAsk, onInvestigate }: AlertCardProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const live = liveAlerts(handled);
  const chips = alertCountChips(handled);
  const sub = live.length
    ? `${live.length} of ${ALERTS.length} alerts need your attention · updated 12m ago`
    : 'You’ve acted on every alert. Kepler will flag anything new.';

  return (
    <section aria-labelledby="al" className={styles.alertCard}>
      <button
        type="button"
        className={`${styles.rowbtn} ${styles.alertHead}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={listId}
      >
        <span className={styles.keplerTile}>
          <KeplerIcon size={20} spin />
        </span>
        <span className={styles.alertHeadText}>
          <span id="al" className="text-h2">Kepler insights and priority alerts</span>
          <span className={styles.sectionDesc}>{sub}</span>
        </span>
        <span className={styles.alertChips}>
          {chips.map((c) => (
            <Chip key={c.text} tone={c.tone} dot>{c.text}</Chip>
          ))}
        </span>
        <Chevron open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={listId}
            key="list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.alertList}>
              {ALERTS.map((a) => (
                <div key={a.id} className={styles.alertRow}>
                  <div className={styles.alertMain}>
                    <div className={styles.alertMeta}>
                      <Chip tone={SEVERITY_TONE[a.severity]} size="sm" dot>{a.severity}</Chip>
                      <span className={styles.caption}>{a.kind} · detected {a.ago}</span>
                      {handled[a.id] && (
                        <Chip tone="success" size="sm" icon={<IconCheck size={12} />}>Action taken</Chip>
                      )}
                    </div>
                    <span className={styles.alertTitle}>{a.title}</span>
                    <span className={styles.alertSummary}>{a.summary}</span>
                  </div>
                  <div className={styles.alertActions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={styles.askKepler}
                      iconLeft={<KeplerIcon size={15} />}
                      onClick={() => onAsk?.(a)}
                    >
                      Ask Kepler
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      iconRight={<IconChevronRight size={15} />}
                      onClick={() => onInvestigate?.(a)}
                      aria-label={`Investigate: ${a.title}`}
                    >
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
              <p className={styles.footnote}>Kepler only recommends. Nothing changes until you confirm an action.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
