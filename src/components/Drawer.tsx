import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { IconButton } from './Button';
import { IconClose } from './icons';
import { useDialog } from './useDialog';
import styles from './Overlay.module.css';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Text for aria-label when the title isn't plain text. */
  ariaLabel?: string;
  /** Content above the title (e.g. a severity chip or overline). */
  leading?: ReactNode;
  /** Content to the left of the title block (avatar, Kepler tile). */
  media?: ReactNode;
  subtitle?: ReactNode;
  /** Fixed content between the header and the scrolling body (e.g. a chat context card). */
  beforeBody?: ReactNode;
  footer?: ReactNode;
  /** Footer that stacks its content instead of right-aligning buttons. */
  footerStacked?: boolean;
  bodyClassName?: string;
  /** Change when the drawer shows different content in place, so focus moves into it. */
  contentKey?: string;
  children: ReactNode;
}

const EASE = [0.2, 0, 0, 1] as const;

/** Right-side drawer for investigation (employee, project, alert, insight, Kepler chat). */
export function Drawer({
  open, onClose, title, ariaLabel, leading, media, subtitle, beforeBody, footer, footerStacked, bodyClassName, contentKey, children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(open, panelRef, onClose, true, contentKey);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={styles.layer} key="drawer">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Close panel"
            className={styles.scrim}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabel ? undefined : titleId}
            aria-label={ariaLabel}
            tabIndex={-1}
            className={styles.drawer}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className={styles.head}>
              <div className={styles.headMain}>
                {media}
                <div className={styles.headText}>
                  {leading}
                  <h2 id={titleId} className={styles.title}>{title}</h2>
                  {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
              </div>
              <IconButton label="Close" variant="plain" onClick={onClose}>
                <IconClose size={18} />
              </IconButton>
            </div>
            {/* Re-key the content so each view fades in when the drawer switches in place. */}
            <motion.div
              key={contentKey ?? 'content'}
              className={styles.drawerContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {beforeBody}
              <div className={[styles.body, bodyClassName].filter(Boolean).join(' ')}>{children}</div>
              {footer && <div className={footerStacked ? styles.footStacked : styles.foot}>{footer}</div>}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
