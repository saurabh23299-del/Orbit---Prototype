import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { IconButton } from './Button';
import { IconClose } from './icons';
import { useDialog } from './useDialog';
import styles from './Overlay.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  /** False while processing: Esc, scrim and the close button do nothing. */
  closable?: boolean;
  /** Change this when the step changes (select → confirm → …) so focus moves into the new step. */
  stepKey?: string;
  children: ReactNode;
}

const EASE = [0.2, 0, 0, 1] as const;

/** Centered modal for decisions (reassign, adjust deadline). Steps live inside one modal. */
export function Modal({ open, onClose, title, subtitle, footer, closable = true, stepKey, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = () => {
    if (closable) onClose();
  };
  useDialog(open, panelRef, close, closable, stepKey);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={styles.layer} key="modal">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Close dialog"
            className={styles.scrim}
            style={{ cursor: closable ? 'pointer' : 'default' }}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <div className={styles.modalWrap}>
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-busy={!closable || undefined}
              tabIndex={-1}
              className={styles.modal}
              initial={{ scale: 0.97, y: 6, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: 6, opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div className={styles.head}>
                <div className={styles.headText}>
                  <h2 id={titleId} className={styles.title}>{title}</h2>
                  {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
                <IconButton label="Close" variant="plain" onClick={close} disabled={!closable}>
                  <IconClose size={18} />
                </IconButton>
              </div>
              <div className={styles.body}>{children}</div>
              {footer && <div className={styles.foot}>{footer}</div>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
