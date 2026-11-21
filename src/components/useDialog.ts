import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog behaviour shared by Drawer and Modal:
 * moves focus into the panel, traps Tab, closes on Esc, and returns focus to the trigger on close.
 */
export function useDialog(
  open: boolean,
  panelRef: RefObject<HTMLElement>,
  onClose: () => void,
  closable = true,
  /** Change when the dialog's content changes in place (a new step or drawer view). */
  contentKey?: string,
) {
  // When the content changes, the focused control may unmount. Move focus to the new
  // content's [data-autofocus] target, else its last enabled button, else the panel.
  useEffect(() => {
    if (!open || !contentKey) return;
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      const active = document.activeElement;
      if (!panel || (active !== panel && panel.contains(active))) return;
      const target =
        panel.querySelector<HTMLElement>('[data-autofocus]') ??
        Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled])')).pop() ??
        panel;
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(raf);
  }, [open, contentKey, panelRef]);

  const triggerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const closableRef = useRef(closable);
  onCloseRef.current = onClose;
  closableRef.current = closable;

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;

    // Focus the first focusable element once the panel has mounted.
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const preferred = panel.querySelector<HTMLElement>('[data-autofocus]');
      const first = preferred ?? panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel) return;
      if (e.key === 'Escape') {
        if (closableRef.current) {
          e.stopPropagation();
          onCloseRef.current();
        }
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      const trigger = triggerRef.current;
      if (trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
    };
  }, [open, panelRef]);
}
