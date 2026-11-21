import { flushSync } from 'react-dom';
import { create } from 'zustand';
import { INITIAL_TASKS } from '../data/mockData';
import { alertsResolvedByDeadline, alertsResolvedByReassign } from '../data/selectors';
import type { AlertId, EmployeeId, ISODate, Task } from '../data/types';

export type Theme = 'light' | 'dark';

export interface ToastMessage {
  id: number;
  title: string;
  text?: string;
  tone?: 'success' | 'info';
}

interface AppState {
  theme: Theme;
  tasks: Task[];
  handledAlerts: Partial<Record<AlertId, boolean>>;
  lastSync: string;
  toasts: ToastMessage[];
  /** Demo switch: the next simulated sync fails once, so the error and retry states can be shown. */
  failNextSync: boolean;

  setFailNextSync: (v: boolean) => void;
  /** Returns true if this sync attempt should fail, and clears the switch. */
  consumeSyncFailure: () => boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  refreshSync: () => void;
  /** Applies a confirmed reassignment. Kepler never calls this; only the manager's confirm step does. */
  reassignTask: (taskId: string, to: EmployeeId) => void;
  /** Applies a confirmed deadline change. */
  adjustDeadline: (taskId: string, due: ISODate) => void;
  pushToast: (t: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: number) => void;
  resetData: () => void;
}

const THEME_KEY = 'orbit-theme';

const readTheme = (): Theme => {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* storage unavailable */
  }
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
};

export const applyTheme = (t: Theme) => {
  document.documentElement.setAttribute('data-theme', t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* storage unavailable */
  }
};

let toastSeq = 0;
const THEME_SWITCH_MS = 800;
let themeTimer: number | undefined;

export const useAppStore = create<AppState>((set, get) => ({
  theme: readTheme(),
  tasks: INITIAL_TASKS.map((t) => ({ ...t })),
  handledAlerts: {},
  lastSync: '4m ago',
  toasts: [],
  failNextSync: typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('simulateSyncError'),

  setFailNextSync: (v) => set({ failNextSync: v }),
  consumeSyncFailure: () => {
    const fail = get().failNextSync;
    if (fail) set({ failNextSync: false });
    return fail;
  },
  setTheme: (theme) => {
    if (theme === get().theme) return;
    const swap = () => {
      applyTheme(theme);
      // Render the new icon/labels synchronously so the transition's "after" frame is complete.
      flushSync(() => set({ theme }));
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      swap();
      return;
    }
    // Preferred: crossfade the whole page in one 800ms ease-out motion (see global.css).
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (doc.startViewTransition) {
      const root = document.documentElement;
      const vt = doc.startViewTransition(() => {
        // Per-element colour transitions would fade again under the crossfade; switch them off meanwhile.
        root.classList.add('theme-crossfade');
        swap();
      });
      vt.finished.finally(() => root.classList.remove('theme-crossfade'));
      return;
    }
    // Fallback: give every element the same 800ms ease-out colour transition for the duration of the switch.
    const root = document.documentElement;
    root.classList.add('theme-switching');
    swap();
    window.clearTimeout(themeTimer);
    themeTimer = window.setTimeout(() => root.classList.remove('theme-switching'), THEME_SWITCH_MS);
  },
  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
  refreshSync: () => set({ lastSync: 'just now' }),

  reassignTask: (taskId, to) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;
    const resolved = alertsResolvedByReassign(task.assignee);
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, assignee: to } : t)),
      handledAlerts: { ...s.handledAlerts, ...Object.fromEntries(resolved.map((id) => [id, true])) },
      lastSync: 'just now',
    }));
  },

  adjustDeadline: (taskId, due) => {
    const resolved = alertsResolvedByDeadline(taskId);
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, due } : t)),
      handledAlerts: { ...s.handledAlerts, ...Object.fromEntries(resolved.map((id) => [id, true])) },
      lastSync: 'just now',
    }));
  },

  pushToast: (t) => {
    const id = ++toastSeq;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    window.setTimeout(() => get().dismissToast(id), 4500);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  resetData: () => set({ tasks: INITIAL_TASKS.map((t) => ({ ...t })), handledAlerts: {}, lastSync: '4m ago' }),
}));
