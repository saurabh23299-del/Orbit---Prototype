import { AnimatePresence, motion } from 'motion/react';
import { useAppStore, type ToastMessage } from '../store/appStore';
import { IconCheckCircle, IconClose, IconInfo } from './icons';
import styles from './Toast.module.css';

export function ToastCard({ toast, onDismiss }: { toast: Omit<ToastMessage, 'id'>; onDismiss?: () => void }) {
  return (
    <div className={styles.toast} role="status">
      <span className={styles.icon}>{toast.tone === 'info' ? <IconInfo size={18} /> : <IconCheckCircle size={18} />}</span>
      <div className={styles.text}>
        <span className={styles.title}>{toast.title}</span>
        {toast.text && <span className={styles.line}>{toast.text}</span>}
      </div>
      {onDismiss && (
        <button type="button" className={styles.close} aria-label="Dismiss notification" onClick={onDismiss}>
          <IconClose size={14} />
        </button>
      )}
    </div>
  );
}

/** Bottom-right toast stack. Inverted colors; auto-dismiss after 4.5s (handled in the store). */
export function ToastViewport() {
  const toasts = useAppStore((s) => s.toasts);
  const dismiss = useAppStore((s) => s.dismissToast);
  return (
    <div className={styles.viewport} aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
          >
            <ToastCard toast={t} onDismiss={() => dismiss(t.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
